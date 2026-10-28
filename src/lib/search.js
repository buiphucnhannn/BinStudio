/**
 * Tìm kiếm tiếng Việt / Anh chạy trên trình duyệt (không gọi server).
 * - Gõ KHÔNG dấu: bỏ dấu khi so ("hoang hon" khớp "Hoàng hôn").
 * - Gõ CÓ dấu: so đúng dấu ("cưới" không khớp "cười").
 * - Các từ đã gõ xong phải khớp trọn từ; từ cuối (đang gõ dở) chỉ cần khớp phần đầu từ.
 * - Xếp hạng: khớp ở tên > phong cách / loại hình > mô tả; khớp nguyên cụm được cộng điểm.
 * Chỉ dùng so khớp chuỗi (includes) — không dựng RegExp từ dữ liệu người dùng.
 */
export const SEARCH_MAX = 60; // giới hạn độ dài từ khoá
const MAX_TERMS = 8;

// "Pre-wedding Thị trấn" → "pre wedding thị trấn" (giữ dấu)
const lower = (text = "") =>
  String(text)
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

// "Pre-wedding Thị trấn" → "pre wedding thi tran" (bỏ dấu, đ → d)
export const fold = (text = "") =>
  lower(text).normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d");

const pad = (s) => ` ${s} `;

/** Chỉ mục 1 mục: [[văn bản, trọng số], ...] → các phần đã chuẩn hoá sẵn (2 dạng: giữ dấu / bỏ dấu) */
export const toIndex = (fields) =>
  fields
    .filter(([text]) => text)
    .map(([text, weight]) => ({ a: pad(lower(text)), f: pad(fold(text)), w: weight }));

/** Phân tích truy vấn: mỗi từ biết mình có dấu hay không và có phải từ cuối (đang gõ dở) */
export function parseQuery(query) {
  const raw = lower(String(query).slice(0, SEARCH_MAX))
    .split(" ")
    .filter(Boolean)
    .slice(0, MAX_TERMS);
  const words = raw.map((a, i) => {
    const f = fold(a);
    return { a, f, accent: a !== f, last: i === raw.length - 1 };
  });
  return { words, phrase: words.map((w) => w.f).join(" ") };
}

/** Điểm liên quan (0 = không khớp) */
export function score(index, { words, phrase }) {
  let total = 0;
  for (const w of words) {
    const needle = ` ${w.accent ? w.a : w.f}${w.last ? "" : " "}`;
    let best = 0;
    for (const part of index)
      if ((w.accent ? part.a : part.f).includes(needle)) best = Math.max(best, part.w);
    if (!best) return 0;
    total += best;
  }
  if (words.length > 1 && index.some((part) => part.f.includes(` ${phrase}`))) total += 5;
  return total;
}
