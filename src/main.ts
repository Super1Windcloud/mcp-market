import { app, BrowserWindow, autoUpdater } from "electron";
import { globalShortcut } from "electron/main";
import registerListeners from "./helpers/ipc/listeners-register";
import path from "path";
import fs from "fs";

import { updateElectronApp } from "update-electron-app";
import { writeSomeLogs } from "@/utils";

const initAutoUpdater = () => {
  if (!app.isPackaged) {
    return;
  }

  const toStrings = (args: unknown[]) =>
    args.map((arg) => {
      if (arg instanceof Error) {
        return `${arg.name}: ${arg.message}\n${arg.stack ?? ""}`;
      }
      if (typeof arg === "string") {
        return arg;
      }
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    });

  const log = (level: "info" | "warn" | "error", args: unknown[]) => {
    writeSomeLogs(`[auto-update] ${level}`, ...toStrings(args));
  };

  updateElectronApp({
    logger: {
      log: (...args: unknown[]) => log("info", args),
      info: (...args: unknown[]) => log("info", args),
      warn: (...args: unknown[]) => log("warn", args),
      error: (...args: unknown[]) => log("error", args),
    },
  });

  autoUpdater.on("error", (error) => {
    writeSomeLogs(
      "[auto-update] error event",
      error?.message ?? String(error),
      error instanceof Error ? error.stack ?? "" : "",
    );
  });
};
const inDevelopment = process.env.NODE_ENV === "development";

const resolveAssetPath = (...segments: string[]) => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, ...segments);
  }
  return path.join(app.getAppPath(), ...segments);
};

const resolvePreloadPath = () => {
  const candidates = ["preload.cjs", "preload.js"];
  for (const candidate of candidates) {
    const fullPath = path.join(__dirname, candidate);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  return path.join(__dirname, "preload.js");
};

let flag = false;

function createWindow() {
  const preload = resolvePreloadPath();
  const iconPath = resolveAssetPath("public", "icon.jpg");

  if (inDevelopment) {
    console.log(iconPath);
  } else {
    writeSomeLogs(iconPath);
  }
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "MCP MARKET",
    show: false,
    darkTheme: true,
    icon: iconPath,
    webPreferences: {
      devTools: inDevelopment,
      contextIsolation: true,
      nodeIntegration: false,
      webgl: true,
      webSecurity: true,
      nodeIntegrationInSubFrames: false,
      preload: preload,
    },
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "hidden",
    trafficLightPosition:
      process.platform === "darwin" ? { x: 5, y: 5 } : undefined,
  });
  registerListeners(mainWindow);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  if (inDevelopment) {
    globalShortcut.register("F10", () => {
      if (!mainWindow.webContents.isDevToolsOpened() || !flag) {
        mainWindow.webContents.openDevTools();
        flag = true;
      } else {
        mainWindow.webContents.closeDevTools();
      }
    });
  }
  mainWindow.once("ready-to-show", async () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  if (app.isPackaged) {
    process.env.MCP_RESOURCE_BASE = process.resourcesPath;
  } else {
    process.env.MCP_RESOURCE_BASE = app.getAppPath();
  }
  initAutoUpdater();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
