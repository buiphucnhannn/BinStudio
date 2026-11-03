import { notFound } from "next/navigation";
import { anchor, localize, isLocale } from "@/i18n";
import { siteConfig } from "@/config/site";
import { pageMeta } from "@/lib/seo";
import { breadcrumb, JsonLd } from "@/lib/schema";
import { licensePage, ui } from "@/data/site";
import Container from "@/components/ui/Container";
import { Messenger, Phone, WhatsApp, Zalo } from "@/components/ui/Icons";

/**
 * Bản quyền & cấp phép hình ảnh. Mọi ảnh trong dữ liệu có cấu trúc (src/lib/schema.js) trỏ về đây qua
 * license (cả trang) và acquireLicensePage (mục #license-request) → Google Hình ảnh hiện nhãn "Licensable".
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const L = localize(licensePage.meta, lang);
  return pageMeta(lang, "/image-license", { title: L.title, description: L.desc });
}

export default async function ImageLicensePage({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const site = localize(siteConfig, lang);
  const L = localize({ licensePage, ui }, lang);
  const page = L.licensePage;

  const channels = [
    { Icon: Zalo, label: "Zalo", value: site.phone, url: site.zalo },
    {
      Icon: WhatsApp,
      label: "WhatsApp",
      // "+84384038453" → "+84 384 038 453"
      value: site.phoneIntl.replace(/^\+84(\d{3})(\d{3})(\d{3})$/, "+84 $1 $2 $3"),
      url: site.whatsapp,
    },
    { Icon: Messenger, label: "Messenger", value: "Studio Bin", url: site.messenger },
    {
      Icon: Phone,
      label: lang === "vi" ? "Điện thoại" : "Phone",
      value: site.phone,
      url: `tel:${site.phoneIntl}`,
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumb(lang, [
          { name: L.ui.home, path: "/" },
          { name: page.eyebrow, path: "/image-license" },
        ])}
      />
      <section className="bg-sand pt-36 pb-20 lg:pt-44 lg:pb-28">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="reveal eyebrow">{page.eyebrow}</p>
            <h1
              className="reveal mt-4 h-display text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem]"
              style={{ "--reveal-delay": "80ms" }}
            >
              {page.title} <span className="text-accent-deep italic">{page.accent}</span>
            </h1>
            <p
              className="reveal mt-6 text-justify text-[15px] leading-relaxed text-ink-soft sm:text-base"
              style={{ "--reveal-delay": "160ms" }}
            >
              {page.intro}
            </p>

            <div className="mt-14 space-y-12">
              {page.sections.map((s) => (
                <section key={s.id} id={anchor(lang, s.id)} className="reveal scroll-mt-28">
                  <h2 className="font-serif text-[1.8rem] leading-tight text-ink sm:text-[2.1rem]">
                    {s.title}
                  </h2>
                  {s.body.map((p, i) => (
                    <p
                      key={i}
                      className="mt-4 text-justify text-[15px] leading-relaxed text-ink-soft sm:text-base"
                    >
                      {p}
                    </p>
                  ))}
                  {s.request && (
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {channels.map(({ Icon, label, value, url }) => (
                        <li key={label}>
                          <a
                            href={url}
                            target={url.startsWith("http") ? "_blank" : undefined}
                            rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white/70 px-5 py-4 transition hover:border-ink/30 hover:bg-white"
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                              <Icon className="h-[18px] w-[18px]" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[13px] text-ink-muted">{label}</span>
                              <span className="block truncate text-[15px] text-ink">{value}</span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
