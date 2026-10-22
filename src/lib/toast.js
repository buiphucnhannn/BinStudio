/**
 * Toast dùng chung toàn site — gọi được từ bất kỳ client component nào:
 *
 *   import { toast } from "@/lib/toast";
 *   toast.success("Đã gửi yêu cầu", "Bin sẽ liên hệ lại trong ngày.");
 *   toast.error("Gửi chưa thành công", "Vui lòng thử lại.");
 *   toast.info("Đã sao chép", "Nội dung đã nằm trong clipboard.", { duration: 3000 });
 *
 * Hiển thị bởi <Toaster /> (đặt 1 lần trong layout). Truyền duration: 0 để toast không tự đóng.
 */
const EVENT = "bin:toast";
let seq = 0;

function emit(type, title, desc, opts = {}) {
  if (typeof window === "undefined") return null;
  const id = ++seq;
  window.dispatchEvent(
    new CustomEvent(EVENT, {
      detail: { id, type, title, desc, duration: opts.duration ?? 5000 },
    }),
  );
  return id;
}

export const toast = {
  success: (title, desc, opts) => emit("success", title, desc, opts),
  error: (title, desc, opts) => emit("error", title, desc, opts),
  info: (title, desc, opts) => emit("info", title, desc, opts),
  dismiss: (id) => window.dispatchEvent(new CustomEvent(EVENT, { detail: { id, dismiss: true } })),
};

export const TOAST_EVENT = EVENT;
