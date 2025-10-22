import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import { MakerWix } from "@electron-forge/maker-wix";
import MakerSquirrel from "@electron-forge/maker-squirrel";
import MakerDMG from "@electron-forge/maker-dmg";
import MakerPKG from "@electron-forge/maker-pkg";

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: "src/assets/icon", // This will look for icon.ico on Windows, icon.icns on macOS, and icon.png on Linux
    extraResource: ["public"],
  },

  rebuildConfig: {},

  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ["darwin"]),
    new MakerDMG({}),
    new MakerPKG({}),
    new MakerRpm({}),
    new MakerDeb({}),
    new MakerWix({
      name: "MCP Market",
      description: "An Electron + Vite App using WSI installer",
      manufacturer: "Superwindcloud",
      version: "1.0.0",
      exe: "mcp-market",
      shortcutName: "MCP Market",
      defaultInstallMode: "perUser",
      shortName: "mcp-market",
      ui: {
        chooseDirectory: true,
      },

    }),
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: "src/main.ts",
          config: "vite.main.config.mts",
          target: "main",
        },
        {
          entry: "src/preload.ts",
          config: "vite.preload.config.mts",
          target: "preload",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.mts",
        },
      ],
    }),

    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
