import { Icon, IconType } from "@/components/icons";
import { cn } from "@/lib/utils";
import { appConfig } from "root/project.config";

const socials = Object.entries(appConfig.social) as [IconType, string][];

export function Socials(props: React.ComponentProps<"div">) {
  return (
    <div {...props} className={cn("flex gap-3", props.className)}>
      {socials.map(([name, url]) => {
        return (
          <a
            href={url}
            rel="noreferrer noopener"
            target="_blank"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground size-8 [&_svg]:size-5 text-muted-foreground"
            data-active="false"
            key={name}
          >
            <Icon name={name} />
          </a>
        );
      })}
    </div>
  );
}
