import React from "react";
import { GlassEffectCard } from "@/components/GlassEffectCard";
import { McpSourceType } from "@/components/template/NavigationMenu";
import { openExternalUrl } from "@/helpers/window_helpers";
import { RocketIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const IndexRouteComponent: React.FC = () => {

  const mcps = [{
    name: "NeteaseCloud MCP",
    url: "https://github.com/Super1WindCloud",
    desc: "网易云音乐MCP智能控制器，提供全局快捷键、搜索单曲播放、搜索歌单播放、自定义歌单管理、每日推荐和私人漫游等丰富功能",
  }] as McpSourceType[];

  const navigate = useNavigate();
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
                    to: "/chat-mcp", replace: true, search: {
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


    </div>
  );
};

export default IndexRouteComponent;