/**
 * Thêm ảnh gốc (JPEG/PNG/WebP...) vào một bộ sưu tập:
 *   node scripts/add-photos.mjs <slug> <ảnh-gốc-1> [ảnh-gốc-2 ...]
 *
 * Mỗi ảnh → public/images/<slug>/<slug>-NN.webp (NN nối tiếp số lớn nhất đang có),
 * WebP q85, cạnh dài ≤ 2400px (không phóng to), xoay theo EXIF, chuyển về sRGB, bỏ metadata (GPS...).
 * Kích thước thật được ghi vào src/data/photo-sizes.json để lưới ảnh xếp đúng tỉ lệ.
 * Sau đó thêm ảnh vào src/data/collections.js (vd. seq("<slug>", 1, NN)).
 * Các cỡ responsive (public/_img/...) do scripts/build-images.mjs tạo lúc dev/build.
 * Ảnh gốc nên cất trong raw-photos/ (không đưa lên git / Vercel), KHÔNG để trong public/.
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const SIZES_FILE = join(ROOT, "src", "data", "photo-sizes.json");
const MAX_EDGE = 2400;
const QUALITY = 85;

const [slug, ...files] = process.argv.slice(2);
if (!slug || !files.length || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Cách dùng: node scripts/add-photos.mjs <slug> <ảnh-gốc...>");
  process.exit(1);
}

const dir = join(ROOT, "public", "images", slug);
await mkdir(dir, { recursive: true });
const re = new RegExp(`^${slug}-(\\d+)\\.webp$`);
let n = Math.max(0, ...(await readdir(dir)).map((f) => +(f.match(re)?.[1] ?? 0)));

const sizes = JSON.parse(await readFile(SIZES_FILE, "utf8"));
for (const file of files) {
  n++;
  const name = `${slug}-${String(n).padStart(2, "0")}.webp`;
  const info = await sharp(file)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .toColourspace("srgb")
    .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
    .toFile(join(dir, name));
  sizes[`/images/${slug}/${name}`] = [info.width, info.height];
  console.log(
    `${file} → ${name} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`,
  );
}

const sorted = Object.fromEntries(Object.entries(sizes).sort(([a], [b]) => a.localeCompare(b)));
const json = Object.entries(sorted).map(([k, [w, h]]) => `  ${JSON.stringify(k)}: [${w}, ${h}]`);
await writeFile(SIZES_FILE, `{\n${json.join(",\n")}\n}\n`);
console.log(`[add-photos] ${slug}: thêm ${files.length} ảnh, hiện có ${n} ảnh`);
