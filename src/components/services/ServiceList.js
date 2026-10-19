import Link from "next/link";
import Container from "@/components/ui/Container";
import Pic from "@/components/ui/Pic";
import Parallax from "@/components/fx/Parallax";
import { href } from "@/i18n";
import { ArrowRight, Check } from "@/components/ui/Icons";
import Ornament from "@/components/ui/Ornaments";
import { cn } from "@/lib/utils";

// Danh sách dịch vụ chi tiết: ảnh / chữ xen kẽ trái–phải, mỗi mục có số, điểm chính và nút đặt lịch.
export default function ServiceList({ lang, items, ui, heading }) {
  return (
    <section id="services" className="bg-sand-50 py-16 lg:py-24">
      <Container wide>
        <p className="reveal eyebrow">{heading.eyebrow}</p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h2
            className="reveal max-w-2xl h-display text-[2rem] sm:text-[2.6rem] lg:text-[3rem]"
            style={{ "--reveal-delay": "80ms" }}
          >
            {heading.title}
          </h2>
          {/* Góc phải: dải film line-art + bộ đếm 01–05 */}
          <div className="reveal flex items-center gap-5" style={{ "--reveal-delay": "200ms" }}>
            <Ornament name="film" float className="hidden w-20 text-ink/[0.14] lg:block" />
            <ol className="flex items-center gap-2">
              {items.map((s) => (
                <li key={s.n}>
                  <a
                    href={`#service-${s.n}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 font-sans text-xs font-medium text-ink/70 transition hover:border-ink hover:bg-ink hover:text-white"
                  >
                    {s.n}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-14 space-y-16 lg:space-y-24">
          {items.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={s.n}
                id={`service-${s.n}`}
                className="grid scroll-mt-28 items-center gap-8 lg:grid-cols-2 lg:gap-16"
              >
                <Parallax
                  speed={0.05}
                  className={cn(
                    "reveal relative aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[1.75rem] bg-sand-200",
                    flip ? "lg:order-2 lg:justify-self-end" : "lg:justify-self-start",
                  )}
                  data-reveal="clip"
                >
                  <Pic
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                    style={{ objectPosition: s.pos }}
                  />
                  <span className="absolute top-5 left-5 rounded-full bg-white/85 px-3 py-1 font-sans text-[11px] font-medium tracking-[0.2em] text-ink backdrop-blur">
                    {s.n}
                  </span>
                </Parallax>

                <div className={cn("relative", flip && "lg:order-1")}>
                  {/* Số thứ tự lớn mờ làm nền sau khối chữ */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -left-4 font-serif text-[9rem] leading-none text-ink/[0.05] select-none sm:text-[12rem] lg:-top-20"
                  >
                    {s.n}
                  </span>
                  <h3 className="reveal relative font-serif text-[2rem] leading-tight text-ink sm:text-[2.4rem]">
                    {s.title}
                  </h3>
                  <p
                    className="reveal mt-5 text-[15px] leading-relaxed text-ink-soft"
                    style={{ "--reveal-delay": "100ms" }}
                  >
                    {s.desc}
                  </p>
                  <ul className="reveal mt-6 space-y-2.5" style={{ "--reveal-delay": "180ms" }}>
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-[14px] text-ink">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-light/50 text-accent-deep">
                          <Check className="h-3 w-3" />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="reveal mt-8 flex flex-wrap gap-3"
                    style={{ "--reveal-delay": "260ms" }}
                  >
                    <button
                      type="button"
                      data-booking={s.n}
                      className="group inline-flex items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-6 text-sm font-medium text-white transition hover:bg-graphite"
                    >
                      {ui.book}
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-0.5">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </button>
                    {s.collection && (
                      <Link
                        href={href(lang, `/bo-suu-tap/${s.collection}`)}
                        className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition hover:border-ink"
                      >
                        {ui.viewAlbum}
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
