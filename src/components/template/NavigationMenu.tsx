import React, { useState } from "react";
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
import { useNavigate } from "@tanstack/react-router";

const categories = [
  { icon: Home, label: "我的MCP", count: 0, route: "/" },
  { icon: Code, label: "开发工具", count: 0, route: "/development" },
  { icon: CheckSquare, label: "效率工具", count: 0, route: "/productivity" },
  { icon: Wrench, label: "实用工具", count: 0, route: "/utilities" },
  { icon: Search, label: "信息检索", count: 0, route: "/information" },
  { icon: ImageIcon, label: "媒体生成", count: 0, route: "/media" },
  { icon: Briefcase, label: "商业服务", count: 0, route: "/business" },
  { icon: FlaskConical, label: "科学教育", count: 0, route: "/education" },
  { icon: DollarSign, label: "股票金融", count: 0, route: "/finance" },
  { icon: Newspaper, label: "新闻咨询", count: 0, route: "/news" },
  { icon: Users, label: "社交媒体", count: 0, route: "/social" },
  { icon: Gamepad2, label: "游戏娱乐", count: 0, route: "/entertainment" },
  { icon: Heart, label: "生活方式", count: 0, route: "/lifestyle" },
  { icon: Activity, label: "健康养生", count: 0, route: "/health" },
  { icon: Plane, label: "旅行交通", count: 0, route: "/travel" },
  { icon: Cloud, label: "气象天气", count: 0, route: "/weather" },
];

export default function Sidebar() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const handleItemClick = async (index: number, route: string) => {
    setSelectedIndex(index);
    await navigate({ to: route });
  };

  return (
    <aside style={{
      scrollbarWidth: "none",
    }} className="w-56 text-gray-200 h-screen overflow-y-auto py-4">
      <ul className="space-y-1">
        {categories.map(({ icon: Icon, label, route }, index) => (
          <li
            key={label}
            onClick={() => handleItemClick(index, route)}
            className={cn(
              "flex items-center justify-between px-4 py-2 text-sm rounded-lg cursor-pointer transition-colors",
              index === selectedIndex
                ? "bg-[#1e1e1e] text-white"
                : "hover:bg-[#1e1e1e]",
            )}
          >
            <div className="flex items-center gap-5">
              <Icon
                className={cn(
                  "w-4 h-4",
                  index === selectedIndex ? "text-white" : "text-gray-400",
                )}
              />
              <span>{label}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
