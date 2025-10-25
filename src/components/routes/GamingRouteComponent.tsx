import React from 'react';

const GamingRouteComponent: React.FC = () => {
  // MCP servers in the gaming category
  const mcpServers = [
    { name: "CoderGamester/mcp-unity", description: "MCP Server for Unity3d Game Engine integration for game development" },
    { name: "Coding-Solo/godot-mcp", description: "A MCP server for interacting with the Godot game engine, providing tools for editing, running, debugging, and managing scenes in Godot projects." },
    { name: "ddsky/gamebrain-api-clients", description: "Search and discover hundreds of thousands of video games on any platform through the GameBrain API." },
    { name: "IvanMurzak/Unity-MCP", description: "MCP Server for Unity Editor and for a game made with Unity" },
    { name: "jiayao/mcp-chess", description: "A MCP server playing chess against LLMs." },
    { name: "kkjdaniel/bgg-mcp", description: "An MCP server that enables interaction with board game related data via the BoardGameGeek API (XML API2)." },
    { name: "opgginc/opgg-mcp", description: "Access real-time gaming data across popular titles like League of Legends, TFT, and Valorant, offering champion analytics, esports schedules, meta compositions, and character statistics." },
    { name: "pab1ito/chess-mcp", description: "Access Chess.com player data, game records, and other public information through standardized MCP interfaces, allowing AI assistants to search and analyze chess information." },
    { name: "rishijatia/fantasy-pl-mcp", description: "An MCP server for real-time Fantasy Premier League data and analysis tools." },
    { name: "sonirico/mpc-stockfish", description: "MCP server connecting AI systems to Stockfish chess engine." },
    { name: "stefan-xyz/mcp-server-runescape", description: "An MCP server with tools for interacting with RuneScape (RS) and Old School RuneScape (OSRS) data, including item prices, player hiscores, and more." },
    { name: "tomholford/mcp-tic-tac-toe", description: "Play Tic Tac Toe against an AI opponent using this MCP server." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">游戏</h1>
      <p className="mb-6">游戏类MCP服务器，用于游戏数据和引擎集成</p>
      
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

export default GamingRouteComponent;