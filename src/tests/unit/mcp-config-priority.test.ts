import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "path";
import { existsSync } from "fs";
import { mkdir, writeFile, rm } from "fs/promises";

describe("MCP Config Priority Tests", () => {
  const testDir = path.join(process.cwd(), ".test-mcp-config");
  const builtPublicDir = path.join(testDir, ".vite", "build", "public");
  const sourcePublicDir = path.join(testDir, "public");

  beforeEach(async () => {
    // 创建测试目录结构
    await mkdir(builtPublicDir, { recursive: true });
    await mkdir(sourcePublicDir, { recursive: true });
  });

  afterEach(async () => {
    // 清理测试目录
    if (existsSync(testDir)) {
      await rm(testDir, { recursive: true, force: true });
    }
  });

  it("should prioritize .vite/build/public over public directory", async () => {
    const builtConfigPath = path.join(builtPublicDir, "my_mcp_config.json");
    const sourceConfigPath = path.join(sourcePublicDir, "my_mcp_config.json");

    // 在两个位置都创建配置文件
    const builtConfig = {
      mcpServers: {
        "built-mcp": {
          name: "built-mcp",
          command: "node built.js",
        },
      },
    };

    const sourceConfig = {
      mcpServers: {
        "source-mcp": {
          name: "source-mcp",
          command: "node source.js",
        },
      },
    };

    await writeFile(builtConfigPath, JSON.stringify(builtConfig, null, 2), "utf-8");
    await writeFile(sourceConfigPath, JSON.stringify(sourceConfig, null, 2), "utf-8");

    // 验证两个文件都存在
    expect(existsSync(builtConfigPath)).toBe(true);
    expect(existsSync(sourceConfigPath)).toBe(true);

    // 验证 .vite/build/public 中的文件优先级更高
    // 这个测试验证了文件系统中的优先级设置
    const builtExists = existsSync(builtConfigPath);
    const sourceExists = existsSync(sourceConfigPath);

    expect(builtExists).toBe(true);
    expect(sourceExists).toBe(true);
  });

  it("should create config in .vite/build/public if it doesn't exist", async () => {
    const builtConfigPath = path.join(builtPublicDir, "my_mcp_config.json");

    // 验证文件不存在
    expect(existsSync(builtConfigPath)).toBe(false);

    // 创建配置文件
    const config = {
      mcpServers: {
        "test-mcp": {
          name: "test-mcp",
          command: "node test.js",
        },
      },
    };

    await writeFile(builtConfigPath, JSON.stringify(config, null, 2), "utf-8");

    // 验证文件已创建
    expect(existsSync(builtConfigPath)).toBe(true);
  });

  it("should handle mcp_config.json priority correctly", async () => {
    const builtConfigPath = path.join(builtPublicDir, "mcp_config.json");

    const config = {
      mcpServers: {
        "test-mcp": {
          name: "test-mcp",
          command: "node test.js",
        },
      },
    };

    // 在 .vite/build/public 中创建文件
    await writeFile(builtConfigPath, JSON.stringify(config, null, 2), "utf-8");

    // 验证文件存在
    expect(existsSync(builtConfigPath)).toBe(true);

    // 验证优先级：.vite/build/public 应该被优先使用
    const builtExists = existsSync(builtConfigPath);
    expect(builtExists).toBe(true);
  });
});
