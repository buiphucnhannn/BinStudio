/**
 * Song ngữ Việt / Anh.
 * - Chuỗi trong data viết dạng t("tiếng Việt", "English") => { vi, en }; localize(data, lang) duyệt sâu và chọn ngôn ngữ.
 * - URL: tiếng Việt tại "/" với đường dẫn tiếng Việt, tiếng Anh tại "/en" với đường dẫn tiếng Anh
 *   (bảng ánh xạ ở ./routes, rewrite trong src/proxy.js).
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
// href("en", "/collections/wedding-beach") => "/en/collections/wedding-beach"; href("vi", "/#about") => "/#gioi-thieu"
export function href(lang, path = "/") {
  if (lang === DEFAULT_LOCALE) return toViPath(path);
  if (path === "/") return "/en";
  if (path.startsWith("/#")) return `/en${path.slice(1)}`;
  return `/en${path}`;
}

// URL công khai bất kỳ (cả /vi/... & /en/...) → đường dẫn nội bộ không tiền tố ngôn ngữ
export function toCanonicalPath(pathname = "/") {
  if (/^\/(en|vi)(\/|$)/.test(pathname)) return pathname.replace(/^\/(en|vi)/, "") || "/";
  return fromViPath(pathname) || pathname;
}

export function localeFromPath(pathname) {
  return /^\/en(\/|$)/.test(pathname) ? "en" : "vi";
}
