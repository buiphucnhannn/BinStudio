"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { href, toCanonicalPath } from "@/i18n";
import { rememberLang, savedLang } from "@/lib/lang";
import { Close } from "@/components/ui/Icons";

/**
 * Gợi ý đổi ngôn ngữ thay cho tự chuyển hướng: link tiếng Việt luôn mở tiếng Việt (đúng địa chỉ khách bấm),
 * nhưng khách CHƯA chọn ngôn ngữ mà trình duyệt không dùng tiếng Việt → thanh nhỏ mời xem bản tiếng Anh;
 * ngược lại đang ở bản tiếng Anh mà trình duyệt dùng tiếng Việt → mời xem bản tiếng Việt.
 * Bấm lựa chọn nào cũng được nhớ 1 năm (cookie, src/lib/lang.js) → không hỏi lại, proxy mở đúng ngôn ngữ.
 */
const DELAY_MS = 2200; // hiện sau màn chào (Preloader) để không chồng lên

export default function LangSuggest({ lang, copy }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const target = lang === "vi" ? "en" : "vi";
  const c = copy[target];

  useEffect(() => {
    if (savedLang()) return; // đã tự chọn ngôn ngữ
    const browser = (navigator.languages?.[0] || navigator.language || "").toLowerCase();
    const prefersVi = browser.startsWith("vi");
    if (lang === "vi" ? prefersVi : !prefersVi) return; // trang đang đúng ngôn ngữ của trình duyệt
    const timer = setTimeout(() => setShow(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [lang]);

  if (!show) return null;
  const stay = () => {
    rememberLang(lang);
    setShow(false);
  };

  return (
    <div
      role="region"
      aria-label={c.text}
      lang={target}
      className="fixed inset-x-3 top-[84px] z-40 mx-auto flex max-w-[42rem] [animation:fadeIn_.35s_ease-out_both] flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl bg-ink/95 py-3 pr-11 pl-4 text-[13px] text-white shadow-soft backdrop-blur sm:top-[96px] sm:flex-nowrap sm:rounded-full sm:py-2 sm:pl-5"
    >
      {/* Mobile: câu chiếm trọn 1 hàng, nút xuống hàng dưới; từ sm: cùng 1 hàng */}
      <p className="w-full min-w-0 leading-snug text-white/85 sm:w-auto sm:flex-1">{c.text}</p>
      <div className="flex shrink-0 items-center gap-2">
        {/* Thẻ <a> thường (tải lại trang) như nút VI/EN — đổi cả layout gốc (html lang, metadata) */}
        <a
          href={href(target, toCanonicalPath(pathname))}
          hrefLang={target}
          onClick={() => rememberLang(target)}
          className="rounded-full bg-white px-4 py-1.5 font-medium whitespace-nowrap text-ink transition hover:bg-sand-100"
        >
          {c.go}
        </a>
        <button
          type="button"
          onClick={stay}
          lang={lang}
          className="rounded-full px-3 py-1.5 whitespace-nowrap text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          {c.stay}
        </button>
      </div>
      <button
        type="button"
        onClick={stay}
        aria-label={c.stay}
        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white sm:top-1/2 sm:-translate-y-1/2"
      >
        <Close className="h-4 w-4" />
      </button>
    </div>
  );
}
