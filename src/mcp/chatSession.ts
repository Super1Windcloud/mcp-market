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

  private async processLLMResponse(resp: string): Promise<string> {
    try {
      const data = JSON.parse(resp);
      if (data.tool && data.arguments) {
        for (const s of this.servers) {
          const tools = await s.listTools();
          if (tools.some((t) => t.name === data.tool)) {
            const result = await s.executeTool(data.tool, data.arguments);
            return `Tool execution result: ${JSON.stringify(result)}`;
          }
        }
        return `未找到工具: ${data.tool}`;
      }
      return resp;
    } catch {
      return resp;
    }
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

    const messages: Message[] = [{ role: "system", content: systemPrompt }];

    const readline = await import("readline");
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q: string) => new Promise<string>((r) => rl.question(q, r));

    while (true) {
      const userInput = (await ask("You: ")).trim();
      if (userInput === "exit" || userInput === "quit") break;

      messages.push({ role: "user", content: userInput });
      const llmResp = await this.llm.getResponse(messages);
      console.log("\nAssistant:", llmResp);

      const result = await this.processLLMResponse(llmResp);
      if (result !== llmResp) {
        messages.push({ role: "system", content: result });
        const final = await this.llm.getResponse(messages);
        console.log("\nFinal:", final);
      }
    }

    rl.close();
    await this.cleanupServers();
  }
}
