import Image from "next/image";
import { cn } from "@/lib/utils";

// Logo thật của khách (tách nền từ logo gốc, tỉ lệ 1600x494).
// light=true: bản vàng cho nền tối; mặc định bản than cho nền sáng. gold=true: luôn vàng.
// sizes: bề rộng hiển thị thật (= chiều cao × 3.24) để trình duyệt tải đúng cỡ ảnh.
// eager: tải ngay (logo luôn nằm đầu trang); priority: thêm độ ưu tiên cao (logo màn chào — thứ đầu tiên khách thấy).
export default function Logo({
  className = "h-8",
  light = false,
  gold = false,
  sizes = "130px",
  eager = false,
  priority = false,
}) {
  const src = gold || light ? "/images/brand/logo-gold.webp" : "/images/brand/logo-dark.webp";
  return (
    <span className={cn("relative block aspect-[1600/494]", className)}>
      <Image
        src={src}
        alt="Studio Bin — Photographer Phú Quốc"
        fill
        sizes={sizes}
        loading={eager ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
        className="object-contain"
      />
    </span>
  );
}
