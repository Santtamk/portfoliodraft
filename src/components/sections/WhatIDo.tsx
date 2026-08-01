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
      className="section-y border-t border-hairline"
      aria-labelledby="what-i-do-title"
    >
      <div className="shell">
        <Eyebrow>{"// what-i-do"}</Eyebrow>

        <h2
          id="what-i-do-title"
          className="display-2 mt-6 max-w-[20ch] text-balance"
        >
          Most people come for a website. They stay for everything else.
        </h2>

        <ul className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-8">
          {WHAT_I_DO.map((block) => (
            <li key={block.index}>
              <span
                data-rule
                aria-hidden="true"
                className="block h-px w-full bg-[var(--surface-line)]"
              />
              <div data-block-body className="pt-6">
                <p className="machine" aria-hidden="true">
                  {block.index}
                </p>
                <h3 className="mt-3 text-xl font-medium tracking-tight md:text-2xl">
                  {block.title}
                </h3>
                <p className="mt-4 text-ink/80">{block.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
