"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icon } from "./icons";

// system -> light -> dark -> system. A two-state toggle makes "follow the OS"
// unreachable the moment it is clicked once.
const ORDER = ["system", "light", "dark"] as const;
type Mode = (typeof ORDER)[number];

const LABEL: Record<Mode, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
};

export function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = (mounted ? (theme as Mode) : "system") ?? "system";
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon_sm"
      rounded="full"
      onClick={() => setTheme(next)}
      // Before hydration we don't know the resolved theme, so keep the label
      // generic rather than announcing a state that may be wrong.
      aria-label={mounted ? `Theme: ${LABEL[current]}. Switch to ${LABEL[next].toLowerCase()}` : "Toggle theme"}
    >
      {/* A hard swap, not a 360° spin. The old spin declared duration-500 with
          no transition-property, so it snapped anyway — and a control used
          dozens of times a session should not animate at all. */}
      {mounted && current === "system" ? (
        <Icon name="monitor" />
      ) : isDark ? (
        <Icon name="moon" />
      ) : (
        <Icon name="sun" />
      )}
    </Button>
  );
}
