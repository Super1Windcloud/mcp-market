import { spawn } from "node:child_process";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import psList from "ps-list";
import type { NeteaseConfig } from "../types/config.js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Builder, By, WebElement, WebDriver } from "selenium-webdriver";
import { Options as ChromeOptions, ServiceBuilder as ChromeServiceBuilder } from "selenium-webdriver/chrome.js";


export const SELENIUM_AVAILABLE = true;

interface ButtonPaths {
  daily_wrapper: {
    xpath: string;
    selector: string;
  };
  play_button: {
    xpath: string;
    absolute_selectors: string[];
  };
  roaming_button: {
    xpath: string;
    title: string;
    description: string;
    backup_selectors: string[];
  };
}

const WINDOW_KEYWORDS = ["cloudmusic", "netease", "网易云音乐"];

export class DailyRecommendController {
  private driver: WebDriver | null = null;
  private readonly config: NeteaseConfig;
  readonly buttonPaths: ButtonPaths;

  constructor(config: NeteaseConfig) {
    this.config = config;
    this.buttonPaths = {
      daily_wrapper: {
        xpath: "//*[@id='dailyRecommendCard']/div[1]",
        selector: "//div[contains(@class, 'DailyRecommendWrapper_')]",
      },
      play_button: {
        xpath: "//*[@id='dailyRecommendCard']/div[1]/div[3]/div[2]/div[1]/button[1]",
        absolute_selectors: [
          "//div[contains(@class, 'DailyRecommendWrapper_')]//button",
          "//div[contains(@class, 'DailyRecommendWrapper_')]/button",
          "//*[@id='dailyRecommendCard']//button[@title='播放']",
          "//*[@id='dailyRecommendCard']//button[contains(@class, 'cmd-button')]",
        ],
      },
      roaming_button: {
        xpath: "//*[@id=\"page_pc_mini_bar\"]/div[1]/div[2]/div[1]/div[1]/button[3]",
        title: "私人漫游",
        description: "经过验证的有效私人漫游按钮路径",
        backup_selectors: [
          "//button[contains(@title, '私人漫游')]",
          "//button[contains(@class, 'ButtonWrapper_') and contains(@title, '漫游')]",
          "//*[@id='page_pc_mini_bar']//button[contains(@title, '漫游')]",
        ],
      },
    };
  }

  async connectToNetease(): Promise<boolean> {
    try {
      if (!(await this.startNeteaseWithDebug())) {
        console.error("[DailyController] Failed to ensure NetEase is running with debug port");
        return false;
      }

      await delay(1000);

      const chromedriverPath = this.resolveChromedriverPath();
      const service = new ChromeServiceBuilder(chromedriverPath);
      const options = new ChromeOptions();
      const debugPort = this.config.debug_port ?? 9222;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      options.options_["debuggerAddress"] = `localhost:${debugPort}`;

      this.driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .setChromeService(service)
        .build();

      await this.driver.getTitle();
      return true;
    } catch (error) {
      console.error("[DailyController] connectToNetease failed:", error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.driver) {
      try {
        await this.driver.quit();
      } catch (error) {
        console.error("[DailyController] disconnect error:", error);
      } finally {
        this.driver = null;
      }
    }
  }

  async hasPlaylist(): Promise<boolean> {
    if (!this.driver) return false;
    try {
      const button = await this.findActionButton(2);
      return button !== null;
    } catch {
      return false;
    }
  }

  async isPlaying(): Promise<boolean> {
    if (!this.driver) return false;
    try {
      const button = await this.findActionButton(2);
      if (!button) return false;
      const classAttr = (await button.getAttribute("class")) ?? "";
      return classAttr.includes("play-pause-btn");
    } catch {
      return false;
    }
  }

  async pausePlayback(): Promise<boolean> {
    if (!this.driver) {
      return false;
    }

    try {
      if (!(await this.isPlaying())) {
        return true;
      }

      const button = await this.findActionButton(2);
      if (!button) {
        return false;
      }

      await button.click();
      await delay(300);
      return !(await this.isPlaying());
    } catch (error) {
      console.error("[DailyController] pausePlayback failed:", error);
      return false;
    }
  }

  async getCurrentMusic(): Promise<string> {
    if (!this.driver) return "";
    try {
      if (!(await this.hasPlaylist())) {
        return "";
      }

      const wrapper = await this.driver.findElement(By.xpath("//div[contains(@class, 'songPlayInfo_')]"));
      const title = await wrapper.findElement(By.className("title"));
      return (await title.getText()).trim();
    } catch (error) {
      console.error("[DailyController] getCurrentMusic failed:", error);
      return "";
    }
  }

  getDriver(): import("selenium-webdriver").WebDriver | null {
    return this.driver;
  }

  async playDailyRecommend(): Promise<boolean> {
    if (!this.driver) {
      console.error("[DailyController] Driver not connected");
      return false;
    }

    try {
      const dailyTab = await this.driver.findElement(
        By.xpath("//div[contains(@data-log, 'cell_pc_main_tab_entrance')]"),
      );
      await dailyTab.click();
      await delay(500);

      let button: WebElement | null = null;

      try {
        button = await this.driver.findElement(By.xpath(this.buttonPaths.play_button.xpath));
      } catch { /* empty */
      }

      if (!button) {
        for (const selector of this.buttonPaths.play_button.absolute_selectors) {
          try {
            button = await this.driver.findElement(By.xpath(selector));
            break;
          } catch { /* empty */
          }
        }
      }

      if (!button) {
        try {
          const wrapper = await this.driver.findElement(By.xpath(this.buttonPaths.daily_wrapper.selector));
          button = await wrapper.findElement(By.css("button"));
        } catch (error) {
          console.error("[DailyController] Failed to locate play button:", error);
          return false;
        }
      }

      const actions = this.driver.actions({ async: true });
      await actions.move({ origin: button }).perform();
      await delay(500);
      await actions.move({ origin: button }).press().release().perform();
      await delay(1000);

      const currentMusic = await this.getCurrentMusic();
      const hasPlaylist = await this.hasPlaylist();
      return hasPlaylist && currentMusic.length > 0;
    } catch (error) {
      console.error("[DailyController] playDailyRecommend failed:", error);
      return false;
    }
  }

  async playRoaming(): Promise<boolean> {
    if (!this.driver) {
      console.error("[DailyController] Driver not connected");
      return false;
    }

    try {
      let button: WebElement | null = null;

      try {
        button = await this.driver.findElement(By.xpath(this.buttonPaths.roaming_button.xpath));
        if (!(await button?.isDisplayed()) || !(await button?.isEnabled())) {
          button = null;
        }
      } catch { /* empty */
      }

      if (!button) {
        for (const selector of this.buttonPaths.roaming_button.backup_selectors) {
          try {
            const candidates = await this.driver.findElements(By.xpath(selector));
            for (const candidate of candidates) {
              if ((await candidate.isDisplayed()) && (await candidate.isEnabled())) {
                button = candidate;
                break;
              }
            }
            if (button) break;
          } catch { /* empty */
          }
        }
      }

      if (!button) {
        console.error("[DailyController] Failed to locate roaming button");
        return false;
      }

      const actions = this.driver.actions({ async: true });
      await actions.move({ origin: button }).perform();
      await delay(500);
      await actions.move({ origin: button }).press().release().perform();
      await delay(2000);

      return true;
    } catch (error) {
      console.error("[DailyController] playRoaming failed:", error);
      return false;
    }
  }

  isSeleniumAvailable(): boolean {
    return SELENIUM_AVAILABLE;
  }

  private async findActionButton(index: number): Promise<WebElement | null> {
    const buttons = await this.findActionButtons();
    if (index >= 0 && index < buttons.length) {
      return buttons[index];
    }
    return null;
  }

  private async findActionButtons(): Promise<WebElement[]> {
    if (!this.driver) {
      return [];
    }

    try {
      const playButtons = await this.driver.findElements(By.id("btn_pc_minibar_play"));
      for (const button of playButtons) {
        if (!(await button.isDisplayed())) {
          continue;
        }
        const container = await button.findElement(By.xpath(".."));
        return await container.findElements(By.css("button"));
      }

      return [];
    } catch {
      return [];
    }
  }

  private async startNeteaseWithDebug(): Promise<boolean> {
    const neteasePath = this.config.netease_music_path;
    if (!neteasePath) {
      return false;
    }

    const debugPort = this.config.debug_port ?? 9222;

    if (await this.isNeteaseRunning()) {
      if (await this.isDebugPortAvailable(debugPort)) {
        return true;
      }
      await this.killNeteaseProcesses();
    }

    try {
      spawn(neteasePath, [`--remote-debugging-port=${debugPort}`], {
        detached: true,
        stdio: "ignore",
        windowsHide: true,
      }).unref();
    } catch (error) {
      console.error("[DailyController] Failed to start NetEase:", error);
      return false;
    }

    for (let i = 0; i < 20; i += 1) {
      if ((await this.isNeteaseRunning()) && (await this.isDebugPortAvailable(debugPort))) {
        return true;
      }
      await delay(500);
    }

    return false;
  }

  private async isNeteaseRunning(): Promise<boolean> {
    try {
      const processes = await psList();
      return processes.some((proc) => {
        if (!proc.name) return false;
        const name = proc.name.toLowerCase();
        return WINDOW_KEYWORDS.some((keyword) => name.includes(keyword));
      });
    } catch (error) {
      console.error("[DailyController] Failed to check processes:", error);
      return false;
    }
  }

  private async killNeteaseProcesses(): Promise<void> {
    try {
      const processes = await psList();
      const candidates = processes.filter((proc) => {
        if (!proc.name) return false;
        const name = proc.name.toLowerCase();
        return WINDOW_KEYWORDS.some((keyword) => name.includes(keyword));
      });

      for (const proc of candidates) {
        if (os.platform().startsWith("win")) {
          spawn("taskkill", ["/PID", String(proc.pid), "/F"], { windowsHide: true });
        } else {
          process.kill(proc.pid, "SIGTERM");
        }
      }

      await delay(1000);
    } catch (error) {
      console.error("[DailyController] Failed to kill processes:", error);
    }
  }

  private async isDebugPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = net.createConnection({ host: "127.0.0.1", port }, () => {
        socket.destroy();
        resolve(true);
      });

      socket.once("error", () => {
        socket.destroy();
        resolve(false);
      });

      socket.setTimeout(1000, () => {
        socket.destroy();
        resolve(false);
      });
    });
  }

  private resolveChromedriverPath(): string {
    const configured = this.config.chromedriver_path ?? "";
    if (configured && path.isAbsolute(configured)) {
      return configured;
    }

    const controllerDir = path.dirname(fileURLToPath(import.meta.url));
    const projectRoot = path.resolve(controllerDir, "..", "..");
    if (configured) {
      return path.join(projectRoot, configured);
    }

    return path.join(projectRoot, "src", "chromedriver", "win64", "chromedriver.exe");
  }
}
