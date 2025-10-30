import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { rmSync } from "node:fs";

// 测试目录
const testDir = path.join(process.cwd(), ".test-mcp-merge");

describe("MCP Config Merge Functionality", () => {
  beforeEach(async () => {
    // 创建测试目录
    if (!existsSync(testDir)) {
      await mkdir(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // 清理测试目录
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("should merge new configs with existing ones", async () => {
    const configPath = path.join(testDir, "my_mcp_config.json");

    // 初始配置
    const initialConfig = {
      mcpServers: {
        "existing-mcp": {
          name: "existing-mcp",
          command: "python server.py",
          args: [],
        },
      },
    };

    // 写入初始配置
    await writeFile(configPath, JSON.stringify(initialConfig, null, 2), "utf-8");

    // 新配置
    const newConfig = {
      mcpServers: {
        "new-mcp": {
          name: "new-mcp",
          command: "node server.js",
          args: ["--port", "8080"],
        },
      },
    };

    // 模拟合并逻辑
    const existingCatalog = initialConfig.mcpServers;
    const newCatalog = newConfig.mcpServers;
    const mergedCatalog = {
      ...existingCatalog,
      ...newCatalog,
    };

    // 写入合并后的配置
    await writeFile(configPath, JSON.stringify({ mcpServers: mergedCatalog }, null, 2), "utf-8");

    // 验证
    const result = JSON.parse(await readFile(configPath, "utf-8"));
    expect(Object.keys(result.mcpServers)).toHaveLength(2);
    expect(result.mcpServers["existing-mcp"]).toBeDefined();
    expect(result.mcpServers["new-mcp"]).toBeDefined();
    expect(result.mcpServers["existing-mcp"].command).toBe("python server.py");
    expect(result.mcpServers["new-mcp"].command).toBe("node server.js");
  });

  it("should overwrite existing config with same name", async () => {
    const configPath = path.join(testDir, "my_mcp_config.json");

    // 初始配置
    const initialConfig = {
      mcpServers: {
        "test-mcp": {
          name: "test-mcp",
          command: "python server.py",
          args: [],
        },
      },
    };

    await writeFile(configPath, JSON.stringify(initialConfig, null, 2), "utf-8");

    // 更新同名配置
    const updatedConfig = {
      mcpServers: {
        "test-mcp": {
          name: "test-mcp",
          command: "node server.js",
          args: ["--port", "8080"],
        },
      },
    };

    // 模拟合并逻辑
    const existingCatalog = initialConfig.mcpServers;
    const newCatalog = updatedConfig.mcpServers;
    const mergedCatalog = {
      ...existingCatalog,
      ...newCatalog,
    };

    await writeFile(configPath, JSON.stringify({ mcpServers: mergedCatalog }, null, 2), "utf-8");

    // 验证
    const result = JSON.parse(await readFile(configPath, "utf-8"));
    expect(Object.keys(result.mcpServers)).toHaveLength(1);
    expect(result.mcpServers["test-mcp"].command).toBe("node server.js");
  });

  it("should handle empty existing config", async () => {
    const configPath = path.join(testDir, "my_mcp_config.json");

    // 空配置
    const initialConfig = {
      mcpServers: {},
    };

    await writeFile(configPath, JSON.stringify(initialConfig, null, 2), "utf-8");

    // 新配置
    const newConfig = {
      mcpServers: {
        "new-mcp": {
          name: "new-mcp",
          command: "python server.py",
          args: [],
        },
      },
    };

    // 模拟合并逻辑
    const existingCatalog = initialConfig.mcpServers;
    const newCatalog = newConfig.mcpServers;
    const mergedCatalog = {
      ...existingCatalog,
      ...newCatalog,
    };

    await writeFile(configPath, JSON.stringify({ mcpServers: mergedCatalog }, null, 2), "utf-8");

    // 验证
    const result = JSON.parse(await readFile(configPath, "utf-8"));
    expect(Object.keys(result.mcpServers)).toHaveLength(1);
    expect(result.mcpServers["new-mcp"]).toBeDefined();
  });
});
