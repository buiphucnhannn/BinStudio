import Pic from "@/components/ui/Pic";
import SplitText from "@/components/fx/SplitText";
import Parallax from "@/components/fx/Parallax";
import { ArrowRight, Messenger, Phone, WhatsApp, Zalo } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const Polaroid = ({ p, className = "", sizes = "260px" }) => (
  <div className={cn("polaroid", className)}>
    <div
      className={cn("relative w-full overflow-hidden", p.wide ? "aspect-[3/2]" : "aspect-[4/5]")}
    >
      <Pic
        src={p.src}
        alt=""
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: p.pos }}
      />
    </div>
    <p className="mt-2 text-center font-serif text-base leading-none text-ink-soft italic">
      {p.caption}
    </p>
  </div>
);

/**
 * Khối mời gọi cuối trang: tiêu đề lớn ở giữa, polaroid xoè quanh (parallax),
 * nút đặt lịch mở popup + 4 kênh liên hệ nhanh.
 */
export default function Contact({ contact, site, ui }) {
  const [p1, p2, p3, p4] = contact.polaroids;
  const spots = [
    { p: p1, cls: "left-[4%] top-[14%] w-[15vw] max-w-[260px] -rotate-[7deg]", speed: 0.08 },
    { p: p2, cls: "left-[9%] bottom-[9%] w-[14vw] max-w-[250px] rotate-[5deg]", speed: -0.05 },
    { p: p3, cls: "right-[5%] top-[12%] w-[12vw] max-w-[210px] rotate-[6deg]", speed: -0.06 },
    { p: p4, cls: "right-[11%] bottom-[10%] w-[13vw] max-w-[230px] -rotate-[4deg]", speed: 0.07 },
  ];

  const channels = [
    { href: site.whatsapp, label: "WhatsApp", Icon: WhatsApp, ext: true },
    { href: site.zalo, label: "Zalo", Icon: Zalo, ext: true },
    { href: site.messenger, label: "Messenger", Icon: Messenger, ext: true },
    { href: `tel:${site.phoneIntl}`, label: site.phone, Icon: Phone },
  ];

  return (
    <section
      id="contact"
      data-nav-theme="dark"
      className="grain relative flex screen items-center justify-center overflow-hidden bg-navy py-16 text-white lg:py-24"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-[160px]" />

      <div className="pointer-events-none absolute inset-0 bleed-box hidden lg:block">
        {spots.map(({ p, cls, speed }, i) => (
          <Parallax key={p.src} speed={speed} className={cn("absolute hidden lg:block", cls)}>
            <div
              className="reveal"
              data-reveal="scale"
              style={{ "--reveal-delay": `${150 + i * 120}ms` }}
            >
              <Polaroid p={p} />
            </div>
          </Parallax>
        ))}
      </div>

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-5 text-center">
        <p className="reveal font-script text-3xl text-accent-light sm:text-4xl">
          {contact.script}
        </p>
        <p className="reveal mt-3 eyebrow text-white/60" style={{ "--reveal-delay": "80ms" }}>
          {contact.eyebrow}
        </p>
        <SplitText
          text={contact.title}
          className="mt-5 h-display text-[2.5rem] text-white sm:text-[3.4rem] lg:text-[4rem] xl:text-[4.6rem]"
        />

        <div className="mt-8 flex items-end justify-center gap-3 lg:hidden">
          <div className="reveal w-[26vw] max-w-[150px] -rotate-6">
            <Polaroid p={p4} sizes="150px" />
          </div>
          <div
            className="reveal w-[30vw] max-w-[170px] translate-y-3"
            style={{ "--reveal-delay": "100ms" }}
          >
            <Polaroid p={p1} sizes="170px" />
          </div>
          <div
            className="reveal w-[26vw] max-w-[150px] rotate-6"
            style={{ "--reveal-delay": "200ms" }}
          >
            <Polaroid p={p3} sizes="150px" />
          </div>
        </div>
        <p
          className="reveal mt-6 max-w-xl text-[15px] leading-relaxed text-white/75 sm:text-base"
          style={{ "--reveal-delay": "250ms" }}
        >
          {contact.desc}
        </p>

        <div
          className="reveal mt-9 flex flex-wrap items-center justify-center gap-3"
          style={{ "--reveal-delay": "350ms" }}
        >
          <button
            type="button"
            data-booking
            className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-7 text-[15px] font-medium text-ink shadow-soft transition hover:bg-sand-100"
          >
            {ui.bookFree}
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </div>

        <ul
          className="reveal mt-10 flex flex-wrap items-center justify-center gap-3"
          style={{ "--reveal-delay": "450ms" }}
        >
          {channels.map(({ href, label, Icon, ext }) => (
            <li key={label}>
              <a
                href={href}
                target={ext ? "_blank" : undefined}
                rel={ext ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[13px] text-white/85 transition hover:border-white hover:bg-white hover:text-ink"
              >
                <Icon className="h-4 w-4" /> {label}
              </a>
            </li>
          ))}
        </ul>
        <p
          className="reveal mt-6 text-[11px] tracking-[0.25em] text-white/35 uppercase"
          style={{ "--reveal-delay": "500ms" }}
        >
          {site.hoursShort} · {site.addressShort}
        </p>
      </div>
    </section>
  );
}
