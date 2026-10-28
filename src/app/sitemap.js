import { siteConfig } from "@/config/site";
import { collections, featuredCollections, hero } from "@/data/site";
import { href, LOCALES } from "@/i18n";

/**
 * Sitemap song ngữ (mỗi URL kèm bản vi/en) + sitemap ảnh: mỗi trang liệt kê ảnh chính của nó
 * để Google Hình ảnh lập chỉ mục đủ ảnh trong các album.
 */
export default function sitemap() {
  const base = siteConfig.url;
  const abs = (src) => base + encodeURI(src);
  const pages = [
    {
      path: "/",
      priority: 1,
      changeFrequency: "weekly",
      images: [...hero.slides.map((s) => s.wide.src), ...featuredCollections.map((c) => c.cover)],
    },
    {
      path: "/collections",
      priority: 0.9,
      changeFrequency: "weekly",
      images: collections.map((c) => c.cover),
    },
    { path: "/services", priority: 0.8, changeFrequency: "monthly", images: [] },
    ...collections.map((c) => ({
      path: `/collections/${c.slug}`,
      priority: 0.7,
      changeFrequency: "monthly",
      images: c.images.map((im) => im.src),
    })),
  ];
  const now = new Date();
  return pages.flatMap((p) =>
    LOCALES.map((lang) => ({
      url: base + href(lang, p.path),
      lastModified: now,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
      alternates: {
        languages: {
          ...Object.fromEntries(LOCALES.map((l) => [l, base + href(l, p.path)])),
          "x-default": base + href("vi", p.path),
        },
      },
      ...(p.images.length && { images: [...new Set(p.images)].map(abs) }),
    })),
  );
}
