"use client";

import { useRef, type ReactNode } from "react";
import {
  deferMotion,
  FULL_MOTION,
  gsap,
  REDUCED_MOTION,
  useGSAP,
} from "@/lib/gsap";

/**
 * Generic fade-up on enter. Hidden state is set after hydration, so the
 * server-rendered page is already complete (Section 7.1).
 */
export function Reveal({
  children,
  className = "",
  stagger = 0.08,
  start = "top 80%",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  start?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () =>
      deferMotion(() => {
        const targets = root.current?.children;
        if (!targets?.length) return;
        const media = gsap.matchMedia();

        media.add(FULL_MOTION, () => {
          gsap.set(targets, { opacity: 0, y: 24 });
          const tween = gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger,
            scrollTrigger: { trigger: root.current, start, once: true },
          });
          return () => tween.scrollTrigger?.kill();
        });

        media.add(REDUCED_MOTION, () => {
          gsap.fromTo(
            targets,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.2,
              scrollTrigger: {
                trigger: root.current,
                start: "top 90%",
                once: true,
              },
            },
          );
        });

        return () => media.revert();
      }),
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}

/**
 * Scrubbed vertical drift for case-study imagery (Section 6).
 *
 * The caller owns the framing: an `overflow-hidden` parent, and enough vertical
 * overscan on this element that the drift never exposes an edge. Nothing is
 * scaled here, so a screenshot is never cropped horizontally.
 */
export function Parallax({
  children,
  amount = 10,
  className = "",
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () =>
      deferMotion(() => {
        const media = gsap.matchMedia();

        media.add(FULL_MOTION, () => {
          const el = root.current;
          if (!el) return;
          const tween = gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
          return () => {
            tween.scrollTrigger?.kill();
            gsap.set(el, { clearProps: "transform" });
          };
        });

        return () => media.revert();
      }),
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
