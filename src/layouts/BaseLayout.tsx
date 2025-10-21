import React from "react";
import DragWindowRegion from "@/components/DragWindowRegion";
import NavigationMenu from "@/components/template/NavigationMenu";
import ToggleTheme from "@/components/ToggleTheme";

export default function BaseLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <DragWindowRegion title="Mcp Market" />
      <main className={"flex flex-row w-full  justify-center items-center "}>
        <h1 className="text-3xl font-bold  self-center">🌐 MCP Servers 市场</h1>
        <ToggleTheme />
      </main>
      <NavigationMenu />
      <main className="">{children}</main>
    </main>
  );
}
