import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@/components/ui/Icons";

/**
 * Nút dùng chung. variant: primary (than) | outline | light (trên nền tối) | pill (trắng + vòng tròn mũi tên) | gold
 * - href: <Link>; as="button": <button>; external: <a target=_blank>
 * - arrow: thêm mũi tên trượt khi hover
 */
export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  className = "",
  external = false,
  as,
  ...rest
}) {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide whitespace-nowrap transition-all duration-300";
  const sizes = {
    sm: "px-5 py-2.5 text-[13px]",
    md: "px-7 py-3.5 text-sm",
    lg: "px-8 py-4 text-sm",
  };
  const styles = {
    primary: "bg-ink text-white shadow-card hover:bg-graphite hover:shadow-soft",
    gold: "bg-accent text-ink shadow-card hover:bg-accent-light hover:shadow-soft",
    outline:
      "border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-white",
    light:
      "border border-white/60 bg-white/15 text-white backdrop-blur-sm hover:bg-white hover:text-ink",
    pill: "bg-white py-1.5 pl-6 pr-1.5 text-ink hover:bg-sand-100",
  };
  const cls = cn(base, variant !== "pill" && sizes[size], styles[variant], className);

  const content = (
    <>
      <span className="inline-flex items-center gap-2">{children}</span>
      {variant === "pill" ? (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowRight className="h-4 w-4" />
        </span>
      ) : (
        arrow && (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        )
      )}
    </>
  );

  if (as === "button" || !href) {
    return (
      <button type="button" className={cls} {...rest}>
        {content}
      </button>
    );
  }
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}
