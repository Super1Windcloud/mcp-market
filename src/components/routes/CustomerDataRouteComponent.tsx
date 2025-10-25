import React from 'react';

const CustomerDataRouteComponent: React.FC = () => {
  // MCP servers in the customer data platforms category
  const mcpServers = [
    { name: "antv/mcp-server-chart", description: "A Model Context Protocol server for generating visual charts using AntV." },
    { name: "hustcc/mcp-echarts", description: "Generate visual charts using Apache ECharts with AI MCP dynamically." },
    { name: "hustcc/mcp-mermaid", description: "Generate mermaid diagram and chart with AI MCP dynamically." },
    { name: "iaptic/mcp-server-iaptic", description: "Connect with iaptic to ask about your Customer Purchases, Transaction data and App Revenue statistics." },
    { name: "OpenDataMCP/OpenDataMCP", description: "Connect any Open Data to any LLM with Model Context Protocol." },
    { name: "sergehuber/inoyu-mcp-unomi-server", description: "An MCP server to access and updates profiles on an Apache Unomi CDP server." },
    { name: "tinybirdco/mcp-tinybird", description: "An MCP server to interact with a Tinybird Workspace from any MCP client." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">客户数据平台</h1>
      <p className="mb-6">客户数据平台类MCP服务器，用于访问客户档案</p>
      
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

export default CustomerDataRouteComponent;