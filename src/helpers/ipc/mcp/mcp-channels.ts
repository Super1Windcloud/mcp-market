// src/helpers/ipc/mcp/mcp-channels.ts
export const MCP_CHANNELS = {
  START_SERVER: 'mcp-start-server',
  STOP_SERVER: 'mcp-stop-server',
  LIST_TOOLS: 'mcp-list-tools',
  EXECUTE_TOOL: 'mcp-execute-tool',
  SEND_MESSAGE: 'mcp-send-message',
  GET_CHAT_HISTORY: 'mcp-get-chat-history',
  CLEAR_CHAT_HISTORY: 'mcp-clear-chat-history',
} as const;