import { NextResponse } from "next/server";
import { LANG_COOKIE, fromViPath, legacyViRedirect, toViPath } from "@/i18n/routes";

/**
 * URL tiếng Việt (không tiền tố) → route thật app/[lang] với lang = "vi".
 *   "/"                              → /vi
 *   "/bo-suu-tap/cap-doi-hoang-hon"  → /vi/collections/sunset-couple
 *   "/dich-vu"                       → /vi/services
 *   "/ban-quyen-anh"                 → /vi/image-license
 * URL trên trình duyệt giữ nguyên. Bản tiếng Anh (/en/...) trùng route thật nên không cần rewrite.
 *
 * Vì sao rewrite ở đây mà không để trong rewrites() của next.config:
 * trên Vercel, rewrite gốc "/" → "/vi" trả về HTML cho cả yêu cầu RSC (chuyển trang phía client),
 * nên khi bấm về trang chủ, router của Next phải tải lại toàn trang → màn chào (Preloader) hiện lại.
 * Rewrite trong Proxy chạy trước bước định tuyến nên yêu cầu RSC được trả đúng dữ liệu RSC.
 *
 * Đường dẫn trùng lặp / cũ được chuyển hướng 308 về URL tiếng Việt chuẩn (tránh trùng nội dung cho SEO):
 *   /vi/...                      → bỏ tiền tố /vi
 *   /collections/..., /services  → /bo-suu-tap/..., /dich-vu
 *   /bo-suu-tap/sunset-couple    → /bo-suu-tap/cap-doi-hoang-hon (slug cũ)
 *
 * Ngôn ngữ theo người xem (xem preferredLang): khách mới vào → bản tiếng Anh; đã bấm VI/EN → nhớ lựa chọn
 * (cookie LANG_COOKIE do nút đổi ngôn ngữ ghi). Chuyển hướng 307 (tạm thời) và KHÔNG áp dụng cho bot,
 * để Google vẫn thu thập & lập chỉ mục được cả hai bản ngôn ngữ ở đúng URL của nó.
 */

// Trình thu thập / xem trước link (Googlebot, Bingbot, Facebook, Zalo, Lighthouse...): không chuyển hướng
const BOT_UA =
  /bot|crawl|spider|slurp|facebookexternalhit|facebookcatalog|embedly|preview|lighthouse|pagespeed|inspectiontool|headless|zalo/i;

// Ngôn ngữ người xem muốn: cookie đã chọn, không có thì tiếng Anh. null = không chuyển hướng.
function preferredLang(request) {
  const h = request.headers;
  if (request.method !== "GET") return null;
  // Chỉ lần mở trang thật (không phải yêu cầu RSC / prefetch khi chuyển trang phía client)
  if (h.get("rsc") || h.get("next-router-prefetch") || h.get("purpose") === "prefetch") return null;
  if (!(h.get("accept") || "").includes("text/html")) return null;
  if (BOT_UA.test(h.get("user-agent") || "")) return null;
  const saved = request.cookies.get(LANG_COOKIE)?.value;
  return saved === "vi" || saved === "en" ? saved : "en";
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const go = (path, mode) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    if (mode === "rewrite") return NextResponse.rewrite(url);
    if (mode !== "lang") return NextResponse.redirect(url, 308);
    // Đổi ngôn ngữ theo người xem: tạm thời, không cache (mỗi người một kết quả)
    const res = NextResponse.redirect(url, 307);
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  };
  const want = preferredLang(request);

  // Trang tiếng Anh: người đã chọn tiếng Việt → bản tiếng Việt tương ứng (nếu có)
  if (/^\/en(\/|$)/.test(pathname)) {
    if (want !== "vi") return NextResponse.next();
    const inner = pathname.replace(/^\/en/, "") || "/";
    const vi = toViPath(inner);
    return vi === "/" || fromViPath(vi) ? go(vi, "lang") : NextResponse.next();
  }

  const internal = pathname === "/" ? "/" : fromViPath(pathname);
  if (internal) {
    // Trang tiếng Việt: khách mới / người đã chọn tiếng Anh → bản tiếng Anh tương ứng
    if (want === "en") return go(internal === "/" ? "/en" : `/en${internal}`, "lang");
    return go(`/vi${internal === "/" ? "" : internal}`, "rewrite");
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
    "/vi/:path*",
    "/bo-suu-tap/:path*",
    "/dich-vu",
    "/collections/:path*",
    "/services",
    "/ban-quyen-anh",
    "/image-license",
  ],
};
