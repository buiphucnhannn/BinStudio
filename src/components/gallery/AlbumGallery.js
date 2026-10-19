"use client";

import { useState } from "react";
import Pic from "@/components/ui/Pic";
import Lightbox from "@/components/ui/Lightbox";
import { cn } from "@/lib/utils";

/**
 * Lưới ảnh album trên lưới 6 cột (desktop): ảnh dọc chiếm 2 cột, ảnh ngang chiếm 4 cột.
 * Ảnh được xếp theo hàng: ưu tiên lấp đầy hàng (ảnh dọc có thể được đôn lên để lấp chỗ trống),
 * hàng nào không lấp hết chiều ngang thì căn giữa thay vì để trống bên phải;
 * hai ảnh ngang liền nhau không có ảnh dọc chen vào thì ghép chung một hàng (mỗi ảnh 3 cột).
 * Mobile: 2 cột, ảnh ngang chiếm cả hàng. Bấm ảnh mở lightbox; phím ←/→ chuyển ảnh.
 */
const COLS = 6;
const size = (im) => (im.wide ? 4 : 2);

function layout(images) {
  const remaining = images.map((im, i) => ({ ...im, i }));
  const out = [];
  while (remaining.length) {
    let used = 0;
    const row = [];
    for (;;) {
      const k = remaining.findIndex((im) => size(im) <= COLS - used);
      if (k < 0) break;
      const [im] = remaining.splice(k, 1);
      row.push(im);
      used += size(im);
      if (used === COLS) break;
    }
    // Hàng chỉ có 1 ảnh ngang (còn trống 2 cột) mà ảnh kế tiếp cũng ngang → ghép 2 ảnh ngang, mỗi ảnh nửa hàng
    if (row.length === 1 && row[0].wide && remaining[0]?.wide) {
      row.push(remaining.shift());
      row.forEach((im) => (im.half = true));
      used = COLS;
    }
    const offset = (COLS - used) / 2; // số cột trống chia đều hai bên
    row.forEach((im, j) => out.push({ ...im, start: j === 0 && offset ? 1 + offset : 0 }));
  }
  return out;
}

const START = { 2: "md:col-start-2", 3: "md:col-start-3" };

export default function AlbumGallery({ images, name }) {
  const [idx, setIdx] = useState(null);
  const items = layout(images);
  const list = items.map((im, i) => ({ src: im.src, alt: `${name} — ${i + 1}` }));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
        {items.map((im, i) => (
          <button
            key={im.src}
            type="button"
            onClick={() => setIdx(i)}
            className={cn(
              "group reveal relative overflow-hidden rounded-2xl bg-sand-200",
              im.wide
                ? cn("col-span-2 aspect-[3/2]", im.half ? "md:col-span-3" : "md:col-span-4")
                : "aspect-[4/5] md:col-span-2",
              START[im.start],
            )}
            style={{ "--reveal-delay": `${(i % 6) * 60}ms` }}
            aria-label={`${name} ${i + 1}`}
          >
            <Pic
              src={im.src}
              alt=""
              fill
              sizes={im.wide ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              style={{ objectPosition: im.pos }}
            />
            <span className="absolute right-3 bottom-3 rounded-full bg-navy-deep/60 px-2 py-0.5 text-[10px] tracking-[0.2em] text-white/80 opacity-0 backdrop-blur transition group-hover:opacity-100">
              {String(i + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
      <Lightbox images={list} index={idx} onClose={() => setIdx(null)} onChange={setIdx} />
    </>
  );
}
