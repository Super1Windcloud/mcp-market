import { app, BrowserWindow } from "electron";
import { globalShortcut } from "electron/main";
import registerListeners from "./helpers/ipc/listeners-register";
import path from "path";

import { writeSomeLogs } from "@/utils";

const inDevelopment = process.env.NODE_ENV === "development";

const iconPath = path.join(__dirname, "/public/icon.jpg");

if (inDevelopment) {
  console.log(iconPath);
} else {
  writeSomeLogs(iconPath);
}

let flag = false;

function createWindow() {
  const preload = path.join(__dirname, "preload.js");
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
      nodeIntegration: true,
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


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("ready", createWindow);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

