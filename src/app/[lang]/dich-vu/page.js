import { localize, href, isLocale } from "@/i18n";
import { siteConfig } from "@/config/site";
import { services, servicesPage, process, ui } from "@/data/site";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceList from "@/components/services/ServiceList";
import Packages from "@/components/services/Packages";
import Process from "@/components/sections/Process";
import Faq from "@/components/services/Faq";
import ServicesCta from "@/components/services/ServicesCta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const L = localize(servicesPage.meta, lang);
  return {
    title: L.title,
    description: L.desc,
    alternates: {
      canonical: href(lang, "/dich-vu"),
      languages: { vi: href("vi", "/dich-vu"), en: href("en", "/dich-vu") },
    },
  };
}

export default async function ServicesPage({ params }) {
  const { lang } = await params;
  const site = localize(siteConfig, lang);
  const L = localize({ services, servicesPage, process, ui }, lang);
  const page = L.servicesPage;

  return (
    <>
      <ServicesHero hero={page.hero} ui={L.ui} />
      <ServiceList lang={lang} items={L.services.items} ui={L.ui} heading={L.services} />
      <Packages data={page.packages} ui={L.ui} />
      <Process data={L.process} />
      <Faq faq={page.faq} />
      <ServicesCta cta={page.cta} site={site} ui={L.ui} />
    </>
  );
}
