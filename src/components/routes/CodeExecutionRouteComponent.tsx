import React from 'react';

const CodeExecutionRouteComponent: React.FC = () => {
  // MCP servers in the code execution category
  const mcpServers = [
    { name: "alfonsograziano/node-code-sandbox-mcp", description: "A Node.js MCP server that spins up isolated Docker-based sandboxes for executing JavaScript snippets with on-the-fly npm dependency installation and clean teardown" },
    { name: "ckanthony/openapi-mcp", description: "OpenAPI-MCP: Dockerized MCP Server to allow your AI agent to access any API with existing api docs." },
    { name: "gwbischof/outsource-mcp", description: "Give your AI assistant its own AI assistants. For example: Could you ask openai to generate an image of a dog?" },
    { name: "hileamlakB/PRIMS", description: "A Python Runtime Interpreter MCP Server that executes user-submitted code in an isolated environment." },
    { name: "ouvreboite/openapi-to-mcp", description: "Lightweight MCP server to access any API using their OpenAPI specification. Supports OAuth2 and full JSON schema parameters and request body." },
    { name: "pydantic/pydantic-ai/mcp-run-python", description: "Run Python code in a secure sandbox via MCP tool calls" },
    { name: "r33drichards/mcp-js", description: "A Javascript code execution sandbox that uses v8 to isolate code to run AI generated javascript locally without fear. Supports heap snapshotting for persistent sessions." },
    { name: "yepcode/mcp-server-js", description: "Execute any LLM-generated code in a secure and scalable sandbox environment and create your own MCP tools using JavaScript or Python, with full support for NPM and PyPI packages" },
    { name: "dagger/container-use", description: "Containerized environments for coding agents. Multiple agents can work independently, isolated in fresh containers and git branches. No conflicts, many experiments. Full execution history, terminal access to agent environments, git workflow. Any agent/model/infra stack." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">代码执行</h1>
      <p className="mb-6">代码执行类MCP服务器，用于安全执行代码</p>
      
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

export default CodeExecutionRouteComponent;