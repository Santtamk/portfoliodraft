"use client";

import { useRef } from "react";
import {
  deferMotion,
  FULL_MOTION,
  gsap,
  REDUCED_MOTION,
  useGSAP,
} from "@/lib/gsap";
import { splitLines } from "@/lib/split";
import { CLIENT_NAME } from "@/lib/site";

export function Testimonial() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () =>
      deferMotion(() => {
        const media = gsap.matchMedia();
        const q = gsap.utils.selector(root);

        media.add(FULL_MOTION, () => {
          const quote = q("[data-quote]")[0] as HTMLElement | undefined;
          const marks = Array.from(
            root.current?.querySelectorAll<SVGPathElement>(
              "[data-mark] path",
            ) ?? [],
          );
          const attribution = q("[data-attribution]");
          const split = quote ? splitLines(quote) : null;

          marks.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
          });
          if (split) gsap.set(split.words, { yPercent: 110 });
          gsap.set(attribution, { opacity: 0 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top 70%",
              once: true,
            },
          });

          timeline
            .to(marks, {
              strokeDashoffset: 0,
              duration: 1,
              stagger: 0.1,
              ease: "power3.inOut",
            })
            .to(
              split?.words ?? [],
              { yPercent: 0, duration: 1, stagger: 0.03 },
              0.25,
            )
            .to(attribution, { opacity: 1, duration: 0.6 }, 0.8);

          return () => {
            timeline.kill();
            split?.revert();
          };
        });

        media.add(REDUCED_MOTION, () => {
          gsap.fromTo(
            q("[data-quote], [data-attribution]"),
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
      id="testimonial"
      ref={root}
      className="section-y border-t border-hairline"
      aria-label="Client testimonial"
    >
      <figure className="shell flex flex-col items-center text-center">
        <svg
          data-mark
          aria-hidden="true"
          viewBox="0 0 48 30"
          className="h-9 w-14 text-marigold"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        >
          <path d="M20 3C11 6 4.5 12 4.5 19.5c0 3.6 2.7 6.2 6.2 6.2s6.2-2.6 6.2-6.2-2.7-6.2-6.2-6.2c-3 0-5.2 1.6-6.2 4.2" />
          <path
            d="M20 3C11 6 4.5 12 4.5 19.5c0 3.6 2.7 6.2 6.2 6.2s6.2-2.6 6.2-6.2-2.7-6.2-6.2-6.2c-3 0-5.2 1.6-6.2 4.2"
            transform="translate(23 0)"
          />
        </svg>

        <blockquote className="mt-10">
          <p data-quote className="display-2 mx-auto max-w-[30ch] text-balance">
            &ldquo;Thanks for the work. It&rsquo;s come out lovely.&rdquo;
          </p>
        </blockquote>

        <figcaption data-attribution className="machine mt-10">
          — {CLIENT_NAME}, Kalimpong Bungalow
        </figcaption>
      </figure>
    </section>
  );
}
