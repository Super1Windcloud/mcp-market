import React from 'react';

const TranslationRouteComponent: React.FC = () => {
  // MCP servers in the translation services category
  const mcpServers = [
    { name: "mmntm/weblate-mcp", description: "Comprehensive Model Context Protocol server for Weblate translation management, enabling AI assistants to perform translation tasks, project management, and content discovery with smart format transformations." },
    { name: "translated/lara-mcp", description: "MCP Server for Lara Translate API, enabling powerful translation capabilities with support for language detection and context-aware translations." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">翻译服务</h1>
      <p className="mb-6">翻译服务类MCP服务器，用于翻译内容</p>
      
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

export default TranslationRouteComponent;