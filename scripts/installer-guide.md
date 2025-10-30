## MCP Market Windows Installers

美观的 Windows 安装包可通过 NSIS 与 Inno Setup 双线并行构建。以下流程默认已经在仓库根目录执行。

### 先决条件
- 已运行 `npm run make`，确保 `out/mcp-market-win32-x64` 目录包含最新版构建。
- Windows 平台安装了 [NSIS 3.08+](https://nsis.sourceforge.io/Download) 与 [Inno Setup 6+(Unicode)](https://jrsoftware.org/isdl.php)。

生成过程中脚本会自动使用 `public/icon.ico` 与 `public/installer/*.bmp` 作为品牌素材，并将结果输出到 `out/installers/`。

### 生成 NSIS 安装包
```powershell
makensis scripts\mcp-market-installer.nsi
```
输出文件：`out/installers/mcp-market-1.0.0-nsis-setup.exe`。

### 生成 Inno Setup 安装包
```powershell
iscc scripts\mcp-market-installer.iss
```
输出文件：`out/installers/mcp-market-1.0.0-inno-setup.exe`。

### 自定义与美化
- 所有欢迎页、页眉、浮水印位图位于 `public/installer/`，可替换为任意 BMP 保持品牌统一。
- 若希望修改亮点文本或任务默认勾选状态，可分别调整 `scripts/mcp-market-installer.nsi` 与 `scripts/mcp-market-installer.iss` 内对应段落。

双版本安装器可覆盖不同安装偏好：NSIS 提供自定义亮点页与 Modern UI，Inno Setup 则使用 Modern 向导主题与额外任务，可满足多场景分发需求。

### 图形静默安装包装器（Rust + web-view）
`wrapper/` 目录提供一个基于 Rust [`web-view`](https://github.com/Boscop/web-view) 的轻量 GUI 安装器包装层，可加载 `wrapper/installer.html` 并在后台静默调用现有的 NSIS 安装包。

1. 安装 Rust toolchain（推荐 `rustup`）。
2. 编译并运行包装器：
   ```powershell
   cd wrapper
   cargo run --release
   ```
3. 前端界面允许用户自定义安装目录或通过“浏览”按钮唤起资源管理器对话框，并可选择是否创建桌面快捷方式；随后后台执行  
   `installer/mcp-market-1.0.0-nsis-setup.exe /S /D=<目标目录>` 完成静默安装（若取消快捷方式，包装器会在安装成功后清理桌面快捷方式）。

如需调整 UI，可编辑 `wrapper/installer.html`；对应的后端事件处理在 `wrapper/src/main.rs` 中实现。
另外，`cargo build --release` 会生成带有 `public/icon.ico` 图标的可执行文件（通过 `wrapper/build.rs` 注入），保证与安装器的品牌一致。
