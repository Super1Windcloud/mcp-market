import { spawn } from "node:child_process";
import os from "node:os";
export class NeteaseMusicController {
  public readonly urlSchemes: Record<string, string>;

  constructor() {
    this.urlSchemes = {
      open: "orpheus://",
      song: "orpheus://song/{song_id}",
      playlist: "orpheus://playlist/{playlist_id}",
      artist: "orpheus://artist/{artist_id}",
      radio: "orpheus://radio",
      recognize: "orpheuswidget://recognize",
      downloads: "orpheuswidget://download"
    };
  }

  async launchByUrlScheme(schemeUrl: string, minimizeWindow = false): Promise<boolean> {
    try {
      const platform = os.platform();
      if (platform.startsWith("win")) {
        spawn("cmd", ["/c", "start", "", schemeUrl], {
          windowsHide: true,
          detached: false
        });
      } else if (platform === "darwin") {
        spawn("open", [schemeUrl], { detached: false });
      } else {
        spawn("xdg-open", [schemeUrl], { detached: false });
      }

      if (minimizeWindow) {
        console.warn("[neteaseController] Window minimization is disabled (node-window-manager removed).");
      }

      return true;
    } catch (error) {
      console.error("Failed to launch via URL scheme:", error);
      return false;
    }
  }

  isWindowControlAvailable(): boolean {
    return false;
  }
}
