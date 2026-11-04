import { LANG_COOKIE } from "@/i18n/routes";

/**
 * Ngôn ngữ người xem đã TỰ CHỌN (nút VI/EN ở thanh menu hoặc thanh gợi ý LangSuggest), lưu 1 năm trong cookie.
 * src/proxy.js đọc cookie này để mở đúng ngôn ngữ ở các lần sau. Chỉ chạy trên trình duyệt.
 */
export function rememberLang(lang) {
  const secure = location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax${secure}`;
}

/** "vi" | "en" nếu người xem đã chọn, ngược lại null */
export function savedLang() {
  const m = document.cookie.match(new RegExp(`(?:^|; )${LANG_COOKIE}=(vi|en)(?:;|$)`));
  return m ? m[1] : null;
}
