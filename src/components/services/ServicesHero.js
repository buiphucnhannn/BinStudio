import Container from "@/components/ui/Container";
import Pic from "@/components/ui/Pic";
import SplitText from "@/components/fx/SplitText";
import Parallax from "@/components/fx/Parallax";
import { Watermark } from "@/components/ui/Ornaments";
import { ArrowRight } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

// Hero trang Dịch vụ: chữ bên trái, 3 ảnh dọc xếp bậc thang bên phải (parallax lệch tốc độ).
export default function ServicesHero({ hero, ui }) {
  return (
    <section className="relative flex screen items-center overflow-hidden bg-sand pt-32 pb-16 lg:pt-0 lg:pb-0">
      <Watermark
        text={hero.script}
        className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 text-center text-[11rem] text-ink/[0.045] lg:block lg:text-[15rem]"
      />
      <Container wide className="relative grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <p className="reveal eyebrow">{hero.eyebrow}</p>
          <SplitText
            as="h1"
            text={hero.title}
            accent={hero.accent}
            accentClass="italic text-accent-deep"
            breakBeforeAccent
            className="mt-4 h-display text-[2.6rem] sm:text-[3.6rem] lg:text-[4.4rem]"
          />
          <p
            className="reveal mt-6 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base"
            style={{ "--reveal-delay": "200ms" }}
          >
            {hero.desc}
          </p>
          <div className="reveal mt-8 flex flex-wrap gap-3" style={{ "--reveal-delay": "300ms" }}>
            <button
              type="button"
              data-booking
              className="group inline-flex items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-6 text-sm font-medium text-white transition hover:bg-graphite"
            >
              {ui.book}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition hover:border-ink"
            >
              {hero.ctaSecondary}
            </a>
          </div>
          <dl
            className="reveal mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-ink/10 pt-8"
            style={{ "--reveal-delay": "400ms" }}
          >
            {hero.stats.map((s) => (
              <div key={s.label}>
                <dt className="font-serif text-3xl text-ink">{s.value}</dt>
                <dd className="mt-1 text-[12px] text-ink-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid grid-cols-3 items-end gap-3 sm:gap-4">
          {hero.images.map((im, i) => (
            <Parallax
              key={im.src}
              speed={[0.06, -0.04, 0.09][i]}
              className={cn(i === 1 && "-translate-y-10", i === 2 && "translate-y-6")}
            >
              <div
                className="reveal relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-sand-200 sm:rounded-[1.5rem]"
                data-reveal="scale"
                style={{ "--reveal-delay": `${150 + i * 120}ms` }}
              >
                <Pic
                  src={im.src}
                  alt=""
                  fill
                  preload={i === 0}
                  sizes="(min-width: 1024px) 16vw, 30vw"
                  className="object-cover"
                  style={{ objectPosition: im.pos }}
                />
              </div>
            </Parallax>
          ))}
        </div>
      </Container>
    </section>
  );
}
