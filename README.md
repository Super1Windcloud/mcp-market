# MCP MARKET

精选的MCP集市,  Electron Forge 与 shadcn-ui (Vite + Typescript+Tailwindcss) 提供支持

## 功能特性

- ⚡ **Electron Forge** - 用于打包、签名和分发 Electron 应用的完整工具
- ⚛️ **React 19** - 最新版本的 React，支持 TypeScript
- 🎨 **shadcn/ui** - 基于 Radix UI 和 Tailwind CSS 构建的可复用组件
- 🔥 **Vite** - 快如闪电的构建工具和开发服务器
- 💅 **Tailwind CSS** - 实用优先的 CSS 框架，集成 shadcn 样式
- 🧪 **Vitest & Playwright** - 单元测试和端到端测试设置
- 🔌 **TypeScript** - 类型安全的开发体验
- 🚀 **现代工具链** - ESLint、Prettier 等代码质量工具

## 技术栈

- **框架**: React 19
- **运行时**: Electron
- **构建工具**: Vite
- **样式**: Tailwind CSS + shadcn/ui
- **语言**: TypeScript
- **测试**: Vitest (单元测试), Playwright (端到端测试)
- **包管理器**: npm

## 系统要求

- Node.js (v18 或更高版本)
- npm (v8 或更高版本)

## 快速开始

### 1. 克隆仓库

```bash
git clone <repository-url>
cd mcp-market
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm start
```

这将在开发模式下启动 Electron 应用，并支持热重载功能。

## 可用脚本

| 脚本                     | 描述                    |
|------------------------|-----------------------|
| `npm start`            | 在开发模式下启动 Electron 应用  |
| `npm run package`      | 打包应用以供分发              |
| `npm run make`         | 为所有平台创建可分发的安装程序       |
| `npm run publish`      | 发布应用 (需要配置)           |
| `npm run lint`         | 使用 ESLint 检查代码        |
| `npm run format`       | 使用 Prettier 检查代码格式    |
| `npm run format:write` | 使用 Prettier 应用代码格式化   |
| `npm test`             | 使用 Vitest 运行单元测试      |
| `npm run test:watch`   | 在监听模式下运行单元测试          |
| `npm run test:unit`    | `npm test` 的别名        |
| `npm run test:e2e`     | 使用 Playwright 运行端到端测试 |
| `npm run test:all`     | 运行单元测试和端到端测试          |

## 项目结构

```
├── src/                    # 源文件
│   ├── main.ts            # 主进程入口点
│   ├── preload.ts         # 预加载脚本
│   ├── renderer/          # 渲染进程代码
│   │   ├── App.tsx        # 主应用组件
│   │   └── index.tsx      # 渲染进程入口点
│   └── assets/            # 静态资源 (图片、图标等)
├── forge.config.ts        # Electron Forge 配置
├── vite.main.config.mts   # 主进程 Vite 配置
├── vite.preload.config.mts # 预加载脚本 Vite 配置
├── vite.renderer.config.mts # 渲染进程 Vite 配置
├── components.json        # shadcn/ui 配置
└── package.json           # 项目依赖和脚本
```

## 生产构建

要创建应用程序的可分发版本：

```bash
npm run make
```

这将为目标平台在 `out/` 目录中创建安装程序。

创建无安装程序的包：

```bash
npm run package
```

## 测试

### 单元测试

使用 Vitest 运行单元测试：

```bash
npm test
# 或
npm run test:unit
```

在监听模式下运行测试：

```bash
npm run test:watch
```

### 端到端测试

使用 Playwright 运行端到端测试：

```bash
npm run test:e2e
```

### 运行所有测试

运行单元测试和端到端测试：

```bash
npm run test:all
```

## 自定义

### 组件库 (shadcn/ui)

此项目使用 shadcn/ui 组件。您可以使用 CLI 添加更多组件：

```bash
npx shadcn-ui@latest add [组件名称]
```

### 样式 (Tailwind CSS)

Tailwind CSS 已配置了 shadcn/ui 特定设置。可以在 `src/styles/global.css` 中添加自定义样式。

### 图标

此项目使用 Lucide React 图标。您可以从 Lucide 库中导入任何图标：

```tsx
import { Search, User, Settings } from 'lucide-react';

// 在组件中使用
<Search />
<User />
<Settings />
```

## 平台支持

该项目配置为制作以下平台的分发包：

- Windows (Squirrel.Windows, ZIP)
- macOS (ZIP)
- Linux (DEB, RPM, ZIP)

详细信息请参见 `forge.config.ts`。

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 致谢

- [Electron](https://www.electronjs.org/) - 使用 JavaScript、HTML 和 CSS 构建跨平台桌面应用
- [shadcn/ui](https://ui.shadcn.com/) - 使用 Radix UI 和 Tailwind CSS 构建的可复用组件
- [Vite](https://vitejs.dev/) - 下一代前端工具
- [Tailwind CSS](https://tailwindcss.com/) - 快速构建现代网站
- [React](https://reactjs.org/) - 用于构建用户界面的 JavaScript 库