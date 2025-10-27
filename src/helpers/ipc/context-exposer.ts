import { exposeThemeContext } from "./theme/theme-context";
import { exposeWindowContext } from "./window/window-context";
import { mcpContext } from "./mcp/mcp-context";

const { contextBridge } = window.require("electron");

export default function exposeContexts() {
  exposeWindowContext();
  exposeThemeContext();
  
  // 暴露MCP上下文
  contextBridge.exposeInMainWorld('mcp', mcpContext);
}
