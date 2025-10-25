import { McpSourceType } from "@/components/template/NavigationMenu";
import { create } from "zustand";

export interface McpsState {
  label: string;
  route  :string;
  mcps: McpSourceType[];
}

interface McpsStore {
  allMcps: McpsState[]; // 状态
  setAllMcps: (data: McpsState[]) => void; // 设置函数
  addMcpGroup: (group: McpsState) => void; // 添加函数
}

export const useMcpsStateStore = create<McpsStore>((set) => ({
  allMcps: [],
  setAllMcps: (data) => set({ allMcps: data }),
  addMcpGroup: (group) =>
    set((state) => ({ allMcps: [...state.allMcps, group] })),
}));
