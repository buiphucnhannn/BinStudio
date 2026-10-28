import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { pageMeta, HOME_TITLE, titleTemplate } from "@/lib/seo";
import { BUSINESS_ID, JsonLd } from "@/lib/schema";
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
import { fontVariables } from "../fonts";
import "../globals.css";

// Không nhận ngôn ngữ ngoài vi / en: đường dẫn lạ trả về trang 404 chung (app/global-not-found.js)
export const dynamicParams = false;

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
    // Ảnh thật của studio (Google khuyến nghị nhiều ảnh, nhiều tỉ lệ) + ảnh chia sẻ
    image: [
      site.url + "/opengraph-image",
      site.url + "/images/sunset-couple/sunset-couple-01.webp",
      site.url + "/images/wedding-beach/wedding-beach-04.webp",
      site.url + "/images/family-villa/family-villa-06.webp",
    ],
    // Logo chữ màu than: Google yêu cầu logo hiển thị rõ trên nền trắng (bản vàng nhạt bị chìm)
    logo: site.url + "/images/brand/logo-dark.webp",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.streetAddress,
      addressLocality: "Phú Quốc",
      addressRegion: "An Giang",
      addressCountry: "VN",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsLink,
    sameAs: [site.facebook],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: site.openingHoursSchema.days,
      opens: site.openingHoursSchema.opens,
      closes: site.openingHoursSchema.closes,
    },
    priceRange: "$$",
    areaServed: { "@type": "Place", name: "Phú Quốc, Việt Nam" },
    knowsLanguage: ["vi", "en"],
  };

  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <JsonLd data={business} />
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
