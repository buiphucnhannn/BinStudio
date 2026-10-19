"use client";

import { useState } from "react";
import { Check } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

/**
 * Form đặt lịch: gửi về /api/contact (hiện chỉ ghi log server — tích hợp email/CRM tại route.js).
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
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
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
        {status === "success" && <Check className="h-3.5 w-3.5" />}
        {status === "success" ? f.sent : status === "error" ? f.error : f.privacy}
      </p>
    </form>
  );
}
