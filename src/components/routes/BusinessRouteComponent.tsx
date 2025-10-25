import React from "react";
import { useMcpsStateStore } from "@/store";
import { useRouterState } from "@tanstack/react-router";
import { GlassEffectCard } from "@/components/GlassEffectCard";

const BusinessRouteComponent: React.FC = () => {
  const mcpServers = [
    { name: "CRM MCP", description: "Customer relationship management" },
    { name: "ERP MCP", description: "Enterprise resource planning" },
    { name: "Project Management MCP", description: "Team project tools" },
    { name: "Analytics MCP", description: "Data analytics integration" },
    { name: "Accounting MCP", description: "Financial management" },
    { name: "E-commerce MCP", description: "Online store tools" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">商业服务</h1>
      <p className="mb-6">这里是商业服务页面，包含各种MCP服务器</p>

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


export function RouteComponent() {
  const allMcps = useMcpsStateStore(s => s.allMcps);
  const { location } = useRouterState();
  const path = location.pathname;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mb-20">
      {
        allMcps.map((mcp) => {
          if (path.includes(mcp.route)) {
            return mcp.mcps.map((item, index) => {
              return (
                <GlassEffectCard key={mcp.label + index}>
                  <h3 className="font-semibold text-center break-words whitespace-normal">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-400 break-words whitespace-normal">
                    {item.desc}
                  </p>

                </GlassEffectCard>
              );
            });
          }
          return null;
        })
      }

    </div>
  );
}


export default BusinessRouteComponent;