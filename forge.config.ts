import path from "path";
import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
// import { MakerWix } from "@electron-forge/maker-wix";
import MakerDMG from "@electron-forge/maker-dmg";
import MakerPKG from "@electron-forge/maker-pkg";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: path.resolve(__dirname, "public", "icon.jpg"),
    extraResource: ["public", ".env", "node_modules/velopack/bin"],
    osxSign: {},
    osxNotarize: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      tool: "notarytool",
      appleId: process.env.APPLE_ID || "",
      appleIdPassword: process.env.APPLE_PASSWORD || "",
      teamId: process.env.APPLE_TEAM_ID || " ",
    },
  },

  rebuildConfig: {},

  publishAutoUpdate: true,

  makers: [
    new MakerZIP({}, ["darwin"]),
    new MakerDMG({}),
    new MakerPKG({}),
    new MakerRpm({}),
    new MakerDeb({}),
    // new MakerWix({
    //   name: "MCP Market",
    //   description: "An Electron + Vite App using WSI installer",
    //   manufacturer: "Superwindcloud",
    //   version: "1.0.0",
    //   exe: "mcp-market",
    //   shortcutName: "MCP Market",
    //   defaultInstallMode: "perUser",
    //   shortName: "mcp-market",
    //   icon: path.resolve(__dirname, "public", "icon.ico"),
    //   ui: {
    //     chooseDirectory: true,
    //   },

    // }),
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "Super1WindCloud",
          name: "mcp-market",
        },
        draft: false,
        prerelease: false,
      },
    },
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
    new AutoUnpackNativesPlugin({}),
  ],
};

export default config;
