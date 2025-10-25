import React from 'react';

const DeliveryRouteComponent: React.FC = () => {
  // MCP servers in the delivery category
  const mcpServers = [
    { name: "DoorDash MCP", description: "DoorDash Delivery (Unofficial)" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">送货</h1>
      <p className="mb-6">送货类MCP服务器</p>
      
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

export default DeliveryRouteComponent;