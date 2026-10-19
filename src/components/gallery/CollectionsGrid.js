"use client";

import { useState } from "react";
import Link from "next/link";
import Pic from "@/components/ui/Pic";
import { cn, pad2 } from "@/lib/utils";
import { href } from "@/i18n";
import { ArrowRight } from "@/components/ui/Icons";

/**
 * Lưới bộ sưu tập có bộ lọc theo kiểu chụp. Thẻ xen kẽ tỉ lệ dọc/ngang theo ảnh bìa.
 */
export default function CollectionsGrid({ lang, collections, categories, ui }) {
  const [cat, setCat] = useState("");
  const list = cat ? collections.filter((c) => c.category === cat) : collections;
  const cats = Object.entries(categories);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setCat("")}
          className={cn(
            "rounded-full border px-4 py-2 text-[13px] transition",
            !cat
              ? "border-ink bg-ink text-white"
              : "border-ink/15 text-ink/70 hover:border-ink hover:text-ink",
          )}
        >
          {ui.all} · {collections.length}
        </button>
        {cats.map(([key, label]) => {
          const n = collections.filter((c) => c.category === key).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCat(key === cat ? "" : key)}
              className={cn(
                "rounded-full border px-4 py-2 text-[13px] transition",
                cat === key
                  ? "border-ink bg-ink text-white"
                  : "border-ink/15 text-ink/70 hover:border-ink hover:text-ink",
              )}
            >
              {label} · {n}
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-ink-muted">{ui.noResults}</p>
      ) : (
        <div className="mt-10 flex flex-wrap justify-center gap-5">
          {list.map((c, i) => (
            <Link
              key={c.slug}
              href={href(lang, `/bo-suu-tap/${c.slug}`)}
              className={cn(
                "group reveal relative block overflow-hidden rounded-[1.5rem] bg-sand-200",
                "aspect-[4/5] w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)]",
              )}
              style={{ "--reveal-delay": `${(i % 6) * 70}ms` }}
            >
              <Pic
                src={c.cover}
                alt={c.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                style={{ objectPosition: c.coverPos }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/10 to-transparent" />
              <span className="absolute top-5 left-5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium tracking-wider text-ink backdrop-blur lg:text-[10px]">
                {pad2(i + 1)}
              </span>
              <span className="absolute top-5 right-5 rounded-full border border-white/30 px-2.5 py-1 text-[10px] tracking-[0.2em] text-white/85 uppercase backdrop-blur">
                {c.images.length} {ui.photos}
              </span>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white">
                <div>
                  <p className="text-[11px] tracking-[0.3em] text-white/70 uppercase lg:text-[10px]">
                    {c.sub}
                  </p>
                  <h3 className="mt-1.5 font-serif text-[1.8rem] leading-tight">{c.name}</h3>
                  <p className="mt-1 text-[13px] text-white/75">{c.concept}</p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink transition group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
