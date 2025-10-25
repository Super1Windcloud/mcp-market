import React from 'react';

const MonitoringRouteComponent: React.FC = () => {
  // MCP servers in the monitoring category
  const mcpServers = [
    { name: "edgedelta/edgedelta-mcp-server", description: "Interact with Edge Delta anomalies, query logs / patterns / events, and pinpoint root causes and optimize your pipelines." },
    { name: "grafana/mcp-grafana", description: "Search dashboards, investigate incidents and query datasources in your Grafana instance" },
    { name: "hyperb1iss/lucidity-mcp", description: "Enhance AI-generated code quality through intelligent, prompt-based analysis across 10 critical dimensions from complexity to security vulnerabilities" },
    { name: "inventer-dev/mcp-internet-speed-test", description: "Internet speed testing with network performance metrics including download/upload speed, latency, jitter analysis, and CDN server detection with geographic mapping" },
    { name: "last9/last9-mcp-server", description: "Seamlessly bring real-time production context—logs, metrics, and traces—into your local environment to auto-fix code faster" },
    { name: "metoro-io/metoro-mcp-server", description: "Query and interact with kubernetes environments monitored by Metoro" },
    { name: "MindscapeHQ/server-raygun", description: "Raygun API V3 integration for crash reporting and real user monitoring" },
    { name: "getsentry/sentry-mcp", description: "Sentry.io integration for error tracking and performance monitoring" },
    { name: "mpeirone/zabbix-mcp-server", description: "Zabbix integration for hosts, items, triggers, templates, problems, data and more." },
    { name: "netdata/netdata#Netdata", description: "Discovery, exploration, reporting and root cause analysis using all observability data, including metrics, logs, systems, containers, processes, and network connections" },
    { name: "pydantic/logfire-mcp", description: "Provides access to OpenTelemetry traces and metrics through Logfire" },
    { name: "seekrays/mcp-monitor", description: "A system monitoring tool that exposes system metrics via the Model Context Protocol (MCP). This tool allows LLMs to retrieve real-time system information through an MCP-compatible interface.（support CPU、Memory、Disk、Network、Host、Process）" },
    { name: "tumf/grafana-loki-mcp", description: "An MCP server that allows querying Loki logs through the Grafana API." },
    { name: "VictoriaMetrics-Community/mcp-victoriametrics", description: "Provides comprehensive integration with your VictoriaMetrics instance APIs and documentation for monitoring, observability, and debugging tasks related to your VictoriaMetrics instances" },
    { name: "imprvhub/mcp-status-observer", description: "Model Context Protocol server for monitoring Operational Status of major digital platforms in Claude Desktop." },
    { name: "inspektor-gadget/ig-mcp-server", description: "Debug your Container and Kubernetes workloads with an AI interface powered by eBPF." },
    { name: "yshngg/pmcp", description: "A Prometheus Model Context Protocol Server." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">监控</h1>
      <p className="mb-6">监控类MCP服务器，用于应用监控数据访问</p>
      
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

export default MonitoringRouteComponent;