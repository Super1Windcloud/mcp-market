import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export class Configuration {
  private readonly apiKey?: string;

  constructor() {
    this.loadEnv();
    this.apiKey = process.env.SIliconflow_API_KEY;
  }

  private loadEnv(): void {
    const absPath = path.resolve(".env");
    dotenv.config({
        path: absPath,
      },
    );
  }

  loadConfig(filePath: string): Record<string, unknown> {
    const absPath = path.resolve(filePath);
    if (!fs.existsSync(absPath)) {
      throw new Error(`配置文件不存在: ${absPath}`);
    }
    const data = fs.readFileSync(absPath, "utf-8");
    return JSON.parse(data);
  }

  get llmApiKey(): string {
    if (!this.apiKey) {
      throw new Error("未在环境变量中找到 LLM_API_KEY");
    }
    return this.apiKey;
  }
}
