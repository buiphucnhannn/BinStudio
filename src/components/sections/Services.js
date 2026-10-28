"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Pic from "@/components/ui/Pic";
import { cn } from "@/lib/utils";
import { href } from "@/i18n";
import { ArrowRight, Check } from "@/components/ui/Icons";
import Ornament from "@/components/ui/Ornaments";

/**
 * Dịch vụ "sticky": khung ảnh bên trái dính theo màn hình, bên phải là 5 khối dịch vụ cuộn qua.
 * Khối nào đi qua tâm màn hình thì ảnh bên trái crossfade sang ảnh của khối đó.
 * Mobile: mỗi khối có ảnh riêng phía trên.
 */
export default function Services({ lang, services, ui }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  const items = services.items;
  const current = items[active];

  useEffect(() => {
    const els = refs.current.filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.i));
        });
      },
      // vùng quan sát là dải ngang ở giữa màn hình
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="services" className="relative overflow-x-clip bg-sand-50 py-16 lg:py-24">
      <Container wide>
        <p className="reveal eyebrow">{services.eyebrow}</p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h2
            className="reveal max-w-2xl h-display text-[2rem] sm:text-[2.6rem] lg:text-[3rem]"
            style={{ "--reveal-delay": "80ms" }}
          >
            {services.title}
          </h2>
          {/* Góc phải: khẩu độ xoay chậm + nút sang trang Dịch vụ — căn tâm tiêu đề */}
          <div
            className="reveal relative flex items-center gap-6"
            style={{ "--reveal-delay": "200ms" }}
          >
            <Ornament
              name="aperture"
              className="hidden w-24 animate-spin-slow text-ink/[0.12] lg:block"
            />
            <Link
              href={href(lang, "/services")}
              className="group inline-flex items-center gap-3 rounded-full border border-ink/15 py-1.5 pr-1.5 pl-6 text-sm font-medium text-ink transition hover:border-ink"
            >
              {services.allLabel}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
        <p
          className="reveal mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-base"
          style={{ "--reveal-delay": "160ms" }}
        >
          {services.desc}
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          {/* Khung ảnh dính (desktop): cao bằng đúng khối dịch vụ đầu tiên, dính khi cuộn */}
          <div className="hidden lg:block">
            <div
              className="group reveal sticky top-[6.5rem] h-[calc(100svh-12rem)] max-h-[860px] w-full overflow-hidden rounded-[1.75rem] bg-sand-200"
              data-reveal="clip"
            >
              {items.map((s, i) => (
                <div
                  key={s.n}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-[900ms] ease-out",
                    active === i ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden={active !== i}
                >
                  <Pic
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(min-width: 1440px) 616px, 42vw"
                    className={cn("object-cover", active === i && "animate-kenburns")}
                    style={{ objectPosition: s.pos }}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/75 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7 text-white">
                <div>
                  <p className="text-[11px] tracking-[0.3em] text-white/70 uppercase lg:text-[10px]">
                    {current.n} / {String(items.length).padStart(2, "0")}
                  </p>
                  <p className="mt-1 max-w-xs font-serif text-2xl leading-tight">{current.title}</p>
                </div>
                {current.collection && (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink transition duration-300 group-hover:translate-x-0.5 group-hover:bg-sand-100">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </div>
              {current.collection && (
                <Link
                  href={href(lang, `/collections/${current.collection}`)}
                  aria-label={`${ui.viewAlbum}: ${current.title}`}
                  className="absolute inset-0 z-10 rounded-[1.75rem]"
                />
              )}
            </div>
          </div>

          {/* Danh sách dịch vụ */}
          <ol className="space-y-5 lg:space-y-6">
            {items.map((s, i) => {
              const on = active === i;
              return (
                <li
                  key={s.n}
                  ref={(el) => (refs.current[i] = el)}
                  data-i={i}
                  className={cn(
                    "reveal relative overflow-hidden rounded-[1.75rem] border p-6 transition-all duration-700 sm:p-8",
                    on ? "border-accent/40 bg-white shadow-soft" : "border-ink/[0.06] bg-white/60",
                  )}
                  style={{ "--reveal-delay": `${120 + i * 60}ms` }}
                >
                  {/* Số thứ tự lớn mờ ở góc làm nền */}
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -top-5 -right-1 hidden font-serif text-[7.5rem] leading-none transition-colors duration-700 select-none lg:block",
                      on ? "text-accent-light/60" : "text-sand-200",
                    )}
                  >
                    {s.n}
                  </span>
                  {/* Mobile: ảnh của dịch vụ */}
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl bg-sand-200 lg:hidden">
                    <Pic
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="82vw"
                      className="object-cover"
                      style={{ objectPosition: s.pos }}
                    />
                  </div>
                  <h3 className="relative max-w-[85%] font-serif text-2xl leading-snug text-ink sm:text-[1.7rem]">
                    {s.title}
                  </h3>
                  <p className="relative mt-3 text-[14.5px] leading-relaxed text-ink-soft sm:text-[15px]">
                    {s.desc}
                  </p>
                  <ul className="relative mt-5 flex flex-wrap gap-x-6 gap-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-[13px] text-ink">
                        <Check className="h-3.5 w-3.5 text-accent-deep" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="relative mt-6 flex flex-wrap gap-2">
                    <button
                      type="button"
                      data-booking={s.n}
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-graphite"
                    >
                      {ui.book} <ArrowRight className="h-4 w-4" />
                    </button>
                    {s.collection && (
                      <Link
                        href={href(lang, `/collections/${s.collection}`)}
                        className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-[13px] font-medium text-ink transition hover:border-ink"
                      >
                        {ui.viewAlbum}
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
