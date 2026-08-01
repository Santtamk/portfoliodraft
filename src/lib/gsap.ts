"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power4.out", duration: 0.9 });
}

/** Section 7.4 — one easing family site-wide. */
export const EASE_IN = "power4.out";
export const EASE_MOVE = "power3.inOut";

/** Matches the CSS `prefers-reduced-motion` query used by gsap.matchMedia. */
export const FULL_MOTION = "(prefers-reduced-motion: no-preference)";
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/** Hover-capable pointers only — cursor, magnetic buttons, hover previews. */
export const FINE_POINTER =
  "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)";
export const DESKTOP =
  "(prefers-reduced-motion: no-preference) and (min-width: 1024px)";

/**
 * Defers motion setup until the main thread is free.
 *
 * Building every section's triggers during hydration is what pushes Total
 * Blocking Time over budget (Section 9): splitting text forces layout, and each
 * ScrollTrigger measures the document. Only the hero needs to be ready on the
 * first frame — everything else is below the fold, so its hidden states can be
 * applied a few frames later with no visible difference. If the visitor somehow
 * scrolls there first, they simply see the finished section.
 *
 * Returns a cleanup that cancels the pending callback and disposes whatever the
 * setup created, so it drops straight into a `useGSAP` body.
 */
export function deferMotion(setup: () => (() => void) | void) {
  let dispose: (() => void) | void;
  let cancelled = false;

  const run = () => {
    if (!cancelled) dispose = setup();
  };

  const idle = typeof window !== "undefined" && "requestIdleCallback" in window;
  const handle = idle
    ? window.requestIdleCallback(run, { timeout: 600 })
    : window.setTimeout(run, 120);

  return () => {
    cancelled = true;
    if (idle) window.cancelIdleCallback(handle);
    else window.clearTimeout(handle);
    dispose?.();
  };
}

export { gsap, ScrollTrigger, useGSAP };
