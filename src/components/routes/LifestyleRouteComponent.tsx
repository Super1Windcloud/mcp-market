import React from 'react';

const LifestyleRouteComponent: React.FC = () => {
  const mcpServers = [
    { name: "Health Tracking MCP", description: "Wellness data access" },
    { name: "Fitness MCP", description: "Exercise tracking" },
    { name: "Recipe MCP", description: "Cooking assistance" },
    { name: "Travel Planning MCP", description: "Trip organization" },
    { name: "Shopping MCP", description: "E-commerce assistance" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">生活方式</h1>
      <p className="mb-6">这里是生活方式页面，包含各种MCP服务器</p>
      
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

export default LifestyleRouteComponent;