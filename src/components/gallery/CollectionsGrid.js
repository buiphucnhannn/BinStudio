"use client";

import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Pic from "@/components/ui/Pic";
import { cn, pad2 } from "@/lib/utils";
import { href } from "@/i18n";
import { SEARCH_MAX, parseQuery, score, toIndex } from "@/lib/search";
import { ArrowRight, Close, Search } from "@/components/ui/Icons";

/**
 * Lưới bộ sưu tập: ô tìm kiếm + bộ lọc theo kiểu chụp.
 * Tìm ngay trên trình duyệt (27 album, không gọi server) — quy tắc khớp & xếp hạng xem src/lib/search.js;
 * gõ tiếng Anh trên bản Việt vẫn ra (searchExtra). Kết quả xếp theo mức liên quan; số trên mỗi ô lọc theo kết quả tìm.
 * Từ khoá chỉ được so khớp chuỗi và hiển thị dạng text (React tự escape) — không HTML, không RegExp từ dữ liệu người dùng.
 * Phím tắt: "/" nhảy vào ô tìm, Esc xoá.
 */
export default function CollectionsGrid({ lang, collections, categories, searchExtra = {}, ui }) {
  const [cat, setCat] = useState("");
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const inputId = useId();
  const deferred = useDeferredValue(query);

  // Trọng số: tên 4 · phong cách / loại hình / bản ngôn ngữ kia 2 · mô tả 1
  const index = useMemo(
    () =>
      collections.map((c) =>
        toIndex([
          [c.name, 4],
          [c.sub, 2],
          [c.concept, 2],
          [categories[c.category], 2],
          [searchExtra[c.slug], 2],
          [c.desc, 1],
        ]),
      ),
    [collections, categories, searchExtra],
  );
  const q = parseQuery(deferred);
  const searching = q.words.length > 0;
  const found = searching
    ? collections
        .map((c, i) => ({ c, i, s: score(index[i], q) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s || a.i - b.i)
        .map((r) => r.c)
    : collections;
  const list = cat ? found.filter((c) => c.category === cat) : found;
  const cats = Object.entries(categories);

  // "/" để nhảy vào ô tìm (trừ khi đang gõ ở ô khác)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const reset = () => {
    setQuery("");
    setCat("");
    inputRef.current?.focus();
  };

  const chip = (active) =>
    cn(
      "shrink-0 snap-start rounded-full border px-4 py-2 text-[13px] whitespace-nowrap transition",
      active
        ? "border-ink bg-ink text-white"
        : "border-ink/15 text-ink/70 hover:border-ink hover:text-ink",
    );

  return (
    <div>
      <form
        role="search"
        aria-label={ui.search}
        onSubmit={(e) => {
          e.preventDefault();
          inputRef.current?.blur(); // mobile: ẩn bàn phím để xem kết quả
        }}
        className="mx-auto max-w-xl"
      >
        <label htmlFor={inputId} className="sr-only">
          {ui.search}
        </label>
        <div className="group relative">
          <Search className="pointer-events-none absolute top-1/2 left-5 h-[18px] w-[18px] -translate-y-1/2 text-ink-muted transition group-focus-within:text-ink" />
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value.slice(0, SEARCH_MAX))}
            onKeyDown={(e) => {
              if (e.key === "Escape" && query) {
                e.preventDefault();
                setQuery("");
              }
            }}
            maxLength={SEARCH_MAX}
            placeholder={ui.searchPlaceholder}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="search"
            className="h-[52px] w-full rounded-full border border-ink/12 bg-white/80 pr-12 pl-12 text-base text-ink shadow-card transition outline-none placeholder:text-ink-muted/80 focus:border-ink/40 focus:bg-white focus:ring-4 focus:ring-ink/[0.06] sm:pr-16 sm:text-[15px] [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label={ui.searchClear}
              className="absolute top-1/2 right-2.5 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition hover:bg-ink/5 hover:text-ink"
            >
              <Close className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute top-1/2 right-5 hidden -translate-y-1/2 rounded-md border border-ink/15 px-1.5 py-0.5 font-sans text-[11px] text-ink-muted sm:block">
              /
            </kbd>
          )}
        </div>
      </form>

      {/* Mobile: một hàng vuốt ngang (không rớt nhiều dòng); từ sm: xuống dòng & căn giữa */}
      <div className="-mx-5 mt-5 no-scrollbar flex snap-x scroll-px-5 items-center gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
        <button type="button" onClick={() => setCat("")} className={chip(!cat)} aria-pressed={!cat}>
          {ui.all} · {found.length}
        </button>
        {cats.map(([key, label]) => {
          const n = found.filter((c) => c.category === key).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCat(key === cat ? "" : key)}
              className={cn(chip(cat === key), n === 0 && cat !== key && "opacity-45")}
              aria-pressed={cat === key}
            >
              {label} · {n}
            </button>
          );
        })}
      </div>

      {/* Thông báo kết quả cho trình đọc màn hình (và hiện chữ khi đang tìm) */}
      <p
        aria-live="polite"
        className={cn("mt-4 text-center text-[13px] text-ink-muted", !searching && "sr-only")}
      >
        {list.length > 0 && ui.searchCount.replace("{n}", list.length)}
      </p>

      {list.length === 0 ? (
        <div className="mx-auto mt-10 max-w-md text-center">
          <p className="font-serif text-2xl text-ink">
            {searching ? ui.searchEmpty.replace("{q}", query.trim()) : ui.noResults}
          </p>
          <p className="mt-2 text-[14px] text-ink-soft">{ui.searchTip}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full border border-ink/20 px-5 py-2.5 text-[13px] text-ink transition hover:border-ink"
          >
            {ui.resetFilters}
          </button>
        </div>
      ) : (
        <div className="mt-8 flex flex-wrap justify-center gap-5">
          {list.map((c, i) => (
            <Link
              key={c.slug}
              href={href(lang, `/collections/${c.slug}`)}
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
                sizes="(min-width: 1440px) 424px, (min-width: 1024px) 29vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                style={{ objectPosition: c.coverPos }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/10 to-transparent" />
              <span className="absolute top-5 left-5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium tracking-wider text-ink backdrop-blur lg:text-[10px]">
                {pad2(collections.indexOf(c) + 1)}
              </span>
              <span className="absolute top-5 right-5 rounded-full border border-white/30 px-2.5 py-1 text-[10px] tracking-[0.2em] text-white/85 uppercase backdrop-blur">
                {c.images.length} {ui.photos}
              </span>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white">
                <div>
                  <p className="text-[11px] tracking-[0.3em] text-white/70 uppercase lg:text-[10px]">
                    {c.sub}
                  </p>
                  <h2 className="mt-1.5 font-serif text-[1.8rem] leading-tight">{c.name}</h2>
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
