"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TOAST_EVENT } from "@/lib/toast";
import { Check, Close } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

/**
 * Khung hiển thị toast (đặt 1 lần trong layout).
 * - Render qua portal ở cuối <body> với z-index cao nhất site (trên popup, lightbox, màn chào).
 * - Desktop: góc phải trên; mobile: trên cùng, rộng gần hết màn hình.
 * - Thanh tiến độ đếm ngược; rê chuột / chạm giữ để tạm dừng; tối đa 4 toast cùng lúc.
 */
const MAX = 4;
const LEAVE_MS = 350;

const TONE = {
  success: { ring: "bg-emerald-500", bar: "bg-emerald-400", icon: <Check className="h-4 w-4" /> },
  error: {
    ring: "bg-red-500",
    bar: "bg-red-400",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M12 7v6M12 17h.01" />
      </svg>
    ),
  },
  info: {
    ring: "bg-accent",
    bar: "bg-accent-light",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M12 11v6M12 7h.01" />
      </svg>
    ),
  },
};

function ToastItem({ t, onClose }) {
  const tone = TONE[t.type] || TONE.info;
  const [shown, setShown] = useState(false);
  const [paused, setPaused] = useState(false);
  const left = useRef(t.duration);
  const startedAt = useRef(0);

  useEffect(() => {
    const r = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(r);
  }, []);

  // Đếm ngược còn lại; dừng khi hover / đang đóng
  useEffect(() => {
    if (!t.duration || paused || t.leaving) return;
    startedAt.current = Date.now();
    const timer = setTimeout(() => onClose(t.id), left.current);
    return () => {
      clearTimeout(timer);
      left.current -= Date.now() - startedAt.current;
    };
  }, [paused, t.duration, t.id, t.leaving, onClose]);

  return (
    <div
      role={t.type === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      className={cn(
        "pointer-events-auto relative w-full overflow-hidden rounded-2xl border border-white/10 bg-navy-deep/95 text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-[350ms] ease-out-expo sm:w-[380px]",
        shown && !t.leaving
          ? "translate-y-0 opacity-100 sm:translate-x-0"
          : "-translate-y-3 opacity-0 sm:translate-x-6 sm:translate-y-0",
      )}
    >
      <div className="flex items-start gap-3.5 py-4 pr-11 pl-4">
        <span
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white",
            tone.ring,
          )}
        >
          {tone.icon}
        </span>
        <div className="min-w-0">
          <p className="text-[15px] leading-snug font-semibold">{t.title}</p>
          {t.desc && <p className="mt-1 text-[13.5px] leading-relaxed text-white/75">{t.desc}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onClose(t.id)}
        aria-label="Close"
        className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
      >
        <Close className="h-4 w-4" />
      </button>
      {t.duration > 0 && (
        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/5">
          <span
            className={cn("block h-full origin-left", tone.bar)}
            style={{
              animation: `toastbar ${t.duration}ms linear forwards`,
              animationPlayState: paused ? "paused" : "running",
            }}
          />
        </span>
      )}
    </div>
  );
}

export default function Toaster() {
  const [items, setItems] = useState([]);

  const close = useCallback((id) => {
    setItems((list) => list.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
    setTimeout(() => setItems((list) => list.filter((x) => x.id !== id)), LEAVE_MS);
  }, []);

  useEffect(() => {
    const onToast = (e) => {
      const d = e.detail;
      if (d.dismiss) return close(d.id);
      setItems((list) => [...list, d].slice(-MAX));
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, [close]);

  // Chỉ có toast sau khi có sự kiện phía trình duyệt → document luôn sẵn sàng khi render portal
  if (!items.length) return null;
  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-3 top-3 z-[1000] flex flex-col items-stretch gap-2.5 sm:inset-x-auto sm:top-5 sm:right-5 sm:items-end"
    >
      {items.map((t) => (
        <ToastItem key={t.id} t={t} onClose={close} />
      ))}
    </div>,
    document.body,
  );
}
