import React from 'react';

const EntertainmentRouteComponent: React.FC = () => {
  const mcpServers = [
    { name: "Gaming MCP", description: "Game platform integration" },
    { name: "Media Streaming MCP", description: "Streaming service tools" },
    { name: "Music MCP", description: "Music service integration" },
    { name: "Sports Data MCP", description: "Sports statistics" },
    { name: "Entertainment Discovery MCP", description: "Content discovery" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">游戏娱乐</h1>
      <p className="mb-6">这里是游戏娱乐页面，包含各种MCP服务器</p>
      
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

export default EntertainmentRouteComponent;