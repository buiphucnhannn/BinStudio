import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight, Check, Clock } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

// Ba gói gợi ý — giá "liên hệ" theo brief; gói giữa nổi bật nền navy.
export default function Packages({ data, ui }) {
  return (
    <section id="packages" className="bg-sand py-16 lg:py-24">
      <Container wide>
        <SectionHeading eyebrow={data.eyebrow} title={data.title} desc={data.desc} align="center" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {data.items.map((p, i) => (
            <div
              key={p.name}
              className={cn(
                "reveal relative flex flex-col rounded-[1.75rem] border p-8 transition-all duration-500 hover:-translate-y-1",
                p.featured
                  ? "border-navy bg-navy text-white shadow-soft md:-mt-4 md:mb-4"
                  : "border-ink/[0.06] bg-white text-ink shadow-card",
              )}
              style={{ "--reveal-delay": `${120 + i * 120}ms` }}
            >
              <p
                className={cn(
                  "text-[11px] tracking-[0.3em] uppercase",
                  p.featured ? "text-accent-light" : "text-accent-deep",
                )}
              >
                {p.for}
              </p>
              <h3 className="mt-3 font-serif text-[2.2rem] leading-none">{p.name}</h3>
              <p
                className={cn(
                  "mt-3 flex items-center gap-2 text-sm",
                  p.featured ? "text-white/70" : "text-ink-muted",
                )}
              >
                <Clock className="h-4 w-4" /> {p.duration}
              </p>
              <ul
                className={cn(
                  "mt-6 flex-1 space-y-3 border-t pt-6 text-[14px]",
                  p.featured ? "border-white/15" : "border-ink/10",
                )}
              >
                {p.includes.map((x) => (
                  <li key={x} className="flex items-start gap-3">
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        p.featured ? "text-accent-light" : "text-accent-deep",
                      )}
                    />
                    {x}
                  </li>
                ))}
              </ul>
              <p
                className={cn(
                  "mt-8 font-serif text-2xl",
                  p.featured ? "text-accent-light" : "text-ink",
                )}
              >
                {ui.priceContact}
              </p>
              <button
                type="button"
                data-booking
                className={cn(
                  "mt-5 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition",
                  p.featured
                    ? "bg-white text-ink hover:bg-sand-100"
                    : "bg-ink text-white hover:bg-graphite",
                )}
              >
                {ui.book} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
