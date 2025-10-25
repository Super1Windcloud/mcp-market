import React from 'react';

const SportsRouteComponent: React.FC = () => {
  // MCP servers in the sports category
  const mcpServers = [
    { name: "guillochon/mlb-api-mcp", description: "MCP server that acts as a proxy to the freely available MLB API, which provides player info, stats, and game information." },
    { name: "mikechao/balldontlie-mcp", description: "MCP server that integrates balldontlie api to provide information about players, teams and games for the NBA, NFL and MLB" },
    { name: "r-huijts/firstcycling-mcp", description: "Access cycling race data, results, and statistics through natural language. Features include retrieving start lists, race results, and rider information from firstcycling.com." },
    { name: "r-huijts/strava-mcp", description: "A Model Context Protocol (MCP) server that connects to Strava API, providing tools to access Strava data through LLMs" },
    { name: "RobSpectre/mvf1", description: "MCP server that controls MultiViewer, an app for watching motorsports like Formula 1, World Endurance Championship, IndyCar and others." },
    { name: "willvelida/mcp-afl-server", description: "MCP server that integrates with the Squiggle API to provide information on Australian Football League teams, ladder standings, results, tips, and power rankings." },
    { name: "cloudbet/sports-mcp-server", description: "Access structured sports data via the Cloudbet API. Query upcoming events, live odds, stake limits, and market info across soccer, basketball, tennis, esports, and more." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">体育</h1>
      <p className="mb-6">体育类MCP服务器，用于访问体育数据</p>
      
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

export default SportsRouteComponent;