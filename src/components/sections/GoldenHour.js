import Container from "@/components/ui/Container";
import Pic from "@/components/ui/Pic";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "@/components/ui/Icons";

/**
 * Lịch ánh sáng Phú Quốc: nền navy, một đường chân trời chạy ngang với 4 mốc giờ;
 * mỗi mốc là một thẻ ảnh + giờ + địa điểm. Mặt trời (chấm vàng) nằm trên mốc "giờ vàng".
 */
export default function GoldenHour({ data }) {
  return (
    <section
      id="light"
      data-nav-theme="dark"
      className="grain relative overflow-hidden bg-navy-deep py-16 text-sand lg:py-24"
    >
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[560px] w-[560px] rounded-full bg-accent/20 blur-[160px]" />
      <Container wide className="relative">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <SectionHeading eyebrow={data.eyebrow} title={data.title} desc={data.desc} light />

          {/* Góc phải, một hàng ngang: bình minh — vạch sáng với mặt trời — hoàng hôn — nút đặt giờ vàng */}
          <div
            className="reveal hidden items-center gap-6 lg:flex"
            style={{ "--reveal-delay": "200ms" }}
          >
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl leading-none text-white">
                {data.slots[0].time}
              </span>
              <span className="mt-1.5 font-sans text-[10px] tracking-[0.25em] text-sand/50 uppercase">
                {data.slots[0].name}
              </span>
            </div>
            <div className="relative h-px w-28 bg-gradient-to-r from-sand/15 via-sand/40 to-sand/15">
              <span className="absolute top-1/2 left-[62%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_18px_4px_rgba(201,151,63,0.5)]" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl leading-none text-white">
                {data.slots[3].time.split(" – ")[1]}
              </span>
              <span className="mt-1.5 font-sans text-[10px] tracking-[0.25em] text-sand/50 uppercase">
                {data.slots[3].name.split(" & ")[0]}
              </span>
            </div>
            <button
              type="button"
              data-booking="02"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-medium text-ink transition hover:bg-sand-100"
            >
              {data.cta} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* đường chân trời */}
        <div className="relative mt-14 hidden lg:block">
          <div className="absolute inset-x-0 top-3 h-px bg-gradient-to-r from-transparent via-sand/30 to-transparent" />
          <div className="grid grid-cols-4">
            {data.slots.map((s, i) => (
              <div key={s.time} className="relative px-2">
                <span
                  className="reveal relative z-10 mx-auto block h-6 w-6 rounded-full border border-accent-light/60 bg-navy-deep"
                  style={{ "--reveal-delay": `${i * 120}ms` }}
                >
                  <span
                    className={
                      i === 2
                        ? "absolute inset-1 rounded-full bg-accent shadow-[0_0_24px_6px_rgba(201,151,63,0.45)]"
                        : "absolute inset-2 rounded-full bg-sand/70"
                    }
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4">
          {data.slots.map((s, i) => (
            <article
              key={s.time}
              className="reveal group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-colors duration-500 hover:bg-white/[0.08]"
              style={{ "--reveal-delay": `${120 + i * 110}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Pic
                  src={s.image.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  style={{ objectPosition: s.image.pos }}
                />
                <span className="absolute top-3 left-3 rounded-full bg-navy-deep/70 px-2.5 py-1 font-sans text-[11px] tracking-[0.15em] text-accent-light tabular-nums backdrop-blur">
                  {s.time}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-2xl text-white">{s.name}</h3>
                <p className="mt-1 text-[11px] tracking-[0.2em] text-accent-light uppercase">
                  {s.where}
                </p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-sand/75">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
