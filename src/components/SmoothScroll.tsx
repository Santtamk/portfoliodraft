"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { deferMotion, gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

/**
 * Section 2 — Lenis driven by the GSAP ticker so smoothing and ScrollTrigger
 * share one clock. Disabled entirely under reduced motion (Section 7.3), which
 * hands scrolling back to the browser.
 *
 * Set up off the hydration path: native scrolling works from the first frame,
 * and smoothing takes over a few frames later.
 */
export function SmoothScroll() {
  useEffect(
    () =>
      deferMotion(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        let lenis: Lenis | null = null;
        let raf: ((time: number) => void) | null = null;

        function start() {
          if (lenis) return;
          lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
          setLenis(lenis);
          lenis.on("scroll", ScrollTrigger.update);
          raf = (time: number) => lenis?.raf(time * 1000);
          gsap.ticker.add(raf);
          gsap.ticker.lagSmoothing(0);
        }

        function stop() {
          if (raf) gsap.ticker.remove(raf);
          lenis?.destroy();
          lenis = null;
          raf = null;
          setLenis(null);
        }

        if (!query.matches) start();

        const onChange = () => (query.matches ? stop() : start());
        query.addEventListener("change", onChange);

        // Late-loading webfonts change line heights; refresh once they settle.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        return () => {
          query.removeEventListener("change", onChange);
          stop();
        };
      }),
    [],
  );

  return null;
}
