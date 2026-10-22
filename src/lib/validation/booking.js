/**
 * Luật kiểm tra form đặt lịch — DÙNG CHUNG cho trình duyệt (báo lỗi tức thì) và server (lớp chặn thật).
 * Không import gì phía server để chạy được trên client. Trả về mã lỗi; câu chữ hiển thị nằm trong data/site.js.
 */

export const PEOPLE = ["1", "2", "3-5", "6-10", "10+"];
export const LIMITS = { name: 60, phone: 20, note: 1000 };

// Ký tự điều khiển, ký tự vô hình, ký tự đảo chiều văn bản (bidi) — hay dùng để giả mạo / chèn header email.
// Dựng từ mã số ký tự (không viết ký tự thật vào mã nguồn để tránh lỗi cú pháp / khó đọc).
const INVISIBLE_RANGES = [
  [0x00, 0x08], // điều khiển (giữ lại tab, xuống dòng)
  [0x0b, 0x0c],
  [0x0e, 0x1f],
  [0x7f, 0x9f],
  [0x200b, 0x200f], // zero-width, LRM/RLM
  [0x2028, 0x2029], // ngắt dòng / đoạn Unicode
  [0x202a, 0x202e], // bidi override
  [0x2060, 0x2069],
  [0xfeff, 0xfeff], // BOM
];
const INVISIBLE = new RegExp(
  "[" +
    INVISIBLE_RANGES.map(([a, b]) => String.fromCodePoint(a) + "-" + String.fromCodePoint(b)).join(
      "",
    ) +
    "]",
  "g",
);

/** Làm sạch chuỗi: chuẩn hoá Unicode, bỏ ký tự vô hình, gộp khoảng trắng, cắt độ dài. */
export function clean(value, max, { multiline = false } = {}) {
  let s = String(value ?? "")
    .normalize("NFC")
    .replace(INVISIBLE, "");
  s = multiline
    ? s
        .replace(/\r\n?/g, "\n")
        .replace(/[^\S\n]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
    : s.replace(/\s+/g, " ");
  return s.trim().slice(0, max);
}

// ---------- Họ tên ----------
// Chữ cái mọi ngôn ngữ (kể cả tiếng Việt có dấu), dấu nháy, gạch nối, dấu chấm, khoảng trắng.
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}'’.\- ]*$/u;

export function checkName(raw) {
  const name = clean(raw, LIMITS.name + 1);
  if (!name) return { error: "name_required" };
  if (name.length > LIMITS.name) return { error: "name_long" };
  const letters = (name.match(/\p{L}/gu) || []).length;
  if (letters < 2) return { error: "name_short" };
  if (!NAME_RE.test(name)) return { error: "name_invalid" }; // có số, ký hiệu, link…
  if (/(.)\1{4,}/u.test(name.replace(/\s/g, ""))) return { error: "name_invalid" }; // "aaaaa"
  if (name.split(" ").length > 8) return { error: "name_invalid" };
  return { value: name };
}

// ---------- Số điện thoại ----------
// Việt Nam: di động 03/05/07/08/09 + 8 số, cố định 02 + 9 số (nhập 0…, 84…, +84…).
// Quốc tế: bắt buộc có "+" và mã nước, 8–15 chữ số (chuẩn E.164).
const VN_MOBILE = /^(3|5|7|8|9)\d{8}$/;
const VN_LANDLINE = /^2\d{9}$/;

export function checkPhone(raw) {
  const input = clean(raw, LIMITS.phone + 1);
  if (!input) return { error: "phone_required" };
  if (input.length > LIMITS.phone || !/^\+?[\d\s().-]+$/.test(input)) {
    return { error: "phone_invalid" };
  }
  const digits = input.replace(/\D/g, "");
  if (/^(\d)\1+$/.test(digits) || /0123456789|1234567890|9876543210/.test(digits)) {
    return { error: "phone_invalid" }; // 0000000000, 0123456789…
  }

  let national = null; // phần sau mã nước Việt Nam
  if (input.startsWith("+")) {
    if (digits.startsWith("84")) national = digits.slice(2);
    else if (digits.length >= 8 && digits.length <= 15 && !digits.startsWith("0")) {
      return { value: input, e164: "+" + digits, country: "intl" };
    } else return { error: "phone_invalid" };
  } else if (digits.startsWith("84") && digits.length === 11) national = digits.slice(2);
  else if (digits.startsWith("0")) national = digits.slice(1);
  else return { error: "phone_intl" }; // số nước ngoài thiếu "+"

  if (national?.startsWith("0")) national = national.slice(1); // +84 0384…
  if (!national || !(VN_MOBILE.test(national) || VN_LANDLINE.test(national))) {
    return { error: "phone_invalid" };
  }
  return { value: input, e164: "+84" + national, country: "vn" };
}

// ---------- Ngày dự kiến (bắt buộc) ----------
const pad = (n) => String(n).padStart(2, "0");
/** Hôm nay theo giờ Việt Nam, dạng YYYY-MM-DD (khách ở mọi múi giờ đều so cùng một mốc). */
export function todayVN(now = new Date()) {
  const d = new Date(now.getTime() + 7 * 3600 * 1000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
export function maxDateVN(now = new Date()) {
  const [y, m, d] = todayVN(now).split("-");
  return `${Number(y) + 2}-${m}-${d}`;
}

export function checkDate(raw, now = new Date()) {
  const v = clean(raw, 10);
  if (!v) return { error: "date_required" };
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return { error: "date_invalid" };
  const dt = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (dt.getUTCMonth() !== +m[2] - 1 || dt.getUTCDate() !== +m[3]) return { error: "date_invalid" }; // 31/02
  if (v < todayVN(now)) return { error: "date_past" };
  if (v > maxDateVN(now)) return { error: "date_far" };
  return { value: v };
}

// ---------- Ghi chú (không bắt buộc) ----------
export function checkNote(raw) {
  const note = clean(raw, LIMITS.note + 1, { multiline: true });
  if (note.length > LIMITS.note) return { error: "note_long" };
  const links = (note.match(/(https?:\/\/|www\.)\S+/gi) || []).length;
  if (links > 2) return { error: "note_links" };
  if (/<\s*\/?\s*(script|iframe|a|img|svg)\b/i.test(note)) return { error: "note_links" };
  return { value: note };
}

/**
 * Kiểm tra toàn bộ form.
 * @param {object} input  dữ liệu thô { name, phone, date, people, service, note }
 * @param {{ serviceIds?: string[], now?: Date }} opts  serviceIds = danh sách mã dịch vụ hợp lệ ("01"…"05")
 * @returns {{ ok: boolean, errors: Record<string,string>, data: object }}
 */
export function validateBooking(input = {}, { serviceIds, now } = {}) {
  const errors = {};
  const data = {};

  const name = checkName(input.name);
  if (name.error) errors.name = name.error;
  else data.name = name.value;

  const phone = checkPhone(input.phone);
  if (phone.error) errors.phone = phone.error;
  else Object.assign(data, { phone: phone.value, phoneE164: phone.e164 });

  const date = checkDate(input.date, now);
  if (date.error) errors.date = date.error;
  else data.date = date.value;

  const people = clean(input.people, 5) || "2";
  if (!PEOPLE.includes(people)) errors.people = "people_invalid";
  else data.people = people;

  const service = clean(input.service, 4);
  if (service && serviceIds && !serviceIds.includes(service)) errors.service = "service_invalid";
  else data.service = service;

  const note = checkNote(input.note);
  if (note.error) errors.note = note.error;
  else data.note = note.value;

  return { ok: Object.keys(errors).length === 0, errors, data };
}
