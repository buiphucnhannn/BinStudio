"use client";

import { useEffect, useState } from "react";

/**
 * Chỉ gắn nội dung (thường là ảnh) sau khi màn chào kéo lên — dành cho ảnh nằm ngay dưới hero:
 * lúc tải trang, trình duyệt sẽ không tải sớm các ảnh này (chúng nằm trong vùng "lazy" gần màn hình đầu)
 * nên băng thông dành cho hero. Khách vẫn đang ở hero khi màn chào kéo lên → không thấy khác biệt.
 * Chuyển trang trong site (màn chào đã chạy) → hiện ngay.
 */
export default function AfterIntro({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const on = () => setReady(true);
    const already = document.documentElement.classList.contains("is-ready");
    const fallback = setTimeout(on, already ? 0 : 4000);
    window.addEventListener("bin:ready", on);
    return () => {
      window.removeEventListener("bin:ready", on);
      clearTimeout(fallback);
    };
  }, []);

  return ready ? children : null;
}
