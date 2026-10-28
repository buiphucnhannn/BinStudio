"use client";

import { useState } from "react";
import Pic from "@/components/ui/Pic";
import Lightbox from "@/components/ui/Lightbox";
import { justifyRows } from "@/lib/justify";
import { cn } from "@/lib/utils";

/**
 * Lưới ảnh album kiểu "justified rows": mỗi hàng cao bằng nhau và lấp kín chiều ngang,
 * ảnh hiển thị NGUYÊN KHUNG theo tỉ lệ thật (không cắt) — đúng tinh thần portfolio nhiếp ảnh.
 * Cách ngắt hàng tính sẵn cho 2 khổ (mobile / từ md trở lên) để hàng nào cũng cân;
 * hàng cuối thiếu ảnh giữ chiều cao chuẩn và căn giữa. Bấm ảnh mở lightbox; phím ←/→ chuyển ảnh.
 */
const LAYOUTS = [
  // Khổ mobile ~358px: thường 2 ảnh dọc hoặc 1 ảnh ngang mỗi hàng
  { key: "sm", className: "md:hidden", gap: 10, width: 358, height: 230, maxPerRow: 3, vw: 100 },
  // Từ md: khung nội dung tối đa 1312px, hàng ~3–5 ảnh
  {
    key: "md",
    className: "hidden md:block",
    gap: 16,
    width: 1312,
    height: 430,
    maxPerRow: 5,
    vw: 92,
  },
];
const ratio = (im) => (im.w && im.h ? im.w / im.h : im.wide ? 1.5 : 0.667);

export default function AlbumGallery({ images, name, place }) {
  const [idx, setIdx] = useState(null);
  // Mô tả ảnh cho Google Hình ảnh & trình đọc màn hình: "Hoàng hôn của hai người — chụp ảnh tại Phú Quốc (3)"
  const altOf = (i) => `${name}${place ? ` — ${place}` : ""} (${i + 1})`;
  const list = images.map((im, i) => ({ src: im.src, w: im.w, h: im.h, alt: altOf(i) }));
  const ratios = images.map(ratio);

  return (
    <>
      {LAYOUTS.map((L) => {
        const rows = justifyRows(ratios, L);
        return (
          <div key={L.key} className={L.className}>
            <div className="flex flex-col" style={{ gap: L.gap }}>
              {rows.map((row, r) => {
                const sum = row.items.reduce((s, i) => s + ratios[i], 0);
                return (
                  <div
                    key={row.items[0]}
                    className="mx-auto flex w-full"
                    style={{
                      gap: L.gap,
                      maxWidth: row.fill < 1 ? `${(row.fill * 100).toFixed(3)}%` : undefined,
                    }}
                  >
                    {row.items.map((i, k) => {
                      const share = (ratios[i] / sum) * row.fill;
                      return (
                        <button
                          key={images[i].src}
                          type="button"
                          onClick={() => setIdx(i)}
                          className={cn(
                            "group reveal relative min-w-0 overflow-hidden bg-sand-200",
                            L.key === "sm" ? "rounded-xl" : "rounded-2xl",
                          )}
                          style={{
                            flex: `${ratios[i]} 1 0%`,
                            aspectRatio: ratios[i],
                            "--reveal-delay": `${(r % 2) * 80 + k * 70}ms`,
                          }}
                        >
                          {/* Ô lưới dùng q85 (không phân biệt được ở cỡ ô); lightbox vẫn mở bản q90 */}
                          <Pic
                            quality={85}
                            src={images[i].src}
                            alt={altOf(i)}
                            fill
                            sizes={
                              L.key === "sm"
                                ? `${Math.ceil(share * L.vw)}vw`
                                : `(min-width: 1440px) ${Math.ceil(share * 1312)}px, ${Math.ceil(share * L.vw)}vw`
                            }
                            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                          />
                          <span className="absolute right-3 bottom-3 rounded-full bg-navy-deep/60 px-2 py-0.5 text-[10px] tracking-[0.2em] text-white/80 opacity-0 backdrop-blur transition group-hover:opacity-100">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <Lightbox images={list} index={idx} onClose={() => setIdx(null)} onChange={setIdx} />
    </>
  );
}
