import { ChildProcess, spawn } from "child_process";
import fs from "fs";
import path from "path";
import { EventEmitter } from "events";
import { writeSomeLogs } from "@/utils";

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
      const { command, argsPrefix, needsShell } = this.resolveCommand();
      const spawnArgs = [...argsPrefix, ...this.config.args];
      writeSomeLogs("launcher command :" + command);
      const args = spawnArgs.join(" ");
      writeSomeLogs("args :" + args);
      const proc = spawn(command, spawnArgs, {
        env: { ...process.env, ...(this.config.env || {}) },
        stdio: ["pipe", "pipe", "pipe"],
        shell: needsShell,
      });

      this.process = proc;

      let handshakeRequested = false;
      let initializationSettled = false;

      const settleInitialization = () => {
        if (initializationSettled) return;
        initializationSettled = true;
        if (!this.capabilities) {
          this.capabilities = { progress: true };
        }
        resolve();
      };

      const requestInitialize = () => {
        if (handshakeRequested || !this.process) return;
        handshakeRequested = true;

        const initId = Math.floor(Math.random() * 100000);
        const initPayload = {
          jsonrpc: "2.0",
          id: initId,
          method: "initialize",
          params: {
            protocolVersion: "1.0",
            capabilities: {},
            clientInfo: {
              name: "mcp-market",
              version: "1.0.0",
            },
          },
        };

        const initReq = new Promise<Record<string, unknown> | void>((resolveInit, rejectInit) => {

          this.pendingRequests.set(initId, {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            resolve: resolveInit,
            reject: rejectInit,
          });
        });

        this.process.stdin?.write(JSON.stringify(initPayload) + "\n");

        initReq
          .then((result) => {
            if (result && typeof result === "object" && "capabilities" in result) {
              this.capabilities = result.capabilities as Record<string, unknown>;
            }
            console.log(`[${this.name}] ✅ JSON-RPC initialize 完成`);
            settleInitialization();
          })
          .catch((err) => {
            console.warn(
              `[${this.name}] ⚠️ initialize 请求失败: ${
                err instanceof Error ? err.message : String(err)
              }`,
            );
            settleInitialization();
          });

        setTimeout(() => {
          if (!initializationSettled) {
            this.pendingRequests.delete(initId);
            console.warn(`[${this.name}] ⚠️ initialize 响应超时，继续执行`);
            settleInitialization();
          }
        }, 3000);
      };

      proc.stdout.on("data", async (data) => {
        const rawText = data.toString();
        const trimmed = rawText.trim();
        if (trimmed) {
          console.log(`[${this.name}] stdout:`, trimmed);
        }
        if (/ready/i.test(rawText)) {
          console.log(`[${this.name}] ✅ 检测到 ready 信号`);
          requestInitialize();
        }

        try {
          const lines = rawText.split(/\r?\n/);
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

      proc.on("exit", (code, signal) => {
        if (!initializationSettled) {
          reject(
            new Error(
              `[${this.name}] 进程在初始化前退出，code: ${code ?? "null"} signal: ${signal ?? "null"}`,
            ),
          );
        }
      });

      setTimeout(() => {
        if (!handshakeRequested) {
          console.warn(`[${this.name}] ⚠️ 未检测到 ready 信号，尝试直接初始化`);
          requestInitialize();
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

    const req = new Promise<unknown>((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
    });

    this.process.stdin?.write(JSON.stringify(payload) + "\n");

    return await req;
  }


  async cleanup(): Promise<void> {
    if (this.process) {
      console.log(`[${this.name}] 关闭进程`);
      this.process.kill();
      this.process = null;
    }
  }

  private resolveCommand(): { command: string; argsPrefix: string[]; needsShell: boolean } {
    const configured = this.config.command;
    if (process.platform !== "win32") {
      return { command: configured, argsPrefix: [], needsShell: false };
    }

    if (configured === "npx") {
      const nodeDir = path.dirname(process.execPath);
      const npxCli = path.join(nodeDir, "node_modules", "npm", "bin", "npx-cli.js");
      if (fs.existsSync(npxCli)) {
        return { command: process.execPath, argsPrefix: [npxCli], needsShell: false };
      }

      const npxCmd = path.join(nodeDir, "npx.cmd");
      if (fs.existsSync(npxCmd)) {
        return { command: npxCmd, argsPrefix: [], needsShell: true };
      }

      return { command: "npx", argsPrefix: [], needsShell: true };
    }

    const needsShell = /\.cmd$/i.test(configured);
    return { command: configured, argsPrefix: [], needsShell };
  }
}
