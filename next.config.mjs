import { DEVICE_SIZES, IMAGE_SIZES } from "./src/lib/image-widths.mjs";

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
  experimental: {
    // Trang 404 chung cho mọi đường dẫn không tồn tại (app/global-not-found.js) — cần vì layout gốc nằm trong [lang]
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Không dùng Image Optimization của Vercel (gói Hobby: 5.000 lượt/tháng, vượt là ảnh lỗi):
    // ảnh các cỡ được tạo sẵn lúc build (scripts/build-images.mjs), loader trỏ thẳng tới file tĩnh.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.js",
    deviceSizes: DEVICE_SIZES,
    imageSizes: IMAGE_SIZES,
    // Next 16 bắt buộc khai báo danh sách quality (giá trị quality trong code giữ nguyên, loader bỏ qua)
    qualities: [75, 85, 90],
  },
  // Tiếng Việt mặc định tại "/" (đường dẫn tiếng Việt, rewrite trong src/proxy.js),
  // tiếng Anh tại "/en" (đường dẫn tiếng Anh = route thật app/[lang]).
  // Đường dẫn tiếng Việt cũ dưới /en → đường dẫn tiếng Anh (giữ link đã chia sẻ & SEO)
  async redirects() {
    return [
      { source: "/en/bo-suu-tap", destination: "/en/collections", permanent: true },
      { source: "/en/bo-suu-tap/:slug", destination: "/en/collections/:slug", permanent: true },
      { source: "/en/dich-vu", destination: "/en/services", permanent: true },
    ];
  },
};

export default nextConfig;
