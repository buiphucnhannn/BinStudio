import Image from "next/image";
import { cn } from "@/lib/utils";

// Logo thật của khách (tách nền từ logo gốc, tỉ lệ 1600x494).
// light=true: bản vàng cho nền tối; mặc định bản than cho nền sáng. gold=true: luôn vàng.
export default function Logo({ className = "h-8", light = false, gold = false, preload = false }) {
  const src = gold || light ? "/images/brand/logo-gold.png" : "/images/brand/logo-dark.png";
  return (
    <span className={cn("relative block aspect-[1600/494]", className)}>
      <Image
        src={src}
        alt="Studio Bin — Photographer Phú Quốc"
        fill
        sizes="260px"
        preload={preload}
        className="object-contain"
      />
    </span>
  );
}
