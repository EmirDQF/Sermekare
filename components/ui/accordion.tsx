"use client";

import type { ComponentProps } from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("rounded-3xl border border-line bg-card-solid transition-shadow data-[state=open]:shadow-soft", className)}
      {...props}
    />
  );
}

export function AccordionTrigger({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header asChild>
      <h3>
        <AccordionPrimitive.Trigger
          className={cn(
            "group flex min-h-16 w-full items-center justify-between gap-4 rounded-3xl px-5 py-4 text-left font-display text-[1.05rem] font-semibold text-heading sm:px-6",
            className,
          )}
          {...props}
        >
          {children}
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-teal-tint text-primary transition-transform duration-300 group-data-[state=open]:rotate-180">
            <ChevronDown aria-hidden className="size-5" strokeWidth={1.75} />
          </span>
        </AccordionPrimitive.Trigger>
      </h3>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-fade-in" {...props}>
      <div className={cn("px-5 pb-6 text-muted sm:px-6", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
