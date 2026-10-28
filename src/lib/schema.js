import { siteConfig } from "@/config/site";
import { href } from "@/i18n";

/**
 * Dữ liệu có cấu trúc (schema.org JSON-LD) cho Google: doanh nghiệp, website, breadcrumb, album ảnh.
 * Mọi URL đều tuyệt đối (domain lấy từ siteConfig.url).
 */
const abs = (path) => siteConfig.url + path;
export const BUSINESS_ID = `${siteConfig.url}/#business`;
const owner = { "@id": BUSINESS_ID };

// Đường dẫn vụn bánh mì: [{ name, path }] (path nội bộ, tự đổi sang URL đúng ngôn ngữ)
export const breadcrumb = (lang, items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: abs(href(lang, it.path)),
  })),
});

export const website = (lang, description) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  name: siteConfig.name,
  alternateName: siteConfig.fullName,
  url: abs(href(lang, "/")),
  description,
  inLanguage: lang === "vi" ? "vi-VN" : "en",
  publisher: owner,
});

// Ảnh kèm thông tin tác giả / bản quyền (Google Hình ảnh hiển thị "Credit" & "Copyright")
const imageObject = (im, caption) => ({
  "@type": "ImageObject",
  contentUrl: abs(im.src),
  width: im.w,
  height: im.h,
  caption,
  creator: { "@type": "Organization", name: siteConfig.name },
  creditText: siteConfig.name,
  copyrightNotice: `© ${siteConfig.name}`,
});

// Trang album: ImageGallery liệt kê toàn bộ ảnh
export const imageGallery = (lang, c, { title, altOf }) => ({
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: title,
  description: c.desc,
  url: abs(href(lang, `/collections/${c.slug}`)),
  inLanguage: lang === "vi" ? "vi-VN" : "en",
  author: owner,
  publisher: owner,
  contentLocation: { "@type": "Place", name: "Phú Quốc, Việt Nam" },
  primaryImageOfPage: imageObject(c.images.find((im) => im.src === c.cover) || c.images[0], c.name),
  image: c.images.map((im, i) => imageObject(im, altOf(i))),
});

// Trang danh sách bộ sưu tập: CollectionPage + ItemList các album
export const collectionList = (lang, { name, description, items }) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description,
  url: abs(href(lang, "/collections")),
  inLanguage: lang === "vi" ? "vi-VN" : "en",
  publisher: owner,
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(href(lang, `/collections/${c.slug}`)),
      name: c.name,
    })),
  },
});

// Nhúng JSON-LD; "<" được escape để chuỗi nội dung không thể đóng thẻ <script>
export function JsonLd({ data }) {
  const json = JSON.stringify(Array.isArray(data) ? data : [data]).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
