import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { pageMeta, HOME_TITLE, titleTemplate } from "@/lib/seo";
import { BUSINESS_ID, JsonLd, website } from "@/lib/schema";
import { LOCALES, isLocale, localize, href } from "@/i18n";
import { nav, ui, footer, booking, services } from "@/data/site";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import Reveal from "@/components/ui/Reveal";
import SmoothScroll from "@/components/fx/SmoothScroll";
import ScrollTop from "@/components/fx/ScrollTop";
import Preloader from "@/components/fx/Preloader";
import PageTransition from "@/components/fx/PageTransition";
import LateFonts from "@/components/fx/LateFonts";
import BookingModal from "@/components/booking/BookingModal";
import Toaster from "@/components/ui/Toaster";
import "../globals.css";

// Font tự host, đã cắt gọn còn Latin + tiếng Việt (src/assets/fonts, tạo từ chính file Google Fonts phục vụ):
// mỗi kiểu chữ 1 file thay vì 3 file latin / latin-ext / vietnamese → ~174KB thay vì ~284KB,
// và chữ có dấu được canh khoảng (kerning) đúng vì cùng nằm trong một file.
// (next/font yêu cầu đường dẫn viết sẵn dạng chuỗi — không ghép từ biến)
const serif = localFont({
  src: [
    { path: "../../assets/fonts/cormorant-garamond-400.woff2", weight: "400", style: "normal" },
    { path: "../../assets/fonts/cormorant-garamond-500.woff2", weight: "500", style: "normal" },
    {
      path: "../../assets/fonts/cormorant-garamond-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../assets/fonts/cormorant-garamond-500-italic.woff2",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const sans = localFont({
  src: [
    { path: "../../assets/fonts/be-vietnam-pro-400.woff2", weight: "400" },
    { path: "../../assets/fonts/be-vietnam-pro-500.woff2", weight: "500" },
    { path: "../../assets/fonts/be-vietnam-pro-600.woff2", weight: "600" },
  ],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: "Arial",
});

// Font viết tay — chỉ dùng cho chữ ký / watermark cỡ lớn phía dưới, không cần tải trước
const script = localFont({
  src: "../../assets/fonts/great-vibes.woff2",
  weight: "400",
  variable: "--font-script",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const site = localize(siteConfig, lang);
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${HOME_TITLE[lang]} | ${site.name}`,
      template: titleTemplate,
    },
    keywords: site.keywords,
    ...pageMeta(lang, "/"),
    robots: { index: true, follow: true },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.themeColor,
};

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const site = localize(siteConfig, lang);
  const L = localize({ nav, ui, footer, booking, services }, lang);

  // Dữ liệu có cấu trúc cho Google: doanh nghiệp địa phương + website (trang con tham chiếu qua @id)
  const business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: site.fullName,
    alternateName: site.name,
    description: site.description,
    url: site.url + href(lang, "/"),
    telephone: site.phoneIntl,
    image: site.url + "/opengraph-image",
    logo: site.url + "/images/brand/logo-gold.webp",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Phú Quốc",
      addressRegion: "An Giang",
      addressCountry: "VN",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsLink,
    sameAs: [site.facebook],
    openingHours: site.openingHoursSchema,
    priceRange: "$",
    areaServed: { "@type": "Place", name: "Phú Quốc, Việt Nam" },
    knowsLanguage: ["vi", "en"],
  };

  return (
    <html lang={lang} className={`${serif.variable} ${sans.variable} ${script.variable}`}>
      <body>
        <JsonLd data={[business, website(lang, site.description)]} />
        <Preloader
          caption={lang === "vi" ? "Photographer · Phú Quốc" : "Photographer · Phu Quoc"}
        />
        <SmoothScroll />
        <LateFonts />
        <PageTransition />
        <Reveal />
        <Navbar lang={lang} nav={L.nav} ui={L.ui} phone={site.phone} phoneRaw={site.phoneIntl} />
        <main>{children}</main>
        <Footer lang={lang} site={site} nav={L.nav} ui={L.ui} footer={L.footer} />
        <FloatingContact site={site} ui={L.ui} />
        <ScrollTop label={L.ui.toTop} />
        <BookingModal
          booking={L.booking}
          services={L.services.items.map(({ n, title }) => ({ n, title }))}
          site={site}
          lang={lang}
        />
        <Toaster />
      </body>
    </html>
  );
}
