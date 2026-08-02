"use client";

import { useRef } from "react";
import { Eyebrow } from "@/components/ui";
import { WHAT_I_DO } from "@/lib/content";
import {
  deferMotion,
  FULL_MOTION,
  gsap,
  REDUCED_MOTION,
  useGSAP,
} from "@/lib/gsap";

export function WhatIDo() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () =>
      deferMotion(() => {
        const media = gsap.matchMedia();
        const q = gsap.utils.selector(root);

        media.add(FULL_MOTION, () => {
          const rules = q("[data-rule]");
          const bodies = q("[data-block-body]");

          gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(bodies, { opacity: 0, y: 24 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top 75%",
              once: true,
            },
          });

          timeline
            .to(rules, {
              scaleX: 1,
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.inOut",
            })
            .to(
              bodies,
              { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 },
              0.15,
            );

          return () => timeline.kill();
        });

        media.add(REDUCED_MOTION, () => {
          gsap.fromTo(
            q("[data-block-body]"),
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.2,
              scrollTrigger: {
                trigger: root.current,
                start: "top 85%",
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
    <section
      id="what-i-do"
      ref={root}
      className="section-y border-t border-ink/60"
      aria-labelledby="what-i-do-title"
    >
      <div className="shell">
        <Eyebrow>What I do</Eyebrow>

        <h2
          id="what-i-do-title"
          className="display-2 mt-6 max-w-[22ch] text-balance"
        >
          Most people come for a website. They stay for everything else.
        </h2>
      </div>

      {/* Chapter blocks — giant index + title left, description right. */}
      <ul className="mt-16 md:mt-24">
        {WHAT_I_DO.map((block) => (
          <li key={block.index} className="relative">
            <span
              data-rule
              aria-hidden="true"
              className="absolute inset-x-0 top-0 block h-px bg-ink/60"
            />
            <div
              data-block-body
              className="shell grid gap-6 py-10 md:py-14 lg:grid-cols-2 lg:gap-16"
            >
              <h3 className="metallic display-chapter max-w-[14ch]">
                {block.title}
              </h3>
              <p className="max-w-[52ch] self-end text-lg leading-relaxed text-ink/80 md:text-xl">
                {block.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
