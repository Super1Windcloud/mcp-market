import React from 'react';

const SocialRouteComponent: React.FC = () => {
  // MCP servers in the social media category
  const mcpServers = [
    { name: "anwerj/youtube-uploader-mcp", description: "AI‑powered YouTube uploader—no CLI, no YouTube Studio. Uploade videos directly from MCP clients with all AI capabilities." },
    { name: "gwbischof/bluesky-social-mcp", description: "An MCP server for interacting with Bluesky via the atproto client." },
    { name: "HagaiHen/facebook-mcp-server", description: "Integrates with Facebook Pages to enable direct management of posts, comments, and engagement metrics through the Graph API for streamlined social media management." },
    { name: "karanb192/reddit-buddy-mcp", description: "Browse Reddit posts, search content, and analyze user activity without API keys. Works out-of-the-box with Claude Desktop." },
    { name: "kunallunia/twitter-mcp", description: "All-in-one Twitter management solution providing timeline access, user tweet retrieval, hashtag monitoring, conversation analysis, direct messaging, sentiment analysis of a post, and complete post lifecycle control - all through a streamlined API." },
    { name: "macrocosm-os/macrocosmos-mcp", description: "Access real-time X/Reddit/YouTube data directly in your LLM applications with search phrases, users, and date filtering." },
    { name: "sinanefeozler/reddit-summarizer-mcp", description: "MCP server for summarizing users's Reddit homepage or any subreddit based on posts and comments." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">社交媒体</h1>
      <p className="mb-6">社交媒体类MCP服务器，用于与社交平台集成</p>
      
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

export default SocialRouteComponent;