import { NextResponse } from "next/server";

/**
 * Trang chủ tiếng Việt: "/" hiển thị nội dung của "/vi" (URL trên trình duyệt vẫn là "/").
 *
 * Vì sao không để trong rewrites() của next.config:
 * trên Vercel, rewrite gốc "/" → "/vi" trả về HTML cho cả yêu cầu RSC (chuyển trang phía client),
 * nên khi bấm về trang chủ, router của Next phải tải lại toàn trang → màn chào (Preloader) hiện lại.
 * Rewrite trong Proxy chạy trước bước định tuyến nên yêu cầu RSC được trả đúng dữ liệu RSC.
 */
export function proxy(request) {
  return NextResponse.rewrite(new URL("/vi", request.url));
}

export const config = {
  matcher: "/",
};
