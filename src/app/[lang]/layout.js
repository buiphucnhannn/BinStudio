import { Cormorant_Garamond, Be_Vietnam_Pro, Great_Vibes } from "next/font/google";
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
import BookingModal from "@/components/booking/BookingModal";
import Toaster from "@/components/ui/Toaster";
import "../globals.css";

// Chỉ khai báo độ đậm thật sự dùng (serif: thường 400 + h-display 500) → ít file font phải tải
const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// Font viết tay — chỉ dùng cho chữ ký / watermark cỡ lớn
const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
  preload: false, // chỉ dùng cho chữ ký trang trí phía dưới, không cần tải trước
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
