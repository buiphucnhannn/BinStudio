"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

/**
 * Màn chào khi TẢI TRANG: nền kem + logo + vạch nạp, rồi tấm màn kéo lên.
 * Khi màn bắt đầu kéo lên: phát sự kiện "bin:ready" + class is-ready trên <html> để Hero mở màn đúng lúc.
 */
const SHOW_MS = 1200;
const LEAVE_MS = 900;

export default function Preloader({ caption }) {
  const [state, setState] = useState("show"); // show | leave | done

  useEffect(() => {
    const t1 = setTimeout(() => {
      setState("leave");
      document.documentElement.classList.add("is-ready");
      window.dispatchEvent(new Event("bin:ready"));
    }, SHOW_MS);
    const t2 = setTimeout(() => setState("done"), SHOW_MS + LEAVE_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (state === "done") return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-sand transition-transform ease-expo",
        state === "leave" ? "-translate-y-full duration-[900ms]" : "translate-y-0",
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center transition-all duration-500",
          state === "leave" ? "-translate-y-6 opacity-0" : "[animation:fadeUp_.9s_ease-out_both]",
        )}
      >
        <Logo className="h-14 sm:h-16" preload />
        <p className="mt-5 text-[10px] tracking-[0.4em] text-ink-muted uppercase">{caption}</p>
        <span className="relative mt-7 block h-px w-28 overflow-hidden bg-ink/10">
          <span className="absolute inset-y-0 left-0 w-full origin-left [animation:loadbar_1.1s_cubic-bezier(.22,1,.36,1)_.1s_both] bg-accent" />
        </span>
      </div>
    </div>
  );
}
