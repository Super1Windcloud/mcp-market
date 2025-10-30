use anyhow::{Context, Result};
use base64::engine::general_purpose::STANDARD as Base64Engine;
use base64::Engine;
use dirs::desktop_dir;
use serde::Deserialize;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::thread;
use tinyfiledialogs::select_folder_dialog;
use web_view::{Content, Handle, WebView};

#[derive(Clone)]
struct AppConfig {
    installer_path: PathBuf,
    default_dir: String,
}

#[derive(Deserialize)]
#[serde(tag = "action", rename_all = "snake_case")]
enum InvokeCommand {
    Install {
        target_dir: String,
        create_shortcut: bool,
    },
    Browse,
}

fn main() -> Result<()> {
    let config = prepare_config()?;
    let default_dir_json = serde_json::to_string(&config.default_dir)?;
    let icon_base64 = Base64Engine.encode(include_bytes!("../../public/icon.jpg"));
    let html = include_str!("../installer.html")
        .replace("__DEFAULT_DIR__", &default_dir_json)
        .replace(
            "__ICON_BASE64__",
            &format!("data:image/jpeg;base64,{}", icon_base64),
        );

    web_view::builder()
        .title("MCP Market Installer")
        .content(Content::Html(html))
        .size(960, 620)
        .resizable(false)
        .debug(false)
        .user_data(config.clone())
        .invoke_handler(|webview, arg| handle_invoke(webview, arg))
        .run()
        .context("failed to run webview")?;

    Ok(())
}

fn prepare_config() -> Result<AppConfig> {
    let repo_root = Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .context("wrapper folder has no parent")?
        .canonicalize()
        .context("unable to resolve repository root")?;

    let installer_path = repo_root
        .join("installer")
        .join("mcp-market-1.0.0-nsis-setup.exe");

    if !installer_path.exists() {
        return Err(anyhow::anyhow!(
            "Installer executable not found at {}",
            installer_path.display()
        ));
    }

    let default_dir = default_install_dir();

    Ok(AppConfig {
        installer_path,
        default_dir,
    })
}

fn default_install_dir() -> String {
    let fallback = r"C:\Program Files\MCP Market".to_string();
    std::env::var("ProgramFiles")
        .map(|program_files| Path::new(&program_files).join("MCP Market"))
        .map(|path| path.to_string_lossy().into_owned())
        .unwrap_or(fallback)
}

fn handle_invoke(webview: &mut WebView<AppConfig>, arg: &str) -> web_view::WVResult {
    println!("[webview] invoke payload: {arg}");
    let command: InvokeCommand = match serde_json::from_str(arg) {
        Ok(cmd) => cmd,
        Err(err) => {
            let script = format!(
                "window.__onInvokeError && window.__onInvokeError({});",
                serde_json::to_string(&format!("Invalid command: {err}")).unwrap()
            );
            webview.eval(&script)?;
            return Ok(());
        }
    };

    match command {
        InvokeCommand::Browse => {
            let default_dir = webview.user_data().default_dir.clone();
            println!("[webview] browse requested (default: {default_dir})");
            let picked = select_folder_dialog("选择安装目录", default_dir.as_str());

            let script = match picked {
                Some(path) => {
                    println!("[webview] browse result: {path}");
                    format!(
                        "window.__onDirectoryPicked && window.__onDirectoryPicked({});",
                        serde_json::to_string(&path).unwrap()
                    )
                }
                None => {
                    println!("[webview] browse cancelled");
                    "window.__onDirectoryPicked && window.__onDirectoryPicked(null);".into()
                }
            };

            webview.eval(&script)?;
        }
        InvokeCommand::Install {
            target_dir,
            create_shortcut,
        } => {
            let target = resolve_target_dir(&target_dir);
            println!(
                "[webview] install requested -> target: {}, shortcut: {}",
                target.display(),
                create_shortcut
            );
            let installer = webview.user_data().installer_path.clone();
            let handle = webview.handle();

            thread::spawn(move || {
                run_install(installer, target, create_shortcut, handle);
            });
        }
    }

    Ok(())
}

fn resolve_target_dir(input: &str) -> PathBuf {
    let trimmed = input.trim();
    if trimmed.is_empty() {
        return PathBuf::from(default_install_dir());
    }

    let candidate = PathBuf::from(trimmed);
    if candidate.is_absolute() {
        candidate
    } else {
        std::env::current_dir()
            .map(|cwd| cwd.join(candidate))
            .unwrap_or_else(|_| PathBuf::from(trimmed))
    }
}

fn run_install(
    installer: PathBuf,
    target_dir: PathBuf,
    create_shortcut: bool,
    handle: Handle<AppConfig>,
) {
    println!(
        "[webview] spawning installer: {} /S /D={} (shortcut: {})",
        installer.display(),
        target_dir.display(),
        create_shortcut
    );
    let target_string = target_dir.to_string_lossy().into_owned();
    let status_script = |success: bool, message: &str| {
        format!(
            "window.__onInstallStatus && window.__onInstallStatus({}, {});",
            success,
            serde_json::to_string(message).unwrap_or_else(|_| "\"\"".to_string())
        )
    };

    let _ = handle.dispatch(|webview| webview.eval("setProgress(45, \"正在静默安装...\");"));

    let command_result = Command::new(&installer)
        .args(["/S", &format!("/D={}", &target_string)])
        .status();

    let script = match command_result {
        Ok(status) if status.success() => {
            let _ =
                handle.dispatch(|webview| webview.eval("setProgress(90, \"正在完成安装...\");"));
            if !create_shortcut {
                if let Some(desktop) = desktop_dir() {
                    let shortcut = desktop.join("MCP Market.lnk");
                    let _ = fs::remove_file(shortcut);
                }
            }
            println!("[webview] installer completed successfully");
            status_script(true, "安装完成")
        }
        Ok(status) => status_script(
            false,
            &format!("安装程序以非零代码退出: {}", status.code().unwrap_or(-1)),
        ),
        Err(err) => {
            println!("[webview] failed to start installer: {err}");
            status_script(false, &format!("无法启动安装程序: {err}"))
        }
    };

    println!("[webview] dispatching status script: {script}");
    let _ = handle.dispatch(move |webview| webview.eval(&script));
}
