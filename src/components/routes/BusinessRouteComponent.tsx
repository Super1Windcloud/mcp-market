import React, { useState, useEffect, useRef } from "react";
import { useMcpsStateStore } from "@/store";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { GlassEffectCard } from "@/components/GlassEffectCard";
import { openExternalUrl } from "@/helpers/window_helpers";
import { RocketIcon, PencilIcon } from "lucide-react";
import { resolveServerConfig } from "@/routes/chat-mcp";
import { MCPServerConfig } from "@/types/mcp";
import { toast } from "sonner";
import { useAsync } from "react-use";

export function RouteComponent() {
  const allMcps = useMcpsStateStore(s => s.allMcps);
  const { location } = useRouterState();
  const path = location.pathname;
  const navigate = useNavigate();

  const [showConfig, setShowConfig] = useState(false);
  const [mcpConfig, setMcpConfig] = useState({} as MCPServerConfig);
  const [editText, setEditText] = useState("");
  const once = useRef(false);
  const [selectedItem, setSelectedItem] = useState<{ name: string; config: MCPServerConfig; url: string }>({
    name: "", config: {
      name: "",
      command: "",
      args: [],
    },
    url: "",
  });

  useEffect(() => {
    if (!editText || once.current) return;
    try {
      const text = JSON.parse(editText) as MCPServerConfig;
      if (Object.keys(text).length > 0) {
        if (text.command === "not found") {
          toast.error("请手动配置MCP", {
            id: "config-mcp",
          });
        }
      } else {
        toast.error("current mcp cofig empty");
      }
      once.current = true;
    } catch (err) {
      if (err) return;
    }

  }, [editText]);

  useAsync(async () => {
    if (!selectedItem.name || Object.keys(mcpConfig).length === 0) {
      return;
    }

    if (mcpConfig.command === "not found") {
      toast.error("请手动配置该MCP");
      return;
    }

    await window.mcp.overrideServerConfig(selectedItem.name, mcpConfig);
    toast.success("MCP 配置更新成功!");
  }, [mcpConfig, selectedItem.name]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowConfig(false);
        once.current = false;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 🔹 打开配置弹窗并加载配置
  const openAndEditDefaultMcpConfig = async (name: string, url: string) => {
    const result = await resolveServerConfig(name, url);
    setEditText(JSON.stringify(result, null, 2));
    setShowConfig(true);
    setSelectedItem({ name, url, config: result });
  };


  const handleSave = async () => {
    try {
      const parsed = JSON.parse(editText) as MCPServerConfig;
      setSelectedItem((prev) => ({ ...prev, config: parsed }));
      setMcpConfig(parsed);
      setShowConfig(false);
    } catch (_err: unknown) {
      toast.error("json format error " + _err, {
        position: "top-center",
        duration: 3000,
        richColors: true,
      });
    }
  };

  // 🔹 跳转到 Chat 页面
  const skipToChatMcp = async (name: string, desc: string, url: string) => {
    const result = await resolveServerConfig(name, url);

    if (Object.keys(result).length === 0) {
      return;
    }

    if (mcpConfig.command === "not found" || result.command === "not found") {
      toast.error("请手动配置该MCP");
      return;
    }

    await navigate({
      to: "/chat-mcp",
      search: { name, desc, url },
    });
  };

  return (
    <div className="relative">
      {/* ✅ MCP Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mb-20">
        {allMcps.map(mcp => {
          if (path.includes(mcp.route)) {
            return mcp.mcps.map((item, index) => (
              <GlassEffectCard key={mcp.label + index} className="flex flex-col justify-between relative">
                {/* 🔸右上角编辑按钮 */}
                <div className="absolute top-1 right-1" title={"配置当前MCP"}>
                  <button
                    onClick={() => openAndEditDefaultMcpConfig(item.name, item.url)}
                    className="bg-gray-800/40 hover:bg-gray-700/60 text-white rounded-full shadow-md transition p-1.5"
                    title="配置当前MCP"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className={"mx-3"}>
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
                  onClick={async () => await skipToChatMcp(item.name, item.desc, item.url)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 mt-4"
                >
                  <RocketIcon className="w-5 h-5" />
                  <span className="font-semibold">Start</span>
                </button>
              </GlassEffectCard>
            ));
          }
          return null;
        })}
      </div>

      {/* ✅ 编辑 MCP 配置弹窗 */}
      {showConfig && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="dark:bg-gray-900 rounded-xl shadow-xl p-6 w-[600px] h-2/3  relative flex flex-col">
            <button
              onClick={() => setShowConfig(false)}
              className="absolute top-2 right-2 text-gray-300  hover:text-red-300"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Edit MCP Config</h2>

            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              className="flex-1 text-sm bg-transparent dark:bg-gray-800 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-pre-wrap break-words"
              spellCheck={false}
              autoFocus={true}

              style={{ resize: "none", scrollbarWidth: "none" }}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  once.current = false;
                  setShowConfig(false);
                }}
                className="px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white transition"
              >
                取消
              </button>
              <button
                onClick={() => handleSave()}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
