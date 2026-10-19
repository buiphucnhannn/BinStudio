"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Pic from "@/components/ui/Pic";
import { ArrowRight, MapPin, Sun } from "@/components/ui/Icons";
import { cn, pad2 } from "@/lib/utils";

/**
 * Địa điểm dạng "bản đồ tương tác":
 * - Trái: danh sách 6 điểm (rê chuột / bấm để chọn).
 * - Phải: ảnh lớn crossfade theo điểm đang chọn.
 * Mobile: ảnh ở trên, danh sách bên dưới.
 */
export default function Locations({ data, ui }) {
  const [active, setActive] = useState(0);
  const items = data.items;
  const cur = items[active];

  return (
    <section id="locations" className="relative overflow-x-clip bg-sand py-16 lg:py-24">
      <Container wide>
        {/* Tiêu đề nằm hàng riêng để khối danh sách + ảnh bên dưới vừa một màn hình */}
        <p className="reveal eyebrow">{data.eyebrow}</p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2
            className="reveal max-w-2xl h-display text-[2rem] sm:text-[2.6rem] lg:text-[3rem]"
            style={{ "--reveal-delay": "80ms" }}
          >
            {data.title}
          </h2>
          <p
            className="reveal max-w-md text-[15px] leading-relaxed text-ink-soft sm:text-base md:text-right"
            style={{ "--reveal-delay": "160ms" }}
          >
            {data.desc}
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:gap-14 xl:gap-20">
          {/* Trái: danh sách */}
          <div className="order-2 lg:order-1">
            <ol className="divide-y divide-ink/10 border-y border-ink/10">
              {items.map((l, i) => {
                const on = i === active;
                return (
                  <li
                    key={l.name}
                    className="reveal"
                    style={{ "--reveal-delay": `${150 + i * 60}ms` }}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  >
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-pressed={on}
                      className="group flex w-full items-center gap-4 py-2.5 text-left"
                    >
                      <span
                        className={cn(
                          "w-7 shrink-0 font-sans text-xs font-medium tracking-wide tabular-nums transition-colors",
                          on ? "text-accent-deep" : "text-ink-muted",
                        )}
                      >
                        {pad2(i + 1)}
                      </span>
                      <span className="flex-1">
                        <span
                          className={cn(
                            "block font-serif text-xl leading-snug transition-colors sm:text-[1.4rem]",
                            on ? "text-ink" : "text-ink/55 group-hover:text-ink",
                          )}
                        >
                          {l.name}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase transition-colors",
                            on ? "text-accent-deep" : "text-ink-muted",
                          )}
                        >
                          <Sun className="h-3 w-3" /> {ui.bestTime}: {l.best}
                        </span>
                      </span>
                      <ArrowRight
                        className={cn(
                          "h-4 w-4 shrink-0 transition-all",
                          on ? "translate-x-0 text-ink opacity-100" : "-translate-x-1 opacity-0",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Phải: ảnh lớn + thẻ bản đồ */}
          <div className="order-1 lg:order-2 lg:flex lg:flex-col">
            <div
              className="reveal relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand-200 sm:aspect-[5/4] lg:aspect-auto lg:min-h-[400px] lg:flex-1"
              data-reveal="clip"
            >
              {items.map((l, i) => (
                <div
                  key={l.name}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-[900ms] ease-out",
                    active === i ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden={active !== i}
                >
                  <Pic
                    src={l.image.src}
                    alt={l.name}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className={cn("object-cover", active === i && "animate-kenburns")}
                    style={{ objectPosition: l.image.pos }}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                <p className="flex items-center gap-2 text-[11px] tracking-[0.2em] text-accent-light uppercase">
                  <Sun className="h-3.5 w-3.5" /> {ui.bestTime}: {cur.best}
                </p>
                <h3 className="mt-2 flex items-center gap-2 font-serif text-3xl sm:text-4xl">
                  <MapPin className="h-6 w-6 text-white/70" /> {cur.name}
                </h3>
                <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/80">
                  {cur.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
