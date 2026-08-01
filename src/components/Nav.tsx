"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/lenis";

const LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
] as const;

export function Nav() {
  const root = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [shownFor, setShownFor] = useState(pathname);

  // Close the overlay on navigation, including browser back/forward. Adjusted
  // during render rather than in an effect so the menu never paints open on the
  // new route.
  if (shownFor !== pathname) {
    setShownFor(pathname);
    setOpen(false);
  }

  // Section 4.1 — transparent over the hero, blurred hairline bar after 80px.
  useGSAP(
    () => {
      const bar = root.current;
      if (!bar) return;

      ScrollTrigger.create({
        start: 80,
        end: "max",
        onToggle: (self) => bar.classList.toggle("is-stuck", self.isActive),
      });
    },
    { scope: root },
  );

  // Overlay open/close — stagger in, focus trap, scroll lock.
  useEffect(() => {
    const panel = overlay.current;
    if (!panel) return;

    if (!open) {
      unlockScroll();
      return;
    }

    lockScroll();

    const items = panel.querySelectorAll<HTMLElement>("[data-menu-item]");
    const context = gsap.context(() => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      } else {
        gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.25 });
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.06,
            delay: 0.05,
            ease: "power4.out",
          },
        );
      }
    }, panel);

    const focusable = panel.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])",
    );
    focusable[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      context.revert();
      unlockScroll();
    };
  }, [open]);

  return (
    <>
      <header
        ref={root}
        data-nav
        className="group fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300 [&.is-stuck]:border-b-[var(--surface-line)] [&.is-stuck]:bg-[color-mix(in_srgb,var(--color-mist)_82%,transparent)] [&.is-stuck]:backdrop-blur-md"
      >
        <nav
          aria-label="Primary"
          className="shell flex h-[4.5rem] items-center justify-between gap-6"
        >
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-2xl leading-none tracking-tight"
          >
            Santam
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className="text-[0.9375rem] text-ink/80 transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="machine hidden items-center gap-2 sm:flex">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 rounded-full bg-marigold"
            />
            open for work
          </p>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="machine -mr-2 px-2 py-2 uppercase md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      {open ? (
        <div
          ref={overlay}
          id="mobile-menu"
          className="surface-pine grain fixed inset-0 z-[60] flex flex-col md:hidden"
        >
          <div className="shell flex h-[4.5rem] shrink-0 items-center justify-between">
            <Link
              href="/"
              className="font-[family-name:var(--font-display)] text-2xl leading-none tracking-tight text-mist"
              data-menu-item
            >
              Santam
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="machine -mr-2 px-2 py-2 uppercase"
            >
              Close
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="shell flex flex-1 flex-col justify-center"
          >
            <ul className="flex flex-col gap-6">
              {LINKS.map((link) => (
                <li key={link.href} data-menu-item>
                  <Link
                    href={link.href}
                    prefetch={false}
                    onClick={() => setOpen(false)}
                    className="display-2 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="machine shell flex shrink-0 items-center gap-2 pb-10">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 rounded-full bg-marigold"
            />
            open for work
          </p>
        </div>
      ) : null}
    </>
  );
}
