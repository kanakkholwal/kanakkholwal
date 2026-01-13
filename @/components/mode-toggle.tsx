"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Icon } from "./icons";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      type="button"
      size="icon_sm"
      rounded="full"
      className="hover:[&>svg]:rotate-360 [&>svg]:duration-500"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Icon name="sun" className="dark:hidden" />
      <Icon name="moon" className="hidden dark:block" />
    </Button>
  );
}
