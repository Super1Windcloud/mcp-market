import React from 'react';

const SupportRouteComponent: React.FC = () => {
  // MCP servers in the support and service management category
  const mcpServers = [
    { name: "aikts/yandex-tracker-mcp", description: "MCP Server for Yandex Tracker. Provides tools for searching and retrieving information about issues, queues, users." },
    { name: "effytech/freshdesk-mcp", description: "MCP server that integrates with Freshdesk, enabling AI models to interact with Freshdesk modules and perform various support operations." },
    { name: "incentivai/quickchat-ai-mcp", description: "Launch your conversational Quickchat AI agent as an MCP to give AI apps real-time access to its Knowledge Base and conversational capabilities." },
    { name: "nguyenvanduocit/jira-mcp", description: "A Go-based MCP connector for Jira that enables AI assistants like Claude to interact with Atlassian Jira. This tool provides a seamless interface for AI models to perform common Jira operations including issue management, sprint planning, and workflow transitions." },
    { name: "sooperset/mcp-atlassian", description: "MCP server for Atlassian products (Confluence and Jira). Supports Confluence Cloud, Jira Cloud, and Jira Server/Data Center. Provides comprehensive tools for searching, reading, creating, and managing content across Atlassian workspaces." },
    { name: "tom28881/mcp-jira-server", description: "Comprehensive TypeScript MCP server for Jira with 20+ tools covering complete project management workflow: issue CRUD, sprint management, comments/history, attachments, batch operations." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">支持和服务管理</h1>
      <p className="mb-6">支持和服务管理类MCP服务器</p>
      
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

export default SupportRouteComponent;