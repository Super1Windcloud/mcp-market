# MCP 配置文件优先级修改说明

## 修改目标
修改 main 进程中的文件读写操作，使其优先更新打包后的目录 `.vite/build/public` 中的配置文件，而不是系统根目录的 `public` 目录。

## 修改文件
- `src/helpers/ipc/mcp/mcp-listeners.ts`

## 修改详情

### 1. `getPublicConfigCandidates()` 函数
**修改前**：按顺序查找 `public/mcp_config.json`
**修改后**：优先查找 `.vite/build/public/mcp_config.json`，然后才查找 `public/mcp_config.json`

优先级顺序：
1. `appPath/../../.vite/build/public/mcp_config.json`
2. `process.cwd()/.vite/build/public/mcp_config.json`
3. `process.resourcesPath/../.vite/build/public/mcp_config.json`
4. `appPath/public/mcp_config.json`
5. `appPath/../public/mcp_config.json`
6. `process.cwd()/public/mcp_config.json`
7. `process.resourcesPath/public/mcp_config.json`

### 2. `getProjectRootCandidates()` 函数
**修改前**：按顺序查找项目根目录
**修改后**：优先考虑打包后的目录位置

优先级顺序：
1. `appPath/../..` (打包后的项目根)
2. `process.resourcesPath/..`
3. `process.cwd()`
4. `appPath`
5. `path.dirname(appPath)`
6. `appPath/..`
7. `process.resourcesPath`

### 3. `resolveCustomConfigPath()` 函数
**修改前**：先查找用户数据目录，再查找项目根目录的 `public` 文件夹
**修改后**：优先查找 `.vite/build/public/my_mcp_config.json`

优先级顺序：
1. 用户数据目录中的覆盖文件
2. `.vite/build/public/my_mcp_config.json`
3. 项目根目录的 `public/my_mcp_config.json`

### 4. `ensureWritableConfigPath()` 函数
**修改前**：写入到找到的第一个可写位置
**修改后**：优先写入到 `.vite/build/public/mcp_config.json`

写入优先级：
1. 如果 `.vite/build/public/mcp_config.json` 存在，写入到该位置
2. 如果不存在，从其他位置读取并复制到 `.vite/build/public`
3. 最后备选方案：创建新文件在 `.vite/build/public`

### 5. `ensureWritableCustomConfigPath()` 函数
**修改前**：写入到找到的第一个可写位置
**修改后**：优先写入到 `.vite/build/public/my_mcp_config.json`

写入优先级：
1. 如果 `.vite/build/public/my_mcp_config.json` 存在，写入到该位置
2. 如果不存在，从其他位置读取并复制到 `.vite/build/public`
3. 最后备选方案：创建新文件在 `.vite/build/public`

## 测试
已添加测试文件：`src/tests/unit/mcp-config-priority.test.ts`

运行测试：
```bash
npm test
```

## 影响范围
- 所有通过 IPC 进行的配置文件读写操作都会优先使用 `.vite/build/public` 目录
- 这包括：
  - `LIST_CUSTOM_SERVERS` - 读取自定义服务器列表
  - `SAVE_CUSTOM_SERVERS` - 保存自定义服务器配置
  - `GET_SERVER_CONFIG` - 读取服务器配置
  - `UPSERT_SERVER_CONFIG` - 更新服务器配置

## 向后兼容性
- 如果 `.vite/build/public` 中不存在配置文件，系统会自动回退到 `public` 目录
- 现有的用户数据目录覆盖机制仍然保留
- 不会破坏现有的配置文件

