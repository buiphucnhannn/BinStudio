import { NextResponse } from "next/server";
import { LANG_COOKIE, VI_HOME, fromViPath, legacyViRedirect, toViPath } from "@/i18n/routes";

/**
 * Định tuyến song ngữ. Tiếng Anh là bản MẶC ĐỊNH ở gốc domain; tiếng Việt có đường dẫn tiếng Việt riêng:
 *   "/"                              → /en   (trang chủ tiếng Anh — Google hiển thị bản này cho tên miền)
 *   "/vi"                            → /vi   (trang chủ tiếng Việt, route thật)
 *   "/bo-suu-tap/cap-doi-hoang-hon"  → /vi/collections/sunset-couple
 *   "/dich-vu", "/ban-quyen-anh"     → /vi/services, /vi/image-license
 * Trang con tiếng Anh (/en/...) trùng route thật nên không cần rewrite. URL trên trình duyệt giữ nguyên.
 *
 * Vì sao rewrite ở đây mà không để trong rewrites() của next.config:
 * trên Vercel, rewrite gốc "/" trả về HTML cho cả yêu cầu RSC (chuyển trang phía client),
 * nên khi bấm về trang chủ, router của Next phải tải lại toàn trang → màn chào (Preloader) hiện lại.
 * Rewrite trong Proxy chạy trước bước định tuyến nên yêu cầu RSC được trả đúng dữ liệu RSC.
 *
 * Đường dẫn trùng lặp / cũ được chuyển hướng 308 về URL chuẩn (tránh trùng nội dung cho SEO):
 *   /en                          → /  (trang chủ tiếng Anh cũ)
 *   /vi/...                      → bỏ tiền tố /vi
 *   /collections/..., /services  → /bo-suu-tap/..., /dich-vu
 *   /bo-suu-tap/sunset-couple    → /bo-suu-tap/cap-doi-hoang-hon (slug cũ)
 *
 * Ngôn ngữ theo người xem (xem preferredLang):
 *   - Đã tự chọn (bấm VI/EN → cookie LANG_COOKIE): mở đúng ngôn ngữ đã chọn ở mọi trang.
 *   - Chưa chọn: mọi URL mở đúng ngôn ngữ của nó, KHÔNG tự chuyển — link tiếng Việt từ Google / Zalo /
 *     Facebook luôn ra trang tiếng Việt; trang chủ "/" vốn đã là tiếng Anh (bản mặc định của studio).
 * Chuyển hướng theo lựa chọn: 307 (tạm thời), không cache, KHÔNG áp dụng cho bot.
 */

// Trình thu thập / xem trước link: Googlebot, "Google Favicon" (không có chữ "bot"), Bing, Facebook, Zalo,
// WhatsApp, Lighthouse... — không bao giờ chuyển hướng theo ngôn ngữ
const BOT_UA =
  /bot|crawl|spider|slurp|google|facebookexternalhit|facebookcatalog|embedly|preview|lighthouse|pagespeed|inspectiontool|headless|zalo|whatsapp|viber|skype/i;

// Ngôn ngữ người xem: "vi" | "en" = đã TỰ CHỌN (cookie) · "new" = chưa chọn · null = không xét (bot, RSC, prefetch...)
function preferredLang(request) {
  const h = request.headers;
  if (request.method !== "GET") return null;
  // Chỉ lần mở trang thật (không phải yêu cầu RSC / prefetch khi chuyển trang phía client)
  if (h.get("rsc") || h.get("next-router-prefetch") || h.get("purpose") === "prefetch") return null;
  if (!(h.get("accept") || "").includes("text/html")) return null;
  if (BOT_UA.test(h.get("user-agent") || "")) return null;
  const saved = request.cookies.get(LANG_COOKIE)?.value;
  return saved === "vi" || saved === "en" ? saved : "new";
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const go = (path, mode) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    if (mode === "rewrite") return NextResponse.rewrite(url);
    if (mode !== "lang") return NextResponse.redirect(url, 308);
    // Đổi ngôn ngữ theo lựa chọn người xem: tạm thời, không cache (mỗi người một kết quả)
    const res = NextResponse.redirect(url, 307);
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  };
  const want = preferredLang(request);

  // Trang chủ tiếng Anh (gốc domain); người đã chọn tiếng Việt → /vi
  if (pathname === "/") return want === "vi" ? go(VI_HOME, "lang") : go("/en", "rewrite");
  // Địa chỉ trang chủ tiếng Anh cũ → gốc domain (URL chuẩn duy nhất)
  if (pathname === "/en") return go("/");

  // Trang con tiếng Anh: người đã chọn tiếng Việt → bản tiếng Việt tương ứng (nếu có)
  if (pathname.startsWith("/en/")) {
    if (want !== "vi") return NextResponse.next();
    const vi = toViPath(pathname.slice(3));
    return fromViPath(vi) ? go(vi, "lang") : NextResponse.next();
  }

  // Trang tiếng Việt (/vi và đường dẫn tiếng Việt): người đã chọn tiếng Anh → bản tiếng Anh tương ứng.
  // Khách chưa chọn luôn mở đúng tiếng Việt — đúng địa chỉ bấm từ Google / Zalo / Facebook.
  const internal = fromViPath(pathname);
  if (internal) {
    if (want === "en") return go(internal === "/" ? "/" : `/en${internal}`, "lang");
    return pathname === VI_HOME ? NextResponse.next() : go(`/vi${internal}`, "rewrite");
  }

  const legacy = legacyViRedirect(pathname);
  if (legacy) return go(legacy);

  // /vi/... và đường dẫn nội bộ dạng tiếng Anh không tiền tố → URL tiếng Việt chuẩn
  const bare = pathname.replace(/^\/vi(?=\/|$)/, "") || "/";
  const vi = toViPath(bare);
  if (vi !== pathname) return go(vi);

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/en",
    "/en/:path*",
    "/vi",
    "/vi/:path*",
    "/bo-suu-tap/:path*",
    "/dich-vu",
    "/collections/:path*",
    "/services",
    "/ban-quyen-anh",
    "/image-license",
  ],
};
