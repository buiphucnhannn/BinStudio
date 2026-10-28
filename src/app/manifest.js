import { siteConfig } from "@/config/site";

export default function manifest() {
  return {
    name: siteConfig.fullName,
    short_name: siteConfig.shortName,
    description: siteConfig.description.vi,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1ea",
    theme_color: siteConfig.themeColor,
    // Icon cài app: nền kem đặc (iOS/Android tô đen phần trong suốt); biểu tượng nằm trong vùng an toàn của "maskable"
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
