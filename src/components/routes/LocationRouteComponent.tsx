import React from 'react';

const LocationRouteComponent: React.FC = () => {
  // MCP servers in the location services category
  const mcpServers = [
    { name: "briandconnelly/mcp-server-ipinfo", description: "IP address geolocation and network information using IPInfo API" },
    { name: "cqtrinv/trinvmcp", description: "Explore French communes and cadastral parcels based on name and surface" },
    { name: "devilcoder01/weather-mcp-server", description: "Access real-time weather data for any location using the WeatherAPI.com API, providing detailed forecasts and current conditions." },
    { name: "ip2location/mcp-ip2location-io", description: "Official IP2Location.io MCP server to obtain the geolocation, proxy and network information of an IP address utilizing IP2Location.io API." },
    { name: "isdaniel/mcp_weather_server", description: "Get weather information from https://api.open-meteo.com API." },
    { name: "ipfind/ipfind-mcp-server", description: "IP Address location service using the IP Find API" },
    { name: "ipfred/aiwen-mcp-server-geoip", description: "MCP Server for the Aiwen IP Location, Get user network IP location, get IP details (country, province, city, lat, lon, ISP, owner, etc.)" },
    { name: "iplocate/mcp-server-iplocate", description: "Look up IP address geolocation, network information, detect proxies and VPNs, and find abuse contact details using IPLocate.io" },
    { name: "jagan-shanmugam/open-streetmap-mcp", description: "An OpenStreetMap MCP server with location-based services and geospatial data." },
    { name: "kukapay/nearby-search-mcp", description: "An MCP server for nearby place searches with IP-based location detection." },
    { name: "mahdin75/geoserver-mcp", description: "A Model Context Protocol (MCP) server implementation that connects LLMs to the GeoServer REST API, enabling AI assistants to interact with geospatial data and services." },
    { name: "mahdin75/gis-mcp", description: "A Model Context Protocol (MCP) server implementation that connects Large Language Models (LLMs) to GIS operations using GIS libraries, enabling AI assistants to perform accurate geospatial operations and transformations." },
    { name: "modelcontextprotocol/server-google-maps", description: "Google Maps integration for location services, routing, and place details" },
    { name: "QGIS MCP", description: "connects QGIS Desktop to Claude AI through the MCP. This integration enables prompt-assisted project creation, layer loading, code execution, and more." },
    { name: "rossshannon/Weekly-Weather-mcp", description: "Weekly Weather MCP server which returns 7 full days of detailed weather forecasts anywhere in the world." },
    { name: "SaintDoresh/Weather-MCP-ClaudeDesktop", description: "An MCP tool that provides real-time weather data, forecasts, and historical weather information using the OpenWeatherMap API." },
    { name: "SecretiveShell/MCP-timeserver", description: "Access the time in any timezone and get the current local time" },
    { name: "stadiamaps/stadiamaps-mcp-server-ts", description: "A MCP server for Stadia Maps' Location APIs - Lookup addresses, places with geocoding, find time zones, create routes and static maps" },
    { name: "TimLukaHorstmann/mcp-weather", description: "Accurate weather forecasts via the AccuWeather API (free tier available)." },
    { name: "trackmage/trackmage-mcp-server", description: "Shipment tracking api and logistics management capabilities through the TrackMage API" },
    { name: "webcoderz/MCP-Geo", description: "Geocoding MCP server for nominatim, ArcGIS, Bing" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">定位服务</h1>
      <p className="mb-6">定位服务类MCP服务器，用于地理位置数据访问</p>
      
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

export default LocationRouteComponent;