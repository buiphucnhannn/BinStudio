"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Pic from "@/components/ui/Pic";
import Lightbox from "@/components/ui/Lightbox";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/**
 * "Một ngày với Bin": lưới ảnh 8 tấm có mốc giờ, như một tờ contact sheet —
 * từ bình minh tới giờ xanh. Ảnh ngang chiếm 2 cột; hàng cuối thiếu ảnh thì căn giữa. Bấm mở lightbox.
 */
export default function DayGrid({ data }) {
  const [idx, setIdx] = useState(null);
  const images = data.items.map((m) => ({ src: m.src, alt: m.time }));

  return (
    <section className="relative overflow-hidden bg-sand-100 py-16 lg:py-24">
      <Container wide>
        <SectionHeading eyebrow={data.eyebrow} title={data.title} align="center" />
        <div className="mt-12 flex flex-wrap justify-center gap-3 md:gap-4">
          {data.items.map((m, i) => (
            <button
              key={m.src}
              type="button"
              onClick={() => setIdx(i)}
              className={cn(
                "group reveal relative overflow-hidden rounded-2xl bg-sand-200",
                m.wide
                  ? "aspect-[3/2] w-full md:w-[calc(50%-0.5rem)]"
                  : "aspect-[3/4] w-[calc(50%-0.375rem)] md:w-[calc(25%-0.75rem)]",
              )}
              style={{ "--reveal-delay": `${i * 70}ms` }}
              aria-label={m.time}
            >
              <Pic
                src={m.src}
                alt=""
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                style={{ objectPosition: m.pos }}
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-navy-deep/60 px-2.5 py-1 font-sans text-[11px] tracking-[0.15em] text-accent-light tabular-nums backdrop-blur">
                {m.time}
              </span>
            </button>
          ))}
        </div>
      </Container>
      <Lightbox images={images} index={idx} onClose={() => setIdx(null)} onChange={setIdx} />
    </section>
  );
}
