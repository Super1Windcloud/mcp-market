// src/helpers/ipc/mcp/mcp-context.ts
import { MCP_CHANNELS } from "./mcp-channels";
import type {
  ChatMessage,
  ExecuteToolResponse,
  MCPServerConfig,
  SendMessageResponse,
  StartServerResponse,
  StopServerResponse,
  ToolDefinition,
} from "@/types/mcp";

const { contextBridge, ipcRenderer } = window.require("electron");

export const mcpContext = {
  startServer: (config: MCPServerConfig) =>
    ipcRenderer.invoke(MCP_CHANNELS.START_SERVER, config) as Promise<StartServerResponse>,

  stopServer: (name: string) =>
    ipcRenderer.invoke(MCP_CHANNELS.STOP_SERVER, name) as Promise<StopServerResponse>,

  listTools: (serverName: string) =>
    ipcRenderer.invoke(MCP_CHANNELS.LIST_TOOLS, serverName) as Promise<ToolDefinition[]>,

  executeTool: (serverName: string, toolName: string, args: Record<string, unknown>) =>
    ipcRenderer.invoke(MCP_CHANNELS.EXECUTE_TOOL, serverName, toolName, args) as Promise<ExecuteToolResponse>,

  sendMessage: (serverName: string, message: string) =>
    ipcRenderer.invoke(MCP_CHANNELS.SEND_MESSAGE, serverName, message) as Promise<SendMessageResponse>,

  getChatHistory: (serverName: string) =>
    ipcRenderer.invoke(MCP_CHANNELS.GET_CHAT_HISTORY, serverName) as Promise<ChatMessage[]>,

  clearChatHistory: (serverName: string) =>
    ipcRenderer.invoke(MCP_CHANNELS.CLEAR_CHAT_HISTORY, serverName) as Promise<StopServerResponse>,
};
