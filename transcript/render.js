const statusEl = document.getElementById("status");
const partialEl = document.getElementById("partialTranscript");
const finalEl = document.getElementById("finalTranscript");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

let audioStream = null;
let audioContext = null;
let sourceNode = null;
let processorNode = null;
let silentNode = null;
let streamingEnabled = false;
let currentSampleRate = 44100;

const mixDownToMono = (channels) => {
  if (!channels || channels.length === 0) {
    return new Float32Array(0);
  }

  if (channels.length === 1) {
    return channels[0];
  }

  const length = channels[0]?.length ?? 0;
  const mono = new Float32Array(length);

  for (let i = 0; i < length; i += 1) {
    let sum = 0;
    for (let channelIndex = 0; channelIndex < channels.length; channelIndex += 1) {
      sum += channels[channelIndex]?.[i] ?? 0;
    }
    mono[i] = sum / channels.length;
  }

  return mono;
};

const floatTo16BitPCM = (float32Array) => {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);

  for (let i = 0; i < float32Array.length; i += 1) {
    let sample = float32Array[i];
    sample = Math.max(-1, Math.min(1, sample));
    view.setInt16(i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }

  return new Int16Array(buffer);
};

const stopCapture = async () => {
  streamingEnabled = false;

  if (processorNode) {
    processorNode.disconnect();
    processorNode.onaudioprocess = null;
    processorNode = null;
  }

  if (sourceNode) {
    sourceNode.disconnect();
    sourceNode = null;
  }

  if (silentNode) {
    silentNode.disconnect();
    silentNode = null;
  }

  if (audioContext) {
    try {
      await audioContext.close();
    } catch (error) {
      console.warn("关闭 AudioContext 失败", error);
    }
    audioContext = null;
  }

  if (audioStream) {
    audioStream.getTracks().forEach((track) => track.stop());
    audioStream = null;
  }
};

const startCapture = async () => {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    throw new Error("当前环境不支持 Web Audio API，请升级浏览器内核");
  }

  await window.electronAPI.enableLoopbackAudio();
  let displayStream;

  try {
    displayStream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });
  } catch (error) {
    await window.electronAPI.disableLoopbackAudio();
    throw error;
  }

  await window.electronAPI.disableLoopbackAudio();

  try {
    const videoTracks = displayStream.getVideoTracks();
    videoTracks.forEach((track) => {
      track.stop();
      displayStream.removeTrack(track);
    });

    const audioTracks = displayStream.getAudioTracks();
    if (audioTracks.length === 0) {
      displayStream.getTracks().forEach((track) => track.stop());
      throw new Error("未检测到系统音频轨道");
    }

    audioStream = new MediaStream(audioTracks);

    audioContext = new AudioContextCtor({ sampleRate: 48000 });
    await audioContext.resume();
    currentSampleRate = audioContext.sampleRate;

    sourceNode = audioContext.createMediaStreamSource(audioStream);
    const inputChannels = sourceNode.channelCount || audioTracks[0]?.getSettings()?.channelCount || 2;
    const bufferSize = 4096;
    processorNode = audioContext.createScriptProcessor(bufferSize, inputChannels, 1);
    silentNode = audioContext.createGain();
    silentNode.gain.value = 0;

    processorNode.onaudioprocess = (event) => {
      if (!streamingEnabled) {
        return;
      }

      const channels = [];
      for (let i = 0; i < event.inputBuffer.numberOfChannels; i += 1) {
        channels.push(event.inputBuffer.getChannelData(i));
      }

      const mono = mixDownToMono(channels);
      if (mono.length === 0) {
        return;
      }

      const pcm16 = floatTo16BitPCM(mono);
      if (pcm16.length > 0) {
        window.electronAPI.sendAudioChunk(pcm16);
      }
    };

    sourceNode.connect(processorNode);
    processorNode.connect(silentNode);
    silentNode.connect(audioContext.destination);

    return { sampleRate: currentSampleRate };
  } catch (error) {
    await stopCapture();
    throw error;
  }
};

startBtn.onclick = async () => {
  if (!window.electronAPI) {
    alert("缺少预加载桥接：window.electronAPI 不存在");
    return;
  }

  startBtn.disabled = true;
  stopBtn.disabled = false;
  statusEl.textContent = "连接中...";
  statusEl.className = "status connecting";
  partialEl.textContent = "建立连接中...";
  finalEl.textContent = "—";

  try {
    const captureConfig = await startCapture();
    window.electronAPI.startTranscription({
      sampleRate: captureConfig.sampleRate,
      channels: 1,
      encoding: "linear16",
    });
    streamingEnabled = true;
  } catch (error) {
    console.error("启动监听失败", error);
    statusEl.textContent = "启动失败";
    statusEl.className = "status disconnected";
    partialEl.textContent = error.message || "请检查录音权限后重试";
    startBtn.disabled = false;
    stopBtn.disabled = true;
    await stopCapture();
  }
};

stopBtn.onclick = async () => {
  if (!window.electronAPI) {
    alert("缺少预加载桥接：window.electronAPI 不存在");
    return;
  }

  window.electronAPI.stopTranscription();
  streamingEnabled = false;
  await stopCapture();
  statusEl.textContent = "已停止";
  statusEl.className = "status disconnected";
  startBtn.disabled = false;
  stopBtn.disabled = true;
};

window.electronAPI.onTranscript((text) => {
  partialEl.textContent = text?.trim().length ? text : "…";
});

window.electronAPI.onFinalTranscript((text) => {
  finalEl.textContent = text?.trim().length ? text : "—";
});

window.electronAPI.onStatus((status) => {
  switch (status) {
    case "connected":
      statusEl.textContent = "已连接 ✅";
      statusEl.className = "status connected";
      streamingEnabled = true;
      if (!partialEl.textContent || partialEl.textContent === "等待语音输入...") {
        partialEl.textContent = "请开始播放或讲话…";
      }
      break;
    case "error":
      statusEl.textContent = "连接错误 ❌";
      statusEl.className = "status disconnected";
      streamingEnabled = false;
      void stopCapture();
      stopBtn.disabled = true;
      startBtn.disabled = false;
      break;
    case "stopped":
    case "closed":
      statusEl.textContent = "已停止";
      statusEl.className = "status disconnected";
      streamingEnabled = false;
      void stopCapture();
      startBtn.disabled = false;
      stopBtn.disabled = true;
      break;
  }
});
