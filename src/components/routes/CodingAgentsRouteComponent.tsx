import React from 'react';

const CodingAgentsRouteComponent: React.FC = () => {
  // MCP servers in the coding agents category
  const mcpServers = [
    { name: "doggybee/mcp-server-leetcode", description: "An MCP server that enables AI models to search, retrieve, and solve LeetCode problems. Supports metadata filtering, user profiles, submissions, and contest data access." },
    { name: "ezyang/codemcp", description: "Coding agent with basic read, write and command line tools." },
    { name: "gabrielmaialva33/winx-code-agent", description: "A high-performance Rust reimplementation of WCGW for code agents, providing shell execution and advanced file management capabilities for LLMs via MCP." },
    { name: "jinzcdev/leetcode-mcp-server", description: "MCP server enabling automated access to LeetCode's programming problems, solutions, submissions and public data with optional authentication for user-specific features (e.g., notes), supporting both leetcode.com (global) and leetcode.cn (China) sites." },
    { name: "juehang/vscode-mcp-server", description: "A MCP Server that allows AI such as Claude to read from the directory structure in a VS Code workspace, see problems picked up by linter(s) and the language server, read code files, and make edits." },
    { name: "micl2e2/code-to-tree", description: "A single-binary MCP server that converts source code into AST, regardless of language." },
    { name: "oraios/serena", description: "A fully-featured coding agent that relies on symbolic code operations by using language servers." },
    { name: "pdavis68/RepoMapper", description: "An MCP server (and command-line tool) to provide a dynamic map of chat-related files from the repository with their function prototypes and related files in order of relevance. Based on the \"Repo Map\" functionality in Aider.chat" },
    { name: "rinadelph/Agent-MCP", description: "A framework for creating multi-agent systems using MCP for coordinated AI collaboration, featuring task management, shared context, and RAG capabilities." },
    { name: "stippi/code-assistant", description: "Coding agent with basic list, read, replace_in_file, write, execute_command and web search tools. Supports multiple projects concurrently." },
    { name: "tiianhk/MaxMSP-MCP-Server", description: "A coding agent for Max (Max/MSP/Jitter), which is a visual programming language for music and multimedia." },
    { name: "nesquikm/mcp-rubber-duck", description: "An MCP server that bridges to multiple OpenAI-compatible LLMs - your AI rubber duck debugging panel for explaining problems to various AI \"ducks\" and getting different perspectives" },
    { name: "VertexStudio/developer", description: "Comprehensive developer tools for file editing, shell command execution, and screen capture capabilities" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">编码代理</h1>
      <p className="mb-6">编码代理类MCP服务器，用于自主编程任务</p>
      
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

export default CodingAgentsRouteComponent;