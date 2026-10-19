import { cn } from "@/lib/utils";

/**
 * Hoạ tiết line-art tối giản theo chủ đề nhiếp ảnh biển đảo: khẩu độ, mặt trời, sóng, lá dừa, phim.
 * Nét mảnh, dùng currentColor → chỉnh màu/độ mờ bằng class text-*. Luôn là trang trí: aria-hidden.
 */
const shapes = {
  aperture: (
    <>
      <circle cx="50" cy="50" r="42" />
      <path d="M50 8v42M86.4 29 50 50M86.4 71 50 50M50 92V50M13.6 71 50 50M13.6 29 50 50" />
      <circle cx="50" cy="50" r="14" />
    </>
  ),
  sun: (
    <>
      <circle cx="50" cy="58" r="20" />
      <path d="M10 86h80M22 94h56" />
      <path d="M50 22v-8M24 32l-6-6M76 32l6-6M16 58H6M94 58h-10" />
    </>
  ),
  wave: (
    <>
      <path d="M4 40c12-12 24-12 36 0s24 12 36 0 16-8 20-4" />
      <path d="M4 58c12-12 24-12 36 0s24 12 36 0 16-8 20-4" />
      <path d="M4 76c12-12 24-12 36 0s24 12 36 0 16-8 20-4" />
    </>
  ),
  palm: (
    <>
      <path d="M50 92V46" />
      <path d="M50 46c-14-18-30-18-40-8 14-2 26 2 40 8z" />
      <path d="M50 46c14-18 30-18 40-8-14-2-26 2-40 8z" />
      <path d="M50 46c-4-20 2-32 14-38-2 14-6 26-14 38z" />
      <path d="M50 46c-10-16-24-22-36-20 12 6 24 12 36 20z" />
    </>
  ),
  film: (
    <>
      <rect x="10" y="26" width="80" height="48" rx="4" />
      <path d="M22 26v48M78 26v48" />
      <path d="M10 36h12M10 48h12M10 60h12M78 36h12M78 48h12M78 60h12" />
      <circle cx="50" cy="50" r="10" />
    </>
  ),
  compass: (
    <>
      <circle cx="50" cy="50" r="40" />
      <path d="M50 14v10M50 76v10M14 50h10M76 50h10" />
      <path d="M62 38 44 44l-6 18 18-6z" />
    </>
  ),
};

export default function Ornament({ name, className, float = false, delay = 0 }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("pointer-events-none select-none", float && "animate-float", className)}
      style={float && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {shapes[name]}
    </svg>
  );
}

// Chữ ký mờ cỡ lớn (font viết tay) làm watermark nền
export function Watermark({ text, className }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none font-script leading-none whitespace-nowrap select-none",
        className,
      )}
    >
      {text}
    </span>
  );
}
