"use client";

import { useRef } from "react";
import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";

/**
 * Section 7.5 — page transitions. A template remounts on every navigation, so
 * incoming content just plays a short entrance. No curtain, no preloader,
 * nothing that could delay content.
 *
 * The first mount is deliberately skipped: on a cold load the hero owns the
 * entrance, and wrapping the tree in a transform would break `position: fixed`
 * descendants (the work-section hover preview).
 */
let mounted = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!mounted) {
        mounted = true;
        return;
      }

      getLenis()?.scrollTo(0, { immediate: true });

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const tween = reduced
        ? gsap.fromTo(
            root.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.2 },
          )
        : gsap.fromTo(
            root.current,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: "power3.inOut",
              onComplete: () => {
                gsap.set(root.current, { clearProps: "all" });
                ScrollTrigger.refresh();
              },
            },
          );

      return () => tween.kill();
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
