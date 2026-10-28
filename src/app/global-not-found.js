import { siteConfig } from "@/config/site";
import { localize } from "@/i18n";
import { nav, ui, booking, services } from "@/data/site";
import Navbar from "@/components/layout/Navbar";
import FloatingContact from "@/components/layout/FloatingContact";
import SmoothScroll from "@/components/fx/SmoothScroll";
import LateFonts from "@/components/fx/LateFonts";
import Reveal from "@/components/ui/Reveal";
import BookingModal from "@/components/booking/BookingModal";
import Toaster from "@/components/ui/Toaster";
import NotFoundView from "@/components/sections/NotFoundView";
import { fontVariables } from "./fonts";
import "./globals.css";

/**
 * Trang 404 cho MỌI đường dẫn không tồn tại (next.config: experimental.globalNotFound).
 * Layout gốc nằm trong [lang] nên trang này tự dựng khung site (menu, nút liên hệ, popup đặt lịch) bản tiếng Việt;
 * không có footer → trang gói gọn trong một màn hình, nội dung căn giữa.
 * SEO: trả mã 404 thật (không chuyển hướng về trang chủ — tránh "soft 404"), Next tự gắn noindex.
 */
export const metadata = {
  title: `Không tìm thấy trang · Page not found | ${siteConfig.name}`,
  description:
    "Trang bạn tìm không tồn tại hoặc đã được di chuyển. Xem các bộ ảnh cưới, cặp đôi, gia đình của Studio Bin tại Phú Quốc.",
};

export default function GlobalNotFound() {
  const lang = "vi";
  const site = localize(siteConfig, lang);
  const L = localize({ nav, ui, booking, services }, lang);

  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <SmoothScroll />
        <LateFonts />
        <Reveal />
        <Navbar lang={lang} nav={L.nav} ui={L.ui} phone={site.phone} phoneRaw={site.phoneIntl} />
        <main>
          <NotFoundView />
        </main>
        <FloatingContact site={site} ui={L.ui} />
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
