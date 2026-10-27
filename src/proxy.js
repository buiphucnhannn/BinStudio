import { NextResponse } from "next/server";
import { fromViPath, legacyViRedirect, toViPath } from "@/i18n/routes";

/**
 * URL tiếng Việt (bản mặc định, không tiền tố) → route thật app/[lang] với lang = "vi".
 *   "/"                              → /vi
 *   "/bo-suu-tap/cap-doi-hoang-hon"  → /vi/collections/sunset-couple
 *   "/dich-vu"                       → /vi/services
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
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const go = (path, rewrite) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return rewrite ? NextResponse.rewrite(url) : NextResponse.redirect(url, 308);
  };

  if (pathname === "/") return go("/vi", true);

  const internal = fromViPath(pathname);
  if (internal) return go(`/vi${internal}`, true);

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
    "/vi/:path*",
    "/bo-suu-tap/:path*",
    "/dich-vu",
    "/collections/:path*",
    "/services",
  ],
};
