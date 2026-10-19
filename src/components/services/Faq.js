"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Pic from "@/components/ui/Pic";
import { ChevronDown } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

// FAQ dạng accordion (mở 1 mục), bên phải 2 polaroid.
export default function Faq({ faq }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-sand-100 py-16 lg:py-24">
      <Container wide className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
        <div>
          <p className="reveal eyebrow">{faq.eyebrow}</p>
          <h2
            className="reveal mt-4 h-display text-[2rem] sm:text-[2.6rem]"
            style={{ "--reveal-delay": "80ms" }}
          >
            {faq.title}
          </h2>
          <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {faq.items.map((item, i) => {
              const on = open === i;
              return (
                <li
                  key={item.q}
                  className="reveal"
                  style={{ "--reveal-delay": `${150 + i * 60}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(on ? -1 : i)}
                    aria-expanded={on}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span
                      className={cn(
                        "font-serif text-xl transition-colors sm:text-[1.35rem]",
                        on ? "text-ink" : "text-ink/70",
                      )}
                    >
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition",
                        on ? "rotate-180 border-ink bg-ink text-white" : "border-ink/15 text-ink",
                      )}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                      on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 text-[14.5px] leading-relaxed text-ink-soft">{item.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          {faq.polaroids.map((p, i) => (
            <div
              key={p.src}
              className={cn(
                "reveal absolute w-[58%] max-w-[280px] polaroid",
                i === 0 ? "top-[8%] left-0 -rotate-6" : "right-0 bottom-[8%] rotate-[5deg]",
              )}
              data-reveal="scale"
              style={{ "--reveal-delay": `${200 + i * 150}ms` }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Pic
                  src={p.src}
                  alt=""
                  fill
                  sizes="280px"
                  className="object-cover"
                  style={{ objectPosition: p.pos }}
                />
              </div>
              <p className="mt-2 text-center font-serif text-base text-ink-soft italic">
                {p.caption}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
