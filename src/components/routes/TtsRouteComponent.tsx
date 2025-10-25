import React from 'react';

const TtsRouteComponent: React.FC = () => {
  // MCP servers in the text-to-speech category
  const mcpServers = [
    { name: "daisys-ai/daisys-mcp", description: "Generate high-quality text-to-speech and text-to-voice outputs using the DAISYS platform and make it able to play and store audio generated." },
    { name: "mbailey/voice-mcp", description: "Complete voice interaction server supporting speech-to-text, text-to-speech, and real-time voice conversations through local microphone, OpenAI-compatible APIs, and LiveKit integration" },
    { name: "mberg/kokoro-tts-mcp", description: "MCP Server that uses the open weight Kokoro TTS models to convert text-to-speech. Can convert text to MP3 on a local driver or auto-upload to an S3 bucket." },
    { name: "transcribe-app/mcp-transcribe", description: "This service provides fast and reliable transcriptions for audio/video files and voice memos. It allows LLMs to interact with the text content of audio/video file." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">文本转语音</h1>
      <p className="mb-6">文本转语音类MCP服务器</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mcpServers.map((server, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold">{server.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{server.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TtsRouteComponent;