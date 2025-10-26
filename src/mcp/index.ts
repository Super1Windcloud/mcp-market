import { Configuration } from "./config";
import { Server } from "./server";
import { LLMClient } from "./llmClient";
import { ChatSession } from "./chatSession";

async function main() {
  const cfg = new Configuration();
  const data = cfg.loadConfig("mcp_config.json");
  const servers = Object.entries(data.mcpServers as object).map(
    ([name, conf]) => new Server(name, conf),
  );

  const llm = new LLMClient(cfg.llmApiKey);
  const chat = new ChatSession(servers, llm);
  await chat.start();
}

main().catch((err) => console.error(err));
