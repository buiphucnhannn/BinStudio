import Link from "next/link";
import { notFound } from "next/navigation";
import { localize, href, isLocale, LOCALES } from "@/i18n";
import { pageMeta } from "@/lib/seo";
import { breadcrumb, imageGallery, JsonLd } from "@/lib/schema";
import { collections, getCollection, categories, seoOf, ui } from "@/data/site";
import Container from "@/components/ui/Container";
import Pic from "@/components/ui/Pic";
import SplitText from "@/components/fx/SplitText";
import Parallax from "@/components/fx/Parallax";
import AlbumGallery from "@/components/gallery/AlbumGallery";
import { ArrowRight } from "@/components/ui/Icons";

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => collections.map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const c = getCollection(slug);
  if (!isLocale(lang) || !c) return {};
  const L = localize({ c, seo: seoOf(c) }, lang);
  const cover = c.images.find((im) => im.src === c.cover) || c.images[0];
  return pageMeta(lang, `/collections/${slug}`, {
    // Tên tab: "Nàng thơ Đông Dương – Ảnh chân dung Phú Quốc | Studio Bin"
    title: `${L.c.name} – ${L.seo}`,
    description: L.c.desc,
    image: { url: cover.src, width: cover.w, height: cover.h, alt: L.c.name },
  });
}

export default async function CollectionDetailPage({ params }) {
  const { lang, slug } = await params;
  const raw = getCollection(slug);
  if (!raw) notFound();

  const idx = collections.findIndex((c) => c.slug === slug);
  const nextRaw = collections[(idx + 1) % collections.length];
  const L = localize({ c: raw, next: nextRaw, categories, seo: seoOf(raw), ui }, lang);
  const { c, next } = L;
  const listHref = href(lang, "/collections");
  // Mô tả ảnh (alt) có từ khoá: "Nàng thơ Đông Dương – Ảnh chân dung Phú Quốc (3)"
  const seo = L.seo;
  const altOf = (i) => `${c.name} – ${seo} (${i + 1})`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumb(lang, [
            { name: L.ui.home, path: "/" },
            { name: L.ui.collections, path: "/collections" },
            { name: c.name, path: `/collections/${c.slug}` },
          ]),
          imageGallery(lang, c, { title: `${c.name} – ${seo}`, altOf }),
        ]}
      />
      {/* Hero: chữ bên trái, ảnh ngang lớn bên phải */}
      <section className="relative flex screen items-center overflow-hidden bg-sand pt-32 pb-16 lg:pt-32 lg:pb-16">
        <Container wide className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <nav className="reveal flex flex-wrap items-center gap-2 text-[12px] text-ink-muted">
              <Link href={href(lang, "/")} className="hover:text-ink">
                {L.ui.home}
              </Link>
              <span>/</span>
              <Link href={listHref} className="hover:text-ink">
                {L.ui.collections}
              </Link>
              <span>/</span>
              <span className="text-ink">{c.name}</span>
            </nav>
            <p className="reveal mt-8 eyebrow" style={{ "--reveal-delay": "80ms" }}>
              {L.categories[c.category]} · {String(idx + 1).padStart(2, "0")}
            </p>
            <SplitText
              as="h1"
              text={c.name}
              className="mt-4 h-display text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem]"
            />
            <p
              className="reveal mt-4 font-serif text-xl text-accent-deep italic"
              style={{ "--reveal-delay": "250ms" }}
            >
              {c.concept}
            </p>
            <p
              className="reveal mt-6 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base"
              style={{ "--reveal-delay": "320ms" }}
            >
              {c.desc}
            </p>
            <div
              className="reveal mt-8 flex flex-wrap items-center gap-3"
              style={{ "--reveal-delay": "400ms" }}
            >
              <button
                type="button"
                data-booking
                className="group inline-flex items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-6 text-sm font-medium text-white transition hover:bg-graphite"
              >
                {L.ui.bookThis}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
              <span className="text-[12px] tracking-[0.2em] text-ink-muted uppercase">
                {c.images.length} {L.ui.photos}
              </span>
            </div>
          </div>

          <Parallax
            speed={0.06}
            className="reveal relative aspect-[16/10] overflow-hidden rounded-[1.75rem] bg-sand-200 lg:aspect-[1.8/1]"
            data-reveal="clip"
          >
            <Pic
              src={c.hero.src}
              alt={c.name}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1440px) 749px, (min-width: 1024px) 51vw, 92vw"
              className="object-cover"
              style={{ objectPosition: c.hero.pos }}
            />
          </Parallax>
        </Container>
      </section>

      <section className="bg-sand pb-16 lg:pb-24">
        <Container wide>
          <AlbumGallery images={c.images} name={c.name} place={seo} />
        </Container>
      </section>

      {/* Bộ sưu tập tiếp theo */}
      <section className="border-t border-ink/10 bg-sand-100 py-16 lg:py-24">
        <Container wide>
          <p className="reveal eyebrow">{L.ui.nextCollection}</p>
          <Link
            href={href(lang, `/collections/${next.slug}`)}
            className="group reveal mt-5 grid items-center gap-8 rounded-[1.75rem] border border-ink/[0.06] bg-white p-4 shadow-card transition hover:shadow-soft md:grid-cols-[0.45fr_1fr] md:p-5"
            style={{ "--reveal-delay": "100ms" }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-sand-200 md:aspect-[5/4]">
              <Pic
                src={next.cover}
                alt={next.name}
                fill
                sizes="(min-width: 1440px) 384px, (min-width: 768px) 26vw, 85vw"
                className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                style={{ objectPosition: next.coverPos }}
              />
            </div>
            <div className="flex items-center justify-between gap-6 pr-2 pb-2 md:pr-6">
              <div>
                <p className="text-[11px] tracking-[0.3em] text-ink-muted uppercase">{next.sub}</p>
                <h2 className="mt-2 font-serif text-[2rem] leading-tight text-ink sm:text-[2.6rem]">
                  {next.name}
                </h2>
                <p className="mt-2 max-w-md text-[14px] text-ink-soft">{next.concept}</p>
              </div>
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </Link>
          <div className="mt-6">
            <Link
              href={listHref}
              className="inline-flex items-center gap-2 text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
            >
              ← {L.ui.viewAll}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
