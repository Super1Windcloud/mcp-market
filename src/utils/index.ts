import fs from "fs";
import path from "path";

class FileLogger {
  private readonly logFilePath: string;
  private readonly maxFileSize: number;

  constructor(logDir: string = "./logs", maxFileSize: number = 10 * 1024 * 1024) {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    this.logFilePath = path.join(logDir, `app-${this.getCurrentDate()}.log`);
    this.maxFileSize = maxFileSize;
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split("T")[0];
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  private async rotateLogIfNeeded(): Promise<void> {
    try {
      const stats = await fs.promises.stat(this.logFilePath);
      if (stats.size > this.maxFileSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const newPath = this.logFilePath.replace(".log", `-${timestamp}.log`);
        await fs.promises.rename(this.logFilePath, newPath);
      }
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError?.code === "ENOENT") {
        // No log file yet; nothing to rotate.
        return;
      }
      console.error("Failed to get file stats:", error);
    }
  }

  async log(level: "INFO" | "WARN" | "ERROR", message: string, data?: unknown): Promise<void> {
    await this.rotateLogIfNeeded();

    const timestamp = this.getCurrentTimestamp();
    const logEntry = {
      timestamp,
      level,
      message,
      data: data || null,
    };

    const logLine = JSON.stringify(logEntry) + "\n";

    try {
      await fs.promises.appendFile(this.logFilePath, logLine, "utf8");
    } catch (error) {
      console.error("Failed to write log:", error);
    }
  }

  async info(message: string, data?: unknown): Promise<void> {
    await this.log("INFO", message, data);
  }

  async warn(message: string, data?: unknown): Promise<void> {
    await this.log("WARN", message, data);
  }

  async error(message: string, data?: unknown): Promise<void> {
    await this.log("ERROR", message, data);
  }
}


export function writeSomeLogs(...messages: string[]): void {
  const logger = new FileLogger();
  messages.forEach((message) => logger.info(message));
}

export function isDev() {
  return process.env.NODE_ENV === "development";
}
