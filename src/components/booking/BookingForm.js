"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check } from "@/components/ui/Icons";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { LIMITS, PEOPLE, maxDateVN, todayVN, validateBooking } from "@/lib/validation/booking";

/**
 * Form đặt lịch → /api/contact → email "Yêu cầu đặt lịch mới" về hộp thư studio.
 * - Kiểm tra ngay trên trình duyệt bằng CÙNG luật với server (lib/validation/booking.js):
 *   ô sai viền đỏ, con trỏ nhảy tới ô sai, toast báo đúng lỗi.
 * - Request có thời gian chờ tối đa; phân biệt lỗi mạng / gửi quá nhiều / lỗi server để báo đúng.
 * - Gửi kèm thời gian điền form (chống bot) và ô ẩn honeypot.
 */
const TIMEOUT_MS = 15_000;
const DURATION = { field: 6000, rate: 9000, server: 8000 };
const FIELD_ORDER = ["name", "phone", "hotel", "date", "people", "service", "note"];

export default function BookingForm({ booking, services, preset, lang }) {
  const f = booking.fields;
  const E = f.errors;
  const [form, setForm] = useState({
    name: "",
    phone: "",
    hotel: "",
    date: "",
    people: "2",
    service: services.some((s) => s.n === preset) ? preset : "",
    note: "",
    website: "", // honeypot chống bot — người thật không thấy ô này
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const uid = useId();
  const formRef = useRef(null);
  const openedAt = useRef(0);
  const lastToast = useRef(null); // toast lỗi đang hiện — đóng trước khi báo lỗi mới để không chồng

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const set = (k) => (e) => {
    setForm((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors(({ [k]: _drop, ...rest }) => rest);
  };

  const msg = (code) => E[code] || f.toastErrDesc;
  const clearToast = () => lastToast.current && toast.dismiss(lastToast.current);
  const fail = (title, desc, duration) => {
    clearToast();
    lastToast.current = toast.error(title, desc, { duration });
  };

  // Báo lỗi trường: viền đỏ + focus ô đầu tiên sai + toast
  const showFieldErrors = (errs) => {
    setErrors(errs);
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (!first) return;
    formRef.current?.querySelector(`[name="${first}"]`)?.focus();
    fail(E.checkTitle, msg(errs[first]), DURATION.field);
  };

  const compose = () => {
    const s = services.find((x) => x.n === form.service);
    return [
      booking.message,
      `• ${f.name}: ${form.name}`,
      `• ${f.phone}: ${form.phone}`,
      `• ${f.hotel}: ${form.hotel}`,
      form.date && `• ${f.date}: ${form.date}`,
      `• ${f.people}: ${form.people}`,
      `• ${f.service}: ${s ? s.title : f.undecided}`,
      form.note && `• ${f.note.split(" (")[0]}: ${form.note}`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return; // chặn bấm gửi liên tục

    const check = validateBooking(form, { serviceIds: services.map((s) => s.n) });
    if (!check.ok) return showFieldErrors(check.errors);

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      return fail(E.offline_title, E.offline, DURATION.server);
    }

    setStatus("loading");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: check.data.name,
          hotel: check.data.hotel,
          phone: check.data.phone,
          note: check.data.note,
          lang,
          elapsed: Date.now() - openedAt.current,
        }),
        signal: ctrl.signal,
      });
      const out = await res.json().catch(() => ({}));

      if (res.ok && out.ok) {
        try {
          await navigator.clipboard.writeText(compose());
        } catch {}
        setStatus("success");
        clearToast();
        toast.success(f.toastOkTitle, f.toastOkDesc);
        return;
      }

      setStatus("error");
      if (out.error === "invalid" && out.fields) return showFieldErrors(out.fields);
      if (out.error === "too_fast") return fail(E.checkTitle, E.too_fast, DURATION.field);
      if (res.status === 429) {
        const minutes = Math.max(1, Math.ceil((out.retryAfter || 60) / 60));
        return fail(E.rate_limited_title, E.rate_limited.replace("{n}", minutes), DURATION.rate);
      }
      fail(f.toastErrTitle, f.toastErrDesc, DURATION.server);
    } catch (err) {
      setStatus("error");
      const aborted = err?.name === "AbortError";
      fail(
        aborted ? f.toastErrTitle : E.offline_title,
        aborted ? E.timeout : E.offline,
        DURATION.server,
      );
    } finally {
      clearTimeout(timer);
    }
  };

  const reset = () => {
    setForm((v) => ({ ...v, date: "", note: "", website: "" }));
    setErrors({});
    setStatus("idle");
    openedAt.current = Date.now();
  };

  // Gửi xong: thay form bằng màn hình xác nhận
  if (status === "success") {
    const [before, after] = f.successDesc.split("{phone}");
    return (
      <div
        role="status"
        className="flex [animation:popIn_.5s_cubic-bezier(.22,1,.36,1)_both] flex-col items-center px-2 py-6 text-center sm:py-10"
      >
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <span className="absolute inset-0 [animation:ripple_2.4s_ease-out_infinite] rounded-full bg-emerald-200/60" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_10px_30px_-10px_rgba(16,185,129,0.7)]">
            <Check className="h-7 w-7" />
          </span>
        </span>
        <h4 className="mt-7 font-serif text-[1.7rem] leading-tight text-ink sm:text-[2rem]">
          {f.successTitle}
        </h4>
        <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-ink-soft">
          {before}
          <strong className="font-semibold text-ink">{form.phone}</strong>
          {after}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink transition hover:border-ink hover:bg-ink hover:text-white"
        >
          {f.again}
        </button>
      </div>
    );
  }

  // Ô lỗi: viền đỏ + vòng sáng đỏ nhạt
  const bad = (k) =>
    errors[k] && "border-red-400 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-100";
  const label =
    "absolute top-[5px] left-4 text-[10.5px] tracking-wider text-ink-muted uppercase lg:text-[10px]";
  // Dòng báo lỗi nhỏ dưới ô (trình đọc màn hình đọc qua aria-describedby)
  const errId = (k) => `${uid}-${k}-err`;
  const a11y = (k) => ({
    "aria-invalid": Boolean(errors[k]),
    "aria-describedby": errors[k] ? errId(k) : undefined,
  });
  // Chỉ HIỆN dòng lỗi của ô sai đầu tiên (giữ popup vừa 1 màn hình); ô sai khác vẫn viền đỏ
  // và vẫn có dòng lỗi ẩn (sr-only) cho trình đọc màn hình. Sửa xong ô này → lỗi ô kế tiếp hiện ra.
  const firstErr = FIELD_ORDER.find((k) => errors[k]);
  const hint = (k) =>
    errors[k] ? (
      <p
        id={errId(k)}
        className={
          k === firstErr
            ? "mt-1 [animation:fadeIn_.25s_ease-out_both] pl-4 text-[11.5px] leading-snug text-red-600"
            : "sr-only"
        }
      >
        {msg(errors[k])}
      </p>
    ) : null;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="flex flex-1 flex-col space-y-2.5 [@media(max-height:700px)]:space-y-2"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={form.website}
        onChange={set("website")}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <input
            name="name"
            required
            maxLength={LIMITS.name}
            className={cn("field", bad("name"))}
            {...a11y("name")}
            aria-label={f.name}
            placeholder={f.name}
            value={form.name}
            onChange={set("name")}
            autoComplete="name"
            enterKeyHint="next"
          />
          {hint("name")}
        </div>
        <div>
          <input
            name="phone"
            required
            type="tel"
            inputMode="tel"
            maxLength={LIMITS.phone}
            className={cn("field", bad("phone"))}
            {...a11y("phone")}
            aria-label={f.phone}
            placeholder={f.phone}
            value={form.phone}
            onChange={set("phone")}
            autoComplete="tel"
            spellCheck={false}
            enterKeyHint="next"
          />
          {hint("phone")}
        </div>
      </div>
      <div>
        <label className="relative block">
          <span className={label}>{f.hotel}</span>
          <input
            name="hotel"
            required
            maxLength={LIMITS.hotel}
            className={cn("field pt-[1.15rem] pb-1.5", bad("hotel"))}
            {...a11y("hotel")}
            placeholder={f.hotelPlaceholder}
            value={form.hotel}
            onChange={set("hotel")}
            enterKeyHint="next"
          />
        </label>
        {hint("hotel")}
      </div>
      <div className="grid grid-cols-[1.4fr_1fr] gap-3 sm:grid-cols-2">
        <div>
          <label className="relative block">
            <span className={label}>{f.date}</span>
            <input
              name="date"
              required
              className={cn("field pt-[1.15rem] pb-1.5", bad("date"))}
              {...a11y("date")}
              type="date"
              value={form.date}
              onChange={set("date")}
              // Giới hạn chọn ngày: từ hôm nay (giờ VN) tới 2 năm sau — đặt khi người dùng mở ô ngày
              onFocus={(e) => {
                e.currentTarget.min = todayVN();
                e.currentTarget.max = maxDateVN();
              }}
            />
          </label>
          {hint("date")}
        </div>
        <div>
          <label className="relative block">
            <span className={label}>{f.people}</span>
            <select
              name="people"
              className={cn("field pt-[1.15rem] pb-1.5", bad("people"))}
              {...a11y("people")}
              value={form.people}
              onChange={set("people")}
            >
              {PEOPLE.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          {hint("people")}
        </div>
      </div>
      <div>
        <label className="relative block">
          <span className={label}>{f.service}</span>
          <select
            name="service"
            className={cn("field pt-[1.15rem] pb-1.5", bad("service"))}
            {...a11y("service")}
            value={form.service}
            onChange={set("service")}
          >
            <option value="">{f.undecided}</option>
            {services.map((s) => (
              <option key={s.n} value={s.n}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        {hint("service")}
      </div>
      {/* Ô ghi chú tự giãn lấp phần còn trống của popup (desktop) */}
      <div className="flex flex-1 flex-col">
        <textarea
          name="note"
          maxLength={LIMITS.note}
          className={cn(
            "min-h-[60px] field flex-1 resize-none [@media(max-height:700px)]:min-h-[44px] lg:[@media(max-height:640px)]:min-h-[34px] lg:[@media(max-height:640px)]:py-2",
            bad("note"),
          )}
          {...a11y("note")}
          aria-label={f.note}
          placeholder={f.note}
          value={form.note}
          onChange={set("note")}
        />
        {hint("note")}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        aria-busy={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-graphite disabled:cursor-wait disabled:opacity-60"
      >
        {status === "loading" && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        )}
        {status === "loading" ? f.sending : f.submit}
      </button>

      <p className="text-center text-[11.5px] text-ink-muted">{f.privacy}</p>
    </form>
  );
}
