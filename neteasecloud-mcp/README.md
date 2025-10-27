NetEase Cloud Music MCP (TypeScript)
==================================

This directory contains a TypeScript re-implementation of the original
`CloudMusic_Auto_Player` MCP server. It exposes the same tool surface (13
tools) via the Model Context Protocol, but is built on Node.js and reuses
the configuration JSON files from the Python project.

Project Layout
--------------

- `src/server.ts` — MCP server entry point built with the official
  `fastmcp` TypeScript framework (stdio transport).
- `src/controllers/neteaseController.ts` — URL scheme launching and client
  window helpers.
- `src/controllers/dailyController.ts` — Selenium workflow for daily
  recommendations / private roaming, ported from the Python logic.
- `src/utils/configManager.ts` / `src/utils/musicSearch.ts` — configuration
  IO helpers and NetEase search utilities.
- Shared JSON configuration files (`netease_config.json`, `playlists.json`)
  mirror the Python project.

Getting Started
---------------

```
cd neteasecloud-mcp
npm install
npm run build          # optional compile check
npm start              # runs the MCP server over stdio
```

Environment Variables
---------------------

- `NETEASE_MUSIC_PATH` — Full path to `cloudmusic.exe`. Required for the
  Selenium tools and overrides `netease_config.json`.
- `CHROMEDRIVER_PATH` — Optional override for ChromeDriver location.

Feature Notes
-------------

- Global hotkey tooling has been removed; playback control now relies on
  URL scheme launches only.
- Window minimisation support has been removed; tools still launch NetEase
  but they no longer attempt to minimise the client window automatically.
- Selenium automation requires ChromeDriver compatible with the local Chrome
  build. The logic mirrors `DailyRecommendController` from the Python
  project, including the fixed XPath strategies.

Legacy Python Reference
-----------------------

The original Python sources are kept under
`neteasecloud-mcp/CloudMusic_Auto_Player` for comparison and future parity
checks.
