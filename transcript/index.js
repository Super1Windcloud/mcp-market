import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import dotenv from "dotenv";
import path from "path";
import { app, BrowserWindow, ipcMain } from "electron";
import { getLoopbackAudioMediaStream, initMain } from "electron-audio-loopback";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

dotenv.config({ path: "../.env" });
initMain();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const preload = path.join(__dirname, "preload.js");
if (!fs.existsSync(preload)) {
  console.error("Preload file not found.");
  // eslint-disable-next-line no-undef
  process.exit(1);
} else {
  console.log(preload);
}

let connection = null;
let deepgram = null;
let mainWindow = null;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Transcription",
    center: true,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: preload,
      devTools: true,
      nodeIntegration: true,
      contextIsolation: true,
      webgl: true,
      webSecurity: true,
    },
  });

  mainWindow.loadFile("index.html");
});

ipcMain.on("start-transcription", async () => {
  if (connection) return;

  // eslint-disable-next-line no-undef
  deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  connection = deepgram.listen.live({ model: "nova-3" });

  connection.on(LiveTranscriptionEvents.Open, () => {
    console.log("Connection opened.");
    mainWindow.webContents.send("status-update", "connected");
  });

  connection.on(LiveTranscriptionEvents.Transcript, (data) => {
    const text = data.channel.alternatives[0].transcript;
    if (text.trim().length > 0) {
      console.log("transcript", text);
      mainWindow.webContents.send("transcript", text);
    }
  });

  connection.on(LiveTranscriptionEvents.Error, (error) => {
    console.error("error", error);
    mainWindow.webContents.send("status-update", "error");
  });

  connection.on(LiveTranscriptionEvents.Close, () => {
    console.log("Connection closed.");
    connection = null;
    mainWindow.webContents.send("status-update", "closed");
  });
});


ipcMain.on("audio-chunk", (_, buffer) => {
  if (connection) connection.send(Buffer.from(buffer));
});

ipcMain.on("stop-transcription", async () => {
  if (connection) {
    connection.finalize();
    connection.disconnect();
    connection = null;
    mainWindow.webContents.send("status-update", "stopped");
  }
});
