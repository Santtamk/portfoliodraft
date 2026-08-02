"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Kept short on purpose — Section 7.5 caps the preloader at 1s. */
const LINE = "making technology make sense";
const CHAR_MS = 18;

export const INTRO_DONE = "intro:done";

/**
 * Runs before the document paints, so the overlay is either there from the
 * first frame or never rendered at all. A crawler never executes this, so the
 * overlay stays `display:none` and the page is complete — Section 7.1.
 */
const GATE = `(function(){try{
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
if(sessionStorage.getItem('santam:intro')==='done')return;
document.documentElement.classList.add('is-intro');
}catch(e){}})();`;

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const finish = () => {
      html.classList.remove("is-intro");
      try {
        sessionStorage.setItem("santam:intro", "done");
      } catch {
        /* private mode — the intro just plays again next time */
      }
      window.dispatchEvent(new Event(INTRO_DONE));
    };

    if (!html.classList.contains("is-intro")) {
      // Not a first visit (or reduced motion): let the hero start immediately.
      window.dispatchEvent(new Event(INTRO_DONE));
      return;
    }

    const overlay = root.current;
    const target = line.current;
    if (!overlay || !target) {
      finish();
      return;
    }

    const typed = { count: 0 };
    const timeline = gsap.timeline({ onComplete: finish });

    timeline
      .fromTo(
        overlay.querySelectorAll("[data-intro-item]"),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 },
      )
      .to(
        typed,
        {
          count: LINE.length,
          duration: (LINE.length * CHAR_MS) / 1000,
          ease: "none",
          onUpdate: () => {
            target.textContent = LINE.slice(0, Math.round(typed.count));
          },
        },
        0.1,
      )
      .to(
        overlay,
        { opacity: 0, duration: 0.3, ease: "power3.inOut" },
        ">-0.05",
      )
      .set(overlay, { pointerEvents: "none" });

    return () => {
      timeline.kill();
      html.classList.remove("is-intro");
    };
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: GATE }} />
      <div
        ref={root}
        aria-hidden="true"
        className="preloader surface-pine grain fixed inset-0 z-[100] flex-col items-center justify-center gap-4"
      >
        <p
          data-intro-item
          className="text-4xl leading-none font-semibold tracking-[-0.04em]"
        >
          Santam
        </p>
        <p data-intro-item className="machine min-h-[1.5em]">
          <span ref={line} />
          <span className="ml-px inline-block w-[0.5em] animate-pulse bg-marigold align-[-0.1em] text-transparent">
            .
          </span>
        </p>
      </div>
    </>
  );
}
