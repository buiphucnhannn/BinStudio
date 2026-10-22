"use client";

import { useCallback, useEffect, useState } from "react";
import Pic from "@/components/ui/Pic";
import Logo from "@/components/ui/Logo";
import BookingForm from "./BookingForm";
import { Check, Close, Messenger, Phone, WhatsApp, Zalo } from "@/components/ui/Icons";
import { lockScroll } from "@/lib/utils";

/**
 * Popup đặt lịch dùng chung toàn site.
 * Mở bằng bất kỳ phần tử nào có thuộc tính data-booking (giá trị tuỳ chọn = id dịch vụ để chọn sẵn).
 */
export default function BookingModal({ booking, services, site, lang }) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState("");

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onClick = (e) => {
      const el = e.target.closest("[data-booking]");
      if (!el) return;
      e.preventDefault();
      // data-booking="02" → chọn sẵn dịch vụ 02; data-booking (React render thành "true") → không chọn sẵn
      const v = el.getAttribute("data-booking") || "";
      setPreset(services.some((s) => s.n === v) ? v : "");
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [services]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    lockScroll(true);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open, close]);

  if (!open) return null;

  const quick = [
    { href: site.whatsapp, label: "WhatsApp", Icon: WhatsApp, ext: true },
    { href: site.zalo, label: "Zalo", Icon: Zalo, ext: true },
    { href: site.messenger, label: "Messenger", Icon: Messenger, ext: true },
    { href: `tel:${site.phoneIntl}`, label: site.phone, Icon: Phone },
  ];

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={booking.title}
    >
      <div
        className="absolute inset-0 [animation:fadeIn_.4s_ease-out_both] bg-ink/70 backdrop-blur-sm"
        onClick={close}
      />

      <div className="relative grid max-h-[calc(100svh-2rem)] w-full max-w-[980px] [animation:popIn_.55s_cubic-bezier(.22,1,.36,1)_both] overflow-hidden rounded-[1.75rem] bg-sand shadow-soft lg:grid-cols-[0.42fr_0.58fr] lg:rounded-[2rem]">
        {/* Cột ảnh (desktop) */}
        <div className="relative hidden lg:block">
          <Pic
            src={booking.image.src}
            alt=""
            fill
            sizes="420px"
            className="object-cover"
            style={{ objectPosition: booking.image.pos }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy/20 to-ink/10" />
          <div className="absolute inset-x-0 bottom-0 px-8 pt-8 pb-8 text-white">
            <p className="font-serif text-[1.7rem] leading-tight whitespace-pre-line">
              {booking.headline}
            </p>
            <ul className="mt-4 space-y-2">
              {booking.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-[13px] text-white/85">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-light" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cột form — data-lenis-prevent: Lenis không chặn cuộn bên trong popup */}
        <div
          data-lenis-prevent
          className="relative no-scrollbar max-h-[calc(100svh-2rem)] overflow-y-auto overscroll-contain px-5 py-6 sm:px-9 sm:py-8"
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition hover:bg-ink/5 hover:text-ink sm:top-4 sm:right-4"
          >
            <Close className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <Logo className="h-7 sm:h-9" />
            <h3 className="mt-2 font-serif text-[1.5rem] leading-tight text-ink sm:mt-4 sm:text-[2.2rem]">
              {booking.title}
            </h3>
            <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-balance text-ink-soft">
              {booking.desc}
            </p>
          </div>

          <div className="mt-4 sm:mt-6">
            <BookingForm
              booking={booking}
              services={services}
              site={site}
              preset={preset}
              lang={lang}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t border-ink/10 pt-4 text-[12px] text-ink-muted sm:mt-6 sm:pt-5">
            <span>{booking.fields.or}</span>
            {quick.map(({ href, label, Icon, ext }) => (
              <a
                key={label}
                href={href}
                target={ext ? "_blank" : undefined}
                rel={ext ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 text-ink/80 transition hover:text-ink"
              >
                <Icon className="h-4 w-4" /> {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
