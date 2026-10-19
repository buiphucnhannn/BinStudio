import Container from "@/components/ui/Container";
import Pic from "@/components/ui/Pic";
import SectionHeading from "@/components/ui/SectionHeading";
import Ornament from "@/components/ui/Ornaments";
import { cn } from "@/lib/utils";

/**
 * Quy trình 4 bước: lưới 4 cột nối bằng đường kẻ, mỗi bước là ảnh nhỏ bo tròn + số lớn kiểu serif.
 * Các bước lẻ đẩy xuống một chút để nhịp bớt đều.
 */
export default function Process({ data }) {
  return (
    <section id="process" className="relative overflow-hidden bg-sand-100 py-16 lg:py-24">
      <Ornament
        name="compass"
        className="absolute -bottom-16 -left-10 hidden w-56 text-ink/[0.05] lg:block"
      />
      <Container wide>
        <SectionHeading eyebrow={data.eyebrow} title={data.title} align="center" />

        <div className="relative mt-14">
          <div className="absolute inset-x-[12%] top-[3.25rem] hidden h-px bg-ink/10 lg:block" />
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {data.steps.map((s, i) => (
              <li
                key={s.n}
                className={cn("reveal relative", i % 2 === 1 && "lg:mt-12")}
                style={{ "--reveal-delay": `${120 + i * 110}ms` }}
              >
                <span className="relative z-10 mx-auto flex h-[6.5rem] w-[6.5rem] items-center justify-center rounded-full border border-ink/10 bg-sand font-serif text-3xl text-ink shadow-card">
                  {s.n}
                </span>
                <div className="relative mx-auto -mt-6 aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-[1.5rem] bg-sand-200">
                  <Pic
                    src={s.image.src}
                    alt=""
                    fill
                    sizes="280px"
                    className="object-cover"
                    style={{ objectPosition: s.image.pos }}
                  />
                </div>
                <h3 className="mt-6 text-center font-serif text-2xl text-ink">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-[280px] text-center text-[13.5px] leading-relaxed text-ink-soft">
                  {s.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
