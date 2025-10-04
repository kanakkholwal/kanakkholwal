import { cn } from "@/lib/utils";
import { DATA } from "~/data/resume";

export function Socials(props: React.ComponentProps<"div">) {
  return (
    <div {...props} className={cn("flex gap-3", props.className)}>
      {Object.entries(DATA.contact.social).map(([name, social]) => {
        if (!social.navbar) return null;
        return (
          <a
            href={social.url}
            rel="noreferrer noopener"
            target="_blank"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground size-8 [&_svg]:size-5 text-muted-foreground"
            data-active="false"
            key={name}
          >
            <social.icon />
          </a>
        );
      })}
    </div>
  );
}
