import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { appConfig } from "root/project.config";
import { Icon } from "./icons";
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
import { Socials } from "./socials";
import { Button } from "./ui/button";
import { TransitionLink } from "./utils/link";

const currentYear = new Date().getFullYear();
export function FooterSection() {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );
  if (selectedStyle === "minimal") {
    return <footer className={cn("w-full mx-auto px-6 py-8 mb-20",selectedStyle === "minimal" ? "max-w-3xl" : "max-w-app")}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <TransitionLink href="/" className="inline-block">
            <Logo className="h-7 w-auto" />
          </TransitionLink>
        </div>

        <div className="flex items-center gap-4">
          <Socials />
          <div className="w-px h-4 bg-border" />

          <div className="flex gap-4 text-xs text-muted-foreground">
            {appConfig.footerLinks.general.map((link) => {
              if (link.label.toLowerCase() === "home") return null; // Skip Home link
              return (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </TransitionLink>
              );
            })}

          </div>
          <div className="w-px h-4 bg-border" />
          <GoToTopButton />
        </div>
      </div>
    </footer>
  }
  return (
    <footer className="w-full mx-auto max-w-app px-6 py-12 md:py-16 lg:px-8">
      <div className="xl:grid xl:grid-cols-3 xl:gap-8">
        <div className="space-y-8 xl:col-span-1">
          <TransitionLink href="/" className="inline-block">
            <Logo className="h-9 w-auto" />
          </TransitionLink>
          <p className="text-sm leading-6 text-muted-foreground max-w-sm">
            {appConfig.description}
          </p>
          <div className="flex space-x-6">
            <Socials />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-8 w-full">
            {Object.entries(appConfig.footerLinks).map(
              ([category, links]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold leading-6 text-foreground capitalize tracking-wider">
                    {category}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {links.map((link) => (
                      <li key={link.href}>
                        <TransitionLink
                          className="group relative inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                          href={link.href}
                          prefetch={false}
                        >
                          <span className="relative">
                            {link.label}
                            <span className="absolute -bottom-0.5 left-0 h-[1px] w-full origin-right scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100" />
                          </span>

                          <Icon
                            name="arrow-up-right"
                            className="ml-1 size-3 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                          />
                        </TransitionLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-border/40 pt-8 sm:mt-20 lg:mt-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs leading-5 text-muted-foreground">
            <p>
              &copy; {currentYear} {appConfig.displayName}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <TransitionLink
                href="/legal/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </TransitionLink>
              <TransitionLink
                href="/legal/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </TransitionLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <GoToTopButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
export function GoToTopButton({ className }: { className?: string }) {
  const handleClick = () => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button variant="ghost" size="icon_sm" rounded="full" onClick={handleClick} className={className}>
      <Icon name="arrow-up" />
    </Button>
  );
}
