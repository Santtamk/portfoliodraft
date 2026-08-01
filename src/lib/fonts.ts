import { Fragment_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

/** Display — the human voice. H1/H2 only. */
export const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

/**
 * Mono — the machine voice. Eyebrows, labels, annotations. Single weight: every
 * mono use on the site is regular, and the same static TTF renders the OG cards.
 */
export const mono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-mono",
});

/**
 * Body — Switzer, self-hosted from Fontshare. Inter is the CSS fallback.
 * Two weights only: every font file is preloaded on every route, so a third
 * weight costs a request on the critical path for very little typographic gain.
 */
export const body = localFont({
  src: [
    { path: "../fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
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

export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
