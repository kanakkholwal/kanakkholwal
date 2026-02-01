"use client";

import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";

import { FileCode, FolderGit2, Terminal } from "lucide-react";
import { useMemo } from "react";

// Deterministic color generator (Pastel/Muted tech colors)
const getTheme = (str: string) => {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-orange-500",
    "bg-violet-500",
    "bg-pink-500"
  ];
  const icons = [FileCode, FolderGit2, Terminal, Layers];

  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);

  const colorIndex = Math.abs(hash % colors.length);
  const iconIndex = Math.abs(hash % icons.length);

  return {
    color: colors[colorIndex],
    Icon: icons[iconIndex]
  };
};
export function ProjectFallback({ title, type = "project" }: { title: string, type?: string }) {
  const { color, Icon } = useMemo(() => getTheme(title), [title]);

  return (
    <div className="relative w-full h-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center overflow-hidden group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors duration-500">

      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, #808080 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
        <div className="w-[120%] h-[120%] border-[20px] border-black dark:border-white rounded-full scale-150" />
      </div>

      <div className="relative z-5 flex flex-col items-center gap-3">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-white", color)}>
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
            NO_MEDIA
          </span>
          <span className="text-[10px] font-mono text-zinc-300 dark:text-zinc-600">
            {title.substring(0, 12).toUpperCase().replace(/\s/g, "_")}...
          </span>
        </div>
      </div>

      {/* 4. Technical Corner Markers (CAD Style) */}
      <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-zinc-300 dark:border-zinc-600" />
      <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-zinc-300 dark:border-zinc-600" />
      <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-zinc-300 dark:border-zinc-600" />
      <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-zinc-300 dark:border-zinc-600" />
    </div>
  );
}