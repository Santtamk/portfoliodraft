"use client";

import { useRef } from "react";
import { deferMotion, FULL_MOTION, gsap, useGSAP } from "@/lib/gsap";

/** Section 5 — a hairline at the top of the viewport, scrubbed to scroll. */
export function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() =>
    deferMotion(() => {
      const media = gsap.matchMedia();

      media.add(FULL_MOTION, () => {
        const el = bar.current;
        const trigger = document.querySelector(target);
        if (!el || !trigger) return;

        gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
        const tween = gsap.to(el, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        });

        return () => tween.scrollTrigger?.kill();
      });

      return () => media.revert();
    }),
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px"
    >
      <div ref={bar} className="h-full w-full bg-marigold" />
    </div>
  );
}
