import React from 'react';

const MarketingRouteComponent: React.FC = () => {
  // MCP servers in the marketing category
  const mcpServers = [
    { name: "gomarble-ai/facebook-ads-mcp-server", description: "MCP server acting as an interface to the Facebook Ads, enabling programmatic access to Facebook Ads data and management features." },
    { name: "gomarble-ai/google-ads-mcp-server", description: "MCP server acting as an interface to the Google Ads, enabling programmatic access to Google Ads data and management features." },
    { name: "marketplaceadpros/amazon-ads-mcp-server", description: "Enables tools to interact with Amazon Advertising, analyzing campaign metrics and configurations." },
    { name: "open-strategy-partners/osp_marketing_tools", description: "A suite of marketing tools from Open Strategy Partners including writing style, editing codes, and product marketing value map creation." },
    { name: "pipeboard-co/meta-ads-mcp", description: "Meta Ads automation that just works. Trusted by 10,000+ businesses to analyze performance, test creatives, optimize spend, and scale results — simply and reliably." },
    { name: "stape-io/stape-mcp-server", description: "This project implements an MCP (Model Context Protocol) server for the Stape platform. It allows interaction with the Stape API using AI assistants like Claude or AI-powered IDEs like Cursor." },
    { name: "stape-io/google-tag-manager-mcp-server", description: "This server supports remote MCP connections, includes built-in Google OAuth, and provide an interface to the Google Tag Manager API." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">市场营销</h1>
      <p className="mb-6">市场营销类MCP服务器，用于营销内容创建和编辑</p>
      
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

export default MarketingRouteComponent;