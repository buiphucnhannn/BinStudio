import nodemailer from "nodemailer";
import { NextResponse, after } from "next/server";
import { bookingEmail } from "@/lib/mail/bookingEmail";
import { LOGO_PNG_BASE64 } from "@/lib/mail/logo";

/**
 * API nhận form đặt lịch → gửi email "Yêu cầu đặt lịch mới" về hộp thư Studio Bin.
 * Cấu hình SMTP qua biến môi trường (xem .env.example). Chưa cấu hình:
 *   - môi trường dev: chỉ ghi log, vẫn trả ok để test giao diện;
 *   - production: trả lỗi 503 để form báo khách nhắn trực tiếp (không âm thầm mất yêu cầu).
 *
 * Tốc độ: kết nối + đăng nhập Gmail mất ~1,8s, gửi thư thêm ~1–2s. Vì vậy API trả kết quả NGAY sau khi
 * kiểm tra dữ liệu, còn việc gửi mail chạy ở nền bằng after() (Vercel giữ hàm sống tới khi gửi xong).
 * Kết nối SMTP được giữ lại (pool) để các lần gửi sau trong cùng tiến trình nhanh hơn.
 * Gửi lỗi → thử lại 1 lần, vẫn lỗi thì ghi log ĐẦY ĐỦ thông tin khách để không mất yêu cầu.
 */
export const runtime = "nodejs";
// Thời gian tối đa cho hàm (bao gồm phần gửi nền) trên nền tảng serverless
export const maxDuration = 30;

const LOGO = Buffer.from(LOGO_PNG_BASE64, "base64");

const LIMIT = 5; // tối đa 5 yêu cầu / 10 phút / IP — chống spam đơn giản
const WINDOW = 10 * 60 * 1000;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW);
  list.push(now);
  hits.set(ip, list);
  return list.length > LIMIT;
}

const clip = (v, n) =>
  String(v ?? "")
    .trim()
    .slice(0, n);

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

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Honeypot: ô ẩn "website" chỉ bot mới điền → giả vờ thành công, không gửi
  if (body.website) return NextResponse.json({ ok: true });

  const ip = (request.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const data = {
    name: clip(body.name, 80),
    phone: clip(body.phone, 20),
    date: clip(body.date, 10),
    people: clip(body.people, 10),
    serviceName: clip(body.serviceName, 120),
    note: clip(body.note, 1500),
    lang: body.lang === "en" ? "en" : "vi",
    receivedAt: new Date().toISOString(),
  };

  if (!data.name || !data.phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }
  if (!/^[0-9+\s().-]{7,20}$/.test(data.phone)) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) data.date = "";

  const mailer = getTransporter();
  if (!mailer) {
    console.warn("[booking] SMTP chưa cấu hình — yêu cầu chỉ được ghi log:", data);
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Mail not configured" }, { status: 503 });
    }
    return NextResponse.json({ ok: true, mailed: false });
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

  // Gửi ở nền sau khi đã trả kết quả cho khách
  after(async () => {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const t0 = Date.now();
        await mailer.sendMail(message);
        console.log(`[booking] đã gửi email (${Date.now() - t0}ms):`, data.name, data.phone);
        return;
      } catch (err) {
        console.error(`[booking] gửi email thất bại lần ${attempt}:`, err?.message);
      }
    }
    console.error("[booking] KHÔNG gửi được email — thông tin khách:", data);
  });

  return NextResponse.json({ ok: true, queued: true });
}
