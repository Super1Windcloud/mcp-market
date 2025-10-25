import React from 'react';

const DevelopmentRouteComponent: React.FC = () => {
  const mcpServers = [
    { name: "GitHub MCP", description: "GitHub repository management" },
    { name: "GitLab MCP", description: "GitLab project integration" },
    { name: "Docker Hub MCP", description: "Docker container management" },
    { name: "AWS MCP", description: "Amazon Web Services integration" },
    { name: "Kubernetes MCP", description: "K8s cluster management" },
    { name: "Database MCP", description: "Universal database access" },
    { name: "Browser Automation MCP", description: "Web automation tools" },
    { name: "Code Execution MCP", description: "Python/JS code sandboxes" },
    { name: "Buildkite MCP", description: "CI/CD pipeline management" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">开发工具</h1>
      <p className="mb-6">这里是开发工具页面，包含各种MCP服务器</p>
      
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

export default DevelopmentRouteComponent;