import Link from "next/link";
import { localize, href, isLocale } from "@/i18n";
import { collections, collectionsPage, categories, ui, totalPhotos } from "@/data/site";
import Container from "@/components/ui/Container";
import Pic from "@/components/ui/Pic";
import SplitText from "@/components/fx/SplitText";
import CollectionsGrid from "@/components/gallery/CollectionsGrid";
import { ArrowRight } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const L = localize(collectionsPage.meta, lang);
  return {
    title: L.title,
    description: L.desc,
    alternates: {
      canonical: href(lang, "/bo-suu-tap"),
      languages: { vi: href("vi", "/bo-suu-tap"), en: href("en", "/bo-suu-tap") },
    },
  };
}

export default async function CollectionsListPage({ params }) {
  const { lang } = await params;
  const L = localize({ collections, collectionsPage, categories, ui }, lang);
  const page = L.collectionsPage;

  return (
    <>
      {/* Hero: chữ bên trái, 3 cột ảnh trôi dọc bên phải */}
      <section className="relative flex items-center overflow-hidden bg-sand pt-28 pb-12 lg:min-h-[100svh] lg:pt-32 lg:pb-16">
        <Container wide className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="reveal eyebrow">{L.ui.collections}</p>
            <SplitText
              as="h1"
              text={page.title}
              accent={page.accent}
              accentClass="italic text-accent-deep"
              breakBeforeAccent
              className="mt-4 h-display text-[2.6rem] sm:text-[3.6rem] lg:text-[4.4rem]"
            />
            <p
              className="reveal mt-6 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base"
              style={{ "--reveal-delay": "200ms" }}
            >
              {page.desc}
            </p>
            <dl
              className="reveal mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-ink/10 pt-8"
              style={{ "--reveal-delay": "300ms" }}
            >
              <div>
                <dt className="font-serif text-3xl text-ink">
                  {String(collections.length).padStart(2, "0")}
                </dt>
                <dd className="mt-1 text-[12px] text-ink-muted">{L.ui.collections}</dd>
              </div>
              <div>
                <dt className="font-serif text-3xl text-ink">{totalPhotos}</dt>
                <dd className="mt-1 text-[12px] text-ink-muted">{L.ui.photos}</dd>
              </div>
              <div>
                <dt className="font-serif text-3xl text-ink">01</dt>
                <dd className="mt-1 text-[12px] text-ink-muted">Phú Quốc</dd>
              </div>
            </dl>
          </div>

          <div className="relative h-[52svh] min-h-[380px] overflow-hidden rounded-[1.75rem] lg:h-[min(calc(100svh-14rem),640px)]">
            <div className="absolute inset-0 grid grid-cols-3 gap-3">
              {page.columns.map((col, c) => (
                <div
                  key={c}
                  className={cn(
                    "flex flex-col gap-3",
                    c === 1 ? "-mt-24 animate-drift-down" : "animate-drift-up",
                  )}
                >
                  {[...col, ...col].map((src, i) => (
                    <div
                      key={`${src}-${i}`}
                      className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-2xl bg-sand-200"
                    >
                      <Pic src={src} alt="" fill sizes="20vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-sand pb-16 lg:pb-24">
        <Container wide>
          <CollectionsGrid
            lang={lang}
            collections={L.collections}
            categories={L.categories}
            ui={L.ui}
          />
        </Container>
      </section>

      <section
        data-nav-theme="dark"
        className="grain relative overflow-hidden bg-navy py-16 text-white lg:py-24"
      >
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-[150px]" />
        <Container className="relative text-center">
          <p className="reveal font-script text-3xl text-accent-light sm:text-4xl">
            {page.ctaScript}
          </p>
          <h2
            className="reveal mt-4 h-display text-[2.2rem] text-white sm:text-[3rem]"
            style={{ "--reveal-delay": "80ms" }}
          >
            {page.ctaTitle}
          </h2>
          <p
            className="reveal mx-auto mt-4 max-w-xl text-white/75"
            style={{ "--reveal-delay": "160ms" }}
          >
            {page.ctaDesc}
          </p>
          <div
            className="reveal mt-8 flex flex-wrap justify-center gap-3"
            style={{ "--reveal-delay": "240ms" }}
          >
            <button
              type="button"
              data-booking
              className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-7 text-[15px] font-medium text-ink shadow-soft transition hover:bg-sand-100"
            >
              {L.ui.bookFree}
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
            <Link
              href={href(lang, "/dich-vu")}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white hover:text-ink"
            >
              {lang === "vi" ? "Xem dịch vụ" : "See services"}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
