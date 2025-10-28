import React, { useEffect, useState } from "react";
import { GlassEffectCard } from "@/components/GlassEffectCard";
import { McpSourceType } from "@/components/template/NavigationMenu";
import { openExternalUrl } from "@/helpers/window_helpers";
import { PlusCircle, RocketIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { AddCustomMcpButton } from "@/components/AddCustomMcpButton.tsx";

const IndexRouteComponent: React.FC = () => {
  const navigate = useNavigate();
  const [mcps, setMcps] = useState<McpSourceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadMyMcps = async () => {
      try {
        const servers = await window.mcp.listCustomServers();
        if (cancelled) return;
        const items: McpSourceType[] = (servers ?? [])
          .filter((server) => server?.name)
          .map((server) => ({
            name: server.name,
            desc: server.desc ?? "",
            url: server.url ?? "",
          }));
        setMcps(items);
      } catch (error) {
        if (cancelled) return;
        console.error("加载 my_mcp_config.json 失败:", error);
        setErrorMessage(error instanceof Error ? error.message : String(error));
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadMyMcps();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        正在加载 MCP 配置...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        读取 MCP 配置失败：{errorMessage}
      </div>
    );
  }

  if (mcps.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        尚未配置 MCP，可在 public/my_mcp_config.json 中添加条目。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  p-4 mb-20 ">
      {
        mcps.map((item) => {
          return (
            <GlassEffectCard key={item.url} className="flex flex-col justify-between">
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
                  await navigate({
                    to: "/chat-mcp", search: {
                      name: item.name,
                      desc: item.desc,
                      url: item.url,
                    },
                  });
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
        })

      }
      <AddCustomMcpButton />
    </div>
  );
};

export function AddCustomMcp() {
  const openMcpConfigDialog =()=>{

  }
  return (
    <div  onClick={openMcpConfigDialog} className="relative group cursor-pointer rounded-2xl overflow-hidden">
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          className="absolute inset-[-2px] rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 animate-border-shine blur-md"></div>
      </div>

      <GlassEffectCard
        className="relative flex flex-col items-center justify-center h-64 text-muted-foreground
                   border border-white/10 group-hover:border-transparent transition-all duration-300"
      >
        <PlusCircle
          size={100}
          className="text-blue-400 group-hover:text-blue-500 transition-all duration-300"
        />
        <span className="mt-4 text-sm text-gray-400 group-hover:text-blue-300 transition-all">
          添加自定义 MCP
        </span>
      </GlassEffectCard>
    </div>
  );
}


export default IndexRouteComponent;
