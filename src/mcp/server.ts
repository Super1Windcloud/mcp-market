import { spawn, ChildProcess } from "child_process";
import { EventEmitter } from "events";

export interface ToolSchema {
  type: "object";
  properties: Record<string, { type: string; description?: string }>;
  required?: string[];
}

export interface McpToolDescription {
  name: string;
  description: string;
  input_schema?: ToolSchema;
  inputSchema?: ToolSchema;
}

/** MCP list_tools 响应结构 */
export interface McpListToolsResult {
  tools: McpToolDescription[];
}

export class Tool {
  constructor(
    public name: string,
    public description: string,
    public inputSchema: ToolSchema,
  ) {
  }

  formatForLLM(): string {
    const props = this.inputSchema.properties || {};
    const req = this.inputSchema.required || [];
    const argsDesc = Object.entries(props)
      .map(([key, val]) => {
        const desc = val.description ?? "No description";
        const reqMark = req.includes(key) ? " (required)" : "";
        return `- ${key}: ${desc}${reqMark}`;
      })
      .join("\n");
    return `\nTool: ${this.name}\nDescription: ${this.description}\nArguments:\n${argsDesc}\n`;
  }
}

export interface ServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export class Server extends EventEmitter {
  name: string;
  config: ServerConfig;
  process: ChildProcess | null = null;
  capabilities: Record<string, unknown> | null = null;
  tools: Tool[] = [];
  private pendingRequests = new Map<number, { resolve: (v: unknown) => void; reject: (e: unknown) => void }>();

  constructor(name: string, config: ServerConfig) {
    super();
    this.name = name;
    this.config = config;
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const isWin = process.platform === "win32";
      const cmd = isWin && this.config.command === "npx" ? "npx.cmd" : this.config.command;

      const proc = spawn(cmd, this.config.args, {
        env: { ...process.env, ...(this.config.env || {}) },
        stdio: ["pipe", "pipe", "pipe"],
        shell: isWin,
      });

      this.process = proc;

      let ready = false;

      proc.stdout.on("data", async (data) => {
        const text = data.toString().trim();
        console.log(`[${this.name}] stdout:`, text);
        if (/ready/i.test(text)) {
          console.log(`[${this.name}] ✅ 检测到 ready 信号`);

          const initId = Math.floor(Math.random() * 100000);
          const initPayload = {
            jsonrpc: "2.0",
            id: initId,
            method: "initialize",
            params: { capabilities: {} },
          };

          const initReq = new Promise((resolve, reject) => {
            this.pendingRequests.set(initId, { resolve, reject });
          });

          this.process?.stdin?.write(JSON.stringify(initPayload) + "\n");
          await initReq;

          ready = true;
          this.capabilities = { progress: true };
          resolve();
        }

        try {
          const lines = text.split("\n");
          for (const line of lines) {
            if (!line.trim()) continue;
            const resp = JSON.parse(line);
            if (resp.id !== undefined) {
              const req = this.pendingRequests.get(resp.id);
              if (req) {
                this.pendingRequests.delete(resp.id);
                if (resp.error) req.reject(new Error(resp.error.message));
                else req.resolve(resp.result);
              }
            }
          }
        } catch { /* empty */
        }
      });

      proc.stderr.on("data", (data) => {
        console.error(`[${this.name}] stderr:`, data.toString());
      });

      proc.on("error", (err) => {
        reject(err);
      });

      setTimeout(() => {
        if (!ready) {
          console.warn(`[${this.name}] ⚠️ 未检测到 ready 信号，继续执行`);
          resolve();
        }
      }, 5000);
    });
  }

  async listTools(): Promise<Tool[]> {
    if (!this.process) throw new Error("进程未初始化");
    const id = Math.floor(Math.random() * 100000);
    const payload = {
      jsonrpc: "2.0",
      id,
      method: "tools/list",
      params: {},
    };

    const req = new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
    });

    this.process.stdin?.write(JSON.stringify(payload) + "\n");

    const result = (await req) as McpListToolsResult;
    const tools = (result.tools || []).map(
      (t: McpToolDescription) =>
        new Tool(t.name, t.description, (t.input_schema ?? t.inputSchema) as ToolSchema),
    );

    this.tools = tools;
    return tools;
  }

  async executeTool(toolName: string, args: Record<string, unknown>): Promise<unknown> {
    if (!this.process) throw new Error("进程未初始化");

    console.log(`[${this.name}] 执行工具: ${toolName} 参数:`, args);

    const id = Math.floor(Math.random() * 100000);
    const payload = {
      jsonrpc: "2.0",
      id,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args,
      },
    };

    const req = new Promise<any>((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
    });

    this.process.stdin?.write(JSON.stringify(payload) + "\n");

    const result = await req;
    return result?.result;
  }


  async cleanup(): Promise<void> {
    if (this.process) {
      console.log(`[${this.name}] 关闭进程`);
      this.process.kill();
      this.process = null;
    }
  }
}
