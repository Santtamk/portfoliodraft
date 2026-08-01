"use client";

import { useRef } from "react";
import { deferMotion, FINE_POINTER, gsap, useGSAP } from "@/lib/gsap";

/**
 * Section 3.4 — a small marigold dot on fine-pointer devices only. It morphs to
 * "OPEN ↗" over anything marked `data-cursor="open"`. The native cursor is only
 * hidden once this replacement is live, and never on touch or reduced motion.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() =>
    deferMotion(() => {
      const media = gsap.matchMedia();

      media.add(FINE_POINTER, () => {
        const el = dot.current;
        const text = label.current;
        if (!el || !text) return;

        document.documentElement.classList.add("has-cursor");

        const toX = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
        const toY = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
        let shown = false;

        function onMove(event: PointerEvent) {
          if (!shown) {
            shown = true;
            gsap.to(el, { opacity: 1, duration: 0.3 });
            gsap.set(el, { x: event.clientX, y: event.clientY });
          }
          toX(event.clientX);
          toY(event.clientY);
        }

        function setState(state: "idle" | "hover" | "open") {
          if (!el || !text) return;
          if (state === "open") {
            gsap.to(el, {
              width: 92,
              height: 34,
              borderRadius: 2,
              duration: 0.3,
              ease: "power3.out",
              margin: "-17px 0 0 -46px",
            });
            gsap.to(text, { opacity: 1, duration: 0.2, delay: 0.05 });
            return;
          }
          gsap.to(text, { opacity: 0, duration: 0.15 });
          gsap.to(el, {
            width: state === "hover" ? 26 : 12,
            height: state === "hover" ? 26 : 12,
            borderRadius: 999,
            margin: state === "hover" ? "-13px 0 0 -13px" : "-6px 0 0 -6px",
            duration: 0.3,
            ease: "power3.out",
          });
        }

        function onOver(event: PointerEvent) {
          const target = event.target as Element | null;
          if (!target?.closest) return;
          if (target.closest('[data-cursor="open"]')) setState("open");
          else if (target.closest("a, button, [role='button']"))
            setState("hover");
          else setState("idle");
        }

        function onLeave() {
          gsap.to(el, { opacity: 0, duration: 0.2 });
          shown = false;
        }

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerover", onOver, { passive: true });
        document.addEventListener("pointerleave", onLeave);

        return () => {
          document.documentElement.classList.remove("has-cursor");
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerover", onOver);
          document.removeEventListener("pointerleave", onLeave);
          gsap.set(el, { opacity: 0 });
        };
      });

      return () => media.revert();
    }),
  );

  return (
    <div ref={dot} aria-hidden="true" className="cursor-dot">
      <span ref={label}>OPEN ↗</span>
    </div>
  );
}
