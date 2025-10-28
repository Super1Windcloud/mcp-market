import React from "react";
import { useMcpsStateStore } from "@/store";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { GlassEffectCard } from "@/components/GlassEffectCard";
import { openExternalUrl } from "@/helpers/window_helpers";
import { RocketIcon } from "lucide-react"; // 图标库：lucide-react

export function RouteComponent() {
  const allMcps = useMcpsStateStore(s => s.allMcps);
  const { location } = useRouterState();
  const path = location.pathname;
  const navigate = useNavigate();


  const skipToChatMcp = async (name: string, desc: string, url: string) => {
    await navigate({
      to: "/chat-mcp",
      search:
        {
          name, desc, url,
        },
    });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mb-20">
      {
        allMcps.map((mcp) => {
          if (path.includes(mcp.route)) {
            return mcp.mcps.map((item, index) => {
              return (
                <GlassEffectCard key={mcp.label + index} className="flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={async () => await openExternalUrl(item.url)}
                      className="cursor-pointer hover:underline font-semibold text-center break-words whitespace-normal"
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-400 break-words whitespace-normal">
                      {item.desc}
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      await skipToChatMcp(item.name, item.desc, item.url);
                    }}
                    className="
      flex items-center justify-center gap-2
      bg-gradient-to-r from-blue-500 to-pink-500
      text-white px-4 py-2 rounded-full shadow-lg
      hover:shadow-xl hover:scale-105
      transition-all duration-200 mt-4
    "
                  >
                    <RocketIcon className="w-5 h-5" />
                    <span className="font-semibold">Start</span>
                  </button>
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
