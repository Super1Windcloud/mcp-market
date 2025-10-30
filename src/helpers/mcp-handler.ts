// src/helpers/mcp-handler.ts
import { ChildProcess } from "child_process";

// 存储MCP服务器实例和相关回调
const mcpServers = new Map<string, {
  process: ChildProcess;
  onMessage: ((data: unknown) => void) | null;
}>();

/**
 * 注册MCP服务器进程及其消息处理函数
 */
export function registerMCPHandler(
  name: string,
  process: ChildProcess,
  onMessage: ((data: unknown) => void) | null,
) {
  // 如果已存在相同的服务器，先清理
  if (mcpServers.has(name)) {
    const existing = mcpServers.get(name)!;
    existing.process.removeAllListeners();
    existing.process.kill();
  }

  mcpServers.set(name, { process, onMessage });

  // 设置输出处理
  process.stdout?.on("data", (data) => {
    const output = data.toString();
    console.log(`[MCP-${name}] stdout:`, output);

    try {
      // 尝试解析服务器的JSON-RPC响应
      const lines = output.split("\n");
      for (const line of lines) {
        if (line.trim() === "") continue;
        const response = JSON.parse(line.trim());

        // 检查是否是响应
        if (response.id !== undefined) {
          // 调用注册的消息处理函数
          if (onMessage) {
            onMessage(response);
          }
        }
      }
    } catch (e) {
      // 如果解析失败，可能是因为输出不是JSON或分块接收
      console.warn(`[MCP-${name}] 解析输出失败:`, e);
    }
  });

  process.stderr?.on("data", (data) => {
    console.error(`[MCP-${name}] stderr:`, data.toString());
  });

  process.on("close", (code) => {
    console.log(`[MCP-${name}] 进程已关闭，退出码: ${code}`);
    mcpServers.delete(name);
  });
}

/**
 * 发送消息到指定的MCP服务器
 */
export function sendToMCP(name: string, message: unknown): boolean {
  const server = mcpServers.get(name);
  if (!server || !server.process.stdin) {
    console.error(`MCP服务器 ${name} 未找到或未正确初始化`);
    return false;
  }

  try {
    const requestData = JSON.stringify(message) + "\n";
    const success = server.process.stdin.write(requestData);
    return success;
  } catch (error) {
    console.error(`向MCP服务器 ${name} 发送消息失败:`, error);
    return false;
  }
}

/**
 * 停止指定的MCP服务器
 */
export function stopMCP(name: string) {
  const server = mcpServers.get(name);
  if (server) {
    server.process.kill();
    mcpServers.delete(name);
  }
}
