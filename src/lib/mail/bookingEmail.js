/**
 * Template email "Yêu cầu đặt lịch mới" gửi về hộp thư Studio Bin.
 * Viết bằng bảng + CSS inline để hiển thị đúng trên Gmail, Outlook, Apple Mail (email client không hỗ trợ CSS hiện đại).
 * Bảng màu khớp website: trắng kem, đen than, vàng hoàng hôn, navy.
 */
import { siteConfig } from "@/config/site";

const C = {
  sand: "#f6f1ea",
  sand100: "#efe7dc",
  ink: "#1f1f1d",
  soft: "#57534c",
  muted: "#8b857a",
  gold: "#c9973f",
  goldDeep: "#a97a2a",
  navy: "#0e2234",
  line: "#e3d7c6",
};
// Georgia thiếu glyph tiếng Việt (dấu bị tách) → dùng Times New Roman, có sẵn trên mọi máy và đủ dấu.
// Cormorant Garamond chỉ hiện ở trình đọc thư hỗ trợ web font (Apple Mail, iOS Mail).
const SERIF = "'Cormorant Garamond', 'Times New Roman', Times, serif";
const SANS = "'Be Vietnam Pro', 'Segoe UI', Helvetica, Arial, sans-serif";

// Chống chèn HTML từ dữ liệu khách nhập
export const esc = (v = "") =>
  String(v)
    .normalize("NFC")
    .replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );

// "0384 038 453" | "+84 384..." → "84384038453" (dùng cho wa.me / zalo.me)
export function phoneDigits(phone = "") {
  let d = String(phone).replace(/\D/g, "");
  if (d.startsWith("0")) d = "84" + d.slice(1);
  return d;
}

// "2026-11-03" → "03/11/2026"
const fmtDate = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso || "";
};

const button = (href, label, primary) => `
    <a href="${esc(href)}" target="_blank"
       style="display:inline-block;margin:4px;white-space:nowrap;padding:12px 22px;border-radius:999px;font-family:${SANS};font-size:13px;font-weight:600;text-decoration:none;${
         primary
           ? `background:${C.ink};color:#ffffff;`
           : `background:#ffffff;color:${C.ink};border:1px solid ${C.line};`
       }">${esc(label)}</a>`;

const row = (label, value) =>
  value
    ? `
  <tr>
    <td style="padding:14px 0;border-bottom:1px solid ${C.line};width:38%;vertical-align:top;font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">${esc(label)}</td>
    <td style="padding:14px 0;border-bottom:1px solid ${C.line};vertical-align:top;font-family:${SANS};font-size:15px;color:${C.ink};">${value}</td>
  </tr>`
    : "";

/**
 * @param {object} b  dữ liệu đã kiểm tra: { name, phone, date, people, serviceName, note, lang, receivedAt }
 * @returns {{ subject: string, html: string, text: string }}
 */
export function bookingEmail(b) {
  const digits = phoneDigits(b.phoneE164 || b.phone);
  const langLabel = b.lang === "en" ? "English — nên trả lời bằng tiếng Anh" : "Tiếng Việt";
  const received = new Date(b.receivedAt).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const service = b.serviceName || "Chưa quyết định, cần tư vấn";
  const date = fmtDate(b.date);

  const subject = `Yêu cầu đặt lịch mới — ${b.name}${date ? ` · ${date}` : ""}`;

  const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,500&display=swap" rel="stylesheet">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.sand};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(b.name)} · ${esc(b.phone)} · ${esc(service)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sand};">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 40px -24px rgba(31,31,29,.35);">

      <!-- Header navy + logo -->
      <tr><td align="center" style="background:${C.navy};padding:34px 24px 30px;">
        <img src="cid:studio-bin-logo" width="180" alt="Studio Bin" style="display:block;width:180px;max-width:60%;height:auto;border:0;">
        <p style="margin:14px 0 0;font-family:${SANS};font-size:10px;letter-spacing:4px;text-transform:uppercase;color:${C.gold};">Photographer · Phú Quốc</p>
      </td></tr>

      <!-- Tiêu đề -->
      <tr><td align="center" style="padding:38px 36px 10px;text-align:center;">
        <p style="margin:0;font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.goldDeep};">Yêu cầu đặt lịch mới</p>
        <!-- Dòng 1: tên khách (tên dài tự xuống dòng, không tràn) -->
        <h1 style="margin:14px 0 0;font-family:${SERIF};font-size:34px;line-height:1.15;font-weight:500;letter-spacing:.3px;color:${C.ink};word-break:break-word;">${esc(b.name)}</h1>
        <!-- Dòng 2: lời dẫn in nghiêng -->
        <p style="margin:6px 0 0;font-family:${SERIF};font-size:24px;line-height:1.25;font-style:italic;color:${C.goldDeep};">muốn đặt lịch chụp.</p>
        <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:22px auto 0;"><tr>
          <td style="width:48px;height:1px;line-height:1px;font-size:0;background:${C.gold};">&nbsp;</td>
        </tr></table>
        <p style="margin:18px auto 0;max-width:420px;font-family:${SANS};font-size:14px;line-height:1.6;color:${C.soft};">Nhận lúc <strong style="color:${C.ink};font-weight:600;">${esc(received)}</strong> qua form trên website.<br>Liên hệ lại trong ngày để giữ lịch cho khách nhé.</p>
      </td></tr>

      <!-- Thông tin -->
      <tr><td style="padding:16px 36px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line};">
          ${row("Họ tên", esc(b.name))}
          ${row("Điện thoại / Zalo", `<a href="tel:+${digits}" style="color:${C.ink};text-decoration:none;font-weight:600;">${esc(b.phone)}</a>`)}
          ${row("Dịch vụ", esc(service))}
          ${row("Ngày dự kiến", esc(date))}
          ${row("Số người", esc(b.people))}
          ${row("Ngôn ngữ khách", esc(langLabel))}
        </table>
      </td></tr>

      ${
        b.note
          ? `<!-- Ghi chú -->
      <tr><td style="padding:16px 36px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sand};border-radius:16px;">
          <tr><td style="padding:20px 22px;">
            <p style="margin:0 0 8px;font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Ghi chú của khách</p>
            <p style="margin:0;font-family:${SERIF};font-size:19px;line-height:1.5;font-style:italic;color:${C.ink};white-space:pre-line;">“${esc(b.note)}”</p>
          </td></tr>
        </table>
      </td></tr>`
          : ""
      }

      <!-- Nút liên hệ nhanh -->
      <tr><td align="center" style="padding:28px 28px 36px;">
        <p style="margin:0 0 12px;font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Liên hệ lại khách</p>
        <div>
          ${button(`tel:+${digits}`, "Gọi ngay", true)}
          ${button(`https://zalo.me/${digits.replace(/^84/, "0")}`, "Nhắn Zalo")}
          ${button(`https://wa.me/${digits}`, "WhatsApp")}
        </div>
      </td></tr>

      <!-- Footer -->
      <tr><td align="center" style="background:${C.sand100};padding:22px 24px;">
        <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted};">Email tự động từ website ${esc(siteConfig.fullName)}.<br>${esc(siteConfig.address.vi)}</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  // Bản chữ thuần cho trình đọc thư không hiển thị HTML
  const text = [
    `YÊU CẦU ĐẶT LỊCH MỚI — ${siteConfig.fullName}`,
    "",
    `Họ tên: ${b.name}`,
    `Điện thoại / Zalo: ${b.phone}`,
    `Dịch vụ: ${service}`,
    date && `Ngày dự kiến: ${date}`,
    `Số người: ${b.people}`,
    `Ngôn ngữ khách: ${langLabel}`,
    b.note && `Ghi chú: ${b.note}`,
    "",
    `Nhận lúc: ${received}`,
    `Gọi: tel:+${digits} · WhatsApp: https://wa.me/${digits}`,
  ]
    .filter((l) => l || l === "")
    .join("\n");

  return { subject, html, text };
}
