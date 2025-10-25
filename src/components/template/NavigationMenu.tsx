import React, { useEffect, useMemo, useState } from "react";

import { cn } from "@/utils/tailwind";
import { useNavigate } from "@tanstack/react-router";
import { FreeMcpSources } from "../../../scripts/constant";
import { isDev } from "@/utils";
import { useMcpsStateStore } from "@/store";

export interface McpCategory {
  icon?: React.ReactNode;
  label: string;
  route: string;
  count: number;
}

export interface McpSourceType {
  name: string;
  desc: string;
  url: string;
}

export default function Sidebar() {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const handleItemClick = async (index: number, route: string, label: string) => {
    setSelectedIndex(index);
    if (isDev() && !route) {
      console.log(label, route);
    }
    await navigate({ to: route, replace: true });
  };

  const categories = useMemo(() => {
    const mcpSources = FreeMcpSources;
    const results = [{
      label: "🦀 我的MCP",
      route: "/",
    }] as McpCategory[];

    for (const resultKey in mcpSources) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = mcpSources[resultKey] as Array<object>;
      results.push({
        label: resultKey,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        route: (mcpSources[resultKey][0] as { [key: string]: string }).route,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        count: result.length,
      });
    }
    return results;
  }, []);
  // console.log(categories);

  const allMcpsList = useMemo(() => {
    const mcpSources = FreeMcpSources;
    const myMcp = {
      label: "🦀 我的MCP",
      mcps: [{
        name: "NeteaseCloud MCP",
        url: "https://github.com/Super1WindClou",
        "desc": "网易云音乐MCP智能控制器，提供全局快捷键、搜索单曲播放、搜索歌单播放、自定义歌单管理、每日推荐和私人漫游等丰富功能",

      }, {
        name :""
      }] as McpSourceType[],
      route: "/",
    };
    const results = [myMcp];
    for (const key in mcpSources) {
      results.push({
        label: key,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mcps: mcpSources[key],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        route: (mcpSources[key][0] as { [key: string]: string }).route,

      });
    }


    return results;
  }, []);

  const setAllMcps = useMcpsStateStore((s) => s.setAllMcps);

  useEffect(() => {
    setAllMcps(allMcpsList);
  }, [allMcpsList, setAllMcps]);

  return (
    <aside style={{
      scrollbarWidth: "none",
    }} className="w-50  text-gray-200 h-screen overflow-y-auto pb-10">
      <ul className="space-y-1">
        {categories.map(({ label, route }, index) => (
          <li
            key={label}
            onClick={() => handleItemClick(index, route, label)}
            className={cn(
              "flex items-center justify-between px-4 py-2 text-sm rounded-lg cursor-pointer transition-colors",
              index === selectedIndex
                ? "bg-[#1e1e1e] text-white"
                : "hover:bg-[#1e1e1e]",
            )}
          >
            <div className="flex items-center justify-between gap-5">
              <span>{label}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
