import DragWindowRegion from "@/components/DragWindowRegion";
import NavigationMenu from "@/components/template/NavigationMenu";
import ToggleTheme from "@/components/ToggleTheme";
import React from "react";
import { ComicText } from "@/components/ui/comic-text.tsx";
import { SparklesText } from "@/components/ui/sparkles-text.tsx";
import { Meteors } from "@/components/ui/meteors.tsx";

export default function BaseLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <DragWindowRegion title="Mcp Market" />

      <div className="flex flex-row w-full justify-center items-center p-2">
        <SparklesText className={"ml-5"}>
          <ComicText fontSize={2}>
            🌐 MCP Servers 市场
          </ComicText>
        </SparklesText>
        <ToggleTheme />

      </div>

      <div className="flex flex-1 w-full h-full min-h-0">
        <NavigationMenu />
        <main
          style={{
            scrollbarWidth: "none",
          }}
          className="flex-1 h-full w-full overflow-y-auto min-h-0"
        >
          {children}
        </main>
      </div>
      <Meteors />
    </div>
  );
}
