import { LANG_COOKIE } from "@/i18n/routes";

/**
 * Ngôn ngữ người xem đã TỰ CHỌN (nút VI/EN ở thanh menu), lưu 1 năm trong cookie.
 * src/proxy.js đọc cookie này để mở đúng ngôn ngữ ở các lần sau. Chỉ chạy trên trình duyệt.
 */
export function rememberLang(lang) {
  const secure = location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax${secure}`;
}
