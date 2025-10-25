import React from 'react';

const FinanceRouteComponent: React.FC = () => {
  // MCP servers in the finance & fintech category
  const mcpServers = [
    { name: "Regenerating-World/pix-mcp", description: "Generate Pix QR codes and copy-paste strings with fallback across multiple providers (Efí, Cielo, etc.) for Brazilian instant payments." },
    { name: "aaronjmars/web3-research-mcp", description: "Deep Research for crypto - free & fully local" },
    { name: "ahnlabio/bicscan-mcp", description: "Risk score / asset holdings of EVM blockchain address (EOA, CA, ENS) and even domain names." },
    { name: "getAlby/mcp", description: "Connect any bitcoin lightning wallet to your agent to send and receive instant payments globally." },
    { name: "alchemy/alchemy-mcp-server", description: "Allow AI agents to interact with Alchemy's blockchain APIs." },
    { name: "anjor/coinmarket-mcp-server", description: "Coinmarket API integration to fetch cryptocurrency listings and quotes" },
    { name: "araa47/jupiter-mcp", description: "Jupiter API Access (allow AI to Trade Tokens on Solana + Access Balances + Search Tokens + Create Limit Orders )" },
    { name: "ariadng/metatrader-mcp-server", description: "Enable AI LLMs to execute trades using MetaTrader 5 platform" },
    { name: "armorwallet/armor-crypto-mcp", description: "MCP to interface with multiple blockchains, staking, DeFi, swap, bridging, wallet management, DCA, Limit Orders, Coin Lookup, Tracking and more." },
    { name: "bankless/onchain-mcp", description: "Bankless Onchain API to interact with smart contracts, query transaction and token information" },
    { name: "base/base-mcp", description: "Base Network integration for onchain tools, allowing interaction with Base Network and Coinbase API for wallet management, fund transfers, smart contracts, and DeFi operations" },
    { name: "berlinbra/alpha-vantage-mcp", description: "Alpha Vantage API integration to fetch both stock and crypto information" },
    { name: "bitteprotocol/mcp", description: "Bitte Protocol integration to run AI Agents on several blockchains." },
    { name: "carsol/monarch-mcp-server", description: "MCP server providing read-only access to Monarch Money financial data, enabling AI assistants to analyze transactions, budgets, accounts, and cashflow data with MFA support." },
    { name: "chargebee/mcp", description: "MCP Server that connects AI agents to Chargebee platform." },
    { name: "codex-data/codex-mcp", description: "Codex API integration for real-time enriched blockchain and market data on 60+ networks" },
    { name: "coinpaprika/dexpaprika-mcp", description: "Coinpaprika's DexPaprika MCP server exposes high-performance DexPaprika API covering 20+ chains and 5M+ tokens with real time pricing, liquidity pool data & historical OHLCV data, providing AI agents standardized access to comprehensive market data through Model Context Protocol." },
    { name: "doggybee/mcp-server-ccxt", description: "An MCP server for accessing real-time crypto market data and trading via 20+ exchanges using the CCXT library. Supports spot, futures, OHLCV, balances, orders, and more." },
    { name: "ferdousbhai/investor-agent", description: "Yahoo Finance integration to fetch stock market data including options recommendations" },
    { name: "ferdousbhai/tasty-agent", description: "Tastyworks API integration to handle trading activities on Tastytrade" },
    { name: "ferdousbhai/wsb-analyst-mcp", description: "Reddit integration to analyze content on WallStreetBets community" },
    { name: "getalby/nwc-mcp-server", description: "Bitcoin Lightning wallet integration powered by Nostr Wallet Connect" },
    { name: "glaksmono/finbud-data-mcp", description: "Access comprehensive, real-time financial data (stocks, options, crypto, forex) via developer-friendly, AI-native APIs offering unbeatable value." },
    { name: "heurist-network/heurist-mesh-mcp-server", description: "Access specialized web3 AI agents for blockchain analysis, smart contract security auditing, token metrics evaluation, and on-chain interactions through the Heurist Mesh network. Provides comprehensive tools for DeFi analysis, NFT valuation, and transaction monitoring across multiple blockchains" },
    { name: "HuggingAGI/mcp-baostock-server", description: "MCP server based on baostock, providing access and analysis capabilities for Chinese stock market data." },
    { name: "intentos-labs/beeper-mcp", description: "Beeper provides transactions on BSC, including balance/token transfers, token swaps in Pancakeswap and beeper reward claims." },
    { name: "janswist/mcp-dexscreener", description: "Real-time on-chain market prices using open and free Dexscreener API" },
    { name: "jjlabsio/korea-stock-mcp", description: "An MCP Server for Korean stock analysis using OPEN DART API and KRX API" },
    { name: "kukapay/binance-alpha-mcp", description: "An MCP server for tracking Binance Alpha trades, helping AI agents optimize alpha point accumulation." },
    { name: "kukapay/blockbeats-mcp", description: "An MCP server that delivers blockchain news and in-depth articles from BlockBeats for AI agents." },
    { name: "kukapay/blocknative-mcp", description: "Providing real-time gas price predictions across multiple blockchains, powered by Blocknative." },
    { name: "kukapay/bridge-rates-mcp", description: "Delivering real-time cross-chain bridge rates and optimal transfer routes to onchain AI agents." },
    { name: "kukapay/chainlink-feeds-mcp", description: "Providing real-time access to Chainlink's decentralized on-chain price feeds." },
    { name: "kukapay/chainlist-mcp", description: "An MCP server that gives AI agents fast access to verified EVM chain information, including RPC URLs, chain IDs, explorers, and native tokens." },
    { name: "kukapay/cointelegraph-mcp", description: "Providing real-time access to the latest news from Cointelegraph." },
    { name: "kukapay/crypto-feargreed-mcp", description: "Providing real-time and historical Crypto Fear & Greed Index data." },
    { name: "kukapay/crypto-indicators-mcp", description: "An MCP server providing a range of cryptocurrency technical analysis indicators and strategie." },
    { name: "kukapay/crypto-liquidations-mcp", description: "Streams real-time cryptocurrency liquidation events from Binance." },
    { name: "kukapay/crypto-news-mcp", description: "An MCP server that provides real-time cryptocurrency news sourced from NewsData for AI agents." },
    { name: "kukapay/crypto-orderbook-mcp", description: "Analyzing order book depth and imbalance across major crypto exchanges." },
    { name: "kukapay/crypto-pegmon-mcp", description: "Tracking stablecoin peg integrity across multiple blockchains." },
    { name: "kukapay/crypto-portfolio-mcp", description: "An MCP server for tracking and managing cryptocurrency portfolio allocations." },
    { name: "kukapay/crypto-projects-mcp", description: "Providing cryptocurrency project data from Mobula.io to AI agents." },
    { name: "kukapay/crypto-rss-mcp", description: "An MCP server that aggregates real-time cryptocurrency news from multiple RSS feeds." },
    { name: "kukapay/crypto-sentiment-mcp", description: "An MCP server that delivers cryptocurrency sentiment analysis to AI agents." },
    { name: "kukapay/crypto-trending-mcp", description: "Tracking the latest trending tokens on CoinGecko." },
    { name: "kukapay/crypto-whitepapers-mcp", description: "Serving as a structured knowledge base of crypto whitepapers." },
    { name: "kukapay/cryptopanic-mcp-server", description: "Providing latest cryptocurrency news to AI agents, powered by CryptoPanic." },
    { name: "kukapay/dao-proposals-mcp", description: "An MCP server that aggregates live governance proposals from major DAOs." },
    { name: "kukapay/defi-yields-mcp", description: "An MCP server for AI agents to explore DeFi yield opportunities." },
    { name: "kukapay/dune-analytics-mcp", description: "A mcp server that bridges Dune Analytics data to AI agents." },
    { name: "kukapay/etf-flow-mcp", description: "Delivering crypto ETF flow data to power AI agents' decision-making." },
    { name: "kukapay/freqtrade-mcp", description: "An MCP server that integrates with the Freqtrade cryptocurrency trading bot." },
    { name: "kukapay/funding-rates-mcp", description: "Providing real-time funding rate data across major crypto exchanges." },
    { name: "kukapay/hyperliquid-info-mcp", description: "An MCP server that provides real-time data and insights from the Hyperliquid perp DEX for use in bots, dashboards, and analytics." },
    { name: "kukapay/hyperliquid-whalealert-mcp", description: "An MCP server that provides real-time whale alerts on Hyperliquid, flagging positions with a notional value exceeding $1 million." },
    { name: "kukapay/jupiter-mcp", description: "An MCP server for executing token swaps on the Solana blockchain using Jupiter's new Ultra API." },
    { name: "kukapay/pancakeswap-poolspy-mcp", description: "An MCP server that tracks newly created pools on Pancake Swap." },
    { name: "kukapay/pumpswap-mcp", description: "Enabling AI agents to interact with PumpSwap for real-time token swaps and automated on-chain trading." },
    { name: "kukapay/raydium-launchlab-mcp", description: "An MCP server that enables AI agents to launch, buy, and sell tokens on the Raydium Launchpad(aka LaunchLab)." },
    { name: "kukapay/rug-check-mcp", description: "An MCP server that detects potential risks in Solana meme tokens." },
    { name: "kukapay/sui-trader-mcp", description: "An MCP server designed for AI agents to perform optimal token swaps on the Sui blockchain." },
    { name: "kukapay/thegraph-mcp", description: "An MCP server that powers AI agents with indexed blockchain data from The Graph." },
    { name: "kukapay/token-minter-mcp", description: "An MCP server providing tools for AI agents to mint ERC-20 tokens across multiple blockchains." },
    { name: "kukapay/token-revoke-mcp", description: "An MCP server for checking and revoking ERC-20 token allowances across multiple blockchains." },
    { name: "kukapay/twitter-username-changes-mcp", description: "An MCP server that tracks the historical changes of Twitter usernames." },
    { name: "kukapay/uniswap-poolspy-mcp", description: "An MCP server that tracks newly created liquidity pools on Uniswap across multiple blockchains." },
    { name: "kukapay/uniswap-price-mcp", description: "An MCP server that tracks newly created liquidity pools on Uniswap across multiple blockchains." },
    { name: "kukapay/uniswap-trader-mcp", description: "An MCP server that delivers real-time token prices from Uniswap V3 across multiple chains." },
    { name: "kukapay/wallet-inspector-mcp", description: "An MCP server that empowers AI agents to inspect any wallet’s balance and onchain activity across major EVM chains and Solana chain." },
    { name: "kukapay/web3-jobs-mcp", description: "An MCP server that provides AI agents with real-time access to curated Web3 jobs." },
    { name: "kukapay/whale-tracker-mcp", description: "A mcp server for tracking cryptocurrency whale transactions." },
    { name: "laukikk/alpaca-mcp", description: "An MCP Server for the Alpaca trading API to manage stock and crypto portfolios, place trades, and access market data." },
    { name: "logotype/fixparser", description: "FIX Protocol (send orders, market data, etc.) written in TypeScript." },
    { name: "longportapp/openapi", description: "LongPort OpenAPI provides real-time stock market data, provides AI access analysis and trading capabilities through MCP." },
    { name: "mcpdotdirect/evm-mcp-server", description: "Comprehensive blockchain services for 30+ EVM networks, supporting native tokens, ERC20, NFTs, smart contracts, transactions, and ENS resolution." },
    { name: "mcpdotdirect/starknet-mcp-server", description: "Comprehensive Starknet blockchain integration with support for native tokens (ETH, STRK), smart contracts, StarknetID resolution, and token transfers." },
    { name: "minhyeoky/mcp-server-ledger", description: "A ledger-cli integration for managing financial transactions and generating reports." },
    { name: "narumiruna/yfinance-mcp", description: "An MCP server that uses yfinance to obtain information from Yahoo Finance." },
    { name: "OctagonAI/octagon-mcp-server", description: "Octagon AI Agents to integrate private and public market data" },
    { name: "openMF/mcp-mifosx", description: "A core banking integration for managing clients, loans, savings, shares, financial transactions and generating financial reports." },
    { name: "polygon-io/mcp_polygon", description: "An MCP server that provides access to Polygon.io financial market data APIs for stocks, indices, forex, options, and more." },
    { name: "pwh-pwh/coin-mcp-server", description: "Bitget API to fetch cryptocurrency price." },
    { name: "QuantConnect/mcp-server", description: "A Dockerized Python MCP server that bridges your local AI (e.g., Claude Desktop, etc) with the QuantConnect API—empowering you to create projects, backtest strategies, manage collaborators, and deploy live-trading workflows directly via natural-language prompts." },
    { name: "QuantGeekDev/coincap-mcp", description: "Real-time cryptocurrency market data integration using CoinCap's public API, providing access to crypto prices and market information without API keys" },
    { name: "QuentinCody/braintree-mcp-server", description: "Unofficial PayPal Braintree payment gateway MCP Server for AI agents to process payments, manage customers, and handle transactions securely." },
    { name: "RomThpt/xrpl-mcp-server", description: "MCP server for the XRP Ledger that provides access to account information, transaction history, and network data. Allows querying ledger objects, submitting transactions, and monitoring the XRPL network." },
    { name: "SaintDoresh/Crypto-Trader-MCP-ClaudeDesktop", description: "An MCP tool that provides cryptocurrency market data using the CoinGecko API." },
    { name: "SaintDoresh/YFinance-Trader-MCP-ClaudeDesktop", description: "An MCP tool that provides stock market data and analysis using the Yahoo Finance API." },
    { name: "shareseer/shareseer-mcp-server", description: "MCP to Access SEC filings, financials & insider trading data in real time using ShareSeer" },
    { name: "tatumio/blockchain-mcp", description: "MCP server for Blockchain Data. It provides access to Tatum's blockchain API across 130+ networks with tools including RPC Gateway and Blockchain Data insights." },
    { name: "ThomasMarches/substrate-mcp-rs", description: "An MCP server implementation to interact with Substrate-based blockchains. Built with Rust and interfacing the subxt crate." },
    { name: "tooyipjee/yahoofinance-mcp", description: "TS version of yahoo finance mcp." },
    { name: "Trade-Agent/trade-agent-mcp", description: "Trade stocks and crypto on common brokerages (Robinhood, E*Trade, Coinbase, Kraken) via Trade Agent's MCP server." },
    { name: "twelvedata/mcp", description: "Interact with Twelve Data APIs to access real-time and historical financial market data for your AI agents." },
    { name: "wowinter13/solscan-mcp", description: "An MCP tool for querying Solana transactions using natural language with Solscan API." },
    { name: "Wuye-AI/mcp-server-wuye-ai", description: "An MCP server that interact with capabilities of the CRIC Wuye AI platform, an intelligent assistant specifically for the property management industry." },
    { name: "XeroAPI/xero-mcp-server", description: "An MCP server that integrates with Xero's API, allowing for standardized access to Xero's accounting and business features." },
    { name: "zlinzzzz/finData-mcp-server", description: "An MCP server for accessing professional financial data, supporting multiple data providers such as Tushare." },
    { name: "zolo-ryan/MarketAuxMcpServer", description: "MCP server for comprehensive market and financial news search with advanced filtering by symbols, industries, countries, and date ranges." },
    { name: "JamesANZ/evm-mcp", description: "An MCP server that provides complete access to Ethereum Virtual Machine (EVM) JSON-RPC methods. Works with any EVM-compatible node provider including Infura, Alchemy, QuickNode, local nodes, and more." },
    { name: "JamesANZ/prediction-market-mcp", description: "An MCP server that provides real-time prediction market data from multiple platforms including Polymarket, PredictIt, and Kalshi. Enables AI assistants to query current odds, prices, and market information through a unified interface." },
    { name: "JamesANZ/bitcoin-mcp", description: "An MCP server that enables AI models to query the Bitcoin blockchain." },
    { name: "hive-intel/hive-crypto-mcp", description: "Hive Intelligence: Ultimate cryptocurrency MCP for AI assistants with unified access to crypto, DeFi, and Web3 analytics" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">金融与金融科技</h1>
      <p className="mb-6">金融与金融科技类MCP服务器</p>
      
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

export default FinanceRouteComponent;