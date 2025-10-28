// src/helpers/ipc/mcp/mcp-listeners.ts
import { app, ipcMain } from "electron";
import { MCP_CHANNELS } from "./mcp-channels";
import { MCPChatManager } from "@/mcp/chatManager";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { MCPServerConfig } from "@/types/mcp";

let manager: MCPChatManager | null = null;
let handlersRegistered = false;
let registrationPromise: Promise<void> | null = null;

const getManager = (): MCPChatManager => {
  if (!manager) {
    manager = new MCPChatManager();
  }
  return manager;
};

const serializeTool = (tool: { name: string; description: string; inputSchema: unknown }) => ({
  name: tool.name,
  description: tool.description,
  inputSchema: tool.inputSchema,
});

const CONFIG_FILENAME = "mcp_config.json";

const getPublicConfigCandidates = (): string[] => {
  const appPath = app.getAppPath();
  return [
    path.join(appPath, "public", CONFIG_FILENAME),
    path.join(appPath, "..", "public", CONFIG_FILENAME),
    path.join(process.cwd(), "public", CONFIG_FILENAME),
    path.join(process.resourcesPath, "public", CONFIG_FILENAME),
  ];
};

let cachedPublicConfigPath: string | null = null;

const resolvePublicConfigPath = (): string => {
  if (cachedPublicConfigPath && existsSync(cachedPublicConfigPath)) {
    return cachedPublicConfigPath;
  }

  const candidates = getPublicConfigCandidates();
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      cachedPublicConfigPath = candidate;
      return candidate;
    }
  }

  throw new Error(`无法在以下路径找到 ${CONFIG_FILENAME}: ${candidates.join(", ")}`);
};

const getOverrideConfigPath = (): string => path.join(app.getPath("userData"), CONFIG_FILENAME);

const resolveReadableConfigPath = (): string => {
  const overridePath = getOverrideConfigPath();
  if (existsSync(overridePath)) {
    return overridePath;
  }
  return resolvePublicConfigPath();
};

const ensureWritableConfigPath = async (): Promise<string> => {
  const publicPath = resolvePublicConfigPath();
  if (!publicPath.includes(".asar")) {
    await mkdir(path.dirname(publicPath), { recursive: true });
    return publicPath;
  }

  const overridePath = getOverrideConfigPath();
  await mkdir(path.dirname(overridePath), { recursive: true });
  if (!existsSync(overridePath)) {
    const source = await readFile(publicPath, "utf-8");
    await writeFile(overridePath, source, "utf-8");
  }
  return overridePath;
};

const loadAllServerConfigs = async (): Promise<Record<string, Partial<MCPServerConfig>>> => {
  const configPath = resolveReadableConfigPath();
  const raw = await readFile(configPath, "utf-8");
  const parsed = JSON.parse(raw);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error(`${CONFIG_FILENAME} 内容无效`);
  }
  return parsed as Record<string, Partial<MCPServerConfig>>;
};

const upsertServerConfig = async (
  name: string,
  config: Partial<MCPServerConfig>,
): Promise<MCPServerConfig> => {
  if (!name) {
    throw new Error("缺少服务器名称，无法更新配置");
  }

  const targetPath = await ensureWritableConfigPath();
  const existing = await loadAllServerConfigs();
  const current = existing[name] ?? {};
  const nextConfig = {
    ...current,
    ...config,
    name: config.name ?? (current as MCPServerConfig).name ?? name,
  } as MCPServerConfig;

  const updated = {
    ...existing,
    [name]: nextConfig,
  };

  await writeFile(targetPath, JSON.stringify(updated, null, 2), "utf-8");
  return nextConfig;
};

const getProjectRootCandidates = (): string[] => {
  const appPath = app.getAppPath();
  const candidates = [
    appPath,
    path.dirname(appPath),
    path.join(appPath, ".."),
    process.resourcesPath,
    process.cwd(),
  ];

  return Array.from(
    new Set(
      candidates
        .filter((candidate) => typeof candidate === "string" && candidate.length > 0)
        .map((candidate) => path.resolve(candidate)),
    ),
  );
};

const resolveLocalBinary = (binName: string): string | null => {
  const binaryFile = process.platform === "win32" ? `${binName}.cmd` : binName;
  for (const basePath of getProjectRootCandidates()) {
    const candidate = path.join(basePath, "node_modules", ".bin", binaryFile);
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
};

const isConvertiblePath = (value: string): boolean => {
  if (!value || typeof value !== "string") return false;
  if (value.startsWith("-")) return false;
  if (path.isAbsolute(value)) return false;
  if (/^[a-zA-Z]+:\/\//.test(value)) return false;
  return true;
};

const resolveArgumentPath = (value: string): string => {
  if (!isConvertiblePath(value)) {
    return value;
  }

  for (const basePath of getProjectRootCandidates()) {
    const candidate = path.resolve(basePath, value);
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return value;
};

const normalizeServerConfig = (config: MCPServerConfig): MCPServerConfig => {
  let command = config.command;
  const args = [...config.args];

  if (command === "npx" && args[0] === "tsx") {
    const localTsx = resolveLocalBinary("tsx");
    if (localTsx) {
      command = localTsx;
      args.shift();
    }
  }

  const normalizedArgs = args.map((arg) => resolveArgumentPath(arg));

  return {
    ...config,
    command,
    args: normalizedArgs,
  };
};

const attachHandlers = () => {
  if (handlersRegistered) {
    return;
  }
  handlersRegistered = true;

  ipcMain.handle(MCP_CHANNELS.START_SERVER, async (_event, rawConfig) => {
    const { name, command, args, env } = rawConfig ?? {};
    if (!name || !command || !Array.isArray(args)) {
      return { success: false, error: "缺少必要的 MCP 配置参数" };
    }

    try {
      const currentManager = getManager();
      const normalizedConfig = normalizeServerConfig({ name, command, args, env });
      const { tools } = await currentManager.startServer(normalizedConfig);
      return {
        success: true,
        tools: tools.map((tool) => serializeTool(tool)),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`启动 MCP 服务器 ${String(name)} 失败:`, error);
      return { success: false, error: message };
    }
  });

  ipcMain.handle(MCP_CHANNELS.STOP_SERVER, async (_event, name: string) => {
    try {
      const currentManager = getManager();
      await currentManager.stopServer(name);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`停止 MCP 服务器 ${String(name)} 失败:`, error);
      return { success: false, error: message };
    }
  });

  ipcMain.handle(MCP_CHANNELS.LIST_TOOLS, (_event, name: string) => {
    try {
      const currentManager = getManager();
      const tools = currentManager.listTools(name);
      return tools.map((tool) => serializeTool(tool));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`获取 MCP 服务器 ${String(name)} 工具列表失败:`, message);
      return [];
    }
  });

  ipcMain.handle(
    MCP_CHANNELS.EXECUTE_TOOL,
    async (_event, name: string, toolName: string, args: Record<string, unknown>) => {
      try {
        const currentManager = getManager();
        const result = await currentManager.executeTool(name, toolName, args);
        return { success: true, result };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`执行 MCP 服务器 ${String(name)} 的工具 ${toolName} 失败:`, error);
        return { success: false, error: message };
      }
    },
  );

  ipcMain.handle(MCP_CHANNELS.SEND_MESSAGE, async (_event, name: string, message: string) => {
    try {
      const currentManager = getManager();
      const result = await currentManager.sendMessage(name, message);
      return {
        success: !result.error,
        userMessage: result.userMessage,
        assistantMessage: result.assistantMessage,
        toolMessages: result.toolMessages,
        error: result.error,
      };
    } catch (error) {
      const messageText = error instanceof Error ? error.message : String(error);
      console.error(`向 MCP 服务器 ${String(name)} 发送消息失败:`, error);
      return { success: false, error: messageText };
    }
  });

  ipcMain.handle(MCP_CHANNELS.GET_CHAT_HISTORY, (_event, name: string) => {
    try {
      const currentManager = getManager();
      return currentManager.getHistory(name);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`获取 MCP 服务器 ${String(name)} 聊天历史失败:`, message);
      return [];
    }
  });

  ipcMain.handle(MCP_CHANNELS.CLEAR_CHAT_HISTORY, (_event, name: string) => {
    try {
      const currentManager = getManager();
      currentManager.clearHistory(name);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`清除 MCP 服务器 ${String(name)} 聊天历史失败:`, error);
      return { success: false, error: message };
    }
  });

  ipcMain.handle(MCP_CHANNELS.GET_SERVER_CONFIG, async (_event, name: string) => {
    try {
      const configs = await loadAllServerConfigs();
      return configs[name] ?? null;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`读取 MCP 配置 ${String(name)} 失败:`, error);
      throw new Error(message);
    }
  });

  ipcMain.handle(
    MCP_CHANNELS.UPSERT_SERVER_CONFIG,
    async (_event, name: string, config: Partial<MCPServerConfig>) => {
      try {
        const updated = await upsertServerConfig(name, config);
        return { success: true, config: updated };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`更新 MCP 配置 ${String(name)} 失败:`, error);
        return { success: false, error: message };
      }
    },
  );
};

export function registerMCPServerListeners() {
  if (handlersRegistered) {
    return;
  }

  if (app.isReady()) {
    attachHandlers();
    return;
  }

  if (!registrationPromise) {
    registrationPromise = app
      .whenReady()
      .then(() => {
        attachHandlers();
      })
      .catch((error: unknown) => {
        console.error("注册 MCP 监听器失败:", error);
        registrationPromise = null;
      });
  }
}

// Ensure handlers are registered even if registerListeners isn't invoked yet.
registerMCPServerListeners();
