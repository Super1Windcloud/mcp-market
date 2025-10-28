import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import React from "react";
import type { ChatMessage, MCPServerConfig, SendMessageResponse } from "@/types/mcp";
import { openExternalUrl } from "@/helpers/window_helpers";
import { isDev } from "@/utils";


export const resolveServerConfig = async (displayName: string, url: string): Promise<MCPServerConfig> => {
  try {
    const override = await window.mcp.getServerConfig(displayName);

    if (override) {
      const resolvedConfig = {
        ...override,
        name: displayName,
      } as MCPServerConfig;

      if (!resolvedConfig.command || !Array.isArray(resolvedConfig.args)) {
        console.warn(`MCP override for ${displayName} 缺少 command 或 args`);
      } else {
        if (isDev()) console.log("current mcp config", resolvedConfig);
        return resolvedConfig;
      }
    }

    const catalog = typeof window.mcp.listCustomServers === "function"
      ? await window.mcp.listCustomServers()
      : [];
    const fallback = (catalog ?? []).find((server) => server.name === displayName);
    if (fallback && fallback.command && Array.isArray(fallback.args)) {
      const normalized: MCPServerConfig = {
        name: displayName,
        command: fallback.command,
        args: [...fallback.args],
        env: fallback.env,
      };
      if (isDev()) console.log(`using fallback MCP config from catalog for ${displayName}`, normalized);
      return normalized;
    }

    console.warn(`MCP config for "${displayName}" not found`);
    return {
      name: displayName,
      command: "not found",
      args: ["not found"],
      env: { error: `请访问${url} 自行配置mcpServer` },

    };
  } catch (error) {
    console.error("resolveServerConfig error:", error);
    throw error;
  }
};


export const Route = createFileRoute("/chat-mcp")({
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

const initGuessChat = {
  id: "first",
  role: "system",
  content: "请问我有什么可以帮助您的?",
  timestamp: new Date(),
} satisfies  ChatMessage;

function MCPChat() {
  const { name, desc, url } = Route.useSearch();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([initGuessChat]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);

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
      setIsInitializing(true); // ✅ 开始动画

      try {
        const config = await resolveServerConfig(name, url);

        if (!config.command || config.command === "not found") {
          const hint =
            typeof config.env?.error === "string"
              ? config.env.error
              : `未找到 ${name} 的 MCP 配置，请访问 ${url} 进行配置`;
          setMessages([createMessage("system", hint)]);
          return;
        }

        const result = await window.mcp.startServer(config);
        if (!result.success) throw new Error(result.error || "启动 MCP 服务器失败");

        const history = await window.mcp.getChatHistory(name) as ChatMessage[];
        if (!history || history.length === 0) {
          setMessages([initGuessChat]);
        } else {
          setMessages(hydrateMessages(history));
        }
      } catch (error) {
        const errorMessage = createMessage(
          "system",
          `连接到 MCP 服务器时出错: ${error instanceof Error ? error.message : `未知错误`}`,
        );
        setMessages([errorMessage]);
      } finally {
        setIsInitializing(false); // ✅ 初始化完成
      }
    };

    void initializeMCP();
  }, [name, desc]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading || !name) return;

    // 清空输入框、渲染用户消息
    setInputValue("");
    setMessages((prev) => [...prev, createMessage("user", trimmed)]);

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

      // 追加 tool/assistant 消息
      setMessages((prev) => {
        const next = [...prev];

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
          `处理消息时出错: ${error instanceof Error ? error.message : "未知错误"}`,
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
      setMessages([initGuessChat]);
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

  if (isInitializing) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-center animate-fadeIn">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-gray-300 animate-pulse">
          正在启动 {name} 服务，请稍候...
        </p>
      </div>
    );
  }

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
              onClick={async () => {
                if (name) {
                  await window.mcp.stopServer(name);
                }
                await navigate({ to: "/", replace: true });
              }}
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
                <div className={`max-w-[80%] rounded-lg p-4`}>
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
