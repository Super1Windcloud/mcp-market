import { app, BrowserWindow } from "electron";
import { globalShortcut } from "electron/main";
import registerListeners from "./helpers/ipc/listeners-register";
import path from "path";
import fs from "fs";

import { writeSomeLogs } from "@/utils";

import { VelopackApp, UpdateManager } from "velopack";

VelopackApp.build().run();

const initAutoUpdater = () => {
  if (!app.isPackaged) {
    writeSomeLogs("[velopack] skip updater in dev mode");
    return;
  }

  const feedUrl =
    process.env.VELOPACK_FEED_URL ??
    `https://github.com/Super1WindCloud/mcp-market/releases/download/latest`;

  if (!feedUrl) {
    writeSomeLogs("[velopack] feed url missing");
    return;
  }

  const updater = new UpdateManager();
  
  updater.setUrlOrPath(feedUrl);
 

  const runUpdateCheck = async () => {
    try {
      if (!updater.isInstalled()) {
        writeSomeLogs("[velopack] application not installed, skip update");
        return;
      }

      writeSomeLogs("[velopack] checking for updates", feedUrl);
      const updateInfo = await updater.checkForUpdatesAsync();
      if (!updateInfo) {
        writeSomeLogs("[velopack] no updates available");
        return;
      }

      const targetRelease = updateInfo.targetFullRelease;
      if (!targetRelease) {
        writeSomeLogs("[velopack] update info missing target release");
        return;
      }

      writeSomeLogs(
        "[velopack] update available",
        `version=${targetRelease.version}`,
        `file=${targetRelease.fileName}`,
      );

      let lastLoggedProgress = -1;
      await updater.downloadUpdatesAsync(targetRelease, (progress) => {
        if (progress > lastLoggedProgress) {
          lastLoggedProgress = progress;
          writeSomeLogs(`[velopack] download ${progress}%`);
        }
      });

      writeSomeLogs(
        "[velopack] applying update",
        `version=${targetRelease.version}`,
      );
      updater.waitExitThenApplyUpdates(targetRelease, true, true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : JSON.stringify(error);
      const stack = error instanceof Error && error.stack ? error.stack : "";
      writeSomeLogs("[velopack] update failed", message, stack);
    }
  };

  void runUpdateCheck();
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
