import { siteConfig } from "@/config/site";
import { collections } from "@/data/site";
import { href, LOCALES } from "@/i18n";

export default function sitemap() {
  const base = siteConfig.url;
  const paths = [
    "/",
    "/collections",
    "/services",
    ...collections.map((c) => `/collections/${c.slug}`),
  ];
  const now = new Date();
  return paths.flatMap((p) =>
    LOCALES.map((lang) => ({
      url: base + href(lang, p),
      lastModified: now,
      changeFrequency: "monthly",
      priority: p === "/" ? 1 : p.includes("/collections/") ? 0.6 : 0.8,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, base + href(l, p)])),
      },
    })),
  );
}
