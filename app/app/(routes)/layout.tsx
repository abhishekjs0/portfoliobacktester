import { ReactNode } from "react";
import { MarketingShell } from "@/components/marketing-shell";

export default function RoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <MarketingShell>{children}</MarketingShell>;
}
