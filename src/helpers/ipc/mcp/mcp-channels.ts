// src/helpers/ipc/mcp/mcp-channels.ts
export const MCP_CHANNELS = {
  START_SERVER: "mcp-start-server",
  STOP_SERVER: "mcp-stop-server",
  LIST_TOOLS: "mcp-list-tools",
  EXECUTE_TOOL: "mcp-execute-tool",
  SEND_MESSAGE: "mcp-send-message",
  GET_CHAT_HISTORY: "mcp-get-chat-history",
  CLEAR_CHAT_HISTORY: "mcp-clear-chat-history",
  GET_SERVER_CONFIG: "mcp-get-server-config",
  UPSERT_SERVER_CONFIG: "mcp-upsert-server-config",
  LIST_CUSTOM_SERVERS: "mcp-list-custom-servers",
  SAVE_CUSTOM_SERVERS: "mcp-save-custom-servers",
  DELETE_CUSTOM_SERVER: "mcp-delete-custom-server",
} as const;
