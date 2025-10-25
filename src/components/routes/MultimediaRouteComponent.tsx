import React from 'react';

const MultimediaRouteComponent: React.FC = () => {
  // MCP servers in the multimedia process category
  const mcpServers = [
    { name: "ananddtyagi/gif-creator-mcp", description: "A MCP server for creating GIFs from your videos." },
    { name: "bogdan01m/zapcap-mcp-server", description: "MCP server for ZapCap API providing video caption and B-roll generation via natural language" },
    { name: "stass/exif-mcp", description: "A MCP server that allows one to examine image metadata like EXIF, XMP, JFIF and GPS. This provides foundation for LLM-powered search and analysis of photo librares and image collections." },
    { name: "Tommertom/sonos-ts-mcp", description: "Comprehensive Sonos audio system control through pure TypeScript implementation. Features complete device discovery, multi-room playback management, queue control, music library browsing, alarm management, real-time event subscriptions, and audio EQ settings. Includes 50+ tools for seamless smart home audio automation via UPnP/SOAP protocols." },
    { name: "sunriseapps/imagesorcery-mcp", description: "ComputerVision-based sorcery of image recognition and editing tools for AI assistants." },
    { name: "video-creator/ffmpeg-mcp", description: "Using ffmpeg command line to achieve an mcp server, can be very convenient, through the dialogue to achieve the local video search, tailoring, stitching, playback and other functions" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">多媒体流程</h1>
      <p className="mb-6">多媒体流程类MCP服务器，用于处理音频和视频</p>
      
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

export default MultimediaRouteComponent;