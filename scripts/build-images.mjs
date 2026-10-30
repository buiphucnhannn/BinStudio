/**
 * Tạo sẵn các cỡ ảnh responsive lúc build (thay cho Image Optimization của Vercel —
 * gói Hobby giới hạn 5.000 lượt tối ưu/tháng, vượt là ảnh không hiện).
 *
 * public/images/<...>.webp  →  public/_img/<width>/images/<...>.webp
 * Các cỡ phải khớp images.deviceSizes / imageSizes trong next.config.mjs; cỡ lớn nhất dùng thẳng ảnh gốc
 * (xem src/lib/image-loader.js). Ảnh đã có và mới hơn ảnh gốc thì bỏ qua → chạy lại rất nhanh.
 */
import { readdir, stat, mkdir } from "node:fs/promises";
import { join, dirname, relative } from "node:path";
import { availableParallelism } from "node:os";
import sharp from "sharp";
import { VARIANT_WIDTHS } from "../src/lib/image-widths.mjs";

const ROOT = join(import.meta.dirname, "..", "public");
const SRC = join(ROOT, "images");
const OUT = join(ROOT, "_img");
const QUALITY = 82;

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith(".webp")) yield p;
  }
}

const mtime = (p) => stat(p).then((s) => s.mtimeMs, () => 0);

const jobs = [];
for await (const file of walk(SRC)) {
  const rel = relative(ROOT, file);
  for (const w of VARIANT_WIDTHS) jobs.push({ file, w, out: join(OUT, String(w), rel) });
}

const t0 = Date.now();
let made = 0;
sharp.concurrency(1);
const run = async () => {
  for (let job; (job = jobs.shift()); ) {
    const src = await mtime(job.file);
    if ((await mtime(job.out)) >= src) continue;
    await mkdir(dirname(job.out), { recursive: true });
    await sharp(job.file)
      .resize({ width: job.w, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(job.out);
    made++;
  }
};
await Promise.all(Array.from({ length: Math.max(2, availableParallelism()) }, run));
console.log(`[images] ${made} ảnh mới · ${((Date.now() - t0) / 1000).toFixed(1)}s`);
