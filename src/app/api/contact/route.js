import { NextResponse } from "next/server";

/**
 * API nhận form đặt lịch.
 * Hiện tại chỉ validate + log server. Tích hợp email (Resend, Nodemailer), Google Sheets
 * hoặc Zalo OA tại đây khi khách cung cấp tài khoản (xem .env.example).
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }
  if (!/^[0-9+\s().-]{7,20}$/.test(phone)) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }

  // TODO: gửi email / lưu CRM
  console.log("[booking]", {
    name,
    phone,
    date: body.date,
    people: body.people,
    service: body.serviceName || body.service,
    note: body.note,
    lang: body.lang,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
