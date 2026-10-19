"use client";

import { useRef } from "react";

/**
 * Kéo chuột để cuộn ngang một khối overflow-x (desktop). Trả về ref + các handler pointer.
 * `moved()` cho biết lần kéo vừa rồi có di chuyển không (để bỏ qua click sau khi kéo).
 */
export default function useDragScroll() {
  const ref = useRef(null);
  const drag = useRef({ on: false, x: 0, left: 0, moved: false });

  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    drag.current = { on: true, x: e.clientX, left: el.scrollLeft, moved: false };
    el.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.on) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    ref.current.scrollLeft = d.left - dx;
  };
  const end = (e) => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    try {
      ref.current?.releasePointerCapture?.(e.pointerId);
    } catch {}
    setTimeout(() => (drag.current.moved = false), 0);
  };

  return {
    ref,
    moved: () => drag.current.moved,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: end,
      onPointerCancel: end,
      onPointerLeave: end,
    },
  };
}
