import React from "react";
import {
  Home,
  Code,
  CheckSquare,
  Wrench,
  Search,
  Image as ImageIcon,
  Briefcase,
  FlaskConical,
  DollarSign,
  Newspaper,
  Users,
  Gamepad2,
  Heart,
  Activity,
  Plane,
  Cloud,
} from "lucide-react";
import { cn } from "@/utils/tailwind";

const categories = [
  { icon: Home, label: "我的MCP", count: 0 },
  { icon: Code, label: "开发工具", count: 0 },
  { icon: CheckSquare, label: "效率工具", count: 0 },
  { icon: Wrench, label: "实用工具", count: 0 },
  { icon: Search, label: "信息检索", count: 0 },
  { icon: ImageIcon, label: "媒体生成", count: 0 },
  { icon: Briefcase, label: "商业服务", count: 0 },
  { icon: FlaskConical, label: "科学教育", count: 0 },
  { icon: DollarSign, label: "股票金融", count: 0 },
  { icon: Newspaper, label: "新闻咨询", count: 0 },
  { icon: Users, label: "社交媒体", count: 0 },
  { icon: Gamepad2, label: "游戏娱乐", count: 0 },
  { icon: Heart, label: "生活方式", count: 0 },
  { icon: Activity, label: "健康养生", count: 0 },
  { icon: Plane, label: "旅行交通", count: 0 },
  { icon: Cloud, label: "气象天气", count: 0 },
];

export default function Sidebar() {
  return (
    <aside style={{
      scrollbarWidth: "none",
    }} className="w-56  text-gray-200 h-screen overflow-y-auto py-4">
      <ul className="space-y-1">
        {categories.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className={cn(
              "flex items-center justify-between px-4 py-2 text-sm rounded-lg cursor-pointer" +
              " hover:bg-[#1e1e1e] transition-colors",
            )}
          >
            <div className="flex items-center gap-5">
              <Icon className="w-4 h-4 text-gray-400" />
              <span>{label}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
    ;
}
