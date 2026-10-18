import type { MCPServerConfig } from "@/types/mcp";
import { parseServerConfig } from "./serverConfig";

export const resolveServerConfig = async (
  displayName: string,
  url: string,
): Promise<MCPServerConfig> => {
  // A saved choice is authoritative, including disabled or invalid configurations.
  const override = await window.mcp.getServerConfig(displayName);
  if (override) return { ...parseServerConfig(override), name: displayName };

  const catalog =
    typeof window.mcp.listCustomServers === "function"
      ? await window.mcp.listCustomServers()
      : [];
  const fallback = (catalog ?? []).find(
    (server) => server.name === displayName,
  );
  if (fallback) return { ...parseServerConfig(fallback), name: displayName };

  return {
    name: displayName,
    command: "not found",
    args: ["not found"],
    env: { error: `请访问${url} 自行配置mcpServer` },
  };
};
