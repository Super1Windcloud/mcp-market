import { FastMCP, type ContentResult } from "fastmcp";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import {
  getPlatform,
  loadPlaylistsFromFile,
  loadCustomPlaylists,
  savePlaylistsToFile,
  loadNeteaseConfig,
  getProjectRoot
} from "./utils/configManager.js";
import { NeteaseMusicController } from "./controllers/neteaseController.js";
import { DailyRecommendController, SELENIUM_AVAILABLE } from "./controllers/dailyController.js";
import {
  searchNeteaseMusic,
  searchNeteasePlaylist,
  generatePlayUrl,
  generatePlaylistPlayUrl
} from "./utils/musicSearch.js";

type OptionalSchema = z.ZodTypeAny | undefined;
type HandlerInput<S extends OptionalSchema> = S extends z.ZodTypeAny ? z.infer<S> : undefined;
type HandlerOutput = string | ContentResult | Record<string, unknown>;

const server = new FastMCP({
  name: "NetEase Cloud Music Controller",
  version: "0.1.0"
});

const musicController = new NeteaseMusicController();
let dailyController: DailyRecommendController | null = null;

const asContentResult = (payload: unknown): ContentResult => {
  const isError =
    typeof payload === "object" &&
    payload !== null &&
    "success" in payload &&
    (payload as Record<string, unknown>).success === false;

  const text =
    typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);

  return {
    content: [
      {
        type: "text",
        text
      }
    ],
    isError
  };
};

function registerTool<S extends OptionalSchema>(
  name: string,
  options: { description: string; schema?: S },
  handler: (input: HandlerInput<S>) => Promise<HandlerOutput>
) {
  server.addTool({
    name,
    description: options.description,
    parameters: options.schema,
    execute: async (rawInput) => {
      const typedInput =
        (options.schema ? (rawInput as HandlerInput<S>) : (undefined as HandlerInput<S>)) ??
        (undefined as HandlerInput<S>);

      const result = await handler(typedInput);

      if (typeof result === "string") {
        return result;
      }

      if (result && typeof result === "object" && "content" in result) {
        return result as ContentResult;
      }

      return asContentResult(result);
    }
  });
}

registerTool(
  "launch_netease_music",
  {
    description: "Launch NetEase Cloud Music using URL scheme",
    schema: z
      .object({
        minimize_window: z.coerce.boolean().optional().default(true)
      })
      .optional()
  },
  async (input) => {
    const minimize = input?.minimize_window ?? true;
    const schemeUrl = musicController.urlSchemes.open;
    const success = await musicController.launchByUrlScheme(schemeUrl, minimize);

    return success
      ? {
          success: true,
          data: {
            scheme_url: schemeUrl,
            minimized: minimize,
            platform: getPlatform()
          },
          message: "✅ 网易云音乐启动成功"
        }
      : {
          success: false,
          error: "网易云音乐启动失败"
        };
  }
);

registerTool(
  "manage_custom_playlists",
  {
    description: "List, add, or remove custom NetEase playlists",
    schema: z.object({
      action: z.enum(["list", "add", "remove"]).default("list"),
      playlist_name: z.string().optional().default(""),
      playlist_id: z.string().optional().default(""),
      description: z.string().optional().default("")
    })
  },
  async (input) => {
    const playlistsData = loadPlaylistsFromFile();

    switch (input.action) {
      case "list": {
        const systemPlaylists = playlistsData.systemPlaylists ?? {};
        const userPlaylists = playlistsData.userPlaylists ?? {};
        return {
          success: true,
          data: {
            system_playlists: systemPlaylists,
            user_playlists: userPlaylists,
            total_system: Object.keys(systemPlaylists).length,
            total_user: Object.keys(userPlaylists).length,
            total_count: Object.keys(systemPlaylists).length + Object.keys(userPlaylists).length,
            source: "playlists_file",
            platform: getPlatform()
          },
          message: `✅ 系统歌单 ${Object.keys(systemPlaylists).length} 个，用户歌单 ${Object.keys(userPlaylists).length} 个`
        };
      }
      case "add": {
        if (!input.playlist_name || !input.playlist_id) {
          return {
            success: false,
            error: "添加歌单需要提供歌单名称和歌单ID"
          };
        }

        if (playlistsData.systemPlaylists?.[input.playlist_name]) {
          return {
            success: false,
            error: `歌单名称 '${input.playlist_name}' 与系统预设歌单重名，请使用其他名称`
          };
        }

        const userPlaylists = playlistsData.userPlaylists ?? {};
        userPlaylists[input.playlist_name] = {
          id: input.playlist_id,
          name: input.playlist_name,
          description:
            input.description && input.description.length > 0
              ? input.description
              : `用户自定义歌单: ${input.playlist_name}`
        };
        playlistsData.userPlaylists = userPlaylists;

        const saved = savePlaylistsToFile(playlistsData);
        return saved
          ? {
              success: true,
              data: {
                playlist_name: input.playlist_name,
                playlist_id: input.playlist_id,
                description: input.description,
                storage: "playlists_file",
                platform: getPlatform()
              },
              message: `✅ 成功添加用户歌单: ${input.playlist_name} (ID: ${input.playlist_id})`
            }
          : { success: false, error: "保存歌单配置失败" };
      }
      case "remove": {
        if (!input.playlist_name) {
          return {
            success: false,
            error: "删除歌单需要提供歌单名称"
          };
        }

        if (playlistsData.systemPlaylists?.[input.playlist_name]) {
          return {
            success: false,
            error: `不能删除系统预设歌单: ${input.playlist_name}`
          };
        }

        const userPlaylists = playlistsData.userPlaylists ?? {};
        if (!userPlaylists[input.playlist_name]) {
          return {
            success: false,
            error: `未找到用户歌单: ${input.playlist_name}`
          };
        }

        const removedId = userPlaylists[input.playlist_name].id;
        delete userPlaylists[input.playlist_name];
        playlistsData.userPlaylists = userPlaylists;

        const saved = savePlaylistsToFile(playlistsData);
        return saved
          ? {
              success: true,
              data: {
                playlist_name: input.playlist_name,
                playlist_id: removedId,
                storage: "playlists_file",
                platform: getPlatform()
              },
              message: `✅ 成功删除用户歌单: ${input.playlist_name} (ID: ${removedId})`
            }
          : { success: false, error: "保存歌单配置失败" };
      }
      default:
        return {
          success: false,
          error: `不支持的操作: ${input.action}，支持的值: list, add, remove`
        };
    }
  }
);

registerTool(
  "get_controller_info",
  {
    description: "Retrieve NetEase controller capability info"
  },
  async () => {
    const customPlaylists = loadCustomPlaylists();
    return {
      success: true,
      data: {
        server_name: "网易云音乐控制器",
        platform: getPlatform(),
        window_control_available: musicController.isWindowControlAvailable(),
        selenium_available: SELENIUM_AVAILABLE,
        url_schemes: Object.keys(musicController.urlSchemes),
        custom_playlists: customPlaylists,
        custom_playlists_count: Object.keys(customPlaylists).length
      },
      message: "✅ 控制器信息获取成功"
    };
  }
);

registerTool(
  "search_and_play",
  {
    description: "Search a NetEase song and play it immediately",
    schema: z.object({
      query: z.string(),
      minimize_window: z.coerce.boolean().optional().default(true)
    })
  },
  async (input) => {
    const searchResult = await searchNeteaseMusic(input.query);
    if (!searchResult.songId) {
      return {
        success: false,
        error: `未找到歌曲: ${input.query}`
      };
    }

    const playUrl = generatePlayUrl(searchResult.songId);
    if (!playUrl) {
      return {
        success: false,
        error: "生成播放URL失败"
      };
    }

    const success = await musicController.launchByUrlScheme(playUrl, input.minimize_window);
    return success
      ? {
          success: true,
          data: {
            query: input.query,
            song_name: searchResult.songName,
            artist: searchResult.artistName,
            song_id: searchResult.songId,
            play_url: playUrl,
            minimized: input.minimize_window,
            platform: getPlatform()
          },
          message: `✅ 成功播放: 《${searchResult.songName}》- ${searchResult.artistName}`
        }
      : {
          success: false,
          error: `播放失败: 《${searchResult.songName}》- ${searchResult.artistName}`
        };
  }
);

registerTool(
  "search_and_play_playlist",
  {
    description: "Search a playlist or use preconfigured playlists and play immediately",
    schema: z.object({
      query: z.string().optional().default(""),
      playlist_name: z.string().optional().default(""),
      minimize_window: z.coerce.boolean().optional().default(true)
    })
  },
  async (input) => {
    const allPlaylists = loadCustomPlaylists();

    let playlistId: string | null = null;
    let playlistName: string | null = null;

    if (input.playlist_name && allPlaylists[input.playlist_name]) {
      playlistId = allPlaylists[input.playlist_name];
      playlistName = input.playlist_name;
    } else if (input.query) {
      const searchResult = await searchNeteasePlaylist(input.query);
      playlistId = searchResult.playlistId;
      playlistName = searchResult.playlistName;
    } else {
      return {
        success: false,
        error: "请提供搜索关键词(query)或常用歌单名称(playlist_name)"
      };
    }

    if (!playlistId || !playlistName) {
      return {
        success: false,
        error: `未找到歌单: ${input.query || input.playlist_name}`
      };
    }

    const playUrl = generatePlaylistPlayUrl(playlistId);
    if (!playUrl) {
      return {
        success: false,
        error: "生成歌单播放URL失败"
      };
    }

    const success = await musicController.launchByUrlScheme(playUrl, input.minimize_window);
    return success
      ? {
          success: true,
          data: {
            query: input.query || input.playlist_name,
            playlist_name: playlistName,
            playlist_id: playlistId,
            play_url: playUrl,
            minimized: input.minimize_window,
            platform: getPlatform()
          },
          message: `✅ 成功播放歌单: 《${playlistName}》`
        }
      : {
          success: false,
          error: `播放歌单失败: 《${playlistName}》`
        };
  }
);

registerTool(
  "get_netease_config",
  {
    description: "Inspect NetEase client and ChromeDriver configuration"
  },
  async () => {
    try {
      const config = loadNeteaseConfig();
      const neteasePath = config.netease_music_path ?? "";
      const pathStatus = neteasePath
        ? fs.existsSync(neteasePath)
          ? "✅ 有效"
          : "❌ 无效"
        : "未配置";

      const chromedriverPath = config.chromedriver_path ?? "src/chromedriver/win64/chromedriver.exe";
      const resolvedChromedriver = path.isAbsolute(chromedriverPath)
        ? chromedriverPath
        : path.join(getProjectRoot(), chromedriverPath);
      const chromedriverStatus = fs.existsSync(resolvedChromedriver) ? "✅ 存在" : "❌ 不存在";

      return {
        success: true,
        config: {
          netease_music_path: neteasePath || "未配置",
          path_status: pathStatus,
          debug_port: config.debug_port ?? 9222,
          chromedriver_path: chromedriverPath,
          chromedriver_status: chromedriverStatus,
          selenium_available: SELENIUM_AVAILABLE,
          platform: getPlatform()
        },
        ready_for_daily_recommend:
          Boolean(neteasePath && fs.existsSync(neteasePath) && fs.existsSync(resolvedChromedriver)) &&
          SELENIUM_AVAILABLE
      };
    } catch (error) {
      return {
        success: false,
        message: `获取配置失败: ${(error as Error).message}`
      };
    }
  }
);

async function ensureDailyController(): Promise<DailyRecommendController> {
  if (!dailyController) {
    dailyController = new DailyRecommendController(loadNeteaseConfig());
  }
  return dailyController;
}

registerTool(
  "play_daily_recommend",
  {
    description: "Use Selenium automation to launch the NetEase daily recommendation playlist"
  },
  async () => {
    if (!SELENIUM_AVAILABLE) {
      return {
        success: false,
        message: "Selenium不可用",
        solution: "请安装selenium-webdriver依赖并配置ChromeDriver"
      };
    }

    const config = loadNeteaseConfig();
    const neteasePath = config.netease_music_path ?? "";
    if (!neteasePath) {
      return {
        success: false,
        message: "网易云音乐路径未配置",
        solution: "请设置环境变量 NETEASE_MUSIC_PATH 或在 netease_config.json 中配置 netease_music_path"
      };
    }

    if (!fs.existsSync(neteasePath)) {
      return {
        success: false,
        message: `网易云音乐路径无效: ${neteasePath}`,
        solution: "请重新设置环境变量 NETEASE_MUSIC_PATH 或在 netease_config.json 中配置正确的路径"
      };
    }

    const controller = await ensureDailyController();

    if (!(await controller.connectToNetease())) {
      return {
        success: false,
        message: "无法连接到网易云音乐",
        details: [
          "可能的原因:",
          "1. 网易云音乐启动失败",
          "2. ChromeDriver连接失败",
          "3. 调试端口被占用"
        ]
      };
    }

    const buttonInfo = {
      container_selector: controller.buttonPaths.daily_wrapper.selector,
      button_exact_path: controller.buttonPaths.play_button.xpath,
      backup_selectors_count: controller.buttonPaths.play_button.absolute_selectors.length
    };

    const playResult = await controller.playDailyRecommend();

    try {
      const currentMusic = await controller.getCurrentMusic();
      const isPlaying = await controller.isPlaying();
      const hasPlaylist = await controller.hasPlaylist();
      const driverInstance = controller.getDriver();
      const currentUrl = driverInstance ? await driverInstance.getCurrentUrl() : "无法获取";
      const pageTitle = driverInstance ? await driverInstance.getTitle() : "无法获取";

      if (playResult) {
        return {
          success: true,
          message: "🎵 每日推荐播放成功（固定路径版本）！",
          details: {
            current_music: currentMusic || "正在加载...",
            is_playing: isPlaying,
            has_playlist: hasPlaylist,
            current_url: currentUrl,
            page_title: pageTitle,
            button_paths_used: buttonInfo,
            version: "fixed_path_optimized",
            status: "播放操作已执行并验证成功",
            platform: getPlatform()
          },
          tips: [
            "✅ 使用固定路径策略，播放操作成功执行",
            `🎶 当前音乐: ${currentMusic || "加载中..."}`,
            "💡 此版本执行速度更快，成功率更高",
            "🔧 如果没有声音，请检查网易云音乐客户端音量设置"
          ]
        };
      }

      return {
        success: false,
        message: "播放每日推荐失败（固定路径版本）",
        debug_info: {
          current_url: currentUrl,
          page_title: pageTitle,
          has_playlist: hasPlaylist,
          is_playing: isPlaying,
          current_music: currentMusic,
          button_paths_info: buttonInfo,
          platform: getPlatform()
        },
        details: [
          "可能的原因:",
          "1. 网易云音乐界面已更新，固定路径失效",
          "2. 网络连接问题 - 检查网络连接",
          "3. ChromeDriver版本不兼容",
          "4. 网易云音乐客户端版本过旧或过新"
        ],
        suggestions: [
          "🔧 排查步骤:",
          "1. 重启网易云音乐客户端",
          "2. 确保网易云音乐已登录",
          "3. 尝试手动打开推荐页面",
          "4. 如果固定路径失效，可以尝试使用 play_daily_recommend() 工具",
          "5. 检查控制台日志获取详细错误信息"
        ]
      };
    } catch (error) {
      await controller.disconnect();
      dailyController = null;
      return {
        success: false,
        message: `播放失败: ${(error as Error).message}`,
        suggestion: "请重试或检查日志获取更多信息"
      };
    }
  }
);

registerTool(
  "play_roaming",
  {
    description: "Activate NetEase private roaming mode via Selenium automation"
  },
  async () => {
    if (!SELENIUM_AVAILABLE) {
      return {
        success: false,
        message: "Selenium不可用",
        solution: "请安装selenium-webdriver依赖并配置ChromeDriver"
      };
    }

    const config = loadNeteaseConfig();
    const neteasePath = config.netease_music_path ?? "";
    if (!neteasePath) {
      return {
        success: false,
        message: "网易云音乐路径未配置",
        solution: "请设置环境变量 NETEASE_MUSIC_PATH 或在 netease_config.json 中配置 netease_music_path"
      };
    }

    if (!fs.existsSync(neteasePath)) {
      return {
        success: false,
        message: `网易云音乐路径无效: ${neteasePath}`,
        solution: "请重新设置环境变量 NETEASE_MUSIC_PATH 或在 netease_config.json 中配置正确的路径"
      };
    }

    const controller = await ensureDailyController();

    if (!(await controller.connectToNetease())) {
      return {
        success: false,
        message: "无法连接到网易云音乐",
        details: [
          "可能的原因:",
          "1. 网易云音乐启动失败",
          "2. ChromeDriver连接失败",
          "3. 调试端口被占用"
        ]
      };
    }

    const roamingInfo = {
      primary_xpath: controller.buttonPaths.roaming_button.xpath,
      button_title: controller.buttonPaths.roaming_button.title,
      backup_selectors_count: controller.buttonPaths.roaming_button.backup_selectors.length,
      description: controller.buttonPaths.roaming_button.description
    };

    const result = await controller.playRoaming();

    try {
      const driverInstance = controller.getDriver();
      const currentUrl = driverInstance ? await driverInstance.getCurrentUrl() : "无法获取";
      const pageTitle = driverInstance ? await driverInstance.getTitle() : "无法获取";

      if (result) {
        return {
          success: true,
          message: "🌍 私人漫游启动成功！",
          details: {
            roaming_status: "已启动",
            current_url: currentUrl,
            page_title: pageTitle,
            roaming_elements_found: "unknown",
            button_paths_used: roamingInfo,
            status: "漫游按钮点击操作已执行",
            platform: getPlatform()
          },
          tips: [
            "✅ 使用验证过的按钮路径，漫游按钮点击成功",
            "🌍 私人漫游功能已启动",
            "💡 执行速度快，成功率高",
            "🔧 如果漫游功能未生效，请检查网易云音乐VIP状态"
          ]
        };
      }

      return {
        success: false,
        message: "启动私人漫游失败",
        debug_info: {
          current_url: currentUrl,
          page_title: pageTitle,
          roaming_elements_found: 0,
          button_paths_info: roamingInfo,
          platform: getPlatform()
        },
        details: [
          "可能的原因:",
          "1. 网易云音乐界面已更新，按钮路径失效",
          "2. 漫游按钮不可见或被禁用",
          "3. 账户没有VIP权限或漫游权限",
          "4. ChromeDriver版本不兼容"
        ],
        suggestions: [
          "🔧 排查步骤:",
          "1. 确认网易云音乐账户具有VIP权限",
          "2. 重启网易云音乐客户端并重新登录",
          "3. 手动查看是否有漫游按钮可见",
          "4. 检查网络连接是否正常",
          "5. 检查控制台日志获取详细错误信息"
        ]
      };
    } catch (error) {
      await controller.disconnect();
      dailyController = null;
      return {
        success: false,
        message: `漫游启动失败: ${(error as Error).message}`,
        suggestion: "请重试或检查日志获取更多信息"
      };
    }
  }
);

registerTool(
  "pause_playback",
  {
    description: "Pause the current NetEase playback via Selenium automation"
  },
  async () => {
    if (!SELENIUM_AVAILABLE) {
      return {
        success: false,
        message: "Selenium不可用",
        solution: "请安装selenium-webdriver依赖并配置ChromeDriver"
      };
    }

    const config = loadNeteaseConfig();
    const neteasePath = config.netease_music_path ?? "";
    if (!neteasePath) {
      return {
        success: false,
        message: "网易云音乐路径未配置",
        solution: "请设置环境变量 NETEASE_MUSIC_PATH 或在 netease_config.json 中配置 netease_music_path"
      };
    }

    if (!fs.existsSync(neteasePath)) {
      return {
        success: false,
        message: `网易云音乐路径无效: ${neteasePath}`,
        solution: "请重新设置环境变量 NETEASE_MUSIC_PATH 或在 netease_config.json 中配置正确的路径"
      };
    }

    const controller = await ensureDailyController();

    if (!(await controller.connectToNetease())) {
      return {
        success: false,
        message: "无法连接到网易云音乐",
        details: [
          "可能的原因:",
          "1. 网易云音乐启动失败",
          "2. ChromeDriver连接失败",
          "3. 调试端口被占用"
        ]
      };
    }

    const wasPlaying = await controller.isPlaying();
    const paused = await controller.pausePlayback();
    const stillPlaying = await controller.isPlaying();

    if (paused) {
      return {
        success: true,
        message: stillPlaying ? "当前没有检测到播放任务，无需暂停。" : "✅ 已暂停播放。",
        data: {
          was_playing_before: wasPlaying,
          is_playing_after: stillPlaying,
          platform: getPlatform()
        }
      };
    }

    return {
      success: false,
      message: "暂停播放失败",
      details: {
        was_playing_before: wasPlaying,
        is_playing_after: stillPlaying,
        platform: getPlatform()
      }
    };
  }
);

server
  .start({ transportType: "stdio" })
  .catch((error) => {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  });
