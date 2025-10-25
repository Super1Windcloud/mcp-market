import React from 'react';

const EducationRouteComponent: React.FC = () => {
  const mcpServers = [
    { name: "Academic Databases MCP", description: "Research database access" },
    { name: "Learning Platforms MCP", description: "Course management" },
    { name: "Scientific Computing MCP", description: "Scientific tools" },
    { name: "Educational Resources MCP", description: "Learning content" },
    { name: "Lab Automation MCP", description: "Laboratory tools" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">科学教育</h1>
      <p className="mb-6">这里是科学教育页面，包含各种MCP服务器</p>
      
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

export default EducationRouteComponent;