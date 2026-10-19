import { siteConfig } from "@/config/site";
import { collections } from "@/data/site";
import { href, LOCALES } from "@/i18n";

export default function sitemap() {
  const base = siteConfig.url;
  const paths = [
    "/",
    "/bo-suu-tap",
    "/dich-vu",
    ...collections.map((c) => `/bo-suu-tap/${c.slug}`),
  ];
  const now = new Date();
  return paths.flatMap((p) =>
    LOCALES.map((lang) => ({
      url: base + href(lang, p),
      lastModified: now,
      changeFrequency: "monthly",
      priority: p === "/" ? 1 : p.includes("/bo-suu-tap/") ? 0.6 : 0.8,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, base + href(l, p)])),
      },
    })),
  );
}
