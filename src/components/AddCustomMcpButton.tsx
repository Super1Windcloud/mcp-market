import React, { useState, useEffect } from "react";
import { PlusCircle, X, Save, Wand2 } from "lucide-react";
import { GlassEffectCard } from "@/components/GlassEffectCard";
import { Button } from "@/components/ui/button";
import { MCPServerDisplayConfig, MCPConfigCatalog } from "@/types/mcp.ts";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { ShineBorder } from "@/components/ui/shine-border.tsx";
import SpotlightCard from "./SpotlightCard";

interface AddCustomMcpButtonProps {
  onSave?: () => Promise<void>;
}

const initDefaultText = `{
  "name": "custom-mcp",
  "url": "https://www.google.com",
  "desc":"custom-mcp",
  "command": "python server.py",
  "args": ["--port", "8080"],
  "env": { "DEBUG": "true" }
}`;

export function AddCustomMcpButton({ onSave }: AddCustomMcpButtonProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [jsonText, setJsonText] = useState(initDefaultText);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowEditor(false);
        setJsonText(initDefaultText);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);


  const handleSave = async () => {
    try {
      const parsed = JSON.parse(jsonText) as unknown;

      let payload: MCPServerDisplayConfig[] | Record<string, MCPServerDisplayConfig> | MCPConfigCatalog;

      if (Array.isArray(parsed)) {
        // If it's an array, pass it directly
        payload = parsed as MCPServerDisplayConfig[];
      } else if (parsed && typeof parsed === "object" && "mcpServers" in parsed) {
        // If it already has mcpServers, use as-is
        payload = parsed as MCPConfigCatalog;
      } else if (parsed && typeof parsed === "object" && "name" in parsed && "command" in parsed) {
        // If it's a single config object, wrap it with the name as key
        const config = parsed as MCPServerDisplayConfig;
        const key = config.name || "custom-mcp";
        payload = {
          mcpServers: {
            [key]: config,
          },
        };
      } else if (parsed && typeof parsed === "object") {
        toast.error("不符合MCP 配置格式");
        return;
      } else {
        throw new Error("配置格式无效：必须是对象或数组");
      }

      const result = await window.mcp.saveCustomServers(payload);
      if (!result?.success) {
        toast.error(`❌ 保存失败: ${result?.error ?? "未知错误"}`);
        return;
      }

      toast.success("✅ MCP 配置已保存！");
      setShowEditor(false);

      if (onSave) {
        await onSave();
      }
      handleClick();
    } catch (err) {
      toast.error("❌ 保存失败: " + (err instanceof Error ? err.message : String(err)));
    }
  };
  const handleClick = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,

      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(jsonText), null, 2);
      setJsonText(formatted);
    } catch {
      toast.error("⚠️ 当前内容不是合法 JSON");
    }
  };

  return (
    <>
      <div
        onClick={() => setShowEditor(true)}
        className="relative group cursor-pointer rounded-2xl overflow-hidden"
      >
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="absolute inset-[-2px] rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 animate-border-shine blur-md"></div>
        </div>

        <GlassEffectCard
          className="relative flex flex-col items-center justify-center h-full  text-muted-foreground
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

      <ShineBorder duration={3600} borderWidth={2} shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />

      {showEditor && (
        <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-md z-50">

          <div
            className="dark:bg-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl p-6 w-[700px]   h-full  max-h-2/3 relative flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">🧩 编辑 MCP 配置 (JSON)</h2>
              <button
                onClick={() => setShowEditor(false)}
                className="text-gray-400 hover:text-red-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              style={{
                scrollbarWidth: "none",
              }}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="flex-1 font-mono text-sm p-4  border border-gray-700 rounded-md text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         whitespace-pre resize-none overflow-y-auto"
              spellCheck={false}
            />

            <div className="flex justify-between mt-4">
              <Button
                variant="ghost"
                onClick={handleFormat}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                <Wand2 className="w-4 h-4" /> 格式化 JSON
              </Button>

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setShowEditor(false)}>
                  取消
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4" /> 保存配置
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
