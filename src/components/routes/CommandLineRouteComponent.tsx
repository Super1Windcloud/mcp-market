import React from 'react';

const CommandLineRouteComponent: React.FC = () => {
  // MCP servers in the command line category
  const mcpServers = [
    { name: "automateyournetwork/pyATS_MCP", description: "Cisco pyATS server enabling structured, model-driven interaction with network devices." },
    { name: "aymericzip/intlayer", description: "A MCP Server that enhance your IDE with AI-powered assistance for Intlayer i18n / CMS tool: smart CLI access, access to the docs." },
    { name: "ferrislucas/iterm-mcp", description: "A Model Context Protocol server that provides access to iTerm. You can run commands and ask questions about what you see in the iTerm terminal." },
    { name: "g0t4/mcp-server-commands", description: "Run any command with run_command and run_script tools." },
    { name: "maxim-saplin/mcp_safe_local_python_executor", description: "Safe Python interpreter based on HF Smolagents LocalPythonExecutor" },
    { name: "misiektoja/kill-process-mcp", description: "List and terminate OS processes via natural language queries" },
    { name: "MladenSU/cli-mcp-server", description: "Command line interface with secure execution and customizable security policies" },
    { name: "OthmaneBlial/term_mcp_deepseek", description: "A DeepSeek MCP-like Server for Terminal" },
    { name: "sonirico/mcp-shell", description: "Give hands to AI. MCP server to run shell commands securely, auditably, and on demand on isolated environments like docker." },
    { name: "tufantunc/ssh-mcp", description: "MCP server exposing SSH control for Linux and Windows servers via Model Context Protocol. Securely execute remote shell commands with password or SSH key authentication." },
    { name: "tumf/mcp-shell-server", description: "A secure shell command execution server implementing the Model Context Protocol (MCP)" },
    { name: "wonderwhy-er/DesktopCommanderMCP", description: "A swiss-army-knife that can manage/execute programs and read/write/search/edit code and text files." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">命令行</h1>
      <p className="mb-6">命令行类MCP服务器，用于执行shell命令和交互</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mcpServers.map((server, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold">{server.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{server.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandLineRouteComponent;