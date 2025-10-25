import { unified } from "unified";
import remarkParse from "remark-parse";
import { Root, Heading, PhrasingContent } from "mdast";
import fs from "fs";

interface Item {
  name: string;
  url: string;
  desc: string;
  route?: string;
  repeat?: number;
}

export async function extractSectionItems(markdown: string, sectionTitle: string): Promise<Item[]> {
  const tree = unified().use(remarkParse).parse(markdown) as Root;

  let inSection = false;
  const items: Item[] = [];

  for (const node of tree.children) {
    if (node.type === "heading" && (node as Heading).depth === 3) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const text = node.children.map((c: PhrasingContent) => c.value || "").join("");
      inSection = text.includes(sectionTitle);
      continue;
    }

    if (inSection && node.type === "list") {
      for (const item of node.children) {
        if (item.type === "listItem") {
          const paragraph = item.children[0];
          if (paragraph?.type === "paragraph") {
            const link = paragraph.children.find((c) => c.type === "link");
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const name = link?.children?.[0]?.value ?? "";
            const url = link?.url ?? "";
            const desc = paragraph.children
              .filter((c) => c.type === "text")
              .map((c) => c.value)
              .join(" ")
              .trim();
            items.push({ name, url, desc, repeat: 0 });
          }
        }
      }
    }

    // 遇到下一个标题则退出
    if (inSection && node.type === "heading" && (node as Heading).depth <= 3) break;
  }

  return items;
}


interface Section {
  level: number;  // 标题级别，例如 # -> 1, ### -> 3
  title: string;  // 去掉 # 和空格后的纯文本
}

function extractAllSectionTitles(markdown: string): Section[] {
  const lines = markdown.split(/\r?\n/);
  const sections: Section[] = [];

  const headingRegex = /^(#{1,6})\s*(.+)$/;

  for (const line of lines) {
    const match = line.match(headingRegex);
    if (match) {
      const [, hashes, text] = match;
      sections.push({
        level: hashes.length,
        title: text.trim(),
      });
    }
  }

  return sections;
}

const categories = [
  { label: "我的MCP", count: 0, route: "/" },
  { label: "聚合器", count: 0, route: "/aggregators" },
  { label: "🚀 航空航天与天体动力学", count: 0, route: "/aerospace-and-astrodynamics" },
  { label: "艺术与文化", count: 0, route: "/art" },
  { label: "浏览器自动化", count: 0, route: "/browser" },
  { label: "生物信息学", count: 0, route: "/bio" },
  { label: "云平台", count: 0, route: "/cloud" },
  { label: "代码执行", count: 0, route: "/code-execution" },
  { label: "编码代理", count: 0, route: "/coding-agents" },
  { label: "命令行", count: 0, route: "/command-line" },
  { label: "沟通", count: 0, route: "/communication" },
  { label: "客户数据平台", count: 0, route: "/customer-data" },
  { label: "数据库", count: 0, route: "/databases" },
  { label: "数据平台", count: 0, route: "/data-platforms" },
  { label: "送货", count: 0, route: "/delivery" },
  { label: "开发者工具", count: 0, route: "/developer-tools" },
  { label: "数据科学工具", count: 0, route: "/data-science" },
  { label: "嵌入式系统", count: 0, route: "/embedded" },
  { label: "文件系统", count: 0, route: "/file-systems" },
  { label: "金融与金融科技", count: 0, route: "/finance" },
  { label: "游戏", count: 0, route: "/gaming" },
  { label: "知识与记忆", count: 0, route: "/knowledge" },
  { label: "定位服务", count: 0, route: "/location" },
  { label: "市场营销", count: 0, route: "/marketing" },
  { label: "监控", count: 0, route: "/monitoring" },
  { label: "多媒体流程", count: 0, route: "/multimedia" },
  { label: "搜索和数据提取", count: 0, route: "/search" },
  { label: "安全", count: 0, route: "/security" },
  { label: "社交媒体", count: 0, route: "/social" },
  { label: "体育", count: 0, route: "/sports" },
  { label: "支持与服务管理", count: 0, route: "/support" },
  { label: "翻译服务", count: 0, route: "/translation" },
  { label: "文本转语音", count: 0, route: "/tts" },
  { label: "旅行与交通", count: 0, route: "/travel" },
  { label: "版本控制", count: 0, route: "/version-control" },
  { label: "工作场所与生产力", count: 0, route: "/workplace" },
  { label: "其他工具和集成", count: 0, route: "/other-tools" },
];


export const getOssMcpSources = async () => {
  const md = fs.readFileSync("./mcp.md");
  const content = md.toString();
  const results = {} as Record<string, Item[]>;
  const titles = extractAllSectionTitles(content);
  if (!titles) throw new Error("not found section ");

  console.log(titles.length);
  for (const title of titles) {
    if (title.level === 3) {
      const result = await extractSectionItems(content, title.title);
      console.log(result.length);
      if (title.title.includes("端到端") || title.title.includes("送货")) continue;

      results[title.title] = result;
    }
  }
  categories.forEach(item => {
    const keys = Object.keys(results);
    for (const key of keys) {
      if (key.includes(item.label)) {
        if (key.includes("端到端")) continue;
        results[key] = results[key].map(unit => {
          const repeat = unit.repeat!;
          return {
            ...unit,
            route: item.route,
            repeat: repeat + 1,
          };
        });
      }

    }
  });


  const output = `export const FreeMcpSources = ${JSON.stringify(results, null, 2)}`;
  fs.writeFileSync("./constant.ts", output);
};


getOssMcpSources();