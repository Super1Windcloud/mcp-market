import React from 'react';

const KnowledgeRouteComponent: React.FC = () => {
  // MCP servers in the knowledge and memory category
  const mcpServers = [
    { name: "0xshellming/mcp-summarizer", description: "AI Summarization MCP Server, Support for multiple content types: Plain text, Web pages, PDF documents, EPUB books, HTML content" },
    { name: "apecloud/ApeRAG", description: "Production-ready RAG platform combining Graph RAG, vector search, and full-text search. Best choice for building your own Knowledge Graph and for Context Engineering" },
    { name: "chatmcp/mcp-server-chatsum", description: "Query and summarize your chat messages with AI prompts." },
    { name: "cameronrye/openzim-mcp", description: "Modern, secure MCP server for accessing ZIM format knowledge bases offline. Enables AI models to search and navigate Wikipedia, educational content, and other compressed knowledge archives with smart retrieval, caching, and comprehensive API." },
    { name: "CheMiguel23/MemoryMesh", description: "Enhanced graph-based memory with a focus on AI role-play and story generation" },
    { name: "entanglr/zettelkasten-mcp", description: "A Model Context Protocol (MCP) server that implements the Zettelkasten knowledge management methodology, allowing you to create, link, and search atomic notes through Claude and other MCP-compatible clients." },
    { name: "GistPad-MCP", description: "Use GitHub Gists to manage and access your personal knowledge, daily notes, and reusable prompts. This acts as a companion to https://gistpad.dev and the GistPad VS Code extension." },
    { name: "graphlit-mcp-server", description: "Ingest anything from Slack, Discord, websites, Google Drive, Linear or GitHub into a Graphlit project - and then search and retrieve relevant knowledge within an MCP client like Cursor, Windsurf or Cline." },
    { name: "hannesrudolph/mcp-ragdocs", description: "An MCP server implementation that provides tools for retrieving and processing documentation through vector search, enabling AI assistants to augment their responses with relevant documentation context" },
    { name: "jinzcdev/markmap-mcp-server", description: "An MCP server built on markmap that converts Markdown to interactive mind maps. Supports multi-format exports (PNG/JPG/SVG), live browser preview, one-click Markdown copy, and dynamic visualization features." },
    { name: "kaliaboi/mcp-zotero", description: "A connector for LLMs to work with collections and sources on your Zotero Cloud" },
    { name: "mem0ai/mem0-mcp", description: "A Model Context Protocol server for Mem0 that helps manage coding preferences and patterns, providing tools for storing, retrieving and semantically handling code implementations, best practices and technical documentation in IDEs like Cursor and Windsurf" },
    { name: "modelcontextprotocol/server-memory", description: "Knowledge graph-based persistent memory system for maintaining context" },
    { name: "MWGMorningwood/Central-Memory-MCP", description: "An Azure PaaS-hostable MCP server that provides a workspace-grounded knowledge graph for multiple developers using Azure Functions MCP triggers and Table storage." },
    { name: "pi22by7/In-Memoria", description: "Persistent intelligence infrastructure for agentic development that gives AI coding assistants cumulative memory and pattern learning. Hybrid TypeScript/Rust implementation with local-first storage using SQLite + SurrealDB for semantic analysis and incremental codebase understanding." },
    { name: "pinecone-io/assistant-mcp", description: "Connects to your Pinecone Assistant and gives the agent context from its knowledge engine." },
    { name: "ragieai/mcp-server", description: "Retrieve context from your Ragie (RAG) knowledge base connected to integrations like Google Drive, Notion, JIRA and more." },
    { name: "TechDocsStudio/biel-mcp", description: "Let AI tools like Cursor, VS Code, or Claude Desktop answer questions using your product docs. Biel.ai provides the RAG system and MCP server." },
    { name: "topoteretes/cognee", description: "Memory manager for AI apps and Agents using various graph and vector stores and allowing ingestion from 30+ data sources" },
    { name: "unibaseio/membase-mcp", description: "Save and query your agent memory in distributed way by Membase" },
    { name: "upstash/context7", description: "Up-to-date code documentation for LLMs and AI code editors." },
    { name: "JamesANZ/memory-mcp", description: "An MCP server that stores and retrieves memories from multiple LLMs using MongoDB. Provides tools for saving, retrieving, adding, and clearing conversation memories with timestamps and LLM identification." },
    { name: "JamesANZ/cross-llm-mcp", description: "An MCP server that enables cross-LLM communication and memory sharing, allowing different AI models to collaborate and share context across conversations." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">知识与记忆</h1>
      <p className="mb-6">知识与记忆类MCP服务器，用于持久化记忆存储</p>
      
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

export default KnowledgeRouteComponent;