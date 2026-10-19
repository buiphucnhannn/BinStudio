import Pic from "@/components/ui/Pic";
import Container from "@/components/ui/Container";
import { ArrowRight, Messenger, Phone, WhatsApp, Zalo } from "@/components/ui/Icons";

// Khối kết trang Dịch vụ: 3 ảnh mờ nền + lớp navy, tiêu đề lớn, nút đặt lịch & kênh liên hệ.
export default function ServicesCta({ cta, site, ui }) {
  const channels = [
    { href: site.whatsapp, label: "WhatsApp", Icon: WhatsApp, ext: true },
    { href: site.zalo, label: "Zalo", Icon: Zalo, ext: true },
    { href: site.messenger, label: "Messenger", Icon: Messenger, ext: true },
    { href: `tel:${site.phoneIntl}`, label: site.phone, Icon: Phone },
  ];
  return (
    <section
      data-nav-theme="dark"
      className="relative overflow-hidden bg-navy-deep py-16 text-white lg:py-24"
    >
      <div className="absolute inset-0 bleed-cap grid grid-cols-3 opacity-35">
        {cta.bg.map((im) => (
          <div key={im.src} className="relative">
            <Pic
              src={im.src}
              alt=""
              fill
              sizes="34vw"
              className="object-cover"
              style={{ objectPosition: im.pos }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/80 to-navy-deep/60" />
      <Container className="relative text-center">
        <p className="reveal font-script text-3xl text-accent-light sm:text-4xl">{cta.script}</p>
        <h2
          className="reveal mt-4 h-display text-[2.4rem] text-white sm:text-[3.2rem] lg:text-[3.8rem]"
          style={{ "--reveal-delay": "80ms" }}
        >
          {cta.title}
        </h2>
        <p
          className="reveal mx-auto mt-5 max-w-xl text-white/75"
          style={{ "--reveal-delay": "160ms" }}
        >
          {cta.desc}
        </p>
        <div className="reveal mt-9 flex justify-center" style={{ "--reveal-delay": "240ms" }}>
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
          className="reveal mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{ "--reveal-delay": "320ms" }}
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
      </Container>
    </section>
  );
}
