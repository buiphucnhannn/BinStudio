/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cho phép build vào thư mục khác (vd. NEXT_DIST_DIR=.next-verify) để kiểm tra bản production
  // mà không ghi đè thư mục .next đang được `npm run dev` sử dụng.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false, // ẩn "X-Powered-By: Next.js"
  // Header bảo mật cho mọi trang & API
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" }, // trang khác không nhúng được site vào iframe
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
  // Ẩn nút "N" góc trái khi dev (lỗi compile/runtime vẫn hiện overlay)
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Next 16 bắt buộc khai báo danh sách quality; ảnh studio dùng 90 cho nét
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
  },
  // Tiếng Việt mặc định tại "/", tiếng Anh tại "/en" (route thật nằm ở app/[lang])
  async rewrites() {
    return [
      { source: "/", destination: "/vi" },
      { source: "/bo-suu-tap", destination: "/vi/bo-suu-tap" },
      { source: "/bo-suu-tap/:slug", destination: "/vi/bo-suu-tap/:slug" },
      { source: "/dich-vu", destination: "/vi/dich-vu" },
      // Bản tiếng Anh có đường dẫn tiếng Anh; route thật dùng chung
      { source: "/en/collections", destination: "/en/bo-suu-tap" },
      { source: "/en/collections/:slug", destination: "/en/bo-suu-tap/:slug" },
      { source: "/en/services", destination: "/en/dich-vu" },
    ];
  },
  async redirects() {
    return [
      { source: "/en/bo-suu-tap", destination: "/en/collections", permanent: true },
      { source: "/en/bo-suu-tap/:slug", destination: "/en/collections/:slug", permanent: true },
      { source: "/en/dich-vu", destination: "/en/services", permanent: true },
    ];
  },
};

export default nextConfig;
