"use client";

import { ORIGINAL_WIDTH } from "./image-widths.mjs";

/**
 * Loader cho next/image: trỏ tới ảnh đã tạo sẵn lúc build (scripts/build-images.mjs) thay vì
 * Image Optimization của Vercel → không tốn hạn mức, ảnh là file tĩnh trên CDN.
 * srcset/sizes vẫn hoạt động như cũ; quality cố định lúc tạo ảnh nên bỏ qua ở đây.
 */
export default function imageLoader({ src, width }) {
  if (!src.startsWith("/images/") || !src.endsWith(".webp") || width >= ORIGINAL_WIDTH) return src;
  return `/_img/${width}${src}`;
}
