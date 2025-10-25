import React from 'react';

const EmbeddedRouteComponent: React.FC = () => {
  // MCP servers in the embedded systems category
  const mcpServers = [
    { name: "horw/esp-mcp", description: "Workflow for fixing build issues in ESP32 series chips using ESP-IDF." },
    { name: "kukapay/modbus-mcp", description: "An MCP server that standardizes and contextualizes industrial Modbus data." },
    { name: "kukapay/opcua-mcp", description: "An MCP server that connects to OPC UA-enabled industrial systems." },
    { name: "stack-chan/stack-chan", description: "A JavaScript-driven M5Stack-embedded super-kawaii robot with MCP server functionality for AI-controlled interactions and emotions." },
    { name: "yoelbassin/gnuradioMCP", description: "An MCP server for GNU Radio that enables LLMs to autonomously create and modify RF .grc flowcharts." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">嵌入式系统</h1>
      <p className="mb-6">嵌入式系统类MCP服务器</p>
      
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

export default EmbeddedRouteComponent;