import { appConfig } from "root/project.config";
import { Icon } from "./icons";
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
import { Socials } from "./socials";
import { Button } from "./ui/button";
import { TransitionLink } from "./utils/link";

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
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

        {/* 3. BOTTOM BAR (Legal & Toggle) */}
        <div className="mt-16 border-t border-border/40 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs leading-5 text-muted-foreground">
              <p>
                &copy; {currentYear} {appConfig.name}. All rights reserved.
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
      </div>
    </footer>
  );
}
export function GoToTopButton({ className }: { className?: string }) {
  const handleClick = () => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button variant="ghost" size="icon_sm" rounded="full" onClick={handleClick}>
      <Icon name="arrow-up" />
    </Button>
  );
}
