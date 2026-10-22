/**
 * Giới hạn tần suất (fixed window) cho API.
 *
 * - Có biến UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN → đếm trên Redis (Upstash, gói miễn phí):
 *   bộ đếm dùng chung cho mọi instance serverless, không bị reset khi hàm khởi động lại. Khuyên dùng khi deploy.
 * - Không có → đếm trong bộ nhớ tiến trình (đủ cho dev / 1 server), có giới hạn số khoá để không bị
 *   tấn công làm đầy bộ nhớ.
 *
 * limit(key, max, windowMs) → { ok, remaining, retryAfter (giây) }
 */
const MAX_KEYS = 10_000;
const memory = new Map(); // key → { count, reset }

function memoryHit(key, max, windowMs) {
  const now = Date.now();
  let e = memory.get(key);
  if (!e || e.reset <= now) {
    if (memory.size >= MAX_KEYS) {
      for (const [k, v] of memory) if (v.reset <= now) memory.delete(k); // dọn khoá hết hạn
      if (memory.size >= MAX_KEYS) memory.delete(memory.keys().next().value); // vẫn đầy → bỏ khoá cũ nhất
    }
    e = { count: 0, reset: now + windowMs };
    memory.set(key, e);
  }
  e.count += 1;
  return { count: e.count, reset: e.reset };
}

async function redisHit(key, windowMs) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["PEXPIRE", key, String(windowMs), "NX"],
      ["PTTL", key],
    ]),
    cache: "no-store",
    signal: AbortSignal.timeout(2000),
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const [[incr], , [ttl]] = (await res.json()).map((r) => [r.result]);
  return { count: Number(incr), reset: Date.now() + Math.max(0, Number(ttl)) };
}

const hasRedis = () =>
  Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

export async function limit(key, max, windowMs) {
  const k = `rl:${key}`;
  let hit;
  try {
    hit = hasRedis() ? await redisHit(k, windowMs) : memoryHit(k, max, windowMs);
  } catch (err) {
    console.warn("[rate-limit] Redis lỗi, tạm dùng bộ nhớ:", err?.message);
    hit = memoryHit(k, max, windowMs);
  }
  return {
    ok: hit.count <= max,
    remaining: Math.max(0, max - hit.count),
    retryAfter: Math.max(1, Math.ceil((hit.reset - Date.now()) / 1000)),
  };
}

/**
 * IP thật của client — chỉ đọc header do HẠ TẦNG ghi đè, không tin header client tự gửi.
 * - Mặc định (Vercel): "x-real-ip" / "x-forwarded-for" do Vercel đặt lại ở edge.
 * - Đặt TRUSTED_IP_HEADER=cf-connecting-ip nếu site chạy sau Cloudflare.
 */
export function clientIp(headers) {
  const trusted = process.env.TRUSTED_IP_HEADER;
  if (trusted) return headers.get(trusted)?.split(",")[0].trim() || "unknown";
  return (
    headers.get("x-real-ip") ||
    (headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "local"
  );
}
