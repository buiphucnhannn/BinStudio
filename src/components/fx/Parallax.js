"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Parallax nhẹ theo vị trí trong viewport.
 * speed > 0: phần tử di chuyển chậm hơn trang (cảm giác chiều sâu).
 */
export default function Parallax({
  speed = 0.12,
  className = "",
  children,
  as: Tag = "div",
  desktopOnly = false,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (desktopOnly && !window.matchMedia("(min-width: 1024px)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -200 || r.top > vh + 200) return;
      const center = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(-center * speed).toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed, desktopOnly]);

  return (
    <Tag ref={ref} className={cn("will-change-transform", className)} {...rest}>
      {children}
    </Tag>
  );
}
