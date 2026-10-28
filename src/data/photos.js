// Đường dẫn & kích thước ảnh.
// Ảnh web: /images/<bộ>/<bộ>-NN.webp — WebP, cạnh dài ≤ 2400px, tạo từ ảnh gốc (raw-photos/, không đưa lên web).
// photo-sizes.json (tự sinh khi tạo ảnh) lưu kích thước thật → lưới ảnh xếp đúng tỉ lệ, không cắt ảnh.
import SIZES from "./photo-sizes.json";

export const P = (group, n) => `/images/${group}/${group}-${String(n).padStart(2, "0")}.webp`;

export function img(group, n, pos) {
  const src = P(group, n);
  const [w, h] = SIZES[src] || [];
  if (!w) throw new Error(`Thiếu ảnh ${src} (chưa có trong photo-sizes.json)`);
  return { src, w, h, wide: w > h, pos: pos ?? (w > h ? "center" : "center 30%") };
}

// Ảnh ngang / ảnh dọc với objectPosition riêng (dùng khi ảnh bị cắt khung: ảnh bìa, hero...)
export const W = (group, n, pos = "center") => img(group, n, pos);
export const V = (group, n, pos = "center 30%") => img(group, n, pos);

// Dãy ảnh liên tiếp của một bộ: seq("honeymoon", 1, 10)
export const seq = (group, from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => img(group, from + i));
