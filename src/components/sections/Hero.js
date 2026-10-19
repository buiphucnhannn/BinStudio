"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Pic from "@/components/ui/Pic";
import SplitText from "@/components/fx/SplitText";
import { cn, pad2 } from "@/lib/utils";
import { ArrowRight } from "@/components/ui/Icons";

const TICK = 5200; // thời gian mỗi slide

/**
 * Hero "điện ảnh": một ảnh tràn màn hình, chuyển cảnh chậm (crossfade + ken burns) qua 5 bộ ảnh.
 * Desktop dùng ảnh ngang, mobile dùng ảnh dọc tương ứng. Chữ hiện từng ký tự, parallax khi cuộn.
 * Góc phải dưới: bộ đếm slide + thanh tiến độ; bấm để nhảy tới slide.
 */
export default function Hero({ hero, ui, exploreHref }) {
  const slides = hero.slides;
  const [idx, setIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const imgRef = useRef(null);
  const textRef = useRef(null);

  // Chờ màn chào (Preloader) kéo lên rồi mới chạy hiệu ứng mở màn
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
  const anim = (cls) => (ready ? cls : "opacity-0");

  // Parallax: ảnh trôi chậm hơn trang, chữ mờ dần khi cuộn
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (y > vh * 1.2) return;
      if (imgRef.current)
        imgRef.current.style.transform = `translate3d(0, ${(y * 0.28).toFixed(1)}px, 0)`;
      if (textRef.current) {
        textRef.current.style.transform = `translate3d(0, ${(y * 0.12).toFixed(1)}px, 0)`;
        textRef.current.style.opacity = String(Math.max(0, 1 - y / (vh * 0.7)));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Tự chuyển slide (chỉ chạy sau màn chào); đổi tay thì đếm lại từ đầu
  useEffect(() => {
    if (!ready) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % slides.length), TICK);
    return () => clearInterval(t);
  }, [ready, slides.length, idx]);

  return (
    <section
      id="top"
      data-nav-theme="dark"
      className="relative h-[var(--screen)] min-h-[640px] w-full overflow-hidden bg-navy-deep"
    >
      {/* Lớp ngoài chạy hiệu ứng mở màn (hero-panel); lớp trong crossfade từng slide bằng opacity —
          tách riêng vì animation fill:both sẽ ghi đè opacity nếu đặt chung một phần tử. */}
      <div
        ref={imgRef}
        className={cn(
          "absolute inset-0 bleed-cap will-change-transform",
          ready ? "hero-panel" : "opacity-0",
        )}
      >
        {slides.map((s, i) => (
          <div
            key={s.wide.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1800ms] ease-out",
              i === idx ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={i !== idx}
          >
            {/* desktop: ảnh ngang */}
            <Pic
              src={s.wide.src}
              alt=""
              fill
              preload={i === 0}
              sizes="100vw"
              className={cn("hidden object-cover sm:block", i === idx && "animate-kenburns-slow")}
              style={{ objectPosition: s.wide.pos }}
            />
            {/* mobile: ảnh dọc */}
            <Pic
              src={s.tall.src}
              alt=""
              fill
              preload={i === 0}
              sizes="100vw"
              className={cn("object-cover sm:hidden", i === idx && "animate-kenburns-slow")}
              style={{ objectPosition: s.tall.pos }}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/35 to-ink/10 sm:via-navy-deep/25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-deep/50 via-transparent to-transparent" />

      <div
        ref={textRef}
        className="relative z-10 flex h-full flex-col justify-center pt-24 pb-28 text-white will-change-transform sm:pt-28 sm:pb-32"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-16">
          <p
            className={cn(
              "mb-5 eyebrow text-accent-light text-legible",
              anim("[animation:fadeUp_1s_.8s_both]"),
            )}
          >
            {hero.eyebrow.split(" · ").map((part, i, arr) => (
              <span key={part} className={cn(i > 0 && i < arr.length - 1 && "hidden sm:inline")}>
                {i > 0 && " · "}
                {part}
              </span>
            ))}
          </p>
          <SplitText
            as="h1"
            mode="char"
            text={hero.title}
            accent={hero.accent}
            accentClass="italic text-sand-100"
            visible={ready}
            manual
            step={20}
            baseDelay={950}
            breakBeforeAccent
            className="max-w-5xl h-display text-[2.3rem] leading-[1.05] text-white text-legible-lg min-[380px]:text-[2.6rem] sm:text-[4.2rem] sm:leading-[1.02] lg:text-[5.4rem] xl:text-[6.2rem]"
          />
          <p
            className={cn(
              "mt-6 max-w-xl text-[15px] leading-relaxed font-medium text-white/90 text-legible sm:text-base",
              anim("[animation:fadeUp_1s_1.7s_both]"),
            )}
          >
            {hero.desc}
          </p>
          <div
            className={cn(
              "mt-8 flex w-full max-w-[290px] flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center",
              anim("[animation:fadeUp_1s_1.95s_both]"),
            )}
          >
            <button
              type="button"
              data-booking
              className="group relative inline-flex h-12 items-center justify-center rounded-full bg-white px-14 text-sm font-medium text-ink transition hover:bg-sand-100 sm:h-auto sm:justify-start sm:gap-3 sm:py-1.5 sm:pr-1.5 sm:pl-6"
            >
              {ui.book}
              <span className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition-transform group-hover:translate-x-0.5 sm:static">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
            <Link
              href={exploreHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/60 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur-sm transition text-legible hover:bg-white hover:text-ink hover:[text-shadow:none] sm:h-auto sm:py-3"
            >
              {ui.explore}
            </Link>
          </div>
        </div>
      </div>

      {/* Bộ đếm slide + thanh tiến độ (góc phải dưới) */}
      <div
        className={cn(
          "absolute right-5 bottom-7 z-10 flex items-end gap-5 text-white sm:right-8 lg:right-[max(4rem,calc((100vw-1312px)/2))]",
          anim("[animation:fadeUp_1s_2.2s_both]"),
        )}
      >
        <p className="hidden text-[11px] tracking-[0.25em] text-white/70 uppercase text-legible md:block">
          {slides[idx].label}
        </p>
        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.wide.src}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`${pad2(i + 1)} ${s.label}`}
              className="group flex h-6 items-center"
            >
              <span className="relative block h-px w-8 overflow-hidden bg-white/30 sm:w-10">
                {i === idx && (
                  <span
                    key={`${i}-${idx}`}
                    className="absolute inset-0 origin-left bg-accent-light"
                    style={{ animation: `slidebar ${TICK}ms linear both` }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <p className="font-serif text-2xl leading-none text-legible">
          {pad2(idx + 1)}
          <span className="text-white/50"> / {pad2(slides.length)}</span>
        </p>
      </div>

      <ul
        className={cn(
          "absolute bottom-7 left-5 z-10 hidden items-center gap-6 text-[11px] tracking-[0.25em] text-white/85 uppercase text-legible sm:left-8 lg:left-[max(4rem,calc((100vw-1312px)/2))] lg:flex",
          anim("[animation:fadeUp_1s_2.2s_both]"),
        )}
      >
        {hero.badges.map((b) => (
          <li key={b} className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-accent-light" />
            {b}
          </li>
        ))}
      </ul>
    </section>
  );
}
