/**
 * Song ngữ Việt / Anh.
 * - Chuỗi trong data viết dạng t("tiếng Việt", "English") => { vi, en }; localize(data, lang) duyệt sâu và chọn ngôn ngữ.
 * - URL: tiếng Anh là bản mặc định — trang chủ ở gốc "/", trang con dưới "/en/..." (đường dẫn tiếng Anh);
 *   tiếng Việt: trang chủ "/vi", trang con đường dẫn tiếng Việt không tiền tố (/bo-suu-tap/..., /dich-vu)
 *   (bảng ánh xạ ở ./routes, rewrite trong src/proxy.js). DEFAULT_LOCALE = ngôn ngữ dữ liệu gốc (chuỗi t()), không phải URL.
 */
import { toViPath, fromViPath } from "./routes";
export { anchor } from "./routes";

export const LOCALES = ["vi", "en"];
export const DEFAULT_LOCALE = "vi";

export const isLocale = (v) => LOCALES.includes(v);

export const t = (vi, en) => ({ vi, en });

const isI18nString = (v) =>
  v &&
  typeof v === "object" &&
  !Array.isArray(v) &&
  "vi" in v &&
  "en" in v &&
  Object.keys(v).length === 2;

export function localize(data, lang) {
  if (Array.isArray(data)) return data.map((d) => localize(d, lang));
  if (data && typeof data === "object") {
    if (isI18nString(data)) return data[lang] ?? data[DEFAULT_LOCALE];
    const out = {};
    for (const k of Object.keys(data)) out[k] = localize(data[k], lang);
    return out;
  }
  return data;
}

// Luôn truyền đường dẫn NỘI BỘ (route thật, slug tiếng Anh); trả về URL công khai đúng ngôn ngữ:
// href("vi", "/collections/wedding-beach") => "/bo-suu-tap/anh-cuoi-bien"
// href("en", "/collections/wedding-beach") => "/en/collections/wedding-beach"; href("vi", "/#about") => "/vi#gioi-thieu"
// Trang chủ tiếng Anh nằm ở GỐC domain (bản mặc định của studio): href("en", "/") => "/", href("en", "/#about") => "/#about";
// trang chủ tiếng Việt ở "/vi"; trang con tiếng Việt giữ đường dẫn tiếng Việt không tiền tố (/bo-suu-tap/...).
export function href(lang, path = "/") {
  if (lang === DEFAULT_LOCALE) return toViPath(path);
  if (path === "/" || path.startsWith("/#")) return path;
  return `/en${path}`;
}

// URL công khai bất kỳ (cả /vi/... & /en/...) → đường dẫn nội bộ không tiền tố ngôn ngữ
export function toCanonicalPath(pathname = "/") {
  if (/^\/(en|vi)(\/|$)/.test(pathname)) return pathname.replace(/^\/(en|vi)/, "") || "/";
  return fromViPath(pathname) || pathname;
}

export function localeFromPath(pathname) {
  return pathname === "/" || /^\/en(\/|$)/.test(pathname) ? "en" : "vi";
}
