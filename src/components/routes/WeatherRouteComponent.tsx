import React from 'react';

const WeatherRouteComponent: React.FC = () => {
  const mcpServers = [
    { name: "Weather Forecast MCP", description: "Weather predictions" },
    { name: "Climate Data MCP", description: "Historical climate info" },
    { name: "Weather Alerts MCP", description: "Weather notifications" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">气象天气</h1>
      <p className="mb-6">这里是气象天气页面，包含各种MCP服务器</p>
      
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

export default WeatherRouteComponent;