import React from "react";
import { useMcpsStateStore } from "@/store";
import { useRouterState } from "@tanstack/react-router";
import { GlassEffectCard } from "@/components/GlassEffectCard";


function ArtRouteComponent() {
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
                  <h3 className="font-semibold text-center">{item.name}</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-400">
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


export default ArtRouteComponent;