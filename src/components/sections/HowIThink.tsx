"use client";

import Link from "next/link";
import { Fragment, useRef, type ReactNode } from "react";
import { Eyebrow } from "@/components/ui";
import { HOW_I_THINK } from "@/lib/content";
import { deferMotion, DESKTOP, FULL_MOTION, gsap, useGSAP } from "@/lib/gsap";

/** Sets the one emphasised word of a statement in display italic. */
function withEmphasis(text: string, emphasis?: string): ReactNode {
  if (!emphasis) return text;
  const at = text.indexOf(emphasis);
  if (at === -1) return text;
  return (
    <Fragment>
      {text.slice(0, at)}
      <em>{emphasis}</em>
      {text.slice(at + emphasis.length)}
    </Fragment>
  );
}

export function HowIThink() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () =>
      deferMotion(() => {
        const media = gsap.matchMedia();
        const q = gsap.utils.selector(root);

        /* "Reading light" — each line lifts as it crosses the upper viewport. */
        media.add(FULL_MOTION, () => {
          const lines = q("[data-statement]") as HTMLElement[];
          // 0.45 floor: mist blended over pine at 0.45 keeps ~3.5:1 contrast
          // (large-text AA) for statements waiting below the reading light.
          gsap.set(lines, { opacity: 0.45, y: 20 });

          const tweens = lines.map((line) =>
            gsap.to(line, {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: line,
                start: "top 80%",
                end: "top 45%",
                scrub: 0.5,
              },
            }),
          );

          return () => tweens.forEach((tween) => tween.scrollTrigger?.kill());
        });

        /* Signature interaction — the machine translation, desktop only. */
        media.add(DESKTOP, () => {
          const items = q("[data-statement]") as HTMLElement[];

          const cleanups = items.map((item) => {
            const note = item.querySelector<HTMLElement>("[data-translation]");
            if (!note) return () => {};

            gsap.set(note, { height: 0, opacity: 0, overflow: "hidden" });

            const open = () =>
              gsap.to(note, {
                height: "auto",
                opacity: 1,
                duration: 0.3,
                ease: "power3.out",
              });
            const close = () =>
              gsap.to(note, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power3.out",
              });

            item.addEventListener("pointerenter", open);
            item.addEventListener("pointerleave", close);
            item.addEventListener("focusin", open);
            item.addEventListener("focusout", close);

            return () => {
              item.removeEventListener("pointerenter", open);
              item.removeEventListener("pointerleave", close);
              item.removeEventListener("focusin", open);
              item.removeEventListener("focusout", close);
              gsap.set(note, { clearProps: "all" });
            };
          });

          return () => cleanups.forEach((fn) => fn());
        });

        return () => media.revert();
      }),
    { scope: root },
  );

  return (
    <section
      id="how-i-think"
      ref={root}
      className="surface-pine grain section-y"
      aria-labelledby="how-i-think-title"
    >
      <div className="shell">
        <Eyebrow>How I think</Eyebrow>
        <h2 id="how-i-think-title" className="display-2 mt-6 max-w-[16ch]">
          I stay current so you don&rsquo;t have to.
        </h2>

        <ul className="mt-16 flex flex-col gap-12 md:mt-24 md:gap-16">
          {HOW_I_THINK.map((statement) => (
            <li
              key={statement.machine}
              data-statement
              className="max-w-[30ch] text-[clamp(1.35rem,2.9vw,2.3rem)] leading-[1.12] font-semibold tracking-[-0.03em] md:max-w-[34ch]"
            >
              {statement.href ? (
                <Link
                  href={statement.href}
                  /* A hairline rather than a rule: this statement spans six
                     lines, and a full-strength underline on each one drowns
                     out a section the spec asks to keep quiet. */
                  className="underline decoration-[color-mix(in_srgb,var(--color-marigold)_28%,transparent)] decoration-1 underline-offset-[10px] transition-colors hover:decoration-marigold"
                >
                  {withEmphasis(statement.text, statement.emphasis)}
                </Link>
              ) : (
                withEmphasis(statement.text, statement.emphasis)
              )}

              <span
                data-translation
                aria-hidden="true"
                className="machine block"
              >
                <span className="block pt-4">{statement.machine}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
