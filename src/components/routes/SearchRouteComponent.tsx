import React from 'react';

const SearchRouteComponent: React.FC = () => {
  // MCP servers in the search and data extraction category
  const mcpServers = [
    { name: "0xdaef0f/job-searchoor", description: "An MCP server for searching job listings with filters for date, keywords, remote work options, and more." },
    { name: "Aas-ee/open-webSearch", description: "Web search using free multi-engine search (NO API KEYS REQUIRED) — Supports Bing, Baidu, DuckDuckGo, Brave, Exa, and CSDN." },
    { name: "ac3xx/mcp-servers-kagi", description: "Kagi search API integration" },
    { name: "adawalli/nexus", description: "AI-powered web search server using Perplexity Sonar models with source citations. Zero-install setup via NPX." },
    { name: "ananddtyagi/webpage-screenshot-mcp", description: "A MCP server for taking screenshots of webpages to use as feedback during UI developement." },
    { name: "urlbox/urlbox-mcp-server", description: "A reliable MCP server for generating and managing screenshots, PDFs, and videos, performing AI-powered screenshot analysis, and extracting web content (Markdown, metadata, and HTML) via the Urlbox API." },
    { name: "andybrandt/mcp-simple-arxiv", description: "MCP for LLM to search and read papers from arXiv" },
    { name: "andybrandt/mcp-simple-pubmed", description: "MCP to search and read medical / life sciences papers from PubMed." },
    { name: "angheljf/nyt", description: "Search articles using the NYTimes API" },
    { name: "apify/mcp-server-rag-web-browser", description: "An MCP server for Apify's open-source RAG Web Browser Actor to perform web searches, scrape URLs, and return content in Markdown." },
    { name: "Bigsy/Clojars-MCP-Server", description: "Clojars MCP Server for upto date dependency information of Clojure libraries" },
    { name: "blazickjp/arxiv-mcp-server", description: "Search ArXiv research papers" },
    { name: "chanmeng/google-news-mcp-server", description: "Google News integration with automatic topic categorization, multi-language support, and comprehensive search capabilities including headlines, stories, and related topics through SerpAPI." },
    { name: "cameronrye/gopher-mcp", description: "Modern, cross-platform MCP server enabling AI assistants to browse and interact with both Gopher protocol and Gemini protocol resources safely and efficiently. Features dual protocol support, TLS security, and structured content extraction." },
    { name: "ConechoAI/openai-websearch-mcp", description: "This is a Python-based MCP server that provides OpenAI web_search build-in tool." },
    { name: "DappierAI/dappier-mcp", description: "Enable fast, free real-time web search and access premium data from trusted media brands—news, financial markets, sports, entertainment, weather, and more. Build powerful AI agents with Dappier." },
    { name: "deadletterq/mcp-opennutrition", description: "Local MCP server for searching 300,000+ foods, nutrition facts, and barcodes from the OpenNutrition database." },
    { name: "dealx/mcp-server", description: "MCP Server for DealX platform" },
    { name: "devflowinc/trieve", description: "Crawl, embed, chunk, search, and retrieve information from datasets through Trieve" },
    { name: "Dumpling-AI/mcp-server-dumplingai", description: "Access data, web scraping, and document conversion APIs by Dumpling AI" },
    { name: "emicklei/melrose-mcp", description: "Plays Melrōse music expressions as MIDI" },
    { name: "erithwik/mcp-hn", description: "An MCP server to search Hacker News, get top stories, and more." },
    { name: "exa-labs/exa-mcp-server", description: "A Model Context Protocol (MCP) server lets AI assistants like Claude use the Exa AI Search API for web searches. This setup allows AI models to get real-time web information in a safe and controlled way." },
    { name: "fatwang2/search1api-mcp", description: "Search via search1api (requires paid API key)" },
    { name: "format37/youtube_mcp", description: "MCP server that transcribes YouTube videos to text. Uses yt-dlp to download audio and OpenAI's Whisper-1 for more precise transcription than youtube captions. Provide a YouTube URL and get back the full transcript splitted by chunks for long videos." },
    { name: "genomoncology/biomcp", description: "Biomedical research server providing access to PubMed, ClinicalTrials.gov, and MyVariant.info." },
    { name: "hbg/mcp-paperswithcode", description: "MCP to search through PapersWithCode API" },
    { name: "hellokaton/unsplash-mcp-server", description: "A MCP server for Unsplash image search." },
    { name: "Himalayas-App/himalayas-mcp", description: "Access tens of thousands of remote job listings and company information. This public MCP server provides real-time access to Himalayas' remote jobs database." },
    { name: "Ihor-Sokoliuk/MCP-SearXNG", description: "A Model Context Protocol Server for SearXNG" },
    { name: "isnow890/naver-search-mcp", description: "MCP server for Naver Search API integration, supporting blog, news, shopping search and DataLab analytics features." },
    { name: "jae-jae/fetcher-mcp", description: "MCP server for fetching web page content using Playwright headless browser, supporting Javascript rendering and intelligent content extraction, and outputting Markdown or HTML format." },
    { name: "jae-jae/g-search-mcp", description: "A powerful MCP server for Google search that enables parallel searching with multiple keywords simultaneously." },
    { name: "joelio/stocky", description: "An MCP server for searching and downloading royalty-free stock photography from Pexels and Unsplash. Features multi-provider search, rich metadata, pagination support, and async performance for AI assistants to find and access high-quality images." },
    { name: "just-every/mcp-read-website-fast", description: "Fast, token-efficient web content extraction for AI agents - converts websites to clean Markdown while preserving links. Features Mozilla Readability, smart caching, polite crawling with robots.txt support, and concurrent fetching." },
    { name: "just-every/mcp-screenshot-website-fast", description: "Fast screenshot capture tool optimized for Claude Vision API. Automatically tiles full pages into 1072x1072 chunks for optimal AI processing with configurable viewports and wait strategies for dynamic content." },
    { name: "kagisearch/kagimcp", description: "Official Kagi Search MCP Server" },
    { name: "kehvinbehvin/json-mcp-filter", description: "Stop bloating your LLM context. Query & Extract only what you need from your JSON files." },
    { name: "kshern/mcp-tavily", description: "Tavily AI search API" },
    { name: "leehanchung/bing-search-mcp", description: "Web search capabilities using Microsoft Bing Search API" },
    { name: "lfnovo/content-core", description: "Extract content from URLs, documents, videos, and audio files using intelligent auto-engine selection. Supports web pages, PDFs, Word docs, YouTube transcripts, and more with structured JSON responses." },
    { name: "Linked-API/linkedapi-mcp", description: "MCP server that lets AI assistants control LinkedIn accounts and retrieve real-time data." },
    { name: "luminati-io/brightdata-mcp", description: "Discover, extract, and interact with the web - one interface powering automated access across the public internet." },
    { name: "mikechao/brave-search-mcp", description: "Web, Image, News, Video, and Local Point of Interest search capabilities using Brave's Search API" },
    { name: "brave/brave-search-mcp-server", description: "Web search capabilities using Brave's Search API" },
    { name: "modelcontextprotocol/server-fetch", description: "Efficient web content fetching and processing for AI consumption" },
    { name: "mzxrai/mcp-webresearch", description: "Search Google and do deep web research on any topic" },
    { name: "nickclyde/duckduckgo-mcp-server", description: "Web search using DuckDuckGo" },
    { name: "nkapila6/mcp-local-rag", description: "primitive RAG-like web search model context protocol (MCP) server that runs locally. No APIs needed." },
    { name: "nyxn-ai/NyxDocs", description: "Specialized MCP server for cryptocurrency project documentation management with multi-blockchain support (Ethereum, BSC, Polygon, Solana)." },
    { name: "OctagonAI/octagon-deep-research-mcp", description: "Lightning-Fast, High-Accuracy Deep Research Agent" },
    { name: "parallel-web/search-mcp", description: "Highest Accuracy Web Search for AI" },
    { name: "parallel-web/task-mcp", description: "Highest Accuracy Deep Research and Batch Tasks MCP" },
    { name: "pragmar/mcp-server-webcrawl", description: "Advanced search and retrieval for web crawler data. Supports WARC, wget, Katana, SiteOne, and InterroBot crawlers." },
    { name: "QuentinCody/catalysishub-mcp-server", description: "Unofficial MCP server for searching and retrieving scientific data from the Catalysis Hub database, providing access to computational catalysis research and surface reaction data." },
    { name: "r-huijts/opentk-mcp", description: "Access Dutch Parliament (Tweede Kamer) information including documents, debates, activities, and legislative cases through structured search capabilities (based on opentk project by Bert Hubert)" },
    { name: "reading-plus-ai/mcp-server-deep-research", description: "MCP server providing OpenAI/Perplexity-like autonomous deep research, structured query elaboration, and concise reporting." },
    { name: "ricocf/mcp-wolframalpha", description: "An MCP server lets AI assistants use the Wolfram Alpha API for real-time access to computational knowledge and data." },
    { name: "sascharo/gxtract", description: "GXtract is a MCP server designed to integrate with VS Code and other compatible editors (documentation: sascharo.github.io/gxtract). It provides a suite of tools for interacting with the GroundX platform, enabling you to leverage its powerful document understanding capabilities directly within your development environment." },
    { name: "scrapeless-ai/scrapeless-mcp-server", description: "The Scrapeless Model Context Protocol service acts as an MCP server connector to the Google SERP API, enabling web search within the MCP ecosystem without leaving it." },
    { name: "searchcraft-inc/searchcraft-mcp-server", description: "Official MCP server for managing Searchcraft clusters, creating a search index, generating an index dynamically given a data file and for easily importing data into a search index given a feed or local json file." },
    { name: "SecretiveShell/MCP-searxng", description: "An MCP Server to connect to searXNG instances" },
    { name: "serkan-ozal/driflyte-mcp-server", description: "The Driflyte MCP Server exposes tools that allow AI assistants to query and retrieve topic-specific knowledge from recursively crawled and indexed web pages." },
    { name: "shopsavvy/shopsavvy-mcp-server", description: "Complete product and pricing data solution for AI assistants. Search for products by barcode/ASIN/URL, access detailed product metadata, access comprehensive pricing data from thousands of retailers, view and track price history, and more." },
    { name: "takashiishida/arxiv-latex-mcp", description: "Get the LaTeX source of arXiv papers to handle mathematical content and equations" },
    { name: "the0807/GeekNews-MCP-Server", description: "An MCP Server that retrieves and processes news data from the GeekNews site." },
    { name: "tianqitang1/enrichr-mcp-server", description: "A MCP server that provides gene set enrichment analysis using the Enrichr API" },
    { name: "tinyfish-io/agentql-mcp", description: "MCP server that provides AgentQL's data extraction capabilities." },
    { name: "Tomatio13/mcp-server-tavily", description: "Tavily AI search API" },
    { name: "vectorize-io/vectorize-mcp-server", description: "Vectorize MCP server for advanced retrieval, Private Deep Research, Anything-to-Markdown file extraction and text chunking." },
    { name: "vitorpavinato/ncbi-mcp-server", description: "Comprehensive NCBI/PubMed literature search server with advanced analytics, caching, MeSH integration, related articles discovery, and batch processing for all life sciences and biomedical research." },
    { name: "kimdonghwi94/Web-Analyzer-MCP", description: "Extracts clean web content for RAG and provides Q&A about web pages." },
    { name: "webscraping-ai/webscraping-ai-mcp-server", description: "Interact with WebScraping.ai for web data extraction and scraping." },
    { name: "yamanoku/baseline-mcp-server", description: "MCP server that searches Baseline status using Web Platform API" },
    { name: "zhsama/duckduckgo-mcp-server", description: "This is a TypeScript-based MCP server that provides DuckDuckGo search functionality." },
    { name: "zoomeye-ai/mcp_zoomeye", description: "Querying network asset information by ZoomEye MCP Server" },
    { name: "Pearch-ai/mcp_pearch", description: "Best people search engine that reduces the time spent on talent discovery" },
    { name: "imprvhub/mcp-domain-availability", description: "A Model Context Protocol (MCP) server that enables Claude Desktop to check domain availability across 50+ TLDs. Features DNS/WHOIS verification, bulk checking, and smart suggestions. Zero-clone installation via uvx." },
    { name: "imprvhub/mcp-claude-hackernews", description: "An integration that allows Claude Desktop to interact with Hacker News using the Model Context Protocol (MCP)." },
    { name: "imprvhub/mcp-rss-aggregator", description: "Model Context Protocol Server for aggregating RSS feeds in Claude Desktop." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">搜索和数据提取</h1>
      <p className="mb-6">搜索和数据提取类MCP服务器</p>
      
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

export default SearchRouteComponent;