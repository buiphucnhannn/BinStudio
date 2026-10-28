import { siteConfig } from "@/config/site";
import { href, t } from "@/i18n";

const OG_DEFAULT = { url: "/opengraph-image", width: 1200, height: 630 };

// Tiêu đề trang chủ: từ khoá chính đứng trước, thương hiệu đứng sau (template "%s | Studio Bin")
// "Photographer Phú Quốc" trùng tên doanh nghiệp trên Google Maps → nhất quán cho SEO địa phương
export const HOME_TITLE = t(
  "Photographer Phú Quốc – Chụp ảnh cưới & du lịch",
  "Phu Quoc Photographer – Wedding & Travel Photos",
);
export const titleTemplate = `%s | ${siteConfig.name}`;

// Mô tả meta gọn trong ~160 ký tự (Google cắt phần dư), cắt ở ranh giới từ
export function clip(text, max = 158) {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:—–-]+$/, "")}…`;
}

/**
 * Metadata SEO dùng chung cho mỗi trang: canonical, hreflang (vi / en / x-default), Open Graph & Twitter.
 * Next ghi đè nguyên khối openGraph của layout khi trang khai báo openGraph, nên mọi trang đều đi qua hàm này
 * để og:url, og:title, ảnh chia sẻ luôn đúng với trang đang xem.
 * - path: đường dẫn nội bộ không tiền tố ngôn ngữ ("/", "/services", "/collections/sunset-couple")
 * - title: tiêu đề trang (bỏ trống = trang chủ); image: { url, width, height, alt } (bỏ trống = ảnh OG chung)
 */
export function pageMeta(lang, path, { title, description, image } = {}) {
  const name = siteConfig.name;
  const fullTitle = `${title || HOME_TITLE[lang]} | ${name}`;
  const desc = clip(description || siteConfig.description[lang]);
  const images = [{ alt: title || siteConfig.fullName, ...(image || OG_DEFAULT) }];
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
