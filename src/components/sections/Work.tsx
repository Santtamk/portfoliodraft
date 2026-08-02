"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Eyebrow, PlaceholderFrame } from "@/components/ui";
import { PROJECTS } from "@/lib/content";
import {
  deferMotion,
  FINE_POINTER,
  FULL_MOTION,
  gsap,
  useGSAP,
} from "@/lib/gsap";

const PREVIEW_SIZES = "(min-width: 1024px) 420px, 100vw";

export function Work() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);

  useGSAP(
    () =>
      deferMotion(() => {
        const media = gsap.matchMedia();
        const q = gsap.utils.selector(root);

        /* Desktop — a floating preview that trails the cursor (Section 4.4). */
        media.add(FINE_POINTER, () => {
          const box = preview.current;
          const rows = q("[data-row]") as HTMLElement[];
          if (!box || rows.length === 0) return;

          const panes = Array.from(
            box.querySelectorAll<HTMLElement>("[data-pane]"),
          );
          const toX = gsap.quickTo(box, "x", { duration: 0.4, ease: "power3" });
          const toY = gsap.quickTo(box, "y", { duration: 0.4, ease: "power3" });
          const setSkew = gsap.quickSetter(box, "skewX", "deg");

          let pointerX = 0;
          let previousX = 0;
          let skew = 0;
          let active = -1;

          function onMove(event: PointerEvent) {
            pointerX = event.clientX;
            toX(event.clientX + 28);
            toY(event.clientY - 120);
          }

          // Velocity-driven skew, clamped to ±6deg and decaying to 0 when idle.
          function onTick() {
            const delta = pointerX - previousX;
            previousX = pointerX;
            const target = gsap.utils.clamp(-6, 6, delta * 0.4);
            skew = gsap.utils.interpolate(skew, target, 0.12);
            setSkew(skew);
          }

          function show(index: number) {
            if (active === index) return;
            active = index;
            panes.forEach((pane, i) =>
              gsap.to(pane, {
                autoAlpha: i === index ? 1 : 0,
                duration: 0.25,
                overwrite: true,
              }),
            );
            gsap.to(box, { autoAlpha: 1, scale: 1, duration: 0.35 });
          }

          function hide() {
            active = -1;
            gsap.to(box, { autoAlpha: 0, scale: 0.96, duration: 0.3 });
          }

          gsap.set(box, { autoAlpha: 0, scale: 0.96 });
          gsap.set(panes, { autoAlpha: 0 });

          const cleanups = rows.map((row, index) => {
            const title = row.querySelector("[data-row-title]");
            const onEnter = () => {
              show(index);
              gsap.to(title, { x: 12, duration: 0.5, ease: "power3.out" });
            };
            const onLeave = () => {
              hide();
              gsap.to(title, { x: 0, duration: 0.5, ease: "power3.out" });
            };
            row.addEventListener("pointerenter", onEnter);
            row.addEventListener("pointerleave", onLeave);
            return () => {
              row.removeEventListener("pointerenter", onEnter);
              row.removeEventListener("pointerleave", onLeave);
            };
          });

          // Scrolling moves the rows out from under a stationary cursor
          // without firing pointerleave, which would strand the preview.
          function onScroll() {
            if (active === -1) return;
            hide();
            gsap.to(q("[data-row-title]"), {
              x: 0,
              duration: 0.5,
              ease: "power3.out",
            });
          }

          window.addEventListener("pointermove", onMove, { passive: true });
          window.addEventListener("scroll", onScroll, { passive: true });
          gsap.ticker.add(onTick);

          return () => {
            cleanups.forEach((fn) => fn());
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("scroll", onScroll);
            gsap.ticker.remove(onTick);
          };
        });

        /* Rows reveal on scroll, on every device. */
        media.add(FULL_MOTION, () => {
          const rows = q("[data-row-shell]") as HTMLElement[];
          gsap.set(rows, { opacity: 0, y: 28 });
          const triggers = rows.map((row) =>
            gsap.to(row, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              scrollTrigger: { trigger: row, start: "top 85%", once: true },
            }),
          );

          /* Touch — mild parallax on the inline images (Section 4.4). */
          const images = q("[data-inline-image]") as HTMLElement[];
          // Stays inside the overscan the frame leaves (±8.1%).
          const parallax = images.map((image) =>
            gsap.fromTo(
              image,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: {
                  trigger: image,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            ),
          );

          return () => {
            triggers.forEach((t) => t.kill());
            parallax.forEach((t) => t.scrollTrigger?.kill());
          };
        });
        return () => media.revert();
      }),
    { scope: root },
  );

  return (
    <section
      id="work"
      ref={root}
      className="section-y border-t border-ink/60"
      aria-labelledby="work-title"
    >
      <div className="shell">
        <Eyebrow>Selected work</Eyebrow>
        <h2 id="work-title" className="display-2 mt-6 max-w-[16ch]">
          No jargon. Just look at them.
        </h2>

        <ul className="mt-14 md:mt-20">
          {PROJECTS.map((project) => (
            <li
              key={project.slug}
              data-row-shell
              className="border-t border-ink/60 last:border-b last:border-ink/60"
            >
              {/* Inline image — the touch/narrow treatment. */}
              <div className="pt-8 lg:hidden">
                {project.card ? (
                  <div className="relative aspect-[16/8.6] w-full overflow-hidden bg-[color-mix(in_srgb,var(--color-pine)_6%,var(--surface))]">
                    <div data-inline-image className="absolute inset-0">
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                        <Image
                          src={project.card.src}
                          alt={project.card.alt}
                          width={project.card.width}
                          height={project.card.height}
                          sizes={PREVIEW_SIZES}
                          className="h-auto w-full"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <PlaceholderFrame
                    label={`${project.name} · case study`}
                    className="w-full"
                  />
                )}
              </div>

              <div
                data-row
                className="group grid items-baseline gap-x-8 gap-y-3 py-8 md:py-10 lg:grid-cols-[1fr_auto]"
              >
                <div>
                  <Link
                    href={`/works/${project.slug}`}
                    data-cursor="open"
                    className="block"
                  >
                    <h3
                      data-row-title
                      className="display-2 inline-block transition-colors group-hover:text-marigold"
                    >
                      {project.name}
                    </h3>
                    <p className="mt-4 max-w-[46ch] text-ink/75">
                      {project.oneLiner}
                    </p>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:flex-col lg:items-end lg:gap-3">
                  <p className="machine">{project.category}</p>
                  {project.live ? (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener"
                      className="machine underline decoration-[var(--surface-line)] underline-offset-4 transition-colors hover:text-ink"
                    >
                      Visit site ↗
                    </a>
                  ) : (
                    <p className="machine">Case study</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating hover preview — desktop only, decorative. */}
      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-40 hidden w-[420px] lg:block"
      >
        {PROJECTS.map((project) => (
          <div
            key={project.slug}
            data-pane
            className="absolute inset-x-0 top-0"
          >
            {project.card ? (
              <Image
                src={project.card.src}
                alt=""
                width={project.card.width}
                height={project.card.height}
                sizes={PREVIEW_SIZES}
                className="h-auto w-full shadow-2xl"
              />
            ) : (
              <PlaceholderFrame
                label={`${project.name} · case study`}
                className="w-full shadow-2xl"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
