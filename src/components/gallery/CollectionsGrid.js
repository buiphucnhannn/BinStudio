"use client";

import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Pic from "@/components/ui/Pic";
import { cn, pad2 } from "@/lib/utils";
import { href } from "@/i18n";
import { SEARCH_MAX, parseQuery, score, toIndex } from "@/lib/search";
import { ArrowRight, Check, ChevronDown, Close, Search } from "@/components/ui/Icons";

// Số loại ảnh hiện thành ô lọc (nhiều bộ nhất trước); các loại còn lại nằm trong nút "…"
const VISIBLE_CATS = 4;

/**
 * Lưới bộ sưu tập: ô tìm kiếm + bộ lọc theo kiểu chụp.
 * Tìm ngay trên trình duyệt (vài chục album, không gọi server) — quy tắc khớp & xếp hạng xem src/lib/search.js;
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
  // Loại có nhiều bộ đứng trước — xếp theo TỔNG số bộ (không theo kết quả tìm) để ô lọc không nhảy chỗ khi gõ;
  // VISIBLE_CATS loại đầu hiện thành ô, phần còn lại gom vào nút "…" (dropdown)
  const cats = useMemo(() => {
    const total = (key) => collections.filter((c) => c.category === key).length;
    return Object.entries(categories)
      .map(([key, label], i) => ({ key, label, total: total(key), i }))
      .sort((a, b) => b.total - a.total || a.i - b.i);
  }, [collections, categories]);
  const shown = cats.slice(0, VISIBLE_CATS);
  const more = cats.slice(VISIBLE_CATS);
  const countOf = (key) => found.filter((c) => c.category === key).length;
  const gridRef = useRef(null);
  useRowAlign(gridRef, list.map((c) => c.slug).join());

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

      {/* Mobile: một hàng vuốt ngang (không rớt nhiều dòng), nút "…" đứng ngoài vùng cuộn để dropdown không bị cắt;
          từ sm: xuống dòng & căn giữa */}
      <div className="mt-5 flex items-center gap-2 sm:justify-center">
        <div className="-ml-5 no-scrollbar flex min-w-0 snap-x scroll-px-5 items-center gap-2 overflow-x-auto [mask-image:linear-gradient(to_right,#000_calc(100%-28px),transparent)] pr-6 pl-5 sm:ml-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:[mask-image:none] sm:pr-0 sm:pl-0">
          <button
            type="button"
            onClick={() => setCat("")}
            className={chip(!cat)}
            aria-pressed={!cat}
          >
            {ui.all} · {found.length}
          </button>
          {shown.map(({ key, label }) => {
            const n = countOf(key);
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
        {more.length > 0 && (
          <MoreFilters
            items={more.map(({ key, label }) => ({ key, label, n: countOf(key) }))}
            cat={cat}
            onPick={(key) => setCat(key === cat ? "" : key)}
            label={ui.moreFilters}
            chip={chip}
          />
        )}
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
        <div ref={gridRef} className="mt-8 flex flex-wrap justify-center gap-5">
          {list.map((c, i) => (
            <Link
              key={c.slug}
              data-card
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
                {/* data-slot: các phần cùng loại được cân cao bằng nhau theo từng hàng (useRowAlign); tên 1 dòng căn giữa ô */}
                <div className="min-w-0">
                  <p
                    data-slot="sub"
                    className="flex flex-col justify-end text-[11px] tracking-[0.3em] text-white/70 uppercase lg:text-[10px]"
                  >
                    {c.sub}
                  </p>
                  <h2
                    data-slot="title"
                    className="mt-1.5 flex flex-col justify-center font-serif text-[1.8rem] leading-tight"
                  >
                    {c.name}
                  </h2>
                  <p data-slot="concept" className="mt-1 text-[13px] text-white/75">
                    {c.concept}
                  </p>
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

/**
 * Cân chữ trên thẻ theo từng hàng: trong một hàng, dòng phụ / tên album / mô tả của mọi thẻ được đặt cao bằng
 * phần cao nhất trong hàng → các phần cùng loại luôn thẳng hàng, dù tên hay mô tả có thẻ 1 dòng, có thẻ 2 dòng.
 * Số dòng đổi theo bề rộng màn hình nên phải đo thật: chạy lại khi đổi cỡ, khi lọc/tìm (key) và khi font tải xong.
 * Mobile 1 cột: mỗi hàng 1 thẻ → không thay đổi gì.
 */
const SLOTS = ["sub", "title", "concept"];
function useRowAlign(ref, key) {
  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    let frame = 0;
    const align = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cards = [...grid.querySelectorAll("[data-card]")];
        const slots = cards.map((card) =>
          SLOTS.map((s) => card.querySelector(`[data-slot="${s}"]`)),
        );
        slots.flat().forEach((el) => el && (el.style.minHeight = ""));
        // Gom thẻ theo hàng (cùng vị trí dọc), rồi lấy chiều cao lớn nhất của từng phần trong hàng
        const rows = new Map();
        cards.forEach((card, i) => {
          const top = Math.round(card.offsetTop);
          if (!rows.has(top)) rows.set(top, []);
          rows.get(top).push(slots[i]);
        });
        for (const row of rows.values()) {
          if (row.length < 2) continue;
          SLOTS.forEach((_, k) => {
            const max = Math.max(...row.map((r) => r[k]?.offsetHeight || 0));
            row.forEach((r) => r[k] && (r[k].style.minHeight = `${max}px`));
          });
        }
      });
    };
    align();
    const ro = new ResizeObserver(align);
    ro.observe(grid);
    document.fonts?.addEventListener("loadingdone", align);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      document.fonts?.removeEventListener("loadingdone", align);
    };
  }, [ref, key]);
}

/**
 * Nút "…" mở danh sách các loại ảnh còn lại. Đang lọc theo một loại trong đây thì nút hiện tên loại đó (tô đậm).
 * Đóng khi chọn, bấm ra ngoài hoặc Esc; ↑/↓ chuyển mục, Enter/Space chọn.
 */
function MoreFilters({ items, cat, onPick, label, chip }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const itemRefs = useRef([]);
  const menuId = useId();
  const active = items.find((it) => it.key === cat);

  useEffect(() => {
    if (!open) return;
    const i = Math.max(
      0,
      items.findIndex((it) => it.key === cat),
    );
    itemRefs.current[i]?.focus();
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, items, cat]);

  const close = () => {
    setOpen(false);
    btnRef.current?.focus();
  };
  const onMenuKey = (e) => {
    const list = itemRefs.current.filter(Boolean);
    const i = list.indexOf(document.activeElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const d = e.key === "ArrowDown" ? 1 : -1;
      list[(i + d + list.length) % list.length]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={active ? undefined : label}
        title={label}
        className={cn(chip(!!active), "flex items-center gap-1.5")}
      >
        {active ? (
          `${active.label} · ${active.n}`
        ) : (
          <span aria-hidden className="text-[15px] leading-none tracking-[0.15em]">
            …
          </span>
        )}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKey}
          className="absolute top-full right-0 z-30 mt-2 min-w-[15rem] rounded-2xl border border-ink/10 bg-white p-1.5 shadow-soft"
        >
          {items.map((it, i) => {
            const on = it.key === cat;
            return (
              <button
                key={it.key}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={on}
                onClick={() => {
                  onPick(it.key);
                  close();
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-4 rounded-xl px-3.5 py-2.5 text-left text-[13px] transition outline-none",
                  on
                    ? "bg-ink/[0.06] text-ink"
                    : "text-ink/75 hover:bg-ink/[0.04] focus:bg-ink/[0.04]",
                  it.n === 0 && !on && "opacity-45",
                )}
              >
                <span className="whitespace-nowrap">
                  {it.label} · {it.n}
                </span>
                {on && <Check className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
