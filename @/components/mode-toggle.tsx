"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icon } from "./icons";

export function ModeToggle() {
  // `theme` can be the literal "system" — switching off it would leave the
  // rendered appearance unchanged, so branch on what's actually on screen.
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <Button
      variant="ghost"
      type="button"
      size="icon_sm"
      rounded="full"
      className="hover:[&>svg]:rotate-360 [&>svg]:duration-500"
      onClick={() => setTheme(nextTheme)}
      aria-pressed={mounted ? isDark : undefined}
      // Before hydration we don't know the resolved theme, so keep the label
      // generic rather than announcing a state that may be wrong.
      aria-label={mounted ? `Switch to ${nextTheme} theme` : "Toggle theme"}
    >
      <Icon name="sun" className="dark:hidden" />
      <Icon name="moon" className="hidden dark:block" />
    </Button>
  );
}
