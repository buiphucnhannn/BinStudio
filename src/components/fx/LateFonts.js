"use client";

import { useEffect } from "react";

/**
 * Font chữ viết tay (Great Vibes) chỉ dùng cho chữ ký / watermark trang trí → tải SAU khi trang đã tải xong,
 * không chen băng thông lúc trang đang hiện. Trước đó chữ .font-script được ẩn (xem globals.css);
 * tải xong font thì thêm class "script-ready" lên <html> để chữ hiện ra đúng font.
 */
export default function LateFonts() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("script-ready")) return;
    const done = () => root.classList.add("script-ready");
    const run = () => {
      const family = getComputedStyle(root).getPropertyValue("--font-script").trim();
      (family ? document.fonts.load(`400 1em ${family}`) : Promise.resolve()).then(done, done);
    };
    if (document.readyState === "complete") {
      run();
      return;
    }
    window.addEventListener("load", run, { once: true });
    return () => window.removeEventListener("load", run);
  }, []);

  return null;
}
