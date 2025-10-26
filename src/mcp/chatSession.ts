import { LLMClient, Message } from "./llmClient";
import { Server } from "./server";

export class ChatSession {
  private readonly servers: Server[];
  private llm: LLMClient;

  constructor(servers: Server[], llm: LLMClient) {
    this.servers = servers;
    this.llm = llm;
  }

  private async cleanupServers() {
    for (const s of this.servers) await s.cleanup();
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
      } catch { /* empty */
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

  private async processLLMResponse(resp: string): Promise<string> {
    const data = this.extractToolCallPayload(resp);
    if (
      data?.tool &&
      data.arguments &&
      typeof data.arguments === "object" &&
      !Array.isArray(data.arguments)
    ) {
      for (const s of this.servers) {
        const tools = await s.listTools();
        if (tools.some((t) => t.name === data.tool)) {
          try {
            const args = this.normalizeArguments(
              data.tool as string,
              data.arguments as Record<string, unknown>,
            );
            const result = await s.executeTool(data.tool as string, args);
            return `Tool execution result: ${JSON.stringify(result)}`;
          } catch (err) {
            return `工具执行失败: ${
              err instanceof Error ? err.message : JSON.stringify(err)
            }`;
          }
        }
      }
      return `未找到工具: ${String(data.tool)}`;
    }

    return resp;
  }

  async start(): Promise<void> {
    for (const s of this.servers) await s.initialize();
    const allTools = (await Promise.all(this.servers.map((s) => s.listTools()))).flat();

    const systemPrompt = `
你是一个拥有以下工具访问能力的助手：
${allTools.map((t) => t.formatForLLM()).join("\n")}
当需要调用工具时，仅输出如下 JSON：
{
  "tool": "tool-name",
  "arguments": { "arg-name": "value" }
}
`;

    const systemMessage: Message = { role: "system", content: systemPrompt };

    const readline = await import("readline");
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q: string) => new Promise<string>((r) => rl.question(q, r));

    while (true) {
      const userInput = (await ask("You: ")).trim();
      if (userInput === "exit" || userInput === "quit" || userInput === "q") break;

      const userMessage: Message = { role: "user", content: userInput };
      const roundMessages: Message[] = [systemMessage, userMessage];
      const llmResp = await this.llm.getResponse(roundMessages);
      console.log("\nAssistant:", llmResp);

      const result = await this.processLLMResponse(llmResp);
      if (result !== llmResp) {
        const summarySystemMessage: Message = {
          role: "system",
          content:
            "请根据给定的工具结果，用自然语言直接回答用户问题，提供精炼总结。不要再次调用工具，也不要输出 JSON。",
        };
        const followupMessages: Message[] = [
          summarySystemMessage,
          userMessage,
          { role: "assistant", content: llmResp },
          { role: "system", content: result },
        ];
        const final = await this.llm.getResponse(followupMessages);
        console.log("\nFinal:", final);
      }

    }

    rl.close();
    await this.cleanupServers();
  }
}
