"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}

/** Used by the overlay menu — Section 4.1. */
export function lockScroll() {
  instance?.stop();
  document.documentElement.classList.add("lenis-stopped");
  document.body.style.overflow = "hidden";
}

export function unlockScroll() {
  instance?.start();
  document.documentElement.classList.remove("lenis-stopped");
  document.body.style.overflow = "";
}
