"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

const tabsListClasses = "inline-flex h-12 items-center justify-center rounded-full bg-white/5 p-1";
const tabsTriggerClasses =
  "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-all data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow hover:text-white";

export const Tabs = TabsPrimitive.Root;
export const TabsList = ({ className, ...props }: TabsPrimitive.TabsListProps) => (
  <TabsPrimitive.List className={cn(tabsListClasses, className)} {...props} />
);
export const TabsTrigger = ({ className, ...props }: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger className={cn(tabsTriggerClasses, className)} {...props} />
);
export const TabsContent = TabsPrimitive.Content;
