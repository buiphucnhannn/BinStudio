/**
 * Đường dẫn thuần một ngôn ngữ cho mỗi bản (không pha Việt – Anh):
 *   tiếng Việt: /bo-suu-tap/cap-doi-hoang-hon, /dich-vu
 *   tiếng Anh:  /en/collections/sunset-couple, /en/services
 *
 * Trong code luôn dùng đường dẫn NỘI BỘ = route thật trong app/[lang] (slug tiếng Anh):
 *   "/collections", "/collections/sunset-couple", "/services".
 * href() đổi sang URL công khai; src/proxy.js đổi URL tiếng Việt ngược về route nội bộ.
 * File này không import gì để proxy nhẹ.
 */

// Trang: nội bộ → đường dẫn tiếng Việt
const PAGES_VI = {
  "/collections": "/bo-suu-tap",
  "/services": "/dich-vu",
};

// Slug album: slug nội bộ (tiếng Anh) → slug tiếng Việt không dấu
export const SLUGS_VI = {
  "wedding-beach": "anh-cuoi-bien",
  "sunset-couple": "cap-doi-hoang-hon",
  maternity: "anh-bau",
  "sunset-portrait": "chan-dung-hoang-hon",
  "resort-editorial": "chan-dung-resort",
  "family-villa": "gia-dinh-villa",
  "family-beach": "sinh-nhat-ben-bien",
  "family-travel": "ky-nghi-gia-dinh",
  "beach-lookbook": "lookbook-bai-bien",
};

// Anchor section (#id) xuất hiện trên URL: id nội bộ (tiếng Anh) → id tiếng Việt
const ANCHORS_VI = {
  about: "gioi-thieu",
  locations: "dia-diem",
  contact: "lien-he",
  services: "danh-sach-dich-vu",
};

const invert = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [v, k]));
const PAGES_INTERNAL = invert(PAGES_VI);
const SLUGS_INTERNAL = invert(SLUGS_VI);
const ANCHORS_INTERNAL = invert(ANCHORS_VI);

// id section theo ngôn ngữ: anchor("vi", "contact") → "lien-he"; anchor("en", "contact") → "contact"
export const anchor = (lang, id) => (lang === "vi" && ANCHORS_VI[id]) || id;

// id tương ứng ở ngôn ngữ kia — để link cũ / link sai ngôn ngữ (vd. "/#contact") vẫn cuộn đúng section
export const anchorAlias = (id) => ANCHORS_VI[id] || ANCHORS_INTERNAL[id];

const splitHash = (path) => {
  const i = path.indexOf("#");
  return i < 0 ? [path, ""] : [path.slice(0, i), path.slice(i)];
};

function viPage(p) {
  const [, page, slug, ...rest] = p.split("/");
  const vi = PAGES_VI[`/${page}`];
  if (!vi || rest.length) return p;
  return slug ? `${vi}/${SLUGS_VI[slug] || slug}` : vi;
}

// "/collections/sunset-couple" → "/bo-suu-tap/cap-doi-hoang-hon"; "/#contact" → "/#lien-he"
export function toViPath(path) {
  const [p, hash] = splitHash(path);
  return viPage(p) + (hash && `#${anchor("vi", hash.slice(1))}`);
}

// URL tiếng Việt → route nội bộ; không phải URL tiếng Việt của trang con → null
// "/bo-suu-tap/cap-doi-hoang-hon" → "/collections/sunset-couple"
export function fromViPath(path) {
  const [, page, slug, ...rest] = path.split("/");
  const internal = PAGES_INTERNAL[`/${page}`];
  if (!internal || rest.length) return null;
  if (!slug) return internal;
  const id = SLUGS_INTERNAL[slug];
  return id ? `${internal}/${id}` : null;
}

// Slug tiếng Anh cũ nằm dưới đường dẫn tiếng Việt (/bo-suu-tap/sunset-couple) → URL tiếng Việt mới
export function legacyViRedirect(path) {
  const m = path.match(/^\/bo-suu-tap\/([^/]+)$/);
  return m && SLUGS_VI[m[1]] ? `/bo-suu-tap/${SLUGS_VI[m[1]]}` : null;
}
