export interface StdioServerConfig {
  transport?: "stdio";
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface HttpServerConfig {
  transport: "streamable-http";
  endpoint: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
  command?: never;
  args?: never;
  env?: never;
}

export type ServerConfig = (StdioServerConfig | HttpServerConfig) & {
  disabled?: boolean;
};

/** Shared by the renderer resolver and the main-process IPC boundary. */
export function parseServerConfig(value: unknown): ServerConfig {
  if (!value || typeof value !== "object") throw new Error("MCP 配置格式无效");
  const raw = value as Record<string, unknown>;
  if (raw.disabled !== undefined && typeof raw.disabled !== "boolean") {
    throw new Error("MCP disabled 必须是布尔值");
  }
  const disabled = raw.disabled as boolean | undefined;
  if (raw.transport === "streamable-http") {
    if (typeof raw.endpoint !== "string")
      throw new Error("MCP 配置缺少 endpoint");
    const endpoint = new URL(raw.endpoint);
    if (!["https:", "http:"].includes(endpoint.protocol)) {
      throw new Error("MCP endpoint 必须使用 HTTP 或 HTTPS");
    }
    if (
      raw.timeoutMs !== undefined &&
      (typeof raw.timeoutMs !== "number" ||
        !Number.isFinite(raw.timeoutMs) ||
        raw.timeoutMs <= 0)
    ) {
      throw new Error("MCP timeoutMs 必须是正数");
    }
    const headers = raw.headers as Record<string, string> | undefined;
    if (
      headers !== undefined &&
      (!headers ||
        typeof headers !== "object" ||
        Array.isArray(headers) ||
        Object.values(headers).some((header) => typeof header !== "string"))
    ) {
      throw new Error("MCP headers 必须是字符串映射");
    }
    return {
      transport: "streamable-http",
      endpoint: endpoint.href,
      headers,
      timeoutMs: raw.timeoutMs as number | undefined,
      disabled,
    };
  }
  if (raw.transport !== undefined && raw.transport !== "stdio") {
    throw new Error("不支持的 MCP transport");
  }
  if (
    typeof raw.command !== "string" ||
    !raw.command.trim() ||
    !Array.isArray(raw.args)
  ) {
    throw new Error("MCP 配置缺少 command 或 args");
  }
  const env =
    raw.env && typeof raw.env === "object"
      ? Object.fromEntries(
          Object.entries(raw.env)
            .filter(([key, value]) => key && value != null)
            .map(([key, value]) => [key, String(value)]),
        )
      : undefined;
  return {
    command: raw.command.trim(),
    args: raw.args.map(String),
    env,
    disabled,
  };
}
