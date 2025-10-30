import { contextBridge } from "electron";
import { exposeThemeContext } from "./theme/theme-context";
import { exposeWindowContext } from "./window/window-context";
import { mcpContext } from "./mcp/mcp-context";

export default function exposeContexts() {
  // 优先保证 MCP API 暴露，避免其它上下文初始化失败时影响核心功能
  try {
    console.log("[preload] exposing MCP context");
    contextBridge.exposeInMainWorld("mcp", mcpContext);
    console.log("[preload] MCP context ready");
  } catch (error) {
    console.error("[preload] expose MCP context failed:", error);
  }

  try {
    exposeWindowContext();
  } catch (error) {
    console.error("[preload] exposeWindowContext failed:", error);
  }

  try {
    exposeThemeContext();
  } catch (error) {
    console.error("[preload] exposeThemeContext failed:", error);
  }
}
