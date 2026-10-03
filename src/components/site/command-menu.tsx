import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { resume_link } from "root/project.config";
import { Icon, type IconType } from "@/components/icons";
import {
  Command,
  CommandBar,
  CommandDialog,
  CommandEmpty,
  CommandFilter,
  CommandFilters,
  CommandFooter,
  CommandGroup,
  CommandHint,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command/command";
import { toast } from "@/components/ui/toast";
import { useProjects } from "@/lib/content";
import { EMAIL, isGroup, NAV, SOCIALS } from "./nav";

const Ctx = createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);

export function useCommandMenu() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCommandMenu must be used inside <CommandMenuProvider>");
  return ctx;
}

export function CommandMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(() => ({ open, setOpen }), [open]);
  return (
    <Ctx.Provider value={value}>
      {children}
      <CommandMenu open={open} setOpen={setOpen} />
    </Ctx.Provider>
  );
}

const PAGES = [
  { label: "Home", href: "/", icon: "home" as const },
  ...NAV.flatMap((entry) =>
    isGroup(entry)
      ? entry.items.map((i) => ({ label: i.label, href: i.href, icon: i.icon ?? ("document" as const) }))
      : entry.href === "/"
        ? []
        : [{ label: entry.label[0].toUpperCase() + entry.label.slice(1), href: entry.href, icon: "document" as const }],
  ),
];

type Scope = "all" | "pages" | "projects" | "actions" | "links";

const SCOPES: { value: Scope; label: string; icon: IconType }[] = [
  { value: "all", label: "Everything", icon: "layers" },
  { value: "pages", label: "Pages", icon: "document" },
  { value: "projects", label: "Projects", icon: "rocket" },
  { value: "actions", label: "Actions", icon: "sparkles" },
  { value: "links", label: "Elsewhere", icon: "link" },
];

function CommandMenu({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const navigate = useNavigate();
  const projects = useProjects();
  const { resolvedTheme, setTheme } = useTheme();
  const [scope, setScope] = useState<Scope>("all");
  const shows = (s: Scope) => scope === "all" || scope === s;

  const run = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };
  const go = (href: string) => run(() => void navigate({ to: href }));
  const visit = (href: string) => run(() => window.open(href, "_blank", "noopener,noreferrer"));

  return (
    <CommandDialog open={open} onOpenChange={setOpen} label="Search the site" variant="launcher">
      <Command loop>
        <CommandBar>
          <CommandInput placeholder="Jump to a page, project or link…" />
          <CommandFilters value={scope} onValueChange={(v) => setScope(v as Scope)} label="Show">
            {SCOPES.map((s) => (
              <CommandFilter key={s.value} value={s.value} label={s.label}>
                <Icon name={s.icon} className="size-4" />
              </CommandFilter>
            ))}
          </CommandFilters>
        </CommandBar>
        <CommandList>
          <CommandEmpty>Nothing matches. Try a project name.</CommandEmpty>
          {shows("pages") ? (
            <CommandGroup heading="Pages">
              {PAGES.map((p) => (
                <CommandItem key={p.href} value={`page ${p.label}`} onSelect={go(p.href)}>
                  <Icon name={p.icon} className="size-4 text-muted-foreground" />
                  {p.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          {shows("projects") ? (
            <CommandGroup heading="Projects">
              {projects.map((p) => (
                <CommandItem
                  key={p.id}
                  value={`project ${p.title}`}
                  keywords={p.technologies.join(" ")}
                  onSelect={go(`/projects/${p.id}`)}
                >
                  <Icon name="rocket" className="size-4 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate">{p.title}</span>
                  <CommandShortcut>{p.dates}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          {shows("actions") ? (
            <CommandGroup heading="Actions">
              <CommandItem
                value="copy email"
                keywords="mail contact"
                onSelect={run(() => {
                  void navigator.clipboard.writeText(EMAIL).then(
                    () => toast.success("Email copied", { description: EMAIL }),
                    () => toast.error("Couldn't reach the clipboard", { description: EMAIL }),
                  );
                })}
              >
                <Icon name="copy" className="size-4 text-muted-foreground" />
                Copy email
              </CommandItem>
              <CommandItem
                value="toggle theme"
                keywords="dark light mode"
                onSelect={run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))}
              >
                <Icon name={resolvedTheme === "dark" ? "sun" : "moon"} className="size-4 text-muted-foreground" />
                Switch to {resolvedTheme === "dark" ? "light" : "dark"} mode
              </CommandItem>
              <CommandItem value="resume" keywords="cv download" onSelect={visit(resume_link)}>
                <Icon name="download" className="size-4 text-muted-foreground" />
                Open resume
              </CommandItem>
            </CommandGroup>
          ) : null}
          {shows("links") ? (
            <CommandGroup heading="Elsewhere">
              {SOCIALS.map((s) => (
                <CommandItem key={s.href} value={`social ${s.label}`} keywords={s.handle} onSelect={visit(s.href)}>
                  <Icon name={s.icon} className="size-4 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate">{s.label}</span>
                  <CommandShortcut>{s.handle}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
        <CommandFooter>
          <span className="flex items-center gap-4">
            <CommandHint keys={["↑", "↓"]}>Move</CommandHint>
            <CommandHint keys={["↵"]}>Open</CommandHint>
          </span>
          <CommandHint keys={["Esc"]}>Close</CommandHint>
        </CommandFooter>
      </Command>
    </CommandDialog>
  );
}
