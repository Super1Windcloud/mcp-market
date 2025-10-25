import React from 'react';

const FileSystemsRouteComponent: React.FC = () => {
  // MCP servers in the file systems category
  const mcpServers = [
    { name: "8b-is/smart-tree", description: "AI-native directory visualization with semantic analysis, ultra-compressed formats for AI consumption, and 10x token reduction. Supports quantum-semantic mode with intelligent file categorization." },
    { name: "box/mcp-server-box-remote", description: "The Box MCP server allows third party AI agents to securely and seamlessly access Box content and use tools such as search, asking questions from files and folders, and data extraction." },
    { name: "cyberchitta/llm-context.py", description: "Share code context with LLMs via MCP or clipboard" },
    { name: "exoticknight/mcp-file-merger", description: "File merger tool, suitable for AI chat length limits." },
    { name: "filesystem@quarkiverse/quarkus-mcp-servers", description: "A filesystem allowing for browsing and editing files implemented in Java using Quarkus. Available as jar or native image." },
    { name: "hmk/box-mcp-server", description: "Box integration for listing, reading and searching files" },
    { name: "isaacphi/mcp-gdrive", description: "Model Context Protocol (MCP) Server for reading from Google Drive and editing Google Sheets." },
    { name: "jeannier/homebrew-mcp", description: "Control your macOS Homebrew setup using natural language via this MCP server. Simply manage your packages, or ask for suggestions, troubleshoot brew issues etc." },
    { name: "mamertofabian/mcp-everything-search", description: "Fast Windows file search using Everything SDK" },
    { name: "mark3labs/mcp-filesystem-server", description: "Golang implementation for local file system access." },
    { name: "mickaelkerjean/filestash", description: "Remote Storage Access: SFTP, S3, FTP, SMB, NFS, WebDAV, GIT, FTPS, gcloud, azure blob, sharepoint, etc." },
    { name: "microsoft/markitdown", description: "MCP tool access to MarkItDown -- a library that converts many file formats (local or remote) to Markdown for LLM consumption." },
    { name: "modelcontextprotocol/server-filesystem", description: "Direct local file system access." },
    { name: "Xuanwo/mcp-server-opendal", description: "Access any storage with Apache OpenDAL™" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">文件系统</h1>
      <p className="mb-6">文件系统类MCP服务器，用于访问本地文件系统</p>
      
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

export default FileSystemsRouteComponent;