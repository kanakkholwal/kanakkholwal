"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="raw"
      type="button"
      size="icon"
      className="px-2 text-foreground"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] text-foreground" />
      <MoonIcon className="hidden h-[1.2rem] w-[1.2rem] text-foreground dark:block" />
    </Button>
  );
}
