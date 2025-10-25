import React from 'react';
import { GlassEffectCard } from "@/components/GlassEffectCard";
import { useMcpsStateStore } from "@/store";
import { useRouterState } from "@tanstack/react-router";

const IndexRouteComponent: React.FC = () => {

  const allMcps= useMcpsStateStore(s=>s.allMcps);
  const { location } = useRouterState();
  const path = location.pathname;
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {
          allMcps.map((mcp) => {
            if (path.includes(mcp.label)) {
              return (
                <GlassEffectCard key={mcp.label}>
                  <h3 className="font-semibold text-center">{mcp.label}</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-400">
                    聚合多个MCP服务器的工具
                  </p>
                </GlassEffectCard>
              );
            }
            return null;
          })
        }



      </div>
  );
};

export default IndexRouteComponent;