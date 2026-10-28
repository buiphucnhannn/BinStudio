// Bộ icon SVG inline — không cần cài thêm thư viện.
const base = (props) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  ...props,
});

export const ArrowRight = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);
export const ArrowUp = ({ className = "h-4 w-4" }) => (
  <svg {...base({ className })}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
export const ArrowDown = ({ className = "h-4 w-4" }) => (
  <svg {...base({ className })}>
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);
export const Close = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Search = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);

export const ChevronLeft = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);
export const ChevronRight = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const ChevronDown = ({ className = "h-4 w-4" }) => (
  <svg {...base({ className })}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const Check = ({ className = "h-4 w-4" }) => (
  <svg {...base({ className, strokeWidth: 2 })}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);
export const Phone = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
export const MapPin = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);
export const Clock = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const Globe = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);
export const Sun = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
  </svg>
);
export const Camera = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4V8Z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);
export const Aperture = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <circle cx="12" cy="12" r="9" />
    <path d="m14.3 15 5.2-9M9.7 9 4.5 18M12 3v9M3.3 10h10.4M20.7 14H10.3M9.7 15l-5.2-9M14.3 9l5.2 9M12 12v9" />
  </svg>
);
export const Heart = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
  </svg>
);
export const Users = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4.5-6.2" />
  </svg>
);
export const Film = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
  </svg>
);
export const Sparkle = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
  </svg>
);
export const Mail = ({ className = "h-5 w-5" }) => (
  <svg {...base({ className })}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

// ---- Mạng xã hội (fill) ----
const brand = (className) => ({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
  className,
});
export const Facebook = ({ className = "h-4 w-4" }) => (
  <svg {...brand(className)}>
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" />
  </svg>
);
export const Instagram = ({ className = "h-4 w-4" }) => (
  <svg {...base({ className, strokeWidth: 1.8 })}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </svg>
);
export const Messenger = ({ className = "h-5 w-5" }) => (
  <svg {...brand(className)}>
    <path d="M12 2C6.5 2 2 6.1 2 11.3c0 2.9 1.4 5.5 3.7 7.2V22l3.4-1.9c.9.3 1.9.4 2.9.4 5.5 0 10-4.1 10-9.3S17.5 2 12 2Zm1 12.5-2.6-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7L13 14.5Z" />
  </svg>
);
export const WhatsApp = ({ className = "h-5 w-5" }) => (
  <svg {...brand(className)}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1 2.7 11.4 11.4 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z" />
  </svg>
);
export const Zalo = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 48 48" aria-hidden className={className}>
    <text
      x="24"
      y="31"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="700"
      fontSize="20"
      fill="currentColor"
    >
      Zalo
    </text>
  </svg>
);
