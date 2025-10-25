import React from 'react';

const DataScienceRouteComponent: React.FC = () => {
  // MCP servers in the data science tools category
  const mcpServers = [
    { name: "arrismo/kaggle-mcp", description: "Connects to Kaggle, ability to download and analyze datasets." },
    { name: "avisangle/calculator-server", description: "A comprehensive Go-based MCP server for mathematical computations, implementing 13 mathematical tools across basic arithmetic, advanced functions, statistical analysis, unit conversions, and financial calculations." },
    { name: "ChronulusAI/chronulus-mcp", description: "Predict anything with Chronulus AI forecasting and prediction agents." },
    { name: "DataEval/dingo", description: "MCP server for the Dingo: a comprehensive data quality evaluation tool. Server Enables interaction with Dingo's rule-based and LLM-based evaluation capabilities and rules&prompts listing." },
    { name: "datalayer/jupyter-mcp-server", description: "Model Context Protocol (MCP) Server for Jupyter." },
    { name: "growthbook/growthbook-mcp", description: "Tools for creating and interacting with GrowthBook feature flags and experiments." },
    { name: "HumanSignal/label-studio-mcp-server", description: "Create, manage, and automate Label Studio projects, tasks, and predictions for data labeling workflows." },
    { name: "jjsantos01/jupyter-notebook-mcp", description: "connects Jupyter Notebook to Claude AI, allowing Claude to directly interact with and control Jupyter Notebooks." },
    { name: "kdqed/zaturn", description: "Link multiple data sources (SQL, CSV, Parquet, etc.) and ask AI to analyze the data for insights and visualizations." },
    { name: "mckinsey/vizro-mcp", description: "Tools and templates to create validated and maintainable data charts and dashboards." },
    { name: "optuna/optuna-mcp", description: "Official MCP server enabling seamless orchestration of hyperparameter search and other optimization tasks with Optuna." },
    { name: "phisanti/MCPR", description: "Model Context Protocol for R: enables AI agents to participate in interactive live R sessions." },
    { name: "reading-plus-ai/mcp-server-data-exploration", description: "Enables autonomous data exploration on .csv-based datasets, providing intelligent insights with minimal effort." },
    { name: "subelsky/bundler_mcp", description: "Enables agents to query local information about dependencies in a Ruby project's Gemfile." },
    { name: "Bright-L01/networkx-mcp-server", description: "The first NetworkX integration for Model Context Protocol, enabling graph analysis and visualization directly in AI conversations. Supports 13 operations including centrality algorithms, community detection, PageRank, and graph visualization." },
    { name: "zcaceres/markdownify-mcp", description: "An MCP server to convert almost any file or web content into Markdown" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">数据科学工具</h1>
      <p className="mb-6">数据科学工具类MCP服务器，用于数据探索和分析</p>
      
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

export default DataScienceRouteComponent;