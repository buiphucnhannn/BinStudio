import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/config/site";
import { hero } from "@/data/site";

/* eslint-disable @next/next/no-img-element -- ImageResponse (Satori) chỉ hỗ trợ <img> thuần */
// Ảnh chia sẻ mạng xã hội (Facebook, Zalo...): ảnh hoàng hôn bên trái + khối navy với tiêu đề serif
// giống hero của website. Sinh 1 lần lúc build. Font .woff trong src/assets/og-fonts (Satori không đọc woff2).
export const alt = "Studio Bin — Photographer Phú Quốc";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PHOTO = "sunset-couple/sunset-couple-01.jpg";
const C = { navy: "#0e2234", cream: "#f6f1ea", gold: "#e9cf98", goldDeep: "#c9a25a" };

export default async function OpengraphImage() {
  const cwd = process.cwd();
  const file = (...p) => readFile(join(cwd, ...p));
  const font = (name) => file("src", "assets", "og-fonts", name);
  const [photo, logo, serif, serifItalic, sans] = await Promise.all([
    file("public", "images", PHOTO),
    file("public", "images", "brand", "logo-gold.png"),
    font("cormorant-500.woff"),
    font("cormorant-500-italic.woff"),
    font("be-vietnam-pro-500.woff"),
  ]);
  const accent = hero.accent.vi.split(" ");
  const dataUrl = (buf, type) => `data:${type};base64,${buf.toString("base64")}`;

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: C.navy }}>
      {/* Ảnh: tràn trái, mép phải hoà dần vào nền navy */}
      <div style={{ position: "relative", display: "flex", width: 700, height: "100%" }}>
        <img
          src={dataUrl(photo, "image/jpeg")}
          alt=""
          style={{ width: 700, height: 630, objectFit: "cover", objectPosition: "58% 50%" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 320,
            height: "100%",
            backgroundImage: `linear-gradient(to right, rgba(14,34,52,0), rgba(14,34,52,0.55) 55%, ${C.navy})`,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 500,
          padding: "58px 56px 54px 24px",
          color: C.cream,
        }}
      >
        <img src={dataUrl(logo, "image/png")} alt="" style={{ width: 210, height: 65 }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Sans",
              fontSize: 15,
              letterSpacing: 5,
              color: C.gold,
              textTransform: "uppercase",
            }}
          >
            Photographer · Phú Quốc
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 22,
              fontFamily: "Serif",
              fontSize: 56,
              lineHeight: 1.02,
              letterSpacing: -0.5,
            }}
          >
            {/* Ngắt dòng chủ động như hero bản mobile: "giữa biển trời" / "Phú Quốc." */}
            <span>{hero.title.vi}</span>
            {[accent.slice(0, -2), accent.slice(-2)].map((words) => (
              <span key={words[0]} style={{ fontStyle: "italic", color: "#efe5d4" }}>
                {words.join(" ")}
              </span>
            ))}
          </div>
          <div style={{ width: 64, height: 2, marginTop: 30, background: C.goldDeep }} />
          <div
            style={{
              marginTop: 22,
              fontFamily: "Sans",
              fontSize: 19,
              color: "rgba(246,241,234,0.78)",
            }}
          >
            Cưới · Cặp đôi · Gia đình · Chân dung
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Sans",
            fontSize: 17,
            color: "rgba(246,241,234,0.7)",
          }}
        >
          <span>
            {new URL(siteConfig.url).host.replace(/^localhost.*/, "studiobinphuquoc.com")}
          </span>
          <span style={{ color: C.gold }}>{siteConfig.phone}</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Serif", data: serif, weight: 500, style: "normal" },
        { name: "Serif", data: serifItalic, weight: 500, style: "italic" },
        { name: "Sans", data: sans, weight: 500, style: "normal" },
      ],
    },
  );
}
