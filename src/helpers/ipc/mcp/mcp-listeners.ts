// src/helpers/ipc/mcp/mcp-listeners.ts
import { app, ipcMain } from "electron";
import { MCP_CHANNELS } from "./mcp-channels";
import { MCPChatManager } from "@/mcp/chatManager";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { MCPServerConfig, MCPServerDisplayConfig } from "@/types/mcp";

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
const CUSTOM_CONFIG_FILENAME = "my_mcp_config.json";

const getPublicConfigCandidates = (): string[] => {
  const appPath = app.getAppPath();
  return [
    // 优先查找打包后的目录
    path.join(appPath, "..", "..", ".vite", "build", "public", CONFIG_FILENAME),
    path.join(process.cwd(), ".vite", "build", "public", CONFIG_FILENAME),
    path.join(process.resourcesPath, "..", ".vite", "build", "public", CONFIG_FILENAME),
    // 然后查找其他位置
    path.join(appPath, "public", CONFIG_FILENAME),
    path.join(appPath, "..", "public", CONFIG_FILENAME),
    path.join(process.cwd(), "public", CONFIG_FILENAME),
    path.join(process.resourcesPath, "public", CONFIG_FILENAME),
  ];
};

let cachedPublicConfigPath: string | null = null;
let cachedCustomConfigPath: string | null = null;

const getCustomConfigOverridePath = (): string => path.join(app.getPath("userData"), CUSTOM_CONFIG_FILENAME);

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
  try {
    // 优先尝试使用 .vite/build/public 中的文件
    const builtPublicPath = path.join(process.cwd(), ".vite", "build", "public", CONFIG_FILENAME);
    if (existsSync(builtPublicPath)) {
      await mkdir(path.dirname(builtPublicPath), { recursive: true });
      cachedPublicConfigPath = builtPublicPath;
      return builtPublicPath;
    }

    const publicPath = resolvePublicConfigPath();
    if (!publicPath.includes(".asar")) {
      // 如果现有路径不在 .asar 中，检查是否应该写入到 .vite/build/public
      if (!publicPath.includes(".vite")) {
        const builtDir = path.join(process.cwd(), ".vite", "build", "public");
        await mkdir(builtDir, { recursive: true });
        const builtPath = path.join(builtDir, CONFIG_FILENAME);
        if (!existsSync(builtPath)) {
          const source = await readFile(publicPath, "utf-8");
          await writeFile(builtPath, source, "utf-8");
        }
        cachedPublicConfigPath = builtPath;
        return builtPath;
      }
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
  } catch (error) {
    // 最后的备选方案：使用 .vite/build/public
    const builtDir = path.join(process.cwd(), ".vite", "build", "public");
    const builtPath = path.join(builtDir, CONFIG_FILENAME);
    await mkdir(builtDir, { recursive: true });
    if (!existsSync(builtPath)) {
      await writeFile(builtPath, JSON.stringify({ mcpServers: {} }, null, 2), "utf-8");
    }
    cachedPublicConfigPath = builtPath;
    return builtPath;
  }
};

const loadAllServerConfigs = async (): Promise<Record<string, Partial<MCPServerConfig>>> => {
  const configPath = resolveReadableConfigPath();
  const raw = await readFile(configPath, "utf-8");
  const parsed = JSON.parse(raw) as unknown;
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error(`${CONFIG_FILENAME} 内容无效`);
  }

  // 如果是 { mcpServers: {...} } 格式，提取 mcpServers
  if ("mcpServers" in parsed) {
    const mcpServers = (parsed as { mcpServers?: unknown }).mcpServers;
    if (typeof mcpServers === "object" && mcpServers !== null) {
      return mcpServers as Record<string, Partial<MCPServerConfig>>;
    }
  }

  // 否则直接返回
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
    // 优先考虑打包后的目录
    path.join(appPath, "..", ".."),
    path.join(process.resourcesPath, ".."),
    process.cwd(),
    // 然后考虑其他位置
    appPath,
    path.dirname(appPath),
    path.join(appPath, ".."),
    process.resourcesPath,
  ];

  return Array.from(
    new Set(
      candidates
        .filter((candidate) => typeof candidate === "string" && candidate.length > 0)
        .map((candidate) => path.resolve(candidate)),
    ),
  );
};

const resolveCustomConfigPath = (): string => {
  const overridePath = getCustomConfigOverridePath();
  if (existsSync(overridePath)) {
    cachedCustomConfigPath = overridePath;
    return overridePath;
  }

  // 优先查找 .vite/build/public 中的文件
  const builtPath = path.join(process.cwd(), ".vite", "build", "public", CUSTOM_CONFIG_FILENAME);
  if (existsSync(builtPath)) {
    cachedCustomConfigPath = builtPath;
    return builtPath;
  }

  for (const basePath of getProjectRootCandidates()) {
    const candidate = path.join(basePath, "public", CUSTOM_CONFIG_FILENAME);
    if (existsSync(candidate)) {
      cachedCustomConfigPath = candidate;
      return candidate;
    }
  }

  throw new Error(`无法在以下路径找到 ${CUSTOM_CONFIG_FILENAME}`);
};

const ensureWritableCustomConfigPath = async (): Promise<string> => {
  try {
    // 优先尝试使用 .vite/build/public 中的文件
    const builtPublicPath = path.join(process.cwd(), ".vite", "build", "public", CUSTOM_CONFIG_FILENAME);
    if (existsSync(builtPublicPath)) {
      await mkdir(path.dirname(builtPublicPath), { recursive: true });
      cachedCustomConfigPath = builtPublicPath;
      return builtPublicPath;
    }

    // 如果不存在，尝试从其他位置读取并写入到 .vite/build/public
    const existingPath = resolveCustomConfigPath();
    if (!existingPath.includes(".asar")) {
      // 如果现有路径不在 .asar 中，检查是否应该写入到 .vite/build/public
      if (!existingPath.includes(".vite")) {
        const builtDir = path.join(process.cwd(), ".vite", "build", "public");
        await mkdir(builtDir, { recursive: true });
        const builtPath = path.join(builtDir, CUSTOM_CONFIG_FILENAME);
        if (!existsSync(builtPath)) {
          const source = await readFile(existingPath, "utf-8");
          await writeFile(builtPath, source, "utf-8");
        }
        cachedCustomConfigPath = builtPath;
        return builtPath;
      }
      await mkdir(path.dirname(existingPath), { recursive: true });
      return existingPath;
    }

    const overridePath = getCustomConfigOverridePath();
    await mkdir(path.dirname(overridePath), { recursive: true });
    if (!existsSync(overridePath)) {
      const source = await readFile(existingPath, "utf-8");
      await writeFile(overridePath, source, "utf-8");
    }
    cachedCustomConfigPath = overridePath;
    return overridePath;
  } catch {
    // 最后的备选方案：使用 .vite/build/public
    const builtDir = path.join(process.cwd(), ".vite", "build", "public");
    const builtPath = path.join(builtDir, CUSTOM_CONFIG_FILENAME);
    await mkdir(builtDir, { recursive: true });
    if (!existsSync(builtPath)) {
      await writeFile(builtPath, JSON.stringify({ mcpServers: {} }, null, 2), "utf-8");
    }
    cachedCustomConfigPath = builtPath;
    return builtPath;
  }
};

const loadCustomServerCatalog = async (): Promise<Record<string, MCPServerDisplayConfig>> => {
  const configPath = resolveCustomConfigPath();
  const raw = await readFile(configPath, "utf-8");
  const parsed = JSON.parse(raw) as unknown;

  if (!parsed || typeof parsed !== "object" || !("mcpServers" in parsed)) {
    return {};
  }

  const mcpServers = (parsed as { mcpServers?: unknown }).mcpServers;
  if (!mcpServers || typeof mcpServers !== "object") {
    return {};
  }

  const catalog: Record<string, MCPServerDisplayConfig> = {};
  for (const [key, entry] of Object.entries(mcpServers as Record<string, unknown>)) {
    if (!entry || typeof entry !== "object") continue;
    const config = sanitizeDisplayConfig(entry, key);
    catalog[key] = config;
  }

  return catalog;
};

const sanitizeDisplayConfig = (entry: unknown, fallbackName?: string): MCPServerDisplayConfig => {
  if (!entry || typeof entry !== "object") {
    console.error(entry);
    throw new Error("MCP 配置条目格式无效");
  }

  const raw = entry as Partial<MCPServerDisplayConfig>;
  const resolvedName = typeof raw.name === "string" && raw.name.trim().length > 0 ? raw.name.trim() : fallbackName;

  if (!resolvedName) {
    throw new Error("MCP 配置缺少 name 字段");
  }

  if (!raw.command || typeof raw.command !== "string" || raw.command.trim().length === 0) {
    throw new Error(`MCP 配置 ${resolvedName} 缺少 command 字段`);
  }

  const rawArgs = Array.isArray(raw.args) ? raw.args : [];
  const normalizedArgs = rawArgs.map((arg) => String(arg));
  const command = raw.command.trim();

  const normalizedEnv =
    raw.env && typeof raw.env === "object"
      ? Object.entries(raw.env).reduce<Record<string, string>>((acc, [key, value]) => {
        if (!key || typeof key !== "string") {
          return acc;
        }
        if (value === undefined || value === null) {
          return acc;
        }
        acc[key] = typeof value === "string" ? value : String(value);
        return acc;
      }, {})
      : undefined;

  const normalized: MCPServerDisplayConfig = {
    name: resolvedName,
    command,
    args: normalizedArgs,
  };

  if (raw.desc && typeof raw.desc === "string") {
    normalized.desc = raw.desc;
  }

  if (raw.url && typeof raw.url === "string") {
    normalized.url = raw.url;
  }

  if (normalizedEnv && Object.keys(normalizedEnv).length > 0) {
    normalized.env = normalizedEnv;
  }

  return normalized;
};

const normalizeCustomServerCatalogInput = (input: unknown): Record<string, MCPServerDisplayConfig> => {
  if (Array.isArray(input)) {
    return input.reduce<Record<string, MCPServerDisplayConfig>>((acc, item) => {
      const config = sanitizeDisplayConfig(item);
      acc[config.name] = config;
      return acc;
    }, {});
  }

  if (input && typeof input === "object") {
    const maybeCatalog = input as { mcpServers?: unknown };
    if (maybeCatalog.mcpServers && typeof maybeCatalog.mcpServers === "object") {
      return normalizeCustomServerCatalogInput(maybeCatalog.mcpServers);
    }

    return Object.entries(input as Record<string, unknown>).reduce<Record<string, MCPServerDisplayConfig>>(
      (acc, [key, value]) => {
        const config = sanitizeDisplayConfig(value, key);
        acc[config.name] = config;
        return acc;
      },
      {},
    );
  }

  throw new Error("自定义 MCP 配置格式无效");
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

  ipcMain.handle(MCP_CHANNELS.LIST_CUSTOM_SERVERS, async () => {
    try {
      const catalog = await loadCustomServerCatalog();
      return Object.values(catalog);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`读取 ${CUSTOM_CONFIG_FILENAME} 失败:`, error);
      if (message.includes("无法在以下路径找到")) {
        return [];
      }
      throw error instanceof Error ? error : new Error(message);
    }
  });
  ipcMain.handle(MCP_CHANNELS.SAVE_CUSTOM_SERVERS, async (_event, payload: unknown) => {
    try {
      const newCatalog = normalizeCustomServerCatalogInput(payload);
      const targetPath = await ensureWritableCustomConfigPath();

      // 读取现有配置
      let existingCatalog: Record<string, MCPServerDisplayConfig> = {};
      try {
        const raw = await readFile(targetPath, "utf-8");
        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === "object" && "mcpServers" in parsed) {
          const mcpServers = (parsed as { mcpServers?: unknown }).mcpServers;
          if (mcpServers && typeof mcpServers === "object") {
            existingCatalog = mcpServers as Record<string, MCPServerDisplayConfig>;
          }
        }
      } catch {
        // 文件不存在或无法解析，使用空对象
        existingCatalog = {};
      }

      // 合并新配置到现有配置
      const mergedCatalog = {
        ...existingCatalog,
        ...newCatalog,
      };

      await writeFile(targetPath, JSON.stringify({ mcpServers: mergedCatalog }, null, 2), "utf-8");
      return { success: true, count: Object.keys(mergedCatalog).length };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`写入 ${CUSTOM_CONFIG_FILENAME} 失败:`, error);
      return { success: false, error: message };
    }
  });

  ipcMain.handle(MCP_CHANNELS.DELETE_CUSTOM_SERVER, async (_event, serverName: string) => {
    try {
      if (!serverName || typeof serverName !== "string") {
        return { success: false, error: "缺少服务器名称" };
      }

      const targetPath = await ensureWritableCustomConfigPath();

      // 读取现有配置
      let existingCatalog: Record<string, MCPServerDisplayConfig> = {};
      try {
        const raw = await readFile(targetPath, "utf-8");
        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === "object" && "mcpServers" in parsed) {
          const mcpServers = (parsed as { mcpServers?: unknown }).mcpServers;
          if (mcpServers && typeof mcpServers === "object") {
            existingCatalog = mcpServers as Record<string, MCPServerDisplayConfig>;
          }
        }
      } catch {
        // 文件不存在或无法解析，使用空对象
        existingCatalog = {};
      }

      // 删除指定的服务器
      delete existingCatalog[serverName];

      // 写回配置文件
      await writeFile(targetPath, JSON.stringify({ mcpServers: existingCatalog }, null, 2), "utf-8");
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`删除 MCP 服务器 ${String(serverName)} 失败:`, error);
      return { success: false, error: message };
    }
  });

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
