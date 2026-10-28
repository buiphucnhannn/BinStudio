import Link from "next/link";
import Container from "@/components/ui/Container";
import Pic from "@/components/ui/Pic";
import AfterIntro from "@/components/fx/AfterIntro";
import SplitText from "@/components/fx/SplitText";
import Button from "@/components/ui/Button";
import { cn, pad2 } from "@/lib/utils";
import { href } from "@/i18n";
import { ArrowRight } from "@/components/ui/Icons";

/**
 * Bộ sưu tập kiểu "editorial grid": 6 thẻ kích thước khác nhau, so le, có số thứ tự.
 * Hover: ảnh phóng nhẹ, caption trượt lên, vòng mũi tên hiện ra.
 */
// sizes khớp từng thẻ: 7/12, 5/12, 4/12 khung nội dung (tối đa 1312px); sm: 2 cột; mobile: 1 cột
const SIZES = [
  "(min-width: 1440px) 757px, (min-width: 1024px) 51vw, (min-width: 768px) 54vw, (min-width: 640px) 44vw, 90vw",
  "(min-width: 1440px) 538px, (min-width: 1024px) 37vw, (min-width: 768px) 38vw, (min-width: 640px) 44vw, 90vw",
  "(min-width: 1440px) 538px, (min-width: 1024px) 37vw, (min-width: 768px) 38vw, (min-width: 640px) 44vw, 90vw",
  "(min-width: 1440px) 427px, (min-width: 1024px) 29vw, (min-width: 768px) 30vw, (min-width: 640px) 44vw, 90vw",
  "(min-width: 1440px) 427px, (min-width: 1024px) 29vw, (min-width: 768px) 30vw, (min-width: 640px) 44vw, 90vw",
  "(min-width: 1440px) 427px, (min-width: 1024px) 29vw, (min-width: 768px) 30vw, (min-width: 640px) 44vw, 90vw",
];

const LAYOUT = [
  "md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto",
  "md:col-span-5 aspect-[4/5] md:aspect-[5/4]",
  "md:col-span-5 aspect-[4/5] md:aspect-[5/4]",
  "md:col-span-4 aspect-[4/5]",
  "md:col-span-4 aspect-[4/5]",
  "md:col-span-4 aspect-[4/5]",
];

export default function Collections({ lang, collections, ui, heading }) {
  const allHref = href(lang, "/collections");
  const linkFor = (slug) => href(lang, `/collections/${slug}`);

  return (
    <section id="collections" className="relative overflow-hidden bg-sand py-16 lg:py-24">
      <Container wide>
        <p className="reveal eyebrow">{heading.eyebrow}</p>
        {/* Nút căn đúng tâm chiều cao tiêu đề (eyebrow nằm hàng riêng phía trên) */}
        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <SplitText
            text={heading.title}
            accent={heading.accent}
            accentClass="italic text-accent-deep"
            className="max-w-2xl h-display text-[2.2rem] sm:text-[2.8rem] lg:text-[3.3rem]"
          />
          <div className="reveal" style={{ "--reveal-delay": "150ms" }}>
            <Button href={allHref} arrow>
              {ui.viewAll}
            </Button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-12 md:gap-5">
          {collections.map((c, i) => (
            <Link
              key={c.slug}
              href={linkFor(c.slug)}
              className={cn(
                "group reveal relative block overflow-hidden rounded-[1.5rem] bg-sand-200",
                LAYOUT[i],
              )}
              style={{ "--reveal-delay": `${100 + i * 90}ms` }}
            >
              {/* ảnh bìa cách màn hình đầu vài lần cuộn: chỉ tải sau màn chào */}
              <AfterIntro>
                <Pic
                  src={c.cover}
                  alt={c.name}
                  fill
                  sizes={SIZES[i]}
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  style={{ objectPosition: c.coverPos }}
                />
              </AfterIntro>
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

              <span className="absolute top-5 left-5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium tracking-wider text-ink backdrop-blur lg:text-[10px]">
                {pad2(i + 1)}
              </span>
              <span className="absolute top-5 right-5 rounded-full border border-white/30 px-2.5 py-1 text-[10px] tracking-[0.2em] text-white/85 uppercase backdrop-blur">
                {c.images.length} {ui.photos}
              </span>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white md:p-7">
                <div className="min-w-0">
                  <p className="text-[11px] tracking-[0.3em] text-white/70 uppercase lg:text-[10px]">
                    {c.sub}
                  </p>
                  <h3
                    className={cn(
                      "mt-1.5 font-serif leading-tight",
                      i === 0 ? "text-3xl md:text-[2.6rem]" : "text-2xl md:text-[1.9rem]",
                    )}
                  >
                    {c.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-1 max-w-sm translate-y-2 text-[13px] text-white/80 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {c.concept}
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
