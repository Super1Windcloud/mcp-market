import React from 'react';

const DataPlatformsRouteComponent: React.FC = () => {
  // MCP servers in the data platforms category
  const mcpServers = [
    { name: "aywengo/kafka-schema-reg-mcp", description: "Comprehensive Kafka Schema Registry MCP server with 48 tools for multi-registry management, schema migration, and enterprise features." },
    { name: "dbt-labs/dbt-mcp", description: "Official MCP server for dbt (data build tool) providing integration with dbt Core/Cloud CLI, project metadata discovery, model information, and semantic layer querying capabilities." },
    { name: "flowcore/mcp-flowcore-platform", description: "Interact with Flowcore to perform actions, ingest data, and analyse, cross reference and utilise any data in your data cores, or in public data cores; all with human language." },
    { name: "JordiNei/mcp-databricks-server", description: "Connect to Databricks API, allowing LLMs to run SQL queries, list jobs, and get job status." },
    { name: "jwaxman19/qlik-mcp", description: "MCP Server for Qlik Cloud API that enables querying applications, sheets, and extracting data from visualizations with comprehensive authentication and rate limiting support." },
    { name: "keboola/keboola-mcp-server", description: "interact with Keboola Connection Data Platform. This server provides tools for listing and accessing data from Keboola Storage API." },
    { name: "mattijsdp/dbt-docs-mcp", description: "MCP server for dbt-core (OSS) users as the official dbt MCP only supports dbt Cloud. Supports project metadata, model and column-level lineage and dbt documentation." },
    { name: "yashshingvi/databricks-genie-MCP", description: "A server that connects to the Databricks Genie API, allowing LLMs to ask natural language questions, run SQL queries, and interact with Databricks conversational agents." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">数据平台</h1>
      <p className="mb-6">数据平台类MCP服务器，用于数据集成和转换</p>
      
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

export default DataPlatformsRouteComponent;