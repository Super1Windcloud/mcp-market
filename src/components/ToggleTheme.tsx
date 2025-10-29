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

    const interval = setInterval(fetchTheme, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleClick = async () => {
    await toggleTheme();
    const currentTheme = await getCurrentTheme();
    setTheme(currentTheme.local || "system");
  };

  return (
    <div className={"cursor-pointer ml-5  mt-7 scale-200"}>
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
