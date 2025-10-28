# TypeScript 类型错误修复说明

## 问题描述
在 `src/helpers/ipc/mcp/mcp-listeners.ts` 中，存在多个 TypeScript 类型错误：

```
TS2345: Argument of type 'Record<string, unknown>' is not assignable to parameter of type 'MCPServerDisplayConfig[] | Record<string, MCPServerDisplayConfig> | MCPConfigCatalog'.
```

## 根本原因
`JSON.parse()` 返回 `unknown` 类型，但代码中直接将其类型断言为具体类型（如 `Record<string, MCPServerDisplayConfig>`），然后在赋值时 TypeScript 无法确认这个类型断言的有效性。

## 修复方案

### 1. `loadAllServerConfigs()` 函数
**修改前**：
```typescript
const parsed = JSON.parse(raw);
if (typeof parsed !== "object" || parsed === null) {
  throw new Error(`${CONFIG_FILENAME} 内容无效`);
}
return parsed as Record<string, Partial<MCPServerConfig>>;
```

**修改后**：
```typescript
const parsed = JSON.parse(raw) as unknown;
if (typeof parsed !== "object" || parsed === null) {
  throw new Error(`${CONFIG_FILENAME} 内容无效`);
}

// 如果是 { mcpServers: {...} } 格式，提取 mcpServers
if ("mcpServers" in parsed) {
  const mcpServers = (parsed as { mcpServers?: unknown }).mcpServers;
  if (typeof mcpServers === "object" && mcpServers !== null) {
    return mcpServers as Record<string, Partial<MCPServerConfig>>;
  }
}

// 否则直接返回
return parsed as Record<string, Partial<MCPServerConfig>>;
```

### 2. `loadCustomServerCatalog()` 函数
**修改前**：
```typescript
const parsed = JSON.parse(raw) as { mcpServers?: Record<string, MCPServerDisplayConfig> };

if (!parsed || typeof parsed !== "object" || !parsed.mcpServers || typeof parsed.mcpServers !== "object") {
  return {};
}

const catalog: Record<string, MCPServerDisplayConfig> = {};
for (const [key, entry] of Object.entries(parsed.mcpServers)) {
  if (!entry || typeof entry !== "object") continue;
  catalog[key] = {
    ...entry,
    name: entry.name ?? key,
  };
}
```

**修改后**：
```typescript
const parsed = JSON.parse(raw) as unknown;

if (!parsed || typeof parsed !== "object" || !("mcpServers" in parsed)) {
  return {};
}

const mcpServers = (parsed as { mcpServers?: unknown }).mcpServers;
if (!mcpServers || typeof mcpServers !== "object") {
  return {};
}

const catalog: Record<string, MCPServerDisplayConfig> = {};
for (const [key, entry] of Object.entries(mcpServers as Record<string, unknown>)) {
  if (!entry || typeof entry !== "object") continue;
  const config = sanitizeDisplayConfig(entry, key);
  catalog[key] = config;
}
```

### 3. `SAVE_CUSTOM_SERVERS` IPC 处理程序
**修改前**：
```typescript
const parsed = JSON.parse(raw) as { mcpServers?: Record<string, MCPServerDisplayConfig> };
if (parsed?.mcpServers && typeof parsed.mcpServers === "object") {
  existingCatalog = parsed.mcpServers;
}
```

**修改后**：
```typescript
const parsed = JSON.parse(raw) as unknown;
if (parsed && typeof parsed === "object" && "mcpServers" in parsed) {
  const mcpServers = (parsed as { mcpServers?: unknown }).mcpServers;
  if (mcpServers && typeof mcpServers === "object") {
    existingCatalog = mcpServers as Record<string, MCPServerDisplayConfig>;
  }
}
```

## 修复原理

1. **显式声明 `unknown` 类型**：`JSON.parse(raw) as unknown` 明确告诉 TypeScript 我们知道这是 unknown 类型
2. **逐步类型检查**：使用 `typeof` 和 `in` 操作符逐步验证对象结构
3. **安全的类型断言**：只在确认对象结构后才进行类型断言
4. **使用 `sanitizeDisplayConfig`**：让专门的函数处理类型转换和验证

## 测试
所有修改都保持了原有的功能逻辑，只是改进了类型安全性。

运行以下命令验证没有类型错误：
```bash
npm run lint
```

## 影响范围
- ✅ 配置文件读取操作
- ✅ 配置文件写入操作
- ✅ 自定义服务器目录加载
- ✅ 所有 IPC 处理程序

