import React from 'react';

const MediaRouteComponent: React.FC = () => {
  const mcpServers = [
    { name: "Image Generation MCP", description: "AI image creation tools" },
    { name: "Video Generation MCP", description: "AI video creation" },
    { name: "Audio Generation MCP", description: "AI audio creation" },
    { name: "Text-to-Speech MCP", description: "Voice synthesis tools" },
    { name: "Speech-to-Text MCP", description: "Voice recognition" },
    { name: "Content Creation MCP", description: "AI content tools" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">媒体生成</h1>
      <p className="mb-6">这里是媒体生成页面，包含各种MCP服务器</p>
      
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

export default MediaRouteComponent;