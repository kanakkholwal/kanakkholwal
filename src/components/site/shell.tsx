import type { CSSProperties, ReactNode } from "react";
import { SiteFooter } from "./footer";
import { SiteHeader } from "./header";
import { NavProgress } from "./nav-progress";
import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";

const VT_SIDEBAR = { "--vt-name": "site-sidebar" } as CSSProperties;

const HATCH =
  "bg-[repeating-linear-gradient(-45deg,var(--border)_0_1px,transparent_1px_7px)] border-border border-dashed";

/** Desktop: hatched rails, a sticky sidebar and a content pane. Mobile: top nav over one column. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto min-h-dvh w-full lg:max-w-[76rem] lg:border-border lg:border-x lg:border-dashed">
      <NavProgress />
      <div aria-hidden className={`absolute inset-y-0 right-full hidden w-6 border-l xl:block ${HATCH}`} />
      <div aria-hidden className={`absolute inset-y-0 left-full hidden w-6 border-r xl:block ${HATCH}`} />

      <div className="lg:grid lg:grid-cols-[18.5rem_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-dvh border-border border-r border-dashed lg:block" style={VT_SIDEBAR}>
          <Sidebar />
        </aside>
        <div className="flex min-h-dvh min-w-0 flex-col">
          <div className="lg:hidden">
            <SiteHeader />
          </div>
          <TopBar />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}
