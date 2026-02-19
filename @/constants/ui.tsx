import { IconComponent, IconType } from "@/components/icons";
import { Box, Minus, Sparkles } from "lucide-react"; // Make sure to install lucide-react

export type StylingModelOption = {
  id: string;
  label: string;
  icon: IconComponent;
  color: string;
  disabled?: boolean;
};
export const StyleModels: StylingModelOption[] = [
  { id: "dynamic", label: "Dynamic", icon: Sparkles, color: "text-blue-500" },
  { id: "static", label: "Static", icon: Box, color: "text-orange-500" },
  {
    id: "minimal",
    label: "Minimal",
    icon: Minus,
    color: "text-slate-500",
    disabled: true,
  },
  // { id: "3d", label: "3D", icon: BoxSelect, color: "text-purple-500", disabled: true },
] as const;

export type StylingModel = (typeof StyleModels)[number]["id"];

export type AnimationMode = {
  id: string;
  label: string;
  disabled: boolean;
  icon: IconType;
};

export const animationModes: AnimationMode[] = [
  { id: "none", label: "None", disabled: true, icon: "default" },
  { id: "stars", label: "Stars Background", disabled: false, icon: "stars" },
  { id: "bubbles", label: "Bubbles", disabled: true, icon: "bubbles" },
  { id: "confetti", label: "Confetti", disabled: true, icon: "confetti" },
];

export const NAV_ITEMS = [
  { label: "Work", href: "/#work" },
  { label: "Projects", href: "/projects" },
  { label: "Stack", href: "/#skills" },
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
];
