import { Fragment_Mono } from "next/font/google";
import localFont from "next/font/local";

/**
 * Two voices, per the stateofaidesign.com-style redesign:
 * one bold grotesque doing everything from 12px UI to viewport-width
 * wordmarks, and the mono "machine voice" for labels and annotations.
 * Switzer is self-hosted from Fontshare; Inter is the CSS fallback.
 */
export const body = localFont({
  src: [
    { path: "../fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
  variable: "--font-body",
  fallback: [
    "Inter",
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

/** Mono — the machine voice. Eyebrows, labels, annotations. */
export const mono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-mono",
});

export const fontVariables = `${body.variable} ${mono.variable}`;
