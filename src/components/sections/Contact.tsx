"use client";

import { useRef } from "react";
import { Eyebrow } from "@/components/ui";
import {
  deferMotion,
  FINE_POINTER,
  FULL_MOTION,
  gsap,
  REDUCED_MOTION,
  useGSAP,
} from "@/lib/gsap";
import { splitLines } from "@/lib/split";
import { EMAIL, EMAIL_HREF, WHATSAPP_HREF } from "@/lib/site";

const MAGNET_RADIUS = 120;
const MAGNET_STRENGTH = 0.35;

export function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () =>
      deferMotion(() => {
        const media = gsap.matchMedia();
        const q = gsap.utils.selector(root);

        media.add(FULL_MOTION, () => {
          const heading = q("[data-contact-title]")[0] as
            HTMLElement | undefined;
          const rest = q("[data-contact-body]");
          const split = heading ? splitLines(heading) : null;

          if (split) gsap.set(split.words, { yPercent: 110 });
          gsap.set(rest, { opacity: 0, y: 20 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top 70%",
              once: true,
            },
          });

          timeline
            .to(split?.words ?? [], { yPercent: 0, duration: 1, stagger: 0.04 })
            .to(rest, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.35);

          return () => {
            timeline.kill();
            split?.revert();
          };
        });

        media.add(REDUCED_MOTION, () => {
          gsap.fromTo(
            q("[data-contact-title], [data-contact-body]"),
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.2,
              stagger: 0.02,
              scrollTrigger: {
                trigger: root.current,
                start: "top 85%",
                once: true,
              },
            },
          );
        });

        /* Magnetic CTA — Section 4.7. Off on touch and under reduced motion. */
        media.add(FINE_POINTER, () => {
          const button = q("[data-magnetic]")[0] as HTMLElement | undefined;
          if (!button) return;

          const toX = gsap.quickTo(button, "x", {
            duration: 0.4,
            ease: "power3",
          });
          const toY = gsap.quickTo(button, "y", {
            duration: 0.4,
            ease: "power3",
          });

          function onMove(event: PointerEvent) {
            if (!button) return;
            const rect = button.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = event.clientX - cx;
            const dy = event.clientY - cy;
            const distance = Math.hypot(dx, dy);

            if (distance > rect.width / 2 + MAGNET_RADIUS) {
              toX(0);
              toY(0);
              return;
            }
            toX(dx * MAGNET_STRENGTH);
            toY(dy * MAGNET_STRENGTH);
          }

          function reset() {
            toX(0);
            toY(0);
          }

          window.addEventListener("pointermove", onMove, { passive: true });
          window.addEventListener("blur", reset);

          return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("blur", reset);
            gsap.set(button, { x: 0, y: 0 });
          };
        });

        return () => media.revert();
      }),
    { scope: root },
  );

  return (
    <section
      id="contact"
      ref={root}
      className="surface-ink grain section-y"
      aria-labelledby="contact-title"
    >
      <div className="shell">
        <Eyebrow>{"// contact"}</Eyebrow>

        <h2
          id="contact-title"
          data-contact-title
          className="display-2 mt-6 max-w-[18ch] text-balance"
        >
          Have a project? Or a question you can&rsquo;t Google properly?
        </h2>

        <p data-contact-body className="mt-8 max-w-[52ch] text-lg text-mist/80">
          Message me on WhatsApp — it&rsquo;s the fastest way to reach me, and
          yes, it&rsquo;s really me replying.
        </p>

        <div data-contact-body className="mt-14">
          <a
            data-magnetic
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-4 rounded-[2px] bg-marigold px-10 py-6 text-2xl font-medium text-ink transition-colors duration-200 hover:bg-[#d1912c] focus-visible:outline-offset-4 md:px-16 md:py-9 md:text-4xl"
          >
            WhatsApp me <span aria-hidden="true">→</span>
          </a>
        </div>

        <p data-contact-body className="machine mt-12">
          <a
            href={EMAIL_HREF}
            className="underline decoration-[var(--surface-line)] underline-offset-4 transition-colors hover:text-mist"
          >
            {EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
}
