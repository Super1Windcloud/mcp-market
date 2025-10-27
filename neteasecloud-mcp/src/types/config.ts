export type Platform = "windows" | "mac" | "linux";

export interface PlaylistEntry {
  id: string;
  name: string;
  description?: string;
}

export interface PlaylistsFile {
  systemPlaylists?: Record<string, PlaylistEntry>;
  userPlaylists?: Record<string, PlaylistEntry>;
}

export interface NeteaseConfig {
  netease_music_path?: string;
  debug_port?: number;
  chromedriver_path?: string;
  description?: string;
  notes?: Record<string, string>;
}

export interface LaunchResult {
  success: boolean;
  message?: string;
  data?: Record<string, unknown>;
  error?: string;
}
