import React from 'react';

const TravelRouteComponent: React.FC = () => {
  // MCP servers in the travel and transportation category
  const mcpServers = [
    { name: "campertunity/mcp-server", description: "Search campgrounds around the world on campertunity, check availability, and provide booking links" },
    { name: "cobanov/teslamate-mcp", description: "A Model Context Protocol (MCP) server that provides access to your TeslaMate database, allowing AI assistants to query Tesla vehicle data and analytics." },
    { name: "KyrieTangSheng/mcp-server-nationalparks", description: "National Park Service API integration providing latest information of park details, alerts, visitor centers, campgrounds, and events for U.S. National Parks" },
    { name: "lucygoodchild/mcp-national-rail", description: "An MCP server for UK National Rail trains service, providing train schedules and live travel information, intergrating the Realtime Trains API" },
    { name: "openbnb-org/mcp-server-airbnb", description: "Provides tools to search Airbnb and get listing details." },
    { name: "pab1it0/tripadvisor-mcp", description: "A MCP server that enables LLMs to interact with Tripadvisor API, supporting location data, reviews, and photos through standardized MCP interfaces" },
    { name: "Pradumnasaraf/aviationstack-mcp", description: "An MCP server using the AviationStack API to fetch real-time flight data including airline flights, airport schedules, future flights and aircraft types." },
    { name: "r-huijts/ns-mcp-server", description: "Access Dutch Railways (NS) travel information, schedules, and real-time updates" },
    { name: "skedgo/tripgo-mcp-server", description: "Provides tools from the TripGo API for multi-modal trip planning, transport locations, and public transport departures, including real-time information." },
    { name: "helpful-AIs/triplyfy-mcp", description: "An MCP server that lets LLMs plan and manage itineraries with interactive maps in Triplyfy; manage itineraries, places and notes, and search/save flights." },
    { name: "srinath1510/alltrails-mcp-server", description: "A MCP server that provides access to AllTrails data, allowing you to search for hiking trails and get detailed trail information" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">旅行与交通</h1>
      <p className="mb-6">旅行与交通类MCP服务器，用于访问旅行和交通信息</p>
      
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

export default TravelRouteComponent;