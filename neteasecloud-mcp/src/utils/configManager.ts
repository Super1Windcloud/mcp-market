import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import type { PlaylistsFile, NeteaseConfig, Platform, PlaylistEntry } from "../types/config.js";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(moduleDir, "..", "..");

const PLAYLISTS_PATH = path.join(projectRoot, "playlists.json");
const CONFIG_PATH = path.join(projectRoot, "config.json");
const NETEASE_CONFIG_PATH = path.join(projectRoot, "netease_config.json");

export function getProjectRoot(): string {
  return projectRoot;
}

export function getPlatform(): Platform {
  const system = os.platform().toLowerCase();
  if (system.startsWith("win")) {
    return "windows";
  }
  if (system === "darwin") {
    return "mac";
  }
  return "linux";
}

export function loadPlaylistsFromFile(): PlaylistsFile {
  try {
    if (!fs.existsSync(PLAYLISTS_PATH)) {
      const defaults: PlaylistsFile = {
        systemPlaylists: {
          飙升榜: { id: "19723756", name: "音乐飙升榜", description: "网易云音乐官方飙升榜" },
          新歌榜: { id: "3779629", name: "音乐新歌榜", description: "网易云音乐官方新歌榜" },
          热歌榜: { id: "3778678", name: "音乐热歌榜", description: "网易云音乐官方热歌榜" },
          排行榜: { id: "2250011882", name: "音乐排行榜", description: "网易云音乐官方排行榜" },
          原创榜: { id: "2884035", name: "原创音乐榜", description: "网易云音乐官方原创榜" },
          私人雷达: { id: "3136952023", name: "私人雷达", description: "网易云音乐个性化推荐" }
        },
        userPlaylists: {}
      };
      savePlaylistsToFile(defaults);
      return defaults;
    }

    return JSON.parse(fs.readFileSync(PLAYLISTS_PATH, "utf-8")) as PlaylistsFile;
  } catch (error) {
    console.error("Failed to load playlists:", error);
    return { systemPlaylists: {}, userPlaylists: {} };
  }
}

export function savePlaylistsToFile(data: PlaylistsFile): boolean {
  try {
    fs.writeFileSync(PLAYLISTS_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Failed to save playlists:", error);
    return false;
  }
}

export function loadCustomPlaylists(): Record<string, string> {
  try {
    const file = loadPlaylistsFromFile();
    const output: Record<string, string> = {};

    const mergeEntries = (entries?: Record<string, PlaylistEntry>) => {
      if (!entries) return;
      for (const [name, info] of Object.entries(entries)) {
        if (info?.id) {
          output[name] = info.id;
        }
      }
    };

    mergeEntries(file.systemPlaylists);
    mergeEntries(file.userPlaylists);

    if (Object.keys(output).length > 0) {
      return output;
    }

    if (fs.existsSync(CONFIG_PATH)) {
      const legacy = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8")) as {
        customPlaylists?: Record<string, string>;
      };
      return legacy.customPlaylists ?? {};
    }

    return {};
  } catch (error) {
    console.warn("Failed to load custom playlists:", error);
    return {};
  }
}

export function loadNeteaseConfig(): NeteaseConfig {
  try {
    let config: NeteaseConfig = {};

    if (fs.existsSync(NETEASE_CONFIG_PATH)) {
      config = JSON.parse(fs.readFileSync(NETEASE_CONFIG_PATH, "utf-8")) as NeteaseConfig;
    } else {
      config = {
        netease_music_path: "",
        debug_port: 9222,
        chromedriver_path: "src/chromedriver/win64/chromedriver.exe"
      };
      saveNeteaseConfig(config);
    }

    const envNetease = process.env.NETEASE_MUSIC_PATH;
    if (envNetease) {
      config.netease_music_path = envNetease;
    }

    const envChromedriver = process.env.CHROMEDRIVER_PATH;
    if (envChromedriver) {
      config.chromedriver_path = envChromedriver;
    } else if (config.chromedriver_path && !path.isAbsolute(config.chromedriver_path)) {
      config.chromedriver_path = path.join(projectRoot, config.chromedriver_path);
    }

    if (!config.chromedriver_path) {
      config.chromedriver_path = path.join(projectRoot, "src", "chromedriver", "win64", "chromedriver.exe");
    }

    return config;
  } catch (error) {
    console.error("Failed to load netease config:", error);
    return {
      netease_music_path: process.env.NETEASE_MUSIC_PATH ?? "",
      debug_port: 9222,
      chromedriver_path:
        process.env.CHROMEDRIVER_PATH ??
        path.join(projectRoot, "src", "chromedriver", "win64", "chromedriver.exe")
    };
  }
}

export function saveNeteaseConfig(config: NeteaseConfig): boolean {
  try {
    fs.writeFileSync(NETEASE_CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Failed to save netease config:", error);
    return false;
  }
}
