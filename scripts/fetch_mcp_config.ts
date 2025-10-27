import fs from 'fs';
import JSON5 from 'json5';
import { FreeMcpSources } from './constant.js';

/**
 * 将 GitHub "blob" 链接转换为 raw 链接
 * 例: https://github.com/owner/repo/blob/master/README.md
 *  ->  https://raw.githubusercontent.com/owner/repo/master/README.md
 */
function toRawGithub(url :string ) {
  // 兼容结尾可能没有 README.md 的仓库根地址
  // 用户原始构造是 value.url + '/blob/master/README.md'
  // 这里也支持 '/blob/main/README.md'
  const m = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);
  if (!m) return null;
  const [, owner, repo, branch, path] = m;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

/**
 * 从 Markdown 中提取包含 mcpServers 的代码块，并解析出对象
 * 支持 ```json / ```javascript / ```js / ```yaml / ```yml / 无标注 的代码块
 * 优先匹配代码块；若没有，则在全文里直接搜索 mcpServers 对象字面量
 */
function extractMcpServers(markdown :string) {
  // 1) 先找代码块
  const fenceRe = /```(\w+)?\s*?\n([\s\S]*?)```/g;
  let m;
  const candidates = [];

  while ((m = fenceRe.exec(markdown)) !== null) {
    const lang = (m[1] || '').toLowerCase();
    const code = m[2];

    if (/^(json|js|javascript|yaml|yml)?$/.test(lang)) {
      if (code.includes('mcpServers')) {
        candidates.push({ lang, code });
      }
    }
  }

  // 2) 如果没找到含有 mcpServers 的代码块，尝试直接在全文里找字面量
  if (candidates.length === 0 && markdown.includes('mcpServers')) {
    candidates.push({ lang: 'unknown', code: markdown });
  }

  // 3) 逐个候选解析
  for (const { lang, code } of candidates) {
    // 优先匹配 "mcpServers": { ... } 或 mcpServers: { ... }
    const keyRe = /(?:["']?mcpServers["']?)\s*:\s*{/g;
    let km;
    while ((km = keyRe.exec(code)) !== null) {
      const start = km.index + km[0].length - 1; // 现在光标在第一个 '{' 上
      const objText = balancedBracesFrom(code, start);
      if (!objText) continue;

      // 构造一个临时 JSON 文本：{ "mcpServers": <obj> }
      const wrapped = `{ "mcpServers": ${objText} }`;

      try {
        // 用 JSON5 解析（容忍注释、单引号、尾逗号）
        const parsed = JSON5.parse(wrapped);
        if (parsed && parsed.mcpServers && typeof parsed.mcpServers === 'object') {
          return parsed.mcpServers;
        }
      } catch {
        // 解析失败就继续尝试下一个匹配
      }
    }

    // 某些 README 可能直接就是一个完整的配置对象
    // 尝试整体解析
    try {
      const parsedWhole = JSON5.parse(code);
      if (parsedWhole && parsedWhole.mcpServers && typeof parsedWhole.mcpServers === 'object') {
        return parsedWhole.mcpServers;
      }
    } catch {
      // 忽略，尝试下一个候选
    }
  }

  return null;
}

/**
 * 从给定字符串的 pos 处（应为 '{'）开始，返回成对花括号包围的子串（包含首尾花括号）
 * 处理字符串与转义，尽量避免在字符串内部错误计数
 */
function balancedBracesFrom(text, pos) {
  if (text[pos] !== '{') return null;

  let depth = 0;
  let i = pos;
  let inStr = false;
  let strQuote = null;
  let escaped = false;

  for (; i < text.length; i++) {
    const ch = text[i];
    const prev = text[i - 1];

    if (inStr) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === strQuote) {
        inStr = false;
        strQuote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inStr = true;
      strQuote = ch;
      continue;
    }

    if (ch === '{') depth++;
    if (ch === '}') depth--;

    if (depth === 0) {
      // i 为匹配到的最后一个 '}'
      return text.slice(pos, i + 1);
    }
  }

  return null; // 未能配对完成
}

async function fetchFirstReadableReadme(rawBases) {
  // 依次尝试这些 raw README 位置
  const candidates = [
    `${rawBases}/README.md`,
    `${rawBases}/Readme.md`,
    `${rawBases}/readme.md`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (res.ok) {
        return await res.text();
      }
    } catch {
      // ignore
    }
  }
  return null;
}

async function main() {
  const merged = {};
  const errors = [];

  for (const groupKey in FreeMcpSources) {
    // @ts-ignore
    for (const value of FreeMcpSources[groupKey]) {
      const name = value.name;
      const repoUrl = value.url; // 期望是 https://github.com/owner/repo

      // 构造两种 blob 形式，然后转 raw：
      const blobMaster = `${repoUrl}/blob/master`;
      const blobMain = `${repoUrl}/blob/main`;
      const rawMasterBase = toRawGithub(`${blobMaster}/README.md`)?.replace(/\/README\.md$/, '');
      const rawMainBase = toRawGithub(`${blobMain}/README.md`)?.replace(/\/README\.md$/, '');

      let md = null;

      // 先尝试 master，再尝试 main
      if (rawMasterBase) {
        md = await fetchFirstReadableReadme(rawMasterBase);
      }
      if (!md && rawMainBase) {
        md = await fetchFirstReadableReadme(rawMainBase);
      }

      if (!md) {
        errors.push({ name, repoUrl, reason: 'README.md 未找到或无法读取（master/main）' });
        continue;
      }

      const servers = extractMcpServers(md);
      if (!servers) {
        errors.push({ name, repoUrl, reason: '未在 README 中解析到 mcpServers' });
        continue;
      }

      // 合并到 merged；遇到同名 key 时，保留首次出现并记录冲突
      for (const [k, v] of Object.entries(servers)) {
        if (merged.hasOwnProperty(k)) {
          errors.push({
            name,
            repoUrl,
            reason: `mcpServers.${k} 冲突，已存在，忽略后者`,
          });
          continue;
        }
        merged[k] = v;
      }
    }
  }

  // 写入文件
  fs.writeFileSync('mcp_config.json', JSON.stringify(merged, null, 2), 'utf-8');

  // 控制台输出
  console.log('✅ 已写入 mcp_config.json');
  console.log('总计条目：', Object.keys(merged).length);

  if (errors.length) {
    console.log('\n⚠️ 解析/合并过程中有一些问题：');
    for (const e of errors) {
      console.log(`- [${e.name}] ${e.repoUrl} -> ${e.reason}`);
    }
  }
}

main().catch((e) => {
  console.error('运行出错：', e);
  process.exit(1);
});
