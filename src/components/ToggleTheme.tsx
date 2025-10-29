import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getCurrentTheme, toggleTheme } from "@/helpers/theme_helpers";

export default function ToggleTheme() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    const fetchTheme = async () => {
      const currentTheme = await getCurrentTheme();
      setTheme(currentTheme.local || "system");
    };

    fetchTheme();

    // Poll for theme changes periodically as a fallback
    const interval = setInterval(fetchTheme, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleClick = async () => {
    await toggleTheme();
    // After toggling, fetch the new theme state
    const currentTheme = await getCurrentTheme();
    setTheme(currentTheme.local || "system");
  };

  return (
    <div className={"cursor-pointer ml-5  mt-3 scale-200"}>
      {
        theme === "dark" ? (
          <Sun size={16} onClick={handleClick} />
        ) : (
          <Moon size={16} onClick={handleClick} />
        )
      }
    </div>

  );
}
