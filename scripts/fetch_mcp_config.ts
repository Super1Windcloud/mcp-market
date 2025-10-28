import fs from "fs/promises";
import JSON5 from "json5";
import pLimit from "p-limit";
import { FreeMcpSources } from "./constant.ts";

const CONCURRENCY = 5;
const README_FILENAMES = ["README.md", "Readme.md", "readme.md"];

/** 将 GitHub blob 链接转换为 raw 链接 */
function toRawGithub(url: string) {
  const m = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);
  if (!m) return null;
  const [, owner, repo, branch, path] = m;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

/** 从 Markdown 中提取 mcpServers 对象 */
function extractMcpServers(markdown: string) {
  const fenceRe = /```(\w+)?\s*?\n([\s\S]*?)```/g;
  const candidates: string[] = [];

  // 先抓代码块
  for (const m of markdown.matchAll(fenceRe)) {
    const lang = (m[1] || "").toLowerCase();
    const code = m[2];
    if (/^(json|js|javascript|yaml|yml)?$/.test(lang) && code.includes("mcpServers")) {
      candidates.push(code);
    }
  }

  // 没有代码块就整个 README 搜索
  if (candidates.length === 0 && markdown.includes("mcpServers")) {
    candidates.push(markdown);
  }

  // 逐个解析（取第一个成功的）
  for (const code of candidates) {
    const keyRe = /["']?mcpServers["']?\s*:\s*{/g;
    for (const match of code.matchAll(keyRe)) {
      const objText = balancedBracesFrom(code, match.index + match[0].length - 1);
      if (!objText) continue;

      try {
        const parsed = JSON5.parse(`{ "mcpServers": ${objText} }`);
        if (parsed.mcpServers && typeof parsed.mcpServers === "object") {
          return parsed.mcpServers; // ✅ 取第一个解析成功的
        }
      } catch {
        // ignore
      }
    }

    // 尝试整体解析
    try {
      const parsedWhole = JSON5.parse(code);
      if (parsedWhole?.mcpServers && typeof parsedWhole.mcpServers === "object") {
        return parsedWhole.mcpServers;
      }
    } catch {
      // ignore
    }
  }

  return null;
}

/** 从某个位置开始提取完整 {...} 内容 */
function balancedBracesFrom(text: string, pos: number) {
  if (text[pos] !== "{") return null;
  let depth = 0;
  let inStr = false;
  let quote = "";
  let escaped = false;

  for (let i = pos; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) inStr = false;
      continue;
    }
    if (ch === "\"" || ch === "'") {
      inStr = true;
      quote = ch;
      continue;
    }
    if (ch === "{") depth++;
    if (ch === "}") depth--;
    if (depth === 0) return text.slice(pos, i + 1);
  }
  return null;
}

/** 尝试读取 README 文本 */
async function fetchFirstReadableReadme(baseUrl: string) {
  for (const name of README_FILENAMES) {
    const url = `${baseUrl}/${name}`;
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (res.ok) return await res.text();
    } catch {
      // ignore
    }
  }
  return null;
}

/** 处理单个仓库 */
async function processRepo({ name, url }: { name: string; url: string }) {
  const result = { name, repoUrl: url, servers: null as unknown, error: null as string | null };

  // ✅ 优先 main 分支
  const blobVariants = [
    `${url}/blob/main/README.md`,
    `${url}/blob/master/README.md`,
  ];

  for (const blob of blobVariants) {
    const rawBase = toRawGithub(blob)?.replace(/\/README\.md$/, "");
    if (!rawBase) continue;

    const md = await fetchFirstReadableReadme(rawBase);
    if (!md) continue;

    const servers = extractMcpServers(md);
    if (servers) {
      result.servers = servers;
      return result;
    }
  }

  result.error = "未找到 README 或未解析出 mcpServers";
  return result;
}

/** 主程序 */
async function main() {
  const merged: Record<string, unknown> = {};
  const errors = [];
  const limit = pLimit(CONCURRENCY);

  const tasks = [];

  for (const groupKey in FreeMcpSources) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    for (const item of FreeMcpSources[groupKey]) {
      tasks.push(limit(() => processRepo(item)));
    }
  }

  const results = await Promise.all(tasks);

  for (const { name, repoUrl, servers, error } of results) {
    if (error || !servers) {
      errors.push({ name, repoUrl, reason: error });
      continue;
    }

    // ✅ 每个仓库使用仓库 name 作为 key
    const firstKey = Object.keys(servers)[0];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    merged[name] = servers[firstKey] ?? servers;
  }

  // ✅ 禁止单引号写入（标准 JSON 格式）
  const jsonText = JSON.stringify(merged, null, 2);
  await fs.writeFile("mcp_config.json", jsonText, "utf-8");

  console.log(`✅ 已写入 mcp_config.json（共 ${Object.keys(merged).length} 项）`);
  if (errors.length) {
    console.log("\n⚠️ 以下项目存在问题：");
    for (const e of errors) {
      console.log(`- [${e.name}] ${e.repoUrl} → ${e.reason}`);
    }
  }
}

main().catch((err) => {
  console.error("❌ 运行出错：", err);
  process.exit(1);
});
