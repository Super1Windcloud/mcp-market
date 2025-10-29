import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const getRuntimeBasePath = (): string => {
  if (process.env.MCP_RESOURCE_BASE) {
    return process.env.MCP_RESOURCE_BASE;
  }

  if (typeof process.resourcesPath === "string" && process.resourcesPath.length > 0) {
    return process.resourcesPath;
  }

  return process.cwd();
};

export class Configuration {
  private readonly apiKey?: string;

  constructor() {
    this.loadEnv();
    this.apiKey =
      process.env.SIliconflow_API_KEY ||
      process.env.SILICONFLOW_API_KEY ||
      process.env.SILICON_FLOW_API_KEY;
  }

  private loadEnv(): void {
    const basePath = getRuntimeBasePath();
    const candidate = path.join(basePath, ".env");

    const searchOrder = [candidate];
    const fallback = path.resolve(".env");
    if (!searchOrder.includes(fallback)) {
      searchOrder.push(fallback);
    }

    for (const envPath of searchOrder) {
      if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        return;
      }
    }
  }

  loadConfig(filePath: string): Record<string, unknown> {
    const basePath = getRuntimeBasePath();
    const candidates: string[] = [];

    if (path.isAbsolute(filePath)) {
      candidates.push(filePath);
    } else {
      candidates.push(path.join(basePath, filePath));
      candidates.push(path.join(basePath, "public", filePath));
      candidates.push(path.resolve(filePath));
    }

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        const data = fs.readFileSync(candidate, "utf-8");
        return JSON.parse(data);
      }
    }

    throw new Error(`配置文件不存在: ${candidates.join(", ")}`);
  }

  get llmApiKey(): string {
    if (!this.apiKey) {
      throw new Error(
        "未在环境变量中找到 LLM_API_KEY。请在仓库根目录创建 .env 文件，并设置 SILICONFLOW_API_KEY=<你的密钥>",
      );
    }
    return this.apiKey;
  }
}
