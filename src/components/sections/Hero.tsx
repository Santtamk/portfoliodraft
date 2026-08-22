"use client";

import { useRef } from "react";
import { BarLink } from "@/components/ui";
import { INTRO_DONE } from "@/components/Preloader";
import { MACHINE_VOICE_LINE } from "@/lib/content";
import { FULL_MOTION, REDUCED_MOTION, gsap, useGSAP } from "@/lib/gsap";
import { splitLines } from "@/lib/split";
import { WHATSAPP_HREF } from "@/lib/site";

const CHAR_MS = 25;

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      const eyebrow = q("[data-hero='eyebrow']");
      const heading = q("[data-hero='h1']")[0] as HTMLElement | undefined;
      const machine = q("[data-hero='machine']")[0] as HTMLElement | undefined;
      const tail = q("[data-hero='sub'], [data-hero='cta']");

      /** Section 4.2 — the whole entrance runs once, after the intro gate. */
      function afterIntro(play: () => void) {
        if (document.documentElement.classList.contains("is-intro")) {
          window.addEventListener(INTRO_DONE, play, { once: true });
          return () => window.removeEventListener(INTRO_DONE, play);
        }
        play();
        return () => {};
      }

      media.add(FULL_MOTION, () => {
        const split = heading ? splitLines(heading) : null;
        const full = machine?.textContent ?? "";

        // Hidden states are set here, after hydration — never in CSS. A crawler
        // or a JS-disabled visitor gets the finished page (Section 7.1).
        gsap.set(eyebrow, { opacity: 0, y: 16 });
        gsap.set(tail, { opacity: 0, y: 20 });
        if (split) gsap.set(split.words, { yPercent: 110 });
        if (machine) machine.textContent = "";

        let cleanupIntro = () => {};
        const timeline = gsap.timeline({ paused: true });

        timeline
          .to(eyebrow, { opacity: 1, y: 0, duration: 0.4 })
          .to(
            split?.words ?? [],
            {
              yPercent: 0,
              duration: 1,
              stagger: 0.04,
              ease: "power4.out",
              onComplete: () =>
                gsap.set(split?.words ?? [], { clearProps: "will-change" }),
            },
            0.25,
          )
          // Typing runs alongside the tail so the orchestrated entrance still
          // lands inside the 1.6s budget while keeping 25ms/char.
          .to(
            { count: 0 },
            {
              count: full.length,
              duration: (full.length * CHAR_MS) / 1000,
              ease: "none",
              onUpdate() {
                const value = this.targets()[0] as { count: number };
                if (machine)
                  machine.textContent = full.slice(0, Math.round(value.count));
              },
            },
            0.95,
          )
          .to(tail, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 1.05);

        cleanupIntro = afterIntro(() => timeline.play());

        return () => {
          cleanupIntro();
          timeline.kill();
          split?.revert();
          if (machine) machine.textContent = full;
        };
      });

      media.add(REDUCED_MOTION, () => {
        gsap.fromTo(
          q("[data-hero]"),
          { opacity: 0 },
          { opacity: 1, duration: 0.2, stagger: 0.02 },
        );
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="hero"
      ref={root}
      className="relative isolate overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div
        aria-hidden="true"
        className="hero-tint pointer-events-none absolute inset-0 -z-10"
      />

      <div className="flex min-h-svh flex-col pt-14 md:pt-16">
        <div className="shell flex flex-1 flex-col justify-center py-16">
          <p
            data-hero="eyebrow"
            className="eyebrow border-t border-ink/60 pt-4"
          >
            Kalimpong, India · Technology, Research &amp; Digital Delivery
          </p>

          {/* Fills the shell width, reference-style: one heavy grotesque. */}
          <h1
            id="hero-title"
            data-hero="h1"
            className="metallic mt-10 text-[clamp(2.9rem,10.4vw,9.75rem)] leading-[0.92] font-semibold tracking-[-0.055em] md:mt-14"
          >
            I turn messy problems into practical digital <em>solutions</em>.
          </h1>

          <p
            data-hero="machine"
            aria-hidden="true"
            className="machine mt-8 max-w-full break-words md:mt-10"
          >
            {MACHINE_VOICE_LINE}
          </p>
        </div>

        <div className="shell pb-10">
          <div className="grid items-start gap-8 border-t border-ink/60 pt-8 lg:grid-cols-2 lg:gap-16">
            <p
              data-hero="sub"
              className="max-w-[52ch] text-lg leading-relaxed text-ink/80 md:text-xl"
            >
              I work across websites, digital tools, research, and client
              projects—understanding the problem, figuring out the right
              approach, and helping turn ideas into something useful.
            </p>

            <div data-hero="cta" className="flex flex-col gap-2">
              <BarLink
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener"
                variant="marigold"
              >
                WhatsApp me
              </BarLink>
              <BarLink href="/#work" variant="ghost" arrow="↓">
                See my work
              </BarLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
