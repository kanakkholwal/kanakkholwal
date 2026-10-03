import type { SVGProps } from "react";
import { cn } from "@/lib/cn";
import { ICONS } from "./generated";
import { ICON_ALIASES as ALIASES, type IconType } from "./schema";

export { type IconType, iconZodSchema } from "./schema";

export function isIconType(name: string): name is IconType {
  return name in ICONS || name in ALIASES;
}

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconType;
  size?: number | string;
}

/** Solar and Simple Icons from `icons.json`; hidden from assistive tech unless labelled. */
export function Icon({ name, size = "1em", className, ...props }: IconProps) {
  const key = name in ALIASES ? ALIASES[name as keyof typeof ALIASES] : (name as keyof typeof ICONS);
  const icon = ICONS[key];
  if (!icon) return null;
  const labelled = props["aria-label"] !== undefined || props["aria-labelledby"] !== undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={icon.viewBox}
      fill={icon.fill}
      width={size}
      height={size}
      aria-hidden={labelled ? undefined : true}
      role={labelled ? "img" : undefined}
      focusable="false"
      data-icon={key}
      className={cn("inline-block shrink-0", className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: bodies are generated from vetted icon sets at build time.
      dangerouslySetInnerHTML={{ __html: icon.body }}
      {...props}
    />
  );
}
