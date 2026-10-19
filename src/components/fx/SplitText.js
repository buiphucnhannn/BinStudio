import { cn, noOrphan } from "@/lib/utils";

/**
 * Tách chữ thành từng từ/ký tự để hiện dần kiểu blur-in.
 * - text: chuỗi chính; accent: phần in nghiêng ở cuối (tuỳ chọn)
 * - mode: "word" | "char"
 * - visible=true: chạy ngay bằng class .is-visible; mặc định chờ cuộn tới (useReveal chạy animation).
 * - manual: chỉ hiện khi visible=true, useReveal bỏ qua
 */
export default function SplitText({
  text,
  accent,
  accentClass = "italic text-ink-soft",
  as: Tag = "h2",
  mode = "word",
  className = "",
  visible = false,
  step = 45,
  baseDelay = 0,
  manual = false,
  breakBeforeAccent = false,
}) {
  let i = 0;
  const mainText = accent ? text : noOrphan(text);
  const accentText = accent ? noOrphan(accent) : accent;
  const render = (str, extra = "") =>
    str.split(" ").flatMap((word, wi, words) => [
      <span key={`${wi}-${word}`} className="whitespace-nowrap">
        {mode === "char" ? (
          [...word].map((ch, ci) => (
            <span key={ci} className={cn("split-unit", extra)} style={{ "--i": i++ }}>
              {ch}
            </span>
          ))
        ) : (
          <span className={cn("split-unit", extra)} style={{ "--i": i++ }}>
            {word}
          </span>
        )}
      </span>,
      wi < words.length - 1 ? " " : null,
    ]);

  return (
    <Tag
      className={cn("split", visible && "is-visible", className)}
      data-manual={manual ? "" : undefined}
      style={{ "--step": `${step}ms`, "--base": `${baseDelay}ms` }}
    >
      {render(mainText)}
      {accent && (
        <>
          {breakBeforeAccent ? <br /> : " "}
          {render(accentText, accentClass)}
        </>
      )}
    </Tag>
  );
}
