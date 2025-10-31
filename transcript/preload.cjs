// preload.cjs
// eslint-disable-next-line @typescript-eslint/no-require-imports,no-undef
const { contextBridge, ipcRenderer } = require("electron");

console.log("✅ preload loaded");

contextBridge.exposeInMainWorld("electronAPI", {
  startTranscription: (options) => ipcRenderer.send("start-transcription", options ?? {}),
  stopTranscription: () => ipcRenderer.send("stop-transcription"),
  onTranscript: (callback) => ipcRenderer.on("transcript", (_, text) => callback(text)),
  onFinalTranscript: (callback) => ipcRenderer.on("transcript-final", (_, text) => callback(text)),
  onStatus: (callback) => ipcRenderer.on("status-update", (_, status) => callback(status)),
  enableLoopbackAudio: () => ipcRenderer.invoke("enable-loopback-audio"),
  disableLoopbackAudio: () => ipcRenderer.invoke("disable-loopback-audio"),
  sendAudioChunk: (chunk) => ipcRenderer.send("audio-chunk", chunk),
});
