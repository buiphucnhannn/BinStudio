import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "left",
  light = false,
  className = "",
  size = "md",
}) {
  const sizes = {
    md: "text-[2rem] sm:text-[2.6rem] lg:text-[3rem]",
    lg: "text-[2.4rem] sm:text-[3.2rem] lg:text-[3.6rem]",
  };
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("reveal mb-4 eyebrow", light && "text-accent-light")}>{eyebrow}</p>
      )}
      <h2
        className={cn("reveal h-display", sizes[size], light && "text-white")}
        style={{ "--reveal-delay": "80ms" }}
      >
        {title}
      </h2>
      {desc && (
        <p
          className={cn(
            "reveal mt-5 text-[15px] leading-relaxed text-ink-soft sm:text-base",
            light && "text-white/80",
          )}
          style={{ "--reveal-delay": "160ms" }}
        >
          {desc}
        </p>
      )}
    </div>
  );
}
