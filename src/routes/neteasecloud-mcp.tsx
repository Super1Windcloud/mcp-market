import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import React from "react";
import type { ChatMessage, MCPServerConfig, SendMessageResponse } from "@/types/mcp";
import { openExternalUrl } from "@/helpers/window_helpers";


const SERVER_CONFIGS: Record<string, MCPServerConfig> = {
  "NeteaseCloud MCP": {
    name: "NeteaseCloud MCP",
    command: "npx",
    args: ["tsx", "neteasecloud-mcp/src/server.ts"],
  },
};

const resolveServerConfig = (displayName: string): MCPServerConfig => {
  const override = SERVER_CONFIGS[displayName];
  if (override) {
    return { ...override };
  } else {
    throw new Error("empty mcp config");
  }
};

export const Route = createFileRoute("/neteasecloud-mcp")({
  component: MCPChat,
  validateSearch: (search: Record<string, unknown>): {
    name: string;
    desc: string;
    url: string;
  } => {
    return {
      name: String(search.name || ""),
      desc: String(search.desc || ""),
      url: String(search.url || ""),
    };
  },
});

function MCPChat() {
  const { name, desc, url } = Route.useSearch();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const createMessage = (role: ChatMessage["role"], content: string): ChatMessage => ({
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : "${Date.now()}",
    role,
    content,
    timestamp: new Date(),
  });

  const hydrateMessage = (message: ChatMessage): ChatMessage => ({
    ...message,
    timestamp: new Date(message.timestamp),
  });

  const hydrateMessages = (messageList: ChatMessage[]): ChatMessage[] =>
    messageList.map(hydrateMessage);

  useEffect(() => {
    const initializeMCP = async () => {
      if (!name) return;
      try {
        const config = resolveServerConfig(name);
        const result = await window.mcp.startServer(config);
        if (!result.success) {
          throw new Error(result.error || "启动 MCP 服务器失败");
        }

        const history = await window.mcp.getChatHistory(name) as ChatMessage[];
        setMessages(hydrateMessages(history ?? []));
      } catch (error) {
        const errorMessage = createMessage(
          "system",
          `连接到MCP服务器时出错: ${error instanceof Error ? error.message : `未知错误`}`,
        );
        setMessages([errorMessage]);
      }
    };

    void initializeMCP();
    return () => {
    };
  }, [name, desc]);

  // 滚动到最新消息
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading || !name) return;

    setInputValue("");
    setIsLoading(true);

    try {
      const result = await window.mcp.sendMessage(name, trimmed) as SendMessageResponse;

      if (!result.success) {
        setMessages((prev) => [
          ...prev,
          createMessage("system", `处理消息时出错: ${result.error ?? "未知错误"}`),
        ]);
        return;
      }

      setMessages((prev) => {
        const next = [...prev];

        if (result.userMessage) {
          next.push(hydrateMessage(result.userMessage));
        } else {
          next.push(createMessage("user", trimmed));
        }

        if (Array.isArray(result.toolMessages) && result.toolMessages.length > 0) {
          next.push(...result.toolMessages.map(hydrateMessage));
        }

        if (result.assistantMessage) {
          next.push(hydrateMessage(result.assistantMessage));
        }

        return next;
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        createMessage(
          "system",
          `处理消息时出错: ${error instanceof Error ? error.message : `未知错误`}`,
        ),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSendMessage();
    }
  };

  const handleResetConversation = async () => {
    if (!name) return;
    try {
      await window.mcp.clearChatHistory(name);
      setMessages([]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        createMessage(
          "system",
          `重置对话时出错: ${error instanceof Error ? error.message : `未知错误`}`,
        ),
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full  bg-background">
      {/* 顶部导航栏 */}
      <div className="border-none">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold hover:underline cursor-pointer" onClick={async () => {
              await openExternalUrl(url);
            }}>{name}</h1>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleResetConversation}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/", replace: true })}
            >
              返回
            </Button>
          </div>
        </div>
      </div>

      <div className="h-2/3  overflow-hidden p-4">
        <ScrollArea className="h-full w-full rounded-md" style={{
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", // shadow-sm
          backdropFilter: "blur(12px)", // backdrop-blur-md
          border: "1px solid rgba(255, 255, 255, 0.1)", // border border-white/10
        }}>
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === `user` ? `justify-end` : `justify-start`}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-transparent text-primary-foreground"
                      : message.role === "system"
                        ? "bg-transparent text-destructive-foreground"
                        : "bg-transparent"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  <div
                    className={`text-xs mt-1 ${message.role === `user` ? `text-primary-foreground/70` : `text-muted-foreground`}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`max-w-[80%] rounded-lg p-4 `}>
                  <div className="text-sm">正在处理您的请求...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* 输入区域 */}
      <div className="border-none  p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              style={{
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", // shadow-sm
                backdropFilter: "blur(12px)", // backdrop-blur-md
                border: "1px solid rgba(255, 255, 255, 0.1)", // border border-white/10
              }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              disabled={isLoading}
              className="resize-none"
            />
          </div>
          <Button
            variant="ghost"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          与 {name} 服务进行对话。此服务可通过MCP协议访问外部工具。
        </p>
      </div>
    </div>
  );
}
