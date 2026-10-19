import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/config/site";

/* eslint-disable @next/next/no-img-element -- ImageResponse (Satori) chỉ hỗ trợ <img> thuần */
// Ảnh chia sẻ mạng xã hội: 3 ảnh dọc + logo + tagline (sinh lúc build).
export const alt = "Studio Bin — Photographer Phú Quốc";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PHOTOS = [
  "wedding-beach/wedding-beach-01.jpg",
  "sunset-couple/sunset-couple-02.jpg",
  "family-beach/family-beach-07.jpg",
];

export default async function OpengraphImage() {
  const pub = join(process.cwd(), "public", "images");
  const photos = await Promise.all(
    PHOTOS.map(async (p) => `data:image/jpeg;base64,${await readFile(join(pub, p), "base64")}`),
  );
  const logo = `data:image/png;base64,${await readFile(join(pub, "brand", "logo-gold.png"), "base64")}`;

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#0e2234" }}>
      <div style={{ display: "flex", width: 600, height: "100%" }}>
        {photos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{
              width: 200,
              height: 630,
              objectFit: "cover",
              objectPosition: "center 25%",
              opacity: 0.94,
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: 600,
          padding: "0 64px",
          color: "#f6f1ea",
        }}
      >
        <img src={logo} alt="" style={{ width: 360 }} />
        <div style={{ fontSize: 30, marginTop: 36, lineHeight: 1.3, color: "#f6f1ea" }}>
          {`${siteConfig.tagline.vi} · ${siteConfig.tagline.en}`}
        </div>
        <div style={{ fontSize: 20, marginTop: 20, color: "#e9cf98" }}>{siteConfig.address.vi}</div>
      </div>
    </div>,
    size,
  );
}
