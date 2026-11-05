import Image from "next/image";
import { cn } from "@/lib/utils";

// Logo thật của studio (tách nền từ logo gốc nền trắng, cắt sát, tỉ lệ 1219×752 ≈ 1.62:1 — gốc ở raw-photos/brand/).
// Mặc định: bản MÀU GỐC (navy + mặt trời cam) cho nền sáng.
// light=true: bản cho nền tối — phần navy đổi sang kem, mặt trời & mặt nước giữ nguyên màu.
// sizes: bề rộng hiển thị thật (= chiều cao × 1.62) để trình duyệt tải đúng cỡ ảnh.
// eager: tải ngay (logo luôn nằm đầu trang); priority: thêm độ ưu tiên cao (logo màn chào — thứ đầu tiên khách thấy).
export const LOGO_RATIO = 1219 / 752;

export default function Logo({
  className = "h-12",
  light = false,
  sizes = "78px",
  eager = false,
  priority = false,
}) {
  const src = light ? "/images/brand/logo-light.webp" : "/images/brand/logo-color.webp";
  return (
    <span className={cn("relative block aspect-[1219/752]", className)}>
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
