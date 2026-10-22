"use client";

import { useState } from "react";
import { Check } from "@/components/ui/Icons";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

/**
 * Form đặt lịch: gửi về /api/contact → server gửi email "Yêu cầu đặt lịch mới" về hộp thư studio.
 * Đồng thời sao chép nội dung vào clipboard để khách dán vào WhatsApp / Zalo nếu muốn.
 */
export default function BookingForm({ booking, services, site, preset, lang }) {
  const f = booking.fields;
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    people: "2",
    service: preset || "",
    note: "",
    website: "", // honeypot chống bot — người thật không thấy ô này
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const set = (k) => (e) => setForm((v) => ({ ...v, [k]: e.target.value }));

  const compose = () => {
    const s = services.find((x) => x.n === form.service);
    return [
      booking.message,
      `• ${f.name}: ${form.name}`,
      `• ${f.phone}: ${form.phone}`,
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
    setStatus("loading");
    const s = services.find((x) => x.n === form.service);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, serviceName: s?.title || "", lang, message: compose() }),
      });
      if (!res.ok) throw new Error("bad response");
      try {
        await navigator.clipboard.writeText(compose());
      } catch {}
      setStatus("success");
      toast.success(f.toastOkTitle, f.toastOkDesc);
    } catch {
      setStatus("error");
      toast.error(f.toastErrTitle, f.toastErrDesc);
    }
  };

  const reset = () => {
    setForm((v) => ({ ...v, date: "", note: "", website: "" }));
    setStatus("idle");
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

  return (
    <form onSubmit={onSubmit} className="space-y-3">
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
        <input
          required
          className="field"
          placeholder={f.name}
          value={form.name}
          onChange={set("name")}
          autoComplete="name"
        />
        <input
          required
          className="field"
          type="tel"
          placeholder={f.phone}
          value={form.phone}
          onChange={set("phone")}
          autoComplete="tel"
        />
      </div>
      <div className="grid grid-cols-[1.4fr_1fr] gap-3 sm:grid-cols-2">
        <label className="relative block">
          <span className="absolute top-1.5 left-4 text-[11px] tracking-wider text-ink-muted uppercase lg:text-[10px]">
            {f.date}
          </span>
          <input className="field pt-5" type="date" value={form.date} onChange={set("date")} />
        </label>
        <label className="relative block">
          <span className="absolute top-1.5 left-4 text-[11px] tracking-wider text-ink-muted uppercase lg:text-[10px]">
            {f.people}
          </span>
          <select className="field pt-5" value={form.people} onChange={set("people")}>
            {["1", "2", "3-5", "6-10", "10+"].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="relative block">
        <span className="absolute top-1.5 left-4 text-[11px] tracking-wider text-ink-muted uppercase lg:text-[10px]">
          {f.service}
        </span>
        <select className="field pt-5" value={form.service} onChange={set("service")}>
          <option value="">{f.undecided}</option>
          {services.map((s) => (
            <option key={s.n} value={s.n}>
              {s.title}
            </option>
          ))}
        </select>
      </label>
      <textarea
        className="min-h-[72px] field resize-none sm:min-h-[88px]"
        placeholder={f.note}
        value={form.note}
        onChange={set("note")}
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-white transition hover:bg-graphite disabled:opacity-60"
      >
        {status === "loading" ? f.sending : f.submit}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "flex items-center justify-center gap-2 text-center text-[12px] transition-all duration-300",
          status === "success"
            ? "text-ink"
            : status === "error"
              ? "text-red-600"
              : "text-ink-muted",
        )}
      >
        {status === "error" ? f.error : f.privacy}
      </p>
    </form>
  );
}
