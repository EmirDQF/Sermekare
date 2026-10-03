"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD_PX = 24;

/** TopBar + Navbar. Al hacer scroll, la TopBar se oculta y la Navbar se compacta en una cápsula con blur. */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled && "-translate-y-10",
      )}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-14 focus:z-[70] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:font-semibold focus:text-on-primary"
      >
        Saltar al contenido
      </a>
      <TopBar />
      <Navbar compact={scrolled} />
    </header>
  );
}
