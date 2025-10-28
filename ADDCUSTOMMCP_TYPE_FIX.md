# AddCustomMcpButton TypeScript 类型错误修复

## 问题描述
在 `AddCustomMcpButton` 组件中，`handleSave` 函数中的 `payload` 变量类型不匹配，导致 TypeScript 编译错误：

```
TS2345: Argument of type 'Record<string, unknown>' is not assignable to parameter of type 'MCPServerDisplayConfig[] | Record<string, MCPServerDisplayConfig> | MCPConfigCatalog'.
```

## 根本原因
`payload` 被声明为 `Record<string, unknown>` 类型，但 `window.mcp.saveCustomServers()` 期望的参数类型是：
- `MCPServerDisplayConfig[]` (数组)
- `Record<string, MCPServerDisplayConfig>` (对象)
- `MCPConfigCatalog` (带 mcpServers 属性的对象)

这三种类型都不能被 `Record<string, unknown>` 类型安全地赋值。

## 解决方案

### 1. 导入 `MCPConfigCatalog` 类型
```typescript
import { MCPServerDisplayConfig, MCPConfigCatalog } from "@/types/mcp.ts";
```

### 2. 修改 `payload` 的类型声明
**修改前**：
```typescript
let payload: Record<string, unknown>;
```

**修改后**：
```typescript
let payload: MCPServerDisplayConfig[] | Record<string, MCPServerDisplayConfig> | MCPConfigCatalog;
```

### 3. 更新所有 `payload` 赋值语句

**修改前**：
```typescript
if (Array.isArray(parsed)) {
  payload = { mcpServers: parsed };
} else if (parsed && typeof parsed === "object" && "mcpServers" in parsed) {
  payload = parsed;
} else if (parsed && typeof parsed === "object" && "name" in parsed && "command" in parsed) {
  const config = parsed as MCPServerDisplayConfig;
  const key = config.name || "custom-mcp";
  payload = {
    mcpServers: {
      [key]: config,
    },
  };
} else if (parsed && typeof parsed === "object") {
  payload = { mcpServers: parsed };
}
```

**修改后**：
```typescript
if (Array.isArray(parsed)) {
  // 如果是数组，直接传递（不包装）
  payload = parsed as MCPServerDisplayConfig[];
} else if (parsed && typeof parsed === "object" && "mcpServers" in parsed) {
  // 如果已经有 mcpServers，直接使用
  payload = parsed as MCPConfigCatalog;
} else if (parsed && typeof parsed === "object" && "name" in parsed && "command" in parsed) {
  // 如果是单个配置对象，用名称作为键包装
  const config = parsed as MCPServerDisplayConfig;
  const key = config.name || "custom-mcp";
  payload = {
    mcpServers: {
      [key]: config,
    },
  };
} else if (parsed && typeof parsed === "object") {
  // 如果是配置对象的记录，直接传递（不包装）
  payload = parsed as Record<string, MCPServerDisplayConfig>;
}
```

**关键改变**：
- 数组：直接传递，不包装在 `{ mcpServers: ... }` 中
- 对象记录：直接传递，不包装在 `{ mcpServers: ... }` 中
- 单个配置：包装在 `{ mcpServers: { [key]: config } }` 中
- 已有 mcpServers 的对象：直接使用

## 为什么这样做？

后端的 `normalizeCustomServerCatalogInput` 函数可以处理三种格式：

1. **数组格式**：`MCPServerDisplayConfig[]`
   - 后端会将其转换为 `Record<string, MCPServerDisplayConfig>`
   - 使用每个配置的 `name` 作为键

2. **对象记录格式**：`Record<string, MCPServerDisplayConfig>`
   - 后端直接使用

3. **Catalog 格式**：`MCPConfigCatalog` (即 `{ mcpServers: {...} }`)
   - 后端会提取 `mcpServers` 属性

因此，我们不应该将数组或对象记录包装在 `{ mcpServers: ... }` 中，除非用户输入的是单个配置对象。

## 修改的文件

**`src/components/AddCustomMcpButton.tsx`**
- 第 5 行：导入 `MCPConfigCatalog`
- 第 33 行：将 `parsed` 显式声明为 `unknown` 类型
- 第 36 行：修改 `payload` 的类型声明
- 第 40, 43, 55 行：添加类型断言（不包装数组和对象记录）

## 类型安全性

修改后的代码：
1. ✅ 明确声明 `parsed` 为 `unknown` 类型
2. ✅ `payload` 类型与 `saveCustomServers` 参数类型完全匹配
3. ✅ 所有分支都有正确的类型断言
4. ✅ 通过 TypeScript 类型检查

## 测试

运行以下命令验证没有类型错误：
```bash
npm run lint
```

应该看到 `AddCustomMcpButton.tsx` 中的类型错误已解决。

