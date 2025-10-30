import { contextBridge, ipcRenderer } from "electron";

console.warn("✅ preload loaded");

contextBridge.exposeInMainWorld("electronAPI", {
  startTranscription: () => ipcRenderer.send("start-transcription"),
  stopTranscription: () => ipcRenderer.send("stop-transcription"),
  onTranscript: (callback) => ipcRenderer.on("transcript", (_, text) => callback(text)),
  onStatus: (callback) => ipcRenderer.on("status-update", (_, status) => callback(status)),
});
