import React from 'react';

const ProductivityRouteComponent: React.FC = () => {
  const mcpServers = [
    { name: "Notion MCP", description: "Notion workspace management" },
    { name: "Obsidian MCP", description: "Obsidian vault integration" },
    { name: "Calendar MCP", description: "Google/Apple Calendar sync" },
    { name: "Task Management MCP", description: "Todo apps integration" },
    { name: "File System MCP", description: "Local file access tools" },
    { name: "Email MCP", description: "Email client automation" },
    { name: "Document Processing MCP", description: "PDF/doc processing tools" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">效率工具</h1>
      <p className="mb-6">这里是效率工具页面，包含各种MCP服务器</p>
      
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

export default ProductivityRouteComponent;