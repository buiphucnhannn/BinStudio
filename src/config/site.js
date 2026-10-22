import { t } from "@/i18n";

/**
 * Thông tin thương hiệu, liên hệ, SEO — theo brief docs/demo.docx (DN0065).
 */
export const siteConfig = {
  name: "Studio Bin",
  fullName: "Photographer Phu Quoc — Studio Bin",
  shortName: "Studio Bin",
  tagline: t("Photographer tại Phú Quốc", "Photographer in Phu Quoc"),
  description: t(
    "Studio Bin — nhiếp ảnh gia bản địa tại Phú Quốc. Chụp ảnh cưới & pre-wedding ngoại cảnh biển, cặp đôi, cầu hôn, săn hoàng hôn, gia đình nghỉ dưỡng tại resort/villa, chân dung nghệ thuật & sự kiện. Phong cách phóng sự tự nhiên, phục vụ khách trong và ngoài nước.",
    "Studio Bin — a local photographer in Phu Quoc, Vietnam. Beach weddings & pre-wedding, couples, proposals, sunset sessions, family holidays at resorts & villas, editorial portraits & events. Candid, documentary style for guests from around the world.",
  ),
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  themeColor: "#f6f1ea",
  keywords: [
    "Photographer Phú Quốc",
    "Phu Quoc photographer",
    "chụp ảnh cưới Phú Quốc",
    "Phu Quoc wedding photographer",
    "chụp ảnh gia đình Phú Quốc",
    "Phu Quoc family photoshoot",
    "sunset photoshoot Phu Quoc",
    "proposal photographer Phu Quoc",
    "Studio Bin",
  ],

  phone: "0384 038 453",
  phoneRaw: "0384038453",
  phoneIntl: "+84384038453",
  zalo: "https://zalo.me/0384038453",
  whatsapp: "https://wa.me/84384038453",
  facebook: "https://www.facebook.com/danhlyts67",
  messenger: "https://m.me/danhlyts67", // nhắn tin thẳng tới trang Facebook trên
  mapsLink: "https://maps.app.goo.gl/zT888PU8bKJ9nmje8",
  mapsEmbed:
    // Nhúng đúng thẻ địa điểm "Photographer Phu Quoc - Studio Bin" (CID lấy từ link maps.app.goo.gl trong brief)
    "https://maps.google.com/maps?cid=1717701600627824128&hl=vi&z=15&output=embed",

  address: t("Khu phố 9, Phú Quốc, An Giang, Việt Nam", "Quarter 9, Phu Quoc, An Giang, Vietnam"),
  addressShort: t("Phú Quốc, Việt Nam", "Phu Quoc, Vietnam"),
  geo: { lat: 10.2358129, lng: 103.9529946 },

  hours: [{ days: t("Hằng ngày", "Daily"), time: "06:00 – 21:00" }],
  hoursShort: t("Nhận lịch hằng ngày, kể cả cuối tuần", "Bookings daily, weekends included"),
  openingHoursSchema: ["Mo,Tu,We,Th,Fr,Sa,Su 06:00-21:00"],
};
