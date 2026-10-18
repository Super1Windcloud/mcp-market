// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { MCP_CHANNELS } from "@/helpers/ipc/mcp/mcp-channels";
import { resolveServerConfig } from "@/mcp/resolveServerConfig";
import { parseServerConfig } from "@/mcp/serverConfig";
import { version } from "../../../package.json";

const mocks = vi.hoisted(() => ({
  handlers: new Map<string, (...args: unknown[]) => Promise<unknown>>(),
  userData: "",
  model: vi.fn(),
}));
vi.mock("electron", () => ({
  app: {
    isPackaged: true,
    isReady: () => true,
    getAppPath: () => process.cwd(),
    getPath: () => mocks.userData,
  },
  ipcMain: {
    handle: (
      channel: string,
      handler: (...args: unknown[]) => Promise<unknown>,
    ) => mocks.handlers.set(channel, handler),
  },
}));
vi.mock("@/mcp/llmClient", () => ({
  LLMClient: class {
    getResponse = mocks.model;
  },
}));
vi.mock("@/utils", () => ({ writeSomeLogs: vi.fn() }));

const invoke = async (channel: string, ...args: unknown[]) =>
  mocks.handlers.get(channel)!(null, ...args);
const tools = ["web_search", "web_fetch"].map((name) => ({
  name,
  description: name,
  inputSchema: { type: "object", properties: {}, required: [] },
}));
const resultUrl = "https://example.com/research";
const content = {
  content: [{ type: "text", text: `Source: ${resultUrl}\nA useful excerpt.` }],
};
let requests: {
  url: string;
  headers: Headers;
  body: { id?: number; method?: string; params?: unknown };
}[];
let fetchSpy: ReturnType<typeof vi.spyOn>;
let fixture: string;
let originalResourcesPath: PropertyDescriptor | undefined;
let mode: "ok" | "error" | "rpc-error" | "tool-error" | "pending" = "ok";

beforeEach(async () => {
  fixture = await mkdtemp(path.join(os.tmpdir(), "mcp-market-search-"));
  mocks.userData = fixture;
  originalResourcesPath = Object.getOwnPropertyDescriptor(
    process,
    "resourcesPath",
  );
  Object.defineProperty(process, "resourcesPath", {
    configurable: true,
    value: fixture,
  });
  vi.stubEnv("SILICONFLOW_API_KEY", "scripted-model-key");
  vi.stubEnv("PARALLEL_API_KEY", "must-not-be-used");
  await import("@/helpers/ipc/mcp/mcp-listeners");
  vi.stubGlobal("window", {
    mcp: {
      getServerConfig: (name: string) =>
        invoke(MCP_CHANNELS.GET_SERVER_CONFIG, name),
      listCustomServers: () => invoke(MCP_CHANNELS.LIST_CUSTOM_SERVERS),
    },
  });
  requests = [];
  mode = "ok";
  mocks.model.mockReset();
  fetchSpy = vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(async (input, init) => {
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      requests.push({
        url: String(input),
        headers: new Headers(init?.headers),
        body,
      });
      if (init?.method === "GET") return new Response(null, { status: 405 });
      if (body.id === undefined) return new Response(null, { status: 202 });
      let result: unknown;
      if (body.method === "initialize")
        result = {
          protocolVersion: "2025-06-18",
          capabilities: { tools: {} },
          serverInfo: { name: "fixture", version: "1" },
        };
      else if (body.method === "tools/list") result = { tools };
      else {
        if (mode === "error")
          return new Response("Service unavailable", { status: 503 });
        if (mode === "pending") return new Promise(() => {});
        if (mode === "rpc-error")
          return Response.json({
            jsonrpc: "2.0",
            id: body.id,
            error: { code: -32602, message: "Invalid search arguments" },
          });
        result =
          mode === "tool-error"
            ? {
                isError: true,
                content: [{ type: "text", text: "Search quota reached" }],
              }
            : content;
      }
      return Response.json({ jsonrpc: "2.0", id: body.id, result });
    });
});

afterEach(async () => {
  await invoke(MCP_CHANNELS.STOP_SERVER, "Parallel Search");
  fetchSpy.mockRestore();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  if (originalResourcesPath)
    Object.defineProperty(process, "resourcesPath", originalResourcesPath);
  else delete (process as { resourcesPath?: string }).resourcesPath;
  await rm(fixture, { recursive: true, force: true });
});

async function resolveAndStart() {
  const config = await resolveServerConfig("Parallel Search", "");
  const start = await invoke(MCP_CHANNELS.START_SERVER, config);
  expect(start).toMatchObject({ success: true, tools });
  return config;
}

async function saveOverride(config: unknown) {
  await writeFile(
    path.join(fixture, "mcp_config.json"),
    JSON.stringify({ "Parallel Search": config }),
  );
}

describe("Parallel Search through resolver, IPC, manager and chat result consumption", () => {
  it.each(["web_search", "web_fetch"])(
    "runs %s anonymously from a fresh install using the real SDK",
    async (tool) => {
      // Listing/resolving alone never grants permission to connect; Start does.
      const config = await resolveServerConfig("Parallel Search", "");
      expect(config).toMatchObject({
        transport: "streamable-http",
        endpoint: "https://search.parallel.ai/mcp",
      });
      expect(requests).toEqual([]);
      await resolveAndStart();
      const args =
        tool === "web_search"
          ? {
              objective: "Find recent research",
              search_queries: ["recent research"],
            }
          : { urls: [resultUrl] };
      mocks.model
        .mockResolvedValueOnce(JSON.stringify({ tool, arguments: args }))
        .mockResolvedValueOnce(`Summary with ${resultUrl}`);
      const answer = await invoke(
        MCP_CHANNELS.SEND_MESSAGE,
        "Parallel Search",
        "Find and summarize research",
      );
      expect(answer).toMatchObject({
        success: true,
        assistantMessage: { content: `Summary with ${resultUrl}` },
      });
      expect(JSON.stringify(mocks.model.mock.calls[1][0])).toContain(resultUrl);
      expect(JSON.stringify(mocks.model.mock.calls[1][0])).toContain(
        "A useful excerpt.",
      );
      expect(
        requests.find((r) => r.body.method === "tools/call")?.body.params,
      ).toEqual({ name: tool, arguments: args });
      expect(requests.some((r) => r.body.method === "initialize")).toBe(true);
      expect(requests.some((r) => r.body.method === "tools/list")).toBe(true);
      for (const request of requests) {
        expect(request.url).toBe("https://search.parallel.ai/mcp");
        expect(request.headers.get("User-Agent")).toBe(`mcp-market/${version}`);
        expect(request.headers.has("Authorization")).toBe(false);
      }
    },
  );

  it("preserves a saved HTTP endpoint, headers and timeout instead of using the bundled default", async () => {
    await saveOverride({
      transport: "streamable-http",
      endpoint: "https://chosen.example/mcp?mode=custom",
      headers: { Authorization: "Bearer explicitly-configured" },
      timeoutMs: 5000,
    });
    await resolveAndStart();
    expect(
      requests.every((r) => r.url === "https://chosen.example/mcp?mode=custom"),
    ).toBe(true);
    expect(
      requests.every(
        (r) =>
          r.headers.get("Authorization") === "Bearer explicitly-configured",
      ),
    ).toBe(true);
  });

  it("preserves a saved local server choice", async () => {
    await saveOverride({
      command: "node",
      args: ["saved-server.js"],
      env: { SAVED: "yes" },
    });
    expect(await resolveServerConfig("Parallel Search", "")).toMatchObject({
      command: "node",
      args: ["saved-server.js"],
      env: { SAVED: "yes" },
    });
    expect(requests).toEqual([]);
  });

  it("executes a saved stdio server through the same manager and chat dispatcher", async () => {
    const script = `
      console.log("ready");
      require("node:readline").createInterface({ input: process.stdin }).on("line", line => {
        const msg = JSON.parse(line);
        const result = msg.method === "initialize" ? { capabilities: {} }
          : msg.method === "tools/list" ? { tools: [{ name: "local_search", description: "Saved local search",
            inputSchema: { type: "object", properties: {} } }] }
          : { content: [{ type: "text", text: "Saved stdio search result" }] };
        console.log(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result }));
      });`;
    await saveOverride({ command: process.execPath, args: ["-e", script] });
    const config = await resolveServerConfig("Parallel Search", "");
    expect(await invoke(MCP_CHANNELS.START_SERVER, config)).toMatchObject({
      success: true,
    });
    mocks.model
      .mockResolvedValueOnce(
        JSON.stringify({ tool: "local_search", arguments: {} }),
      )
      .mockResolvedValueOnce("Saved provider summary");
    expect(
      await invoke(MCP_CHANNELS.SEND_MESSAGE, "Parallel Search", "Research"),
    ).toMatchObject({
      success: true,
      assistantMessage: { content: "Saved provider summary" },
    });
    expect(JSON.stringify(mocks.model.mock.calls[1][0])).toContain(
      "Saved stdio search result",
    );
    expect(requests).toEqual([]);
  });

  it("does not replace a disabled or invalid override with Parallel", async () => {
    await saveOverride({
      transport: "streamable-http",
      endpoint: "https://chosen.example/mcp",
      disabled: true,
    });
    const config = await resolveServerConfig("Parallel Search", "");
    expect(await invoke(MCP_CHANNELS.START_SERVER, config)).toMatchObject({
      success: false,
      error: expect.stringContaining("禁用"),
    });
    await saveOverride({
      transport: "streamable-http",
      endpoint: "file:///tmp/mcp",
    });
    await expect(resolveServerConfig("Parallel Search", "")).rejects.toThrow(
      "HTTP",
    );
    expect(requests).toEqual([]);
  });

  it("respects a user catalog that omits the default search entry", async () => {
    await writeFile(
      path.join(fixture, "my_mcp_config.json"),
      JSON.stringify({ mcpServers: {} }),
    );
    expect(await resolveServerConfig("Parallel Search", "")).toMatchObject({
      command: "not found",
    });
    expect(requests).toEqual([]);
  });

  it("round-trips custom HTTP configurations through save/list and rejects malformed IPC input", async () => {
    const config = {
      name: "Custom HTTP",
      transport: "streamable-http",
      endpoint: "https://custom.example/mcp",
      headers: { Authorization: "Bearer saved" },
      disabled: true,
    };
    expect(
      await invoke(MCP_CHANNELS.SAVE_CUSTOM_SERVERS, {
        mcpServers: { "Custom HTTP": config },
      }),
    ).toMatchObject({ success: true });
    expect(await invoke(MCP_CHANNELS.LIST_CUSTOM_SERVERS)).toEqual(
      expect.arrayContaining([expect.objectContaining(config)]),
    );
    expect(
      await invoke(MCP_CHANNELS.START_SERVER, {
        name: "Invalid",
        transport: "streamable-http",
        endpoint: "ftp://example.com",
      }),
    ).toMatchObject({ success: false });
    expect(() =>
      parseServerConfig({
        transport: "streamable-http",
        endpoint: "https://example.com",
        headers: { Bad: 7 },
      }),
    ).toThrow("headers");
    expect(() =>
      parseServerConfig({
        transport: "streamable-http",
        endpoint: "https://example.com",
        timeoutMs: 0,
      }),
    ).toThrow("timeoutMs");
    expect(requests).toEqual([]);
  });

  it.each(["error", "rpc-error", "tool-error"] as const)(
    "passes %s to the chat result consumer without fallback",
    async (failure) => {
      await resolveAndStart();
      mode = failure;
      mocks.model
        .mockResolvedValueOnce(
          JSON.stringify({
            tool: "web_search",
            arguments: { objective: "Research", search_queries: ["research"] },
          }),
        )
        .mockResolvedValueOnce("Search failed; no answer available.");
      await invoke(MCP_CHANNELS.SEND_MESSAGE, "Parallel Search", "Research");
      const context = JSON.stringify(mocks.model.mock.calls[1][0]);
      expect(context).toContain(
        failure === "error"
          ? "503"
          : failure === "rpc-error"
            ? "Invalid search arguments"
            : "Search quota reached",
      );
      expect(
        requests.filter((r) => r.body.method === "tools/call"),
      ).toHaveLength(1);
    },
  );

  it("times out an HTTP tool request and passes that error to the answer context", async () => {
    await saveOverride({
      transport: "streamable-http",
      endpoint: "https://search.parallel.ai/mcp",
      timeoutMs: 50,
    });
    await resolveAndStart();
    mode = "pending";
    mocks.model
      .mockResolvedValueOnce(
        JSON.stringify({ tool: "web_search", arguments: {} }),
      )
      .mockResolvedValueOnce("Search timed out.");
    const answer = await invoke(
      MCP_CHANNELS.SEND_MESSAGE,
      "Parallel Search",
      "Research",
    );
    expect(answer).toMatchObject({
      success: true,
      assistantMessage: { content: "Search timed out." },
    });
    expect(JSON.stringify(mocks.model.mock.calls[1][0])).toContain("timed out");
  });

  it("cancels pending calls when the user stops a search session", async () => {
    await resolveAndStart();
    mode = "pending";
    const call = invoke(
      MCP_CHANNELS.EXECUTE_TOOL,
      "Parallel Search",
      "web_search",
      {},
    );
    await vi.waitFor(() =>
      expect(requests.some((r) => r.body.method === "tools/call")).toBe(true),
    );
    await invoke(MCP_CHANNELS.STOP_SERVER, "Parallel Search");
    expect(await call).toMatchObject({
      success: false,
      error: expect.stringContaining("closed"),
    });
  });
});
