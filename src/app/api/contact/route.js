import nodemailer from "nodemailer";
import { NextResponse, after } from "next/server";
import { bookingEmail } from "@/lib/mail/bookingEmail";
import { LOGO_PNG_BASE64 } from "@/lib/mail/logo";
import { validateBooking } from "@/lib/validation/booking";
import { limit, clientIp } from "@/lib/rateLimit";
import { services } from "@/data/site";

/**
 * API form đặt lịch → email "Yêu cầu đặt lịch mới" về hộp thư Studio Bin.
 *
 * Các lớp bảo vệ (theo thứ tự, việc rẻ làm trước):
 *  1. Chỉ nhận request từ chính website (Origin / Sec-Fetch-Site) và đúng Content-Type JSON.
 *  2. Giới hạn kích thước body 8KB (đọc dạng text rồi mới parse) — chặn gửi payload khổng lồ.
 *  3. Rate limit: theo IP (3 / phút, 8 / giờ, 20 / ngày) — Redis nếu cấu hình, không thì bộ nhớ.
 *  4. Chống bot: ô ẩn honeypot + thời gian điền form tối thiểu.
 *  5. Validate từng trường bằng CÙNG luật với trình duyệt (lib/validation/booking.js);
 *     dịch vụ chỉ nhận mã trong danh sách, tên dịch vụ do server tự tra (không tin chữ từ client).
 *  6. Theo số điện thoại: tối đa 3 yêu cầu / giờ, trùng y hệt trong 10 phút → coi như đã nhận (không gửi lại).
 *  7. Dữ liệu được làm sạch ký tự điều khiển/vô hình → không chèn được header email; template escape HTML.
 * Lỗi trả về dạng { error: "<mã>", fields?: { tên_trường: "<mã>" } } để client hiện toast đúng ngữ cảnh.
 *
 * Lưu ý: DDoS quy mô lớn phải chặn ở hạ tầng (Vercel Firewall / Cloudflare) — xem README.
 */
export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BODY = 8 * 1024;
const MIN_FILL_MS = 1500; // người thật không thể điền xong form dưới 1,5 giây
const LOGO = Buffer.from(LOGO_PNG_BASE64, "base64");
const SERVICE_IDS = services.items.map((s) => s.n);
const serviceTitle = (id, lang) => services.items.find((s) => s.n === id)?.title?.[lang] || "";

const json = (body, status = 200, headers = {}) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers },
  });

function sameOrigin(request) {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  const origin = request.headers.get("origin");
  if (!origin) return false; // trình duyệt luôn gửi Origin cho fetch POST; thiếu = script/bot
  let host;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  const allowed = new Set([request.headers.get("host")]);
  try {
    if (process.env.NEXT_PUBLIC_SITE_URL)
      allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).host);
  } catch {}
  return allowed.has(host);
}

let transporter;
function getTransporter() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      pool: true, // giữ kết nối, khỏi đăng nhập lại mỗi lần gửi
      maxConnections: 2,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return transporter;
}

async function rateCheck(rules) {
  for (const [key, max, windowMs] of rules) {
    const r = await limit(key, max, windowMs);
    if (!r.ok) return r;
  }
  return null;
}

export async function POST(request) {
  // 1. Nguồn gửi + Content-Type
  if (!sameOrigin(request)) return json({ error: "forbidden" }, 403);
  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    return json({ error: "bad_request" }, 415);
  }

  // 2. Kích thước body
  if (Number(request.headers.get("content-length") || 0) > MAX_BODY) {
    return json({ error: "too_large" }, 413);
  }
  let raw;
  try {
    raw = await request.text();
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  if (raw.length > MAX_BODY) return json({ error: "too_large" }, 413);
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ error: "bad_request" }, 400);
  }

  // 3. Rate limit theo IP
  const ip = clientIp(request.headers);
  const blocked = await rateCheck([
    [`ip:m:${ip}`, 3, 60_000],
    [`ip:h:${ip}`, 8, 3_600_000],
    [`ip:d:${ip}`, 20, 86_400_000],
  ]);
  if (blocked) {
    return json({ error: "rate_limited", retryAfter: blocked.retryAfter }, 429, {
      "Retry-After": String(blocked.retryAfter),
    });
  }

  // 4. Chống bot: honeypot (giả vờ thành công để bot không dò ra) + điền quá nhanh
  if (body.website) return json({ ok: true });
  const elapsed = Number(body.elapsed);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS) {
    return json({ error: "too_fast" }, 422);
  }

  // 5. Validate từng trường
  const lang = body.lang === "en" ? "en" : "vi";
  const v = validateBooking(body, { serviceIds: SERVICE_IDS });
  if (!v.ok) return json({ error: "invalid", fields: v.errors }, 422);
  const data = {
    ...v.data,
    serviceName: serviceTitle(v.data.service, lang),
    lang,
    receivedAt: new Date().toISOString(),
  };

  // 6. Theo số điện thoại: chặn spam 1 số + bỏ qua bấm gửi trùng
  const phoneBlocked = await rateCheck([[`ph:h:${data.phoneE164}`, 3, 3_600_000]]);
  if (phoneBlocked) {
    return json({ error: "rate_limited", retryAfter: phoneBlocked.retryAfter }, 429, {
      "Retry-After": String(phoneBlocked.retryAfter),
    });
  }
  const fingerprint = [data.phoneE164, data.name, data.date, data.service, data.note].join("|");
  const dup = await limit(`dup:${fingerprint}`, 1, 600_000);
  if (!dup.ok) return json({ ok: true, duplicate: true });

  // 7. Gửi mail
  const mailer = getTransporter();
  if (!mailer) {
    console.warn("[booking] SMTP chưa cấu hình — yêu cầu chỉ được ghi log:", data);
    if (process.env.NODE_ENV === "production") return json({ error: "unavailable" }, 503);
    return json({ ok: true, mailed: false });
  }

  const { subject, html, text } = bookingEmail(data);
  const message = {
    from: process.env.MAIL_FROM || `"Studio Bin Website" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER,
    subject,
    html,
    text,
    attachments: [{ filename: "logo.png", content: LOGO, cid: "studio-bin-logo" }],
  };

  // Gửi ở nền sau khi đã trả kết quả cho khách (kết nối + gửi Gmail mất vài giây)
  after(async () => {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const t0 = Date.now();
        await mailer.sendMail(message);
        console.log(`[booking] đã gửi email (${Date.now() - t0}ms):`, data.name, data.phoneE164);
        return;
      } catch (err) {
        console.error(`[booking] gửi email thất bại lần ${attempt}:`, err?.message);
      }
    }
    console.error("[booking] KHÔNG gửi được email — thông tin khách:", data);
  });

  return json({ ok: true, queued: true });
}
