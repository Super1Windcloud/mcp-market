import { randomUUID } from "crypto";
import { Configuration } from "./config";
import { ChatSession, ChatSessionReply } from "./chatSession";
import { LLMClient } from "./llmClient";
import { Server, Tool } from "./server";
import type { ChatMessage, ChatRole, MCPServerConfig } from "@/types/mcp";

interface SessionEntry {
  server: Server;
  session: ChatSession;
  history: ChatMessage[];
}

export interface SendMessageResult {
  reply?: ChatSessionReply;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  toolMessages: ChatMessage[];
  error?: string;
}

export class MCPChatManager {
  private readonly configuration: Configuration;
  private readonly llmClient: LLMClient;
  private readonly sessions = new Map<string, SessionEntry>();

  constructor(configuration = new Configuration()) {
    this.configuration = configuration;
    this.llmClient = new LLMClient(configuration.llmApiKey);
  }

  async startServer(payload: MCPServerConfig): Promise<{ tools: Tool[] }> {
    const { name, command, args, env } = payload;

    if (this.sessions.has(name)) {
      await this.stopServer(name);
    }

    const server = new Server(name, { command, args, env });
    const session = new ChatSession([server], this.llmClient);
    await session.initialize();

    this.sessions.set(name, {
      server,
      session,
      history: [],
    });

    return { tools: session.getTools() };
  }

  async stopServer(name: string): Promise<void> {
    const entry = this.sessions.get(name);
    if (!entry) return;

    await entry.session.dispose();
    this.sessions.delete(name);
  }

  async sendMessage(name: string, content: string): Promise<SendMessageResult> {
    const entry = this.sessions.get(name);
    if (!entry) {
      throw new Error(`MCP 会话 "${name}" 未初始化`);
    }

    const userMessage = this.createMessage("user", content);
    entry.history.push(userMessage);

    let reply: ChatSessionReply;
    let errorMessage: string | undefined;
    try {
      reply = await entry.session.sendMessage(content);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
      const systemMessage = this.createMessage("system", errorMessage);
      entry.history.push(systemMessage);
      return {
        reply: {
          assistant: { role: "assistant", content: "" },
          rawAssistant: "",
        } as ChatSessionReply,
        userMessage,
        assistantMessage: systemMessage,
        toolMessages: [],
        error: errorMessage,
      };
    }

    const toolMessages: ChatMessage[] = [];
    if (reply.toolResultMessage) {
      const toolMsg = this.createMessage("system", reply.toolResultMessage.content);
      toolMessages.push(toolMsg);
      entry.history.push(toolMsg);
    }

    const assistantMessage = this.createMessage("assistant", reply.assistant.content);
    entry.history.push(assistantMessage);

    return {
      reply,
      userMessage,
      assistantMessage,
      toolMessages,
    };
  }

  async executeTool(name: string, toolName: string, args: Record<string, unknown>): Promise<unknown> {
    const entry = this.sessions.get(name);
    if (!entry) {
      throw new Error(`MCP 会话 "${name}" 未初始化`);
    }

    return entry.server.executeTool(toolName, args);
  }

  listTools(name: string): Tool[] {
    const entry = this.sessions.get(name);
    if (!entry) {
      throw new Error(`MCP 会话 "${name}" 未初始化`);
    }
    return entry.session.getTools();
  }

  getHistory(name: string): ChatMessage[] {
    const entry = this.sessions.get(name);
    if (!entry) return [];
    return [...entry.history];
  }

  clearHistory(name: string): void {
    const entry = this.sessions.get(name);
    if (!entry) return;
    entry.history = [];
    entry.session.reset();
  }

  private createMessage(role: ChatRole, content: string): ChatMessage {
    return {
      id: randomUUID(),
      role,
      content,
      timestamp: new Date(),
    };
  }
}
