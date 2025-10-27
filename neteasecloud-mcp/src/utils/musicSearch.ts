interface SongSearchResponse {
  code?: number;
  result?: {
    songs?: Array<{
      id: number;
      name: string;
      artists?: Array<{ name: string }>;
    }>;
  };
}

interface PlaylistSearchResponse {
  code?: number;
  result?: {
    playlists?: Array<{
      id: number;
      name: string;
    }>;
  };
}

export interface SongSearchResult {
  songId: number | null;
  songName: string | null;
  artistName: string | null;
}

export interface PlaylistSearchResult {
  playlistId: string | null;
  playlistName: string | null;
}

const BASE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36",
  Referer: "http://music.163.com/"
};

const SEARCH_ENDPOINT = "http://music.163.com/api/search/get/web";

async function parseJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch (error) {
    console.error("Failed to parse response:", error);
    return null;
  }
}

export async function searchNeteaseMusic(songName: string): Promise<SongSearchResult> {
  try {
    const params = new URLSearchParams({
      csrf_token: "",
      hlpretag: "",
      hlposttag: "",
      s: songName,
      type: "1",
      offset: "0",
      total: "true",
      limit: "1"
    });

    const response = await fetch(`${SEARCH_ENDPOINT}?${params.toString()}`, {
      headers: BASE_HEADERS,
      method: "GET"
    });

    if (!response.ok) {
      console.error("Search request failed:", response.status, response.statusText);
      return { songId: null, songName: null, artistName: null };
    }

    const data = await parseJson<SongSearchResponse>(response);
    if (!data || data.code !== 200) {
      console.error("Unexpected response:", data);
      return { songId: null, songName: null, artistName: null };
    }

    const song = data.result?.songs?.[0];
    if (!song) {
      return { songId: null, songName: null, artistName: null };
    }

    return {
      songId: song.id,
      songName: song.name,
      artistName: song.artists?.[0]?.name ?? "未知艺术家"
    };
  } catch (error) {
    console.error("Failed to search music:", error);
    return { songId: null, songName: null, artistName: null };
  }
}

export async function searchNeteasePlaylist(playlistName: string): Promise<PlaylistSearchResult> {
  try {
    const params = new URLSearchParams({
      csrf_token: "",
      hlpretag: "",
      hlposttag: "",
      s: playlistName,
      type: "1000",
      offset: "0",
      total: "true",
      limit: "1"
    });

    const response = await fetch(`${SEARCH_ENDPOINT}?${params.toString()}`, {
      headers: BASE_HEADERS,
      method: "GET"
    });

    if (!response.ok) {
      console.error("Playlist search failed:", response.status, response.statusText);
      return { playlistId: null, playlistName: null };
    }

    const data = await parseJson<PlaylistSearchResponse>(response);
    if (!data || data.code !== 200) {
      console.error("Unexpected playlist response:", data);
      return { playlistId: null, playlistName: null };
    }

    const playlist = data.result?.playlists?.[0];
    if (!playlist) {
      return { playlistId: null, playlistName: null };
    }

    return {
      playlistId: String(playlist.id),
      playlistName: playlist.name
    };
  } catch (error) {
    console.error("Failed to search playlist:", error);
    return { playlistId: null, playlistName: null };
  }
}

export function generatePlayUrl(songId: number): string | null {
  try {
    const payload = {
      type: "song",
      id: String(songId),
      cmd: "play"
    };
    const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    return `orpheus://${base64}`;
  } catch (error) {
    console.error("Failed to generate play url:", error);
    return null;
  }
}

export function generatePlaylistPlayUrl(playlistId: string): string | null {
  try {
    const payload = {
      type: "playlist",
      id: playlistId,
      cmd: "play"
    };
    const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    return `orpheus://${base64}`;
  } catch (error) {
    console.error("Failed to generate playlist url:", error);
    return null;
  }
}
