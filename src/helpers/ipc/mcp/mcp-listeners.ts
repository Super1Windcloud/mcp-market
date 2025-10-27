// src/helpers/ipc/mcp/mcp-listeners.ts
import { ipcMain } from "electron";
import { MCP_CHANNELS } from "./mcp-channels";
import { MCPChatManager } from "@/mcp/chatManager";

let manager: MCPChatManager | null = null;

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

export function registerMCPServerListeners() {
  ipcMain.handle(MCP_CHANNELS.START_SERVER, async (_event, rawConfig) => {
    const { name, command, args, env } = rawConfig ?? {};
    if (!name || !command || !Array.isArray(args)) {
      return { success: false, error: "缺少必要的 MCP 配置参数" };
    }

    try {
      const currentManager = getManager();
      const { tools } = await currentManager.startServer({ name, command, args, env });
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
      console.error(`获取 MCP 服务器 ${String(name)} 工具列表失败:`, error);
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
      console.error(`获取 MCP 服务器 ${String(name)} 聊天历史失败:`, error);
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
}
