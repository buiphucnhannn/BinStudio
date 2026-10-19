// Dải chữ chạy liên tục ngay dưới hero: liệt kê các kiểu chụp.
export default function Marquee({ items }) {
  const half = [...items, ...items];
  const row = [...half, ...half];
  return (
    <div className="marquee overflow-hidden border-y border-ink/10 bg-sand py-4" aria-hidden>
      <div className="bleed-cap overflow-hidden">
        <div className="marquee-track gap-10" style={{ "--marquee-duration": "48s" }}>
          {row.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-10 font-serif text-xl whitespace-nowrap text-ink/70 italic sm:text-2xl"
            >
              {item}
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
