import { LLMClient, Message } from "./llmClient";
import { Server, Tool } from "./server";

export interface ToolInvocation {
  name: string;
  arguments: Record<string, unknown>;
  result: unknown;
  rawResponse: string;
}

export interface ChatSessionReply {
  assistant: Message;
  rawAssistant: string;
  toolInvocation?: ToolInvocation;
  toolResultMessage?: Message;
}

const SUMMARY_PROMPT =
  "请根据给定的工具结果，用自然语言直接回答用户问题，提供精炼总结。不要再次调用工具，也不要输出 JSON。";

export class ChatSession {
  private readonly servers: Server[];
  private readonly llm: LLMClient;
  private initialized = false;
  private systemMessage: Message | null = null;
  private history: Message[] = [];
  private availableTools: Tool[] = [];

  constructor(servers: Server[], llm: LLMClient) {
    this.servers = servers;
    this.llm = llm;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    for (const server of this.servers) {
      await server.initialize();
    }

    const toolsByServer = await Promise.all(this.servers.map((server) => server.listTools()));
    this.availableTools = toolsByServer.flat();
    const systemPrompt = this.composeSystemPrompt(this.availableTools);
    this.systemMessage = { role: "system", content: systemPrompt };
    this.initialized = true;
  }

  async dispose(): Promise<void> {
    await this.cleanupServers();
    this.initialized = false;
    this.systemMessage = null;
    this.history = [];
    this.availableTools = [];
  }

  getTools(): Tool[] {
    return this.availableTools;
  }

  reset(): void {
    this.history = [];
  }

  async sendMessage(userContent: string): Promise<ChatSessionReply> {
    await this.ensureInitialized();

    const userMessage: Message = { role: "user", content: userContent };
    this.history.push(userMessage);

    const conversation: Message[] = [this.systemMessage!, ...this.history];
    const llmResp = await this.llm.getResponse(conversation);
    const processed = await this.processLLMResponse(llmResp);

    if (processed.toolInvocation) {
      let toolResultMessage: Message | undefined;

      if (processed.toolInvocation.result !== undefined) {
        const toolSummary = this.stringifyToolResult(processed.toolInvocation);
        toolResultMessage = { role: "system", content: toolSummary };
        this.history.push(toolResultMessage);
      }

      const followupMessages: Message[] = [
        { role: "system", content: SUMMARY_PROMPT },
        userMessage,
        { role: "assistant", content: llmResp },
        { role: "system", content: processed.content },
      ];
      const finalAnswer = await this.llm.getResponse(followupMessages);
      const assistantMessage: Message = { role: "assistant", content: finalAnswer };
      this.history.push(assistantMessage);

      return {
        assistant: assistantMessage,
        rawAssistant: llmResp,
        toolInvocation: processed.toolInvocation,
        toolResultMessage,
      };
    }

    const assistantMessage: Message = { role: "assistant", content: processed.content };
    this.history.push(assistantMessage);
    return { assistant: assistantMessage, rawAssistant: llmResp };
  }

  async start(): Promise<void> {
    await this.ensureInitialized();
    const readline = await import("readline");
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q: string) => new Promise<string>((resolve) => rl.question(q, resolve));

    try {
      // CLI loop primarily for development/testing parity.
      while (true) {
        const userInput = (await ask("You: ")).trim();
        if (["exit", "quit", "q"].includes(userInput)) break;

        const reply = await this.sendMessage(userInput);
        console.log("\nAssistant:", reply.assistant.content);
        if (reply.toolInvocation) {
          console.log("\nTool invocation:", reply.toolInvocation.name);
          console.log("Arguments:", JSON.stringify(reply.toolInvocation.arguments, null, 2));
          console.log("Result:", this.stringifyResult(reply.toolInvocation.result));
        }
      }
    } finally {
      rl.close();
      await this.cleanupServers();
    }
  }

  getConversation(): Message[] {
    return [this.systemMessage!, ...this.history];
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  private async cleanupServers() {
    for (const server of this.servers) {
      await server.cleanup();
    }
  }

  private composeSystemPrompt(tools: Tool[]): string {
    return `
你是一个拥有以下工具访问能力的助手：
${tools.map((tool) => tool.formatForLLM()).join("\n")}
当需要调用工具时，仅输出如下 JSON：
{
  "tool": "tool-name",
  "arguments": { "arg-name": "value" }
}
`.trim();
  }

  private extractToolCallPayload(resp: string): Record<string, unknown> | null {
    const candidates: string[] = [resp];
    const fencedMatch = resp.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fencedMatch?.[1]) {
      candidates.unshift(fencedMatch[1].trim());
    }

    for (const candidate of candidates) {
      try {
        return JSON.parse(candidate);
      } catch {
        /* empty */
      }
    }

    return null;
  }

  private normalizeArguments(toolName: string, args: Record<string, unknown>) {
    const normalized = { ...args };
    if (toolName === "web-search" || toolName === "search") {
      const engines = normalized.engines;
      if (Array.isArray(engines)) {
        normalized.engines = engines.map((engine) =>
          typeof engine === "string" ? engine.toLowerCase() : engine,
        );
      } else if (typeof engines === "string") {
        normalized.engines = [engines.toLowerCase()];
      }
    }
    return normalized;
  }

  private async processLLMResponse(resp: string): Promise<{
    type: "text" | "tool";
    content: string;
    toolInvocation?: ToolInvocation;
  }> {
    const data = this.extractToolCallPayload(resp);
    if (
      data?.tool &&
      data.arguments &&
      typeof data.arguments === "object" &&
      !Array.isArray(data.arguments)
    ) {
      const toolName = String(data.tool);
      const normalizedArgs = this.normalizeArguments(toolName, data.arguments as Record<string, unknown>);

      for (const server of this.servers) {
        const tool = server.tools.find((t) => t.name === toolName);
        if (!tool) continue;

        try {
          const executionResult = await server.executeTool(toolName, normalizedArgs);
          const resultText = this.stringifyResult(executionResult);
          return {
            type: "tool",
            content: resultText,
            toolInvocation: {
              name: toolName,
              arguments: normalizedArgs,
              result: executionResult,
              rawResponse: resp,
            },
          };
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
          return {
            type: "tool",
            content: errorMessage,
            toolInvocation: {
              name: toolName,
              arguments: normalizedArgs,
              result: { error: errorMessage },
              rawResponse: resp,
            },
          };
        }
      }

      return {
        type: "tool",
        content: `未找到工具: ${toolName}`,
        toolInvocation: {
          name: toolName,
          arguments: normalizedArgs,
          result: { error: "TOOL_NOT_FOUND" },
          rawResponse: resp,
        },
      };
    }

    return { type: "text", content: resp };
  }

  private stringifyResult(result: unknown): string {
    if (typeof result === "string") return result;
    try {
      return JSON.stringify(result, null, 2);
    } catch {
      return String(result);
    }
  }

  private stringifyToolResult(invocation: ToolInvocation): string {
    const resultSummary = this.stringifyResult(invocation.result);
    return [
      `工具 "${invocation.name}" 执行完成。`,
      "输入参数:",
      JSON.stringify(invocation.arguments, null, 2),
      "输出结果:",
      resultSummary,
    ].join("\n");
  }
}
