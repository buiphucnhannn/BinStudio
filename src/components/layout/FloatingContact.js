"use client";

import { useEffect, useState } from "react";
import { Messenger, Phone, WhatsApp, Zalo } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

// Cụm nút liên hệ nhanh: WhatsApp / Zalo / Messenger / Gọi — hiện sau khi cuộn qua nửa hero.
export default function FloatingContact({ site, ui }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    {
      href: site.whatsapp,
      label: ui.chatWhatsApp,
      Icon: WhatsApp,
      cls: "bg-[#25D366]",
      iconCls: "h-6 w-6",
    },
    { href: site.zalo, label: ui.chatZalo, Icon: Zalo, cls: "bg-[#0068FF]", iconCls: "h-7 w-7" },
    {
      href: site.messenger,
      label: ui.chatMessenger,
      Icon: Messenger,
      cls: "bg-[linear-gradient(135deg,#00B2FF_0%,#006AFF_100%)]",
      iconCls: "h-[22px] w-[22px]",
    },
    {
      href: `tel:${site.phoneIntl}`,
      label: `${ui.callNow} ${site.phone}`,
      Icon: Phone,
      cls: "bg-ink",
      iconCls: "h-5 w-5",
      tel: true,
      pulse: true,
    },
  ];

  return (
    <div
      className={cn(
        "pointer-events-none fixed right-3 bottom-3 z-40 flex flex-col gap-2 transition-all duration-500 sm:right-4 sm:bottom-4 sm:gap-2.5",
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
      )}
    >
      {items.map(({ href, label, Icon, cls, iconCls, tel, pulse }) => (
        <a
          key={label}
          href={href}
          target={tel ? undefined : "_blank"}
          rel={tel ? undefined : "noopener noreferrer"}
          aria-label={label}
          className="group pointer-events-none flex items-center justify-end gap-3"
        >
          <span className="pointer-events-none translate-x-2 rounded-full bg-ink px-3 py-1.5 text-xs whitespace-nowrap text-white opacity-0 shadow-card transition-all group-hover:translate-x-0 group-hover:opacity-100">
            {label}
          </span>
          <span className="relative flex h-11 w-11 items-center justify-center">
            {pulse && (
              <span
                className="pointer-events-none absolute inset-0 [animation:ripple_3s_ease-out_infinite] rounded-full bg-ink/50"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-full text-white shadow-soft transition-transform group-hover:scale-105",
                show && "pointer-events-auto",
                cls,
              )}
            >
              <Icon className={iconCls} />
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
