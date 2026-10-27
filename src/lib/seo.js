import { siteConfig } from "@/config/site";
import { href } from "@/i18n";

const OG_DEFAULT = { url: "/opengraph-image", width: 1200, height: 630 };

/**
 * Metadata SEO dùng chung cho mỗi trang: canonical, hreflang (vi / en / x-default), Open Graph & Twitter.
 * Next ghi đè nguyên khối openGraph của layout khi trang khai báo openGraph, nên mọi trang đều đi qua hàm này
 * để og:url, og:title, ảnh chia sẻ luôn đúng với trang đang xem.
 * - path: đường dẫn không tiền tố ngôn ngữ ("/", "/services", "/collections/sunset-couple")
 * - title: tiêu đề ngắn của trang (bỏ trống = trang chủ); image: { url, width, height } (bỏ trống = ảnh OG chung)
 */
export function pageMeta(lang, path, { title, description, image } = {}) {
  const name = siteConfig.name;
  const fullTitle = `${name} | ${title || siteConfig.tagline[lang]}`;
  const desc = description || siteConfig.description[lang];
  const images = [{ ...(image || OG_DEFAULT), alt: title || siteConfig.fullName }];
  return {
    ...(title && { title }),
    description: desc,
    alternates: {
      canonical: href(lang, path),
      languages: { vi: href("vi", path), en: href("en", path), "x-default": href("vi", path) },
    },
    openGraph: {
      type: "website",
      locale: lang === "vi" ? "vi_VN" : "en_US",
      alternateLocale: lang === "vi" ? "en_US" : "vi_VN",
      url: href(lang, path),
      siteName: name,
      title: fullTitle,
      description: desc,
      images,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images },
  };
}
