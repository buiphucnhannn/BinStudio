import { siteConfig } from "@/config/site";
import { localize, href } from "@/i18n";
import {
  hero,
  marquee,
  about,
  usps,
  featuredCollections,
  collections,
  services,
  goldenHour,
  locations,
  process,
  moments,
  dayGrid,
  testimonials,
  contact,
  ui,
} from "@/data/site";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Usps from "@/components/sections/Usps";
import Collections from "@/components/sections/Collections";
import Services from "@/components/sections/Services";
import GoldenHour from "@/components/sections/GoldenHour";
import Locations from "@/components/sections/Locations";
import Process from "@/components/sections/Process";
import Moments from "@/components/sections/Moments";
import DayGrid from "@/components/sections/DayGrid";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

const collectionsHeading = {
  eyebrow: { vi: "Bộ sưu tập", en: "Portfolio" },
  title: { vi: "Mỗi bộ ảnh, một ngày", en: "Every collection, one day" },
  accent: { vi: "ở Phú Quốc.", en: "in Phu Quoc." },
};

// Trang chủ: Hero → Marquee → Về Bin → USP → Bộ sưu tập → Dịch vụ → Giờ vàng → Địa điểm → Quy trình → Khoảnh khắc → Một ngày → Đánh giá → Liên hệ
export default async function HomePage({ params }) {
  const { lang } = await params;
  const site = localize(siteConfig, lang);
  const L = localize(
    {
      hero,
      marquee,
      about,
      usps,
      featuredCollections,
      services,
      goldenHour,
      locations,
      process,
      moments,
      dayGrid,
      testimonials,
      contact,
      ui,
      collectionsHeading,
    },
    lang,
  );

  return (
    <>
      <Hero hero={L.hero} ui={L.ui} exploreHref={href(lang, "/bo-suu-tap")} />
      <Marquee items={L.marquee} />
      <About about={L.about} />
      <Usps usps={L.usps} />
      <Collections
        lang={lang}
        collections={L.featuredCollections}
        ui={L.ui}
        heading={L.collectionsHeading}
      />
      <Services lang={lang} services={L.services} ui={L.ui} />
      <GoldenHour data={L.goldenHour} />
      <Locations data={L.locations} ui={L.ui} />
      <Process data={L.process} />
      <Moments
        moments={L.moments}
        ui={L.ui}
        allHref={href(lang, "/bo-suu-tap")}
        collectionsCount={collections.length}
      />
      <DayGrid data={L.dayGrid} />
      <Testimonials data={L.testimonials} />
      <Contact contact={L.contact} site={site} ui={L.ui} />
    </>
  );
}
