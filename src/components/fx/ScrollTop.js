"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp } from "@/components/ui/Icons";

// Nút cuộn lên đầu trang (góc trái dưới), hiện sau khi cuộn qua hero.
export default function ScrollTop({ label }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={toTop}
      aria-label={label}
      className={cn(
        "fixed bottom-3 left-3 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/70 text-ink shadow-card backdrop-blur-md transition-all duration-500 hover:bg-ink hover:text-white sm:bottom-4 sm:left-4",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp />
    </button>
  );
}
