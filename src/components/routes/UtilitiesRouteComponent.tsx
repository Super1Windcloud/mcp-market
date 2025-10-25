import React from 'react';

const UtilitiesRouteComponent: React.FC = () => {
  const mcpServers = [
    { name: "Calculator MCP", description: "Mathematical calculations" },
    { name: "QR Code MCP", description: "QR code generation" },
    { name: "System Monitor MCP", description: "Hardware monitoring" },
    { name: "Image Processing MCP", description: "Image manipulation tools" },
    { name: "Audio Tools MCP", description: "Audio processing utilities" },
    { name: "Video Tools MCP", description: "Video processing utilities" },
    { name: "File Converter MCP", description: "Document format conversion" },
    { name: "Archive Tools MCP", description: "Zip/rar/7z handling" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">实用工具</h1>
      <p className="mb-6">这里是实用工具页面，包含各种MCP服务器</p>
      
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

export default UtilitiesRouteComponent;