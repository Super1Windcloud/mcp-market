import React from 'react';

const DatabasesRouteComponent: React.FC = () => {
  // MCP servers in the databases category
  const mcpServers = [
    { name: "Aiven-Open/mcp-aiven", description: "Navigate your Aiven projects and interact with the PostgreSQL®, Apache Kafka®, ClickHouse® and OpenSearch® services" },
    { name: "alexanderzuev/supabase-mcp-server", description: "Supabase MCP Server with support for SQL query execution and database exploration tools" },
    { name: "aliyun/alibabacloud-tablestore-mcp-server", description: "MCP service for Tablestore, features include adding documents, semantic search for documents based on vectors and scalars, RAG-friendly, and serverless." },
    { name: "amineelkouhen/mcp-cockroachdb", description: "A Model Context Protocol server for managing, monitoring, and querying data in CockroachDB." },
    { name: "benborla29/mcp-server-mysql", description: "MySQL database integration in NodeJS with configurable access controls and schema inspection" },
    { name: "bram2w/baserow", description: "Baserow database integration with table search, list, and row create, read, update, and delete capabilities." },
    { name: "c4pt0r/mcp-server-tidb", description: "TiDB database integration with schema inspection and query capabilities" },
    { name: "Canner/wren-engine", description: "The Semantic Engine for Model Context Protocol(MCP) Clients and AI Agents" },
    { name: "centralmind/gateway", description: "MCP and MCP SSE Server that automatically generate API based on database schema and data. Supports PostgreSQL, Clickhouse, MySQL, Snowflake, BigQuery, Supabase" },
    { name: "ChristianHinge/dicom-mcp", description: "DICOM integration to query, read, and move medical images and reports from PACS and other DICOM compliant systems." },
    { name: "chroma-core/chroma-mcp", description: "Chroma MCP server to access local and cloud Chroma instances for retrieval capabilities" },
    { name: "ClickHouse/mcp-clickhouse", description: "ClickHouse database integration with schema inspection and query capabilities" },
    { name: "confluentinc/mcp-confluent", description: "Confluent integration to interact with Confluent Kafka and Confluent Cloud REST APIs." },
    { name: "Couchbase-Ecosystem/mcp-server-couchbase", description: "Couchbase MCP server provides unfied access to both Capella cloud and self-managed clusters for document operations, SQL++ queries and natural language data analysis." },
    { name: "cr7258/elasticsearch-mcp-server", description: "MCP Server implementation that provides Elasticsearch interaction" },
    { name: "crystaldba/postgres-mcp", description: "All-in-one MCP server for Postgres development and operations, with tools for performance analysis, tuning, and health checks" },
    { name: "Dataring-engineering/mcp-server-trino", description: "Trino MCP Server to query and access data from Trino Clusters." },
    { name: "davewind/mysql-mcp-server", description: "A user-friendly read-only mysql mcp server for cursor and n8n..." },
    { name: "designcomputer/mysql_mcp_server", description: "MySQL database integration with configurable access controls, schema inspection, and comprehensive security guidelines" },
    { name: "domdomegg/airtable-mcp-server", description: "Airtable database integration with schema inspection, read and write capabilities" },
    { name: "edwinbernadus/nocodb-mcp-server", description: "Nocodb database integration, read and write capabilities" },
    { name: "ergut/mcp-bigquery-server", description: "Server implementation for Google BigQuery integration that enables direct BigQuery database access and querying capabilities" },
    { name: "f4ww4z/mcp-mysql-server", description: "Node.js-based MySQL database integration that provides secure MySQL database operations" },
    { name: "ferrants/memvid-mcp-server", description: "Python Streamable HTTP Server you can run locally to interact with memvid storage and semantic search." },
    { name: "fireproof-storage/mcp-database-server", description: "Fireproof ledger database with multi-user sync" },
    { name: "freema/mcp-gsheets", description: "MCP server for Google Sheets API integration with comprehensive reading, writing, formatting, and sheet management capabilities." },
    { name: "FreePeak/db-mcp-server", description: "A high-performance multi-database MCP server built with Golang, supporting MySQL & PostgreSQL (NoSQL coming soon). Includes built-in tools for query execution, transaction management, schema exploration, query building, and performance analysis, with seamless Cursor integration for enhanced database workflows." },
    { name: "furey/mongodb-lens", description: "MongoDB Lens: Full Featured MCP Server for MongoDB Databases" },
    { name: "gannonh/firebase-mcp", description: "Firebase services including Auth, Firestore and Storage." },
    { name: "get-convex/convex-backend", description: "Convex database integration to introspect tables, functions, and run oneoff queries" },
    { name: "googleapis/genai-toolbox", description: "Open source MCP server specializing in easy, fast, and secure tools for Databases." },
    { name: "GreptimeTeam/greptimedb-mcp-server", description: "MCP Server for querying GreptimeDB." },
    { name: "hannesrudolph/sqlite-explorer-fastmcp-mcp-server", description: "An MCP server that provides safe, read-only access to SQLite databases through Model Context Protocol (MCP). This server is built with the FastMCP framework, which enables LLMs to explore and query SQLite databases with built-in safety features and query validation." },
    { name: "henilcalagiya/google-sheets-mcp", description: "Your AI Assistant's Gateway to Google Sheets! 25 powerful tools for seamless Google Sheets automation via MCP." },
    { name: "hydrolix/mcp-hydrolix", description: "Hydrolix time-series datalake integration providing schema exploration and query capabilities to LLM-based workflows." },
    { name: "idoru/influxdb-mcp-server", description: "Run queries against InfluxDB OSS API v2." },
    { name: "InfluxData/influxdb3_mcp_server", description: "Official MCP server for InfluxDB 3 Core/Enterprise/Cloud Dedicated" },
    { name: "isaacwasserman/mcp-snowflake-server", description: "Snowflake integration implementing read and (optional) write operations as well as insight tracking" },
    { name: "iunera/druid-mcp-server", description: "Comprehensive MCP server for Apache Druid that provides extensive tools, resources, and prompts for managing and analyzing Druid clusters." },
    { name: "yannbrrd/simple_snowflake_mcp", description: "Simple Snowflake MCP server that works behind a corporate proxy. Read and write (optional) operations" },
    { name: "joshuarileydev/supabase-mcp-server", description: "Supabase MCP Server for managing and creating projects and organisations in Supabase" },
    { name: "jovezhong/mcp-timeplus", description: "MCP server for Apache Kafka and Timeplus. Able to list Kafka topics, poll Kafka messages, save Kafka data locally and query streaming data with SQL via Timeplus" },
    { name: "jparkerweb/mcp-sqlite", description: "Model Context Protocol (MCP) server that provides comprehensive SQLite database interaction capabilities." },
    { name: "KashiwaByte/vikingdb-mcp-server", description: "VikingDB integration with collection and index introduction, vector store and search capabilities." },
    { name: "kiliczsh/mcp-mongo-server", description: "A Model Context Protocol Server for MongoDB" },
    { name: "ktanaka101/mcp-server-duckdb", description: "DuckDB database integration with schema inspection and query capabilities" },
    { name: "LucasHild/mcp-server-bigquery", description: "BigQuery database integration with schema inspection and query capabilities" },
    { name: "memgraph/mcp-memgraph", description: "Memgraph MCP Server - includes a tool to run a query against Memgraph and a schema resource." },
    { name: "modelcontextprotocol/server-postgres", description: "PostgreSQL database integration with schema inspection and query capabilities" },
    { name: "modelcontextprotocol/server-sqlite", description: "SQLite database operations with built-in analysis features" },
    { name: "neo4j-contrib/mcp-neo4j", description: "Model Context Protocol with Neo4j (Run queries, Knowledge Graph Memory, Manaage Neo4j Aura Instances)" },
    { name: "neondatabase/mcp-server-neon", description: "An MCP Server for creating and managing Postgres databases using Neon Serverless Postgres" },
    { name: "niledatabase/nile-mcp-server", description: "MCP server for Nile's Postgres platform - Manage and query Postgres databases, tenants, users, auth using LLMs" },
    { name: "openlink/mcp-server-jdbc", description: "An MCP server for generic Database Management System (DBMS) Connectivity via the Java Database Connectivity (JDBC) protocol" },
    { name: "openlink/mcp-server-odbc", description: "An MCP server for generic Database Management System (DBMS) Connectivity via the Open Database Connectivity (ODBC) protocol" },
    { name: "openlink/mcp-server-sqlalchemy", description: "An MCP server for generic Database Management System (DBMS) Connectivity via SQLAlchemy using Python ODBC (pyodbc)" },
    { name: "pab1it0/adx-mcp-server", description: "Query and analyze Azure Data Explorer databases" },
    { name: "pab1it0/prometheus-mcp-server", description: "Query and analyze Prometheus, open-source monitoring system." },
    { name: "prisma/mcp", description: "Gives LLMs the ability to manage Prisma Postgres databases (e.g. spin up new databases and run migrations or queries)." },
    { name: "qdrant/mcp-server-qdrant", description: "A Qdrant MCP server" },
    { name: "QuantGeekDev/mongo-mcp", description: "MongoDB integration that enables LLMs to interact directly with databases." },
    { name: "quarkiverse/mcp-server-jdbc", description: "Connect to any JDBC-compatible database and query, insert, update, delete, and more." },
    { name: "rashidazarang/airtable-mcp", description: "Connect AI tools directly to Airtable. Query, create, update, and delete records using natural language. Features include base management, table operations, schema manipulation, record filtering, and data migration through a standardized MCP interface." },
    { name: "redis/mcp-redis", description: "The Redis official MCP Server offers an interface to manage and search data in Redis." },
    { name: "runekaagaard/mcp-alchemy", description: "Universal SQLAlchemy-based database integration supporting PostgreSQL, MySQL, MariaDB, SQLite, Oracle, MS SQL Server and many more databases. Features schema and relationship inspection, and large dataset analysis capabilities." },
    { name: "s2-streamstore/s2-sdk-typescript", description: "Official MCP server for the S2.dev serverless stream platform." },
    { name: "schemacrawler/SchemaCrawler-MCP-Server-Usage", description: "Connect to any relational database, and be able to get valid SQL, and ask questions like what does a certain column prefix mean." },
    { name: "sirmews/mcp-pinecone", description: "Pinecone integration with vector search capabilities" },
    { name: "skysqlinc/skysql-mcp", description: "Serverless MariaDB Cloud DB MCP server. Tools to launch, delete, execute SQL and work with DB level AI agents for accurate text-2-sql and conversations." },
    { name: "Snowflake-Labs/mcp", description: "Open-source MCP server for Snowflake from official Snowflake-Labs supports prompting Cortex Agents, querying structured & unstructured data, object management, SQL execution, semantic view querying, and more. RBAC, fine-grained CRUD controls, and all authentication methods supported." },
    { name: "subnetmarco/pgmcp", description: "Natural language PostgreSQL queries with automatic streaming, read-only safety, and universal database compatibility." },
    { name: "supabase-community/supabase-mcp", description: "Official Supabase MCP server to connect AI assistants directly with your Supabase project and allows them to perform tasks like managing tables, fetching config, and querying data." },
    { name: "TheRaLabs/legion-mcp", description: "Universal database MCP server supporting multiple database types including PostgreSQL, Redshift, CockroachDB, MySQL, RDS MySQL, Microsoft SQL Server, BigQuery, Oracle DB, and SQLite." },
    { name: "tradercjz/dolphindb-mcp-server", description: "TDolphinDB database integration with schema inspection and query capabilities" },
    { name: "tuannvm/mcp-trino", description: "A Go implementation of a Model Context Protocol (MCP) server for Trino" },
    { name: "VictoriaMetrics-Community/mcp-victorialogs", description: "Provides comprehensive integration with your VictoriaLogs instance APIs and documentation for working with logs, investigating and debugging tasks related to your VictoriaLogs instances." },
    { name: "weaviate/mcp-server-weaviate", description: "An MCP Server to connect to your Weaviate collections as a knowledge base as well as using Weaviate as a chat memory store." },
    { name: "wenb1n-dev/mysql_mcp_server_pro", description: "Supports SSE, STDIO; not only limited to MySQL's CRUD functionality; also includes database exception analysis capabilities; controls database permissions based on roles; and makes it easy for developers to extend tools with customization" },
    { name: "xexr/mcp-libsql", description: "Production-ready MCP server for libSQL databases with comprehensive security and management tools." },
    { name: "XGenerationLab/xiyan_mcp_server", description: "An MCP server that supports fetching data from a database using natural language queries, powered by XiyanSQL as the text-to-SQL LLM." },
    { name: "xing5/mcp-google-sheets", description: "A Model Context Protocol server for interacting with Google Sheets. This server provides tools to create, read, update, and manage spreadsheets through the Google Sheets API." },
    { name: "ydb/ydb-mcp", description: "MCP server for interacting with YDB databases" },
    { name: "yincongcyincong/VictoriaMetrics-mcp-server", description: "An MCP server for interacting with VictoriaMetrics database." },
    { name: "Zhwt/go-mcp-mysql", description: "Easy to use, zero dependency MySQL MCP server built with Golang with configurable readonly mode and schema inspection." },
    { name: "zilliztech/mcp-server-milvus", description: "MCP Server for Milvus / Zilliz, making it possible to interact with your database." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">数据库</h1>
      <p className="mb-6">数据库类MCP服务器，用于访问数据库</p>
      
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

export default DatabasesRouteComponent;