"use client";

import type { ComponentProps } from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("inline-flex rounded-full border border-line bg-card-solid p-1.5 shadow-soft", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 font-display text-[0.975rem] font-semibold text-muted transition-colors duration-200",
        "hover:text-heading data-[state=active]:bg-navy data-[state=active]:text-white",
        "dark:data-[state=active]:bg-teal dark:data-[state=active]:text-navy [&_svg]:size-5",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("focus-visible:outline-none", className)} {...props} />;
}
