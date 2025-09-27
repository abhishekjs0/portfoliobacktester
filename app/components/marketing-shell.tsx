import { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div id="main-content" className="site-main" role="main">
        {children}
      </div>
      <SiteFooter />
    </>
  );
}
