/**
 * Tạo sẵn các cỡ ảnh responsive lúc build (thay cho Image Optimization của Vercel —
 * gói Hobby giới hạn 5.000 lượt tối ưu/tháng, vượt là ảnh không hiện).
 *
 * public/images/<...>.webp  →  public/_img/<width>/images/<...>.webp
 * Các cỡ phải khớp images.deviceSizes / imageSizes trong next.config.mjs; cỡ lớn nhất dùng thẳng ảnh gốc
 * (xem src/lib/image-loader.js).
 *
 * Ảnh tạo ra được lưu ở .next/cache/images (Vercel giữ thư mục này giữa các lần deploy) kèm mã băm ảnh gốc:
 * ảnh gốc không đổi thì bỏ qua → chỉ lần build đầu chậm (vài phút), các lần sau vài giây.
 */
import { readdir, readFile, writeFile, mkdir, cp, access } from "node:fs/promises";
import { join, dirname, relative } from "node:path";
import { createHash } from "node:crypto";
import { availableParallelism } from "node:os";
import sharp from "sharp";
import { VARIANT_WIDTHS } from "../src/lib/image-widths.mjs";

const ROOT = join(import.meta.dirname, "..");
const PUBLIC = join(ROOT, "public");
const SRC = join(PUBLIC, "images");
const CACHE = join(ROOT, ".next", "cache", "images");
const OUT = join(PUBLIC, "_img");
const MANIFEST = join(CACHE, "manifest.json");
const QUALITY = 82;
const KEY = `q${QUALITY}:${VARIANT_WIDTHS.join(",")}`; // đổi cấu hình → tạo lại toàn bộ

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith(".webp")) yield p;
  }
}

const exists = (p) => access(p).then(() => true, () => false);
const old = await readFile(MANIFEST, "utf8").then(JSON.parse, () => ({}));
const manifest = { key: KEY, files: {} };

const files = [];
for await (const file of walk(SRC)) files.push(file);

const t0 = Date.now();
let done = 0;
let made = 0;
sharp.concurrency(1);
const queue = [...files];
const run = async () => {
  for (let file; (file = queue.shift()); ) {
    const rel = relative(PUBLIC, file).replaceAll("\\", "/");
    const buf = await readFile(file);
    const hash = createHash("sha1").update(buf).digest("hex");
    const outs = VARIANT_WIDTHS.map((w) => join(CACHE, String(w), rel));
    const fresh =
      old.key === KEY && old.files?.[rel] === hash && (await Promise.all(outs.map(exists))).every(Boolean);
    if (!fresh) {
      for (const [i, w] of VARIANT_WIDTHS.entries()) {
        await mkdir(dirname(outs[i]), { recursive: true });
        await sharp(buf)
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: QUALITY, effort: 4 })
          .toFile(outs[i]);
      }
      made++;
    }
    manifest.files[rel] = hash;
    if (++done % 50 === 0) console.log(`[images] ${done}/${files.length}`);
  }
};
await Promise.all(Array.from({ length: Math.max(2, availableParallelism()) }, run));

await mkdir(CACHE, { recursive: true });
await writeFile(MANIFEST, JSON.stringify(manifest));
for (const w of VARIANT_WIDTHS) await cp(join(CACHE, String(w)), join(OUT, String(w)), { recursive: true });
console.log(
  `[images] ${files.length} ảnh gốc · ${made} ảnh tạo mới · ${((Date.now() - t0) / 1000).toFixed(1)}s`,
);
