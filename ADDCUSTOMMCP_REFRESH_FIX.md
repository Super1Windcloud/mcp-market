# AddCustomMcpButton 保存后刷新列表修复

## 问题描述
在 `AddCustomMcpButton` 中，`handleSave` 函数执行后只是关闭编辑器，但没有刷新父组件 `IndexRouteComponent` 中的 MCP 列表。这导致新添加的 MCP 不会立即显示在列表中。

## 根本原因
- `AddCustomMcpButton` 是一个独立的子组件
- 保存配置后，只有本地状态被更新（关闭编辑器）
- 父组件的 `mcps` 状态没有被更新
- 需要一种方式通知父组件重新加载数据

## 解决方案

### 1. 修改 `IndexRouteComponent.tsx`

提取 `loadMyMcps` 函数到组件作用域，使其可以被传递给子组件：

```typescript
const loadMyMcps = async () => {
  try {
    const servers = await window.mcp.listCustomServers();
    const items: McpSourceType[] = (servers ?? [])
      .filter((server) => server?.name)
      .map((server) => ({
        name: server.name,
        desc: server.desc ?? "",
        url: server.url ?? "",
      }));
    setMcps(items);
    setErrorMessage(null);
  } catch (error) {
    console.error("加载 my_mcp_config.json 失败:", error);
    setErrorMessage(error instanceof Error ? error.message : String(error));
  } finally {
    setIsLoading(false);
  }
};
```

将 `loadMyMcps` 作为 props 传递给 `AddCustomMcpButton`：
```typescript
<AddCustomMcpButton onSave={loadMyMcps} />
```

### 2. 修改 `AddCustomMcpButton.tsx`

添加 props 接口：
```typescript
interface AddCustomMcpButtonProps {
  onSave?: () => Promise<void>;
}

export function AddCustomMcpButton({ onSave }: AddCustomMcpButtonProps) {
  // ...
}
```

在 `handleSave` 中调用 `onSave` 回调：
```typescript
const handleSave = async () => {
  try {
    // ... 保存逻辑 ...
    await window.mcp.saveCustomServers(payload);
    toast.success("✅ MCP 配置已保存！");
    setShowEditor(false);

    // 保存后刷新列表
    if (onSave) {
      await onSave();
    }
  } catch (err) {
    toast.error("❌ 保存失败: " + (err instanceof Error ? err.message : String(err)));
  }
};
```

## 修改的文件

1. **`src/components/routes/IndexRouteComponent.tsx`**
   - 提取 `loadMyMcps` 函数
   - 将 `loadMyMcps` 作为 `onSave` prop 传递

2. **`src/components/AddCustomMcpButton.tsx`**
   - 添加 `AddCustomMcpButtonProps` 接口
   - 接收 `onSave` prop
   - 在 `handleSave` 中调用 `onSave()`

## 工作流程

1. 用户点击"添加自定义 MCP"按钮
2. 编辑器打开，用户输入配置
3. 用户点击"保存配置"按钮
4. `handleSave` 执行：
   - 验证 JSON 格式
   - 调用 `window.mcp.saveCustomServers()` 保存到文件
   - 显示成功提示
   - 关闭编辑器
   - **调用 `onSave()` 回调刷新列表** ✨
5. 父组件重新加载 MCP 列表
6. 新添加的 MCP 立即显示在列表中

## 优势

- ✅ 用户体验改进：保存后立即看到新 MCP
- ✅ 数据同步：UI 状态与文件系统保持一致
- ✅ 代码解耦：使用 props 回调而不是直接修改父组件
- ✅ 可扩展：如果有其他组件需要刷新，可以传递不同的回调

