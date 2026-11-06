import Link from "next/link";
import Ornament from "@/components/ui/Ornaments";
import { ArrowRight } from "@/components/ui/Icons";
import { href } from "@/i18n";

/**
 * Nội dung trang 404 (dùng cho app/global-not-found.js và app/[lang]/not-found.js):
 * một màn hình, căn giữa. Song ngữ vì trang lỗi không biết khách đang xem bản nào.
 * Các nút là liên kết nội bộ về trang chủ / bộ sưu tập để khách (và Google) đi tiếp.
 */
export default function NotFoundView() {
  return (
    <section className="relative flex min-h-[var(--screen)] items-center justify-center overflow-hidden bg-sand px-5 pt-28 pb-16 text-center">
      <Ornament
        name="aperture"
        className="pointer-events-none absolute -top-16 -right-16 w-80 animate-spin-slow text-ink/[0.05]"
      />
      <div className="relative mx-auto max-w-2xl">
        <p className="eyebrow">Lỗi 404 · Page not found</p>

        {/* "4 ◎ 4": số 0 là biểu tượng aperture của thương hiệu */}
        <p
          aria-hidden="true"
          className="mt-5 flex items-center justify-center gap-3 font-serif text-[6rem] leading-none text-ink sm:text-[8rem]"
        >
          <span>4</span>
          {/* SVG nhúng thẳng (cùng hình với favicon): không dùng <img> vì nội dung trang 404 đi kèm mọi trang,
              React sẽ phát lệnh tải trước ảnh đó trên cả trang chủ dù không hiển thị (cảnh báo "preloaded but not used") */}
          <svg
            viewBox="-100 -100 200 200"
            className="h-[0.78em] w-[0.78em] animate-spin-slow"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="nf-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#e2be78" />
                <stop offset="0.5" stopColor="#c08f3e" />
                <stop offset="1" stopColor="#9c6f2c" />
              </linearGradient>
              <mask
                id="nf-blades"
                maskUnits="userSpaceOnUse"
                x="-100"
                y="-100"
                width="200"
                height="200"
              >
                <circle r="91" fill="#fff" />
                <path
                  d="M-44.22 -12.68L-22.30 -40.23L12.68 -44.22L40.23 -22.30L44.22 12.68L22.30 40.23L-12.68 44.22L-40.23 22.30Z"
                  fill="#000"
                />
                <path
                  d="M-22.30 -40.23L18.24 -91.19M12.68 -44.22L77.38 -51.59M40.23 -22.30L91.19 18.24M44.22 12.68L51.59 77.38M22.30 40.23L-18.24 91.19M-12.68 44.22L-77.38 51.59M-40.23 22.30L-91.19 -18.24M-44.22 -12.68L-51.59 -77.38"
                  stroke="#000"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </mask>
            </defs>
            <g transform="scale(0.94)">
              <circle r="97.7" fill="none" stroke="url(#nf-gold)" strokeWidth="4.6" />
              <circle r="91" fill="url(#nf-gold)" mask="url(#nf-blades)" />
            </g>
          </svg>
          <span>4</span>
        </p>

        <h1 className="mt-6 h-display text-[2.2rem] sm:text-[3rem]">
          Khoảnh khắc này <span className="text-accent-deep italic">chưa được ghi lại.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft sm:text-base">
          Đường dẫn bạn mở không tồn tại hoặc đã được đổi.
        </p>
        <p className="mx-auto mt-1 max-w-md font-serif text-lg text-ink-soft italic">
          This page doesn&apos;t exist or has moved.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-6 text-sm font-medium text-white shadow-card transition hover:bg-graphite"
          >
            Về trang chủ
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link
            href={href("vi", "/collections")}
            className="inline-flex items-center rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition hover:border-ink"
          >
            Xem bộ sưu tập
          </Link>
        </div>
        <Link
          href="/"
          hrefLang="en"
          className="mt-5 inline-flex items-center gap-2 text-sm text-ink-soft underline-offset-4 transition hover:text-ink hover:underline"
        >
          English home <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
