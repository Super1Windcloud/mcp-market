import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import dotenv from "dotenv";
import path from "path";
import { app, BrowserWindow, ipcMain } from "electron";
import { initMain } from "electron-audio-loopback";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

dotenv.config({ path: "../.env" });
initMain();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const preload = path.join(__dirname, "preload.cjs");
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
let finalTranscript = "";
let transcriptionConfig = {
  sampleRate: 48000,
  encoding: "linear16",
  channels: 1,
};

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
      nodeIntegration: false,
      contextIsolation: true,
      webgl: true,
      webSecurity: true,
      disableBlinkFeatures: "Autofill",
    },
  });

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.loadFile("index.html");
});


ipcMain.on("start-transcription", async (_, options = {}) => {
  if (connection) return;

  transcriptionConfig = {
    sampleRate: Number(options?.sampleRate) > 0 ? Number(options.sampleRate) : 48000,
    encoding: typeof options?.encoding === "string" ? options.encoding : "linear16",
    channels: Number(options?.channels) > 0 ? Number(options.channels) : 1,
  };

  // eslint-disable-next-line no-undef
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    console.error("Missing DEEPGRAM_API_KEY in environment.");
    mainWindow?.webContents.send("status-update", "error");
    return;
  }

  try {
    deepgram = createClient(apiKey);
    connection = deepgram.listen.live({
      model: "nova-3",
      encoding: transcriptionConfig.encoding,
      sample_rate: transcriptionConfig.sampleRate,
      channels: transcriptionConfig.channels,
      interim_results: true,
      smart_format: true,
    });
  } catch (error) {
    console.error("Failed to create Deepgram live transcription connection.", error);
    mainWindow?.webContents.send("status-update", "error");
    return;
  }

  finalTranscript = "";

  connection.on(LiveTranscriptionEvents.Open, () => {
    console.log("Connection opened.");
    mainWindow?.webContents.send("status-update", "connected");
  });

  connection.on(LiveTranscriptionEvents.Transcript, (data) => {
    const alternative = data?.channel?.alternatives?.[0];
    const text = alternative?.transcript?.trim() ?? "";

    if (!text.length) return;

    console.log("transcript", text, data.is_final ? "(final)" : "(partial)");
    mainWindow?.webContents.send("transcript", text);

    if (data.is_final || data.speech_final || data.from_finalize) {
      finalTranscript = `${finalTranscript} ${text}`.trim();
      mainWindow?.webContents.send("transcript-final", finalTranscript);
    }
  });

  connection.on(LiveTranscriptionEvents.Error, (error) => {
    console.error("error", error);
    mainWindow?.webContents.send("status-update", "error");
    connection = null;
  });

  connection.on(LiveTranscriptionEvents.Close, () => {
    console.log("Connection closed.");
    connection = null;
    if (finalTranscript) {
      mainWindow?.webContents.send("transcript-final", finalTranscript);
    }
    mainWindow?.webContents.send("status-update", "closed");
  });
});


ipcMain.on("audio-chunk", (_, buffer) => {
  if (!connection || !buffer) return;

  try {
    let chunk;
    if (buffer instanceof ArrayBuffer) {
      chunk = Buffer.from(buffer);
    } else if (ArrayBuffer.isView(buffer)) {
      chunk = Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    } else {
      chunk = Buffer.from(buffer);
    }

    if (chunk.length > 0) {
      connection.send(chunk);
    }
  } catch (error) {
    console.error("Failed to forward audio chunk to Deepgram.", error);
  }
});

ipcMain.on("stop-transcription", async () => {
  if (connection) {
    connection.finalize();
    connection.disconnect();
    connection = null;
    if (finalTranscript) {
      mainWindow?.webContents.send("transcript-final", finalTranscript);
    }
    mainWindow?.webContents.send("status-update", "stopped");
  } else {
    mainWindow?.webContents.send("status-update", "stopped");
  }
});
