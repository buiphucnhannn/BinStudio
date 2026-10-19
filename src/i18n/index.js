/**
 * Song ngữ Việt / Anh.
 * - Chuỗi trong data viết dạng t("tiếng Việt", "English") => { vi, en }; localize(data, lang) duyệt sâu và chọn ngôn ngữ.
 * - URL: tiếng Việt tại "/", tiếng Anh tại "/en" (xem rewrites trong next.config.mjs).
 */
import { toEnPath, toViPath } from "./routes";

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

// Luôn truyền đường dẫn TIẾNG VIỆT; bản tiếng Anh tự dịch đường dẫn:
// href("en", "/bo-suu-tap/wedding-beach") => "/en/collections/wedding-beach"; href("vi", "/#about") => "/#about"
export function href(lang, path = "/") {
  if (lang === DEFAULT_LOCALE) return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#")) return `/en${path.slice(1)}`;
  return `/en${toEnPath(path)}`;
}

// Đường dẫn bất kỳ (URL thật hoặc nội bộ sau rewrite, cả /vi/... & /en/...) → dạng tiếng Việt không tiền tố
export function toCanonicalPath(pathname = "/") {
  if (/^\/en(\/|$)/.test(pathname)) return toViPath(pathname.replace(/^\/en/, "") || "/");
  return pathname.replace(/^\/vi(?=\/|$)/, "") || "/";
}

export function localeFromPath(pathname) {
  return /^\/en(\/|$)/.test(pathname) ? "en" : "vi";
}
