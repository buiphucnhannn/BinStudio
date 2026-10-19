import Container from "@/components/ui/Container";
import Pic from "@/components/ui/Pic";
import SectionHeading from "@/components/ui/SectionHeading";
import { Watermark } from "@/components/ui/Ornaments";
import { cn } from "@/lib/utils";

/**
 * Đánh giá: 3 thẻ, mỗi thẻ có ảnh tròn nhỏ của buổi chụp, trích dẫn serif lớn.
 * Thẻ giữa đẩy xuống để nhịp so le. Chữ ký mờ "thank you" làm nền.
 */
export default function Testimonials({ data }) {
  return (
    <section className="relative overflow-hidden bg-sand py-16 lg:py-24">
      <Watermark
        text="thank you"
        className="absolute top-8 left-1/2 -translate-x-1/2 text-[9rem] text-ink/[0.04] sm:text-[13rem] lg:text-[17rem]"
      />
      <Container wide className="relative">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} align="center" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {data.items.map((tm, i) => (
            <figure
              key={tm.name}
              className={cn(
                "reveal flex flex-col rounded-[1.75rem] border border-ink/[0.06] bg-white p-7 shadow-card",
                i === 1 && "md:mt-10",
              )}
              style={{ "--reveal-delay": `${120 + i * 120}ms` }}
            >
              <span className="font-serif text-5xl leading-none text-accent">“</span>
              <blockquote className="mt-2 flex-1 font-serif text-[1.35rem] leading-snug text-ink">
                {tm.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-sand-200">
                  <Pic
                    src={tm.image.src}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                    style={{ objectPosition: tm.image.pos }}
                  />
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">{tm.name}</span>
                  <span className="block text-xs text-ink-muted">{tm.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
