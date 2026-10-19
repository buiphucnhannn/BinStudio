import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { Globe, Film, Sun } from "@/components/ui/Icons";

const ICONS = { globe: Globe, film: Film, sun: Sun };

// Ba điểm khác biệt (USP theo brief) — thẻ trắng trên nền be, số thứ tự lớn kiểu serif.
export default function Usps({ usps }) {
  return (
    <section className="relative overflow-hidden bg-sand-100 py-16 lg:py-24">
      <Container wide>
        <SectionHeading eyebrow={usps.eyebrow} title={usps.title} align="center" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {usps.items.map((u, i) => {
            const Icon = ICONS[u.icon];
            return (
              <div
                key={u.title}
                className="reveal group relative overflow-hidden rounded-[1.75rem] border border-ink/[0.06] bg-white p-8 shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-soft"
                style={{ "--reveal-delay": `${150 + i * 120}ms` }}
              >
                <span className="pointer-events-none absolute -top-4 -right-2 font-serif text-[7rem] leading-none text-sand-200 transition-colors duration-500 group-hover:text-accent-light/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-sand text-accent-deep">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="relative mt-6 font-serif text-2xl leading-tight text-ink">
                  {u.title}
                </h3>
                <p className="relative mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                  {u.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
