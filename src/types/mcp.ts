import type { ToolSchema } from "@/mcp/server";
import type { ServerConfig } from "@/mcp/serverConfig";

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
}



export type MCPServerConfig = ServerConfig & { name: string };

export type MCPServerDisplayConfig = MCPServerConfig & {
  desc?: string;
  url?: string;
};

export interface MCPConfigCatalog {
  mcpServers: Record<string, MCPServerDisplayConfig>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolSchema;
}

export interface StartServerResponse {
  success: boolean;
  error?: string;
  tools?: ToolDefinition[];
}

export interface StopServerResponse {
  success: boolean;
  error?: string;
}

export interface ExecuteToolResponse {
  success: boolean;
  result?: unknown;
  error?: string;
}

export interface SendMessageResponse {
  success: boolean;
  userMessage?: ChatMessage;
  assistantMessage?: ChatMessage;
  toolMessages?: ChatMessage[];
  error?: string;
}
