# Santam Kumai — Portfolio

Built to `PORTFOLIO-MASTER-SPEC.md`. Next.js 16 (App Router) · TypeScript · Tailwind v4 · GSAP · Lenis. Every route is statically generated; there is no CMS, no backend, and no contact form.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

---

## Before you ship

Everything the spec marks as a placeholder lives in one file: [src/lib/site.ts](src/lib/site.ts). Nothing else needs editing.

**Two values are still placeholders and must be set:**

| Constant | Current value | What to do |
|---|---|---|
| `WHATSAPP` | `919800000000` | **Required.** Santam's real number, country code first, digits only. Every CTA on the site and the `wa.me` link in `/llms.txt` are built from this. |
| `DOMAIN` | `santam.dev` | **Required.** The production domain, no protocol. Drives canonicals, OG URLs, JSON-LD, `sitemap.xml`, `robots.txt`, and `llms.txt`. |

**Values that were filled in and are worth confirming:**

| Constant | Current value | Note |
|---|---|---|
| `EMAIL` | `team@1947.io` | Rendered as a real, visible `mailto:` link in the Contact section and in `Person` schema. Change it if a different public address is wanted. |
| `GITHUB` | `https://github.com/santamkumai` | Verify the handle. Appears in the footer and in `sameAs`. |
| `LINKEDIN` | *(empty)* | Optional. Empty means it's omitted everywhere — footer link and `sameAs` entry both disappear. Add the URL to switch it on. |
| `CLIENT_NAME` | `Client` | Renders as "— Client, Kalimpong Bungalow". Replace with the client's name once they confirm permission to be named. |
| `PHOTO` | *(empty)* | Optional portrait for `/about`. Empty means the portrait block is skipped entirely. Drop a file in `public/`, set the path, and the grayscale→colour block appears. |

Run the guard any time:

```bash
npm run check:placeholders
```

It fails while `WHATSAPP` or `DOMAIN` is still a sentinel, and greps `src/` and `public/` for any surviving `[TOKEN]` literal.

---

## Pointing the domain at Vercel

1. **Get the domain.** The GitHub Student Developer Pack has historically included a free `.dev` for the first year via Name.com. **Verify the current offer before relying on it** — the terms have changed more than once, and renewal is always paid. If it's gone, any registrar works.
2. **Deploy.** Import the repo into Vercel. No environment variables are needed; the build is fully static.
3. **Add the domain** in Vercel → Project → Settings → Domains, then set the DNS records Vercel shows you at the registrar (an `A` record for the apex, `CNAME` for `www`). `.dev` is on the HSTS preload list, so it is HTTPS-only — Vercel provisions the certificate automatically.
4. **Set `DOMAIN` in `src/lib/site.ts` and redeploy.** Canonicals and schema are built at build time, so they only pick up the real domain on a rebuild.

## Retiring the old deployment

The previous portfolio at `portfolio-murex-five-79.vercel.app` should be redirected, not deleted — anything already linking to it keeps working, and the link equity transfers.

In the **old** project (not this one), add a `vercel.json`:

```json
{
  "redirects": [
    { "source": "/:path*", "destination": "https://YOUR-DOMAIN/:path*", "permanent": true }
  ]
}
```

`"permanent": true` emits a 301. Redeploy the old project once; leave it in place. If you would rather not keep the old project alive, transfer the `portfolio-murex-five-79.vercel.app` domain onto this project instead and let Vercel handle the redirect.

---

## How the site is put together

```
src/
  app/                       routes; every page is a server component
    page.tsx                 home — composes the six sections
    about/ writing/ works/   about, article index + article, three case pages
    llms.txt/route.ts        generated so the domain lives in one place
    robots.ts sitemap.ts     Next metadata conventions
    opengraph-image.tsx      one per route — 1200×630 via next/og
    template.tsx             page transition (skipped on first mount)
  components/
    sections/                the six home sections
    motion.tsx               Reveal + Parallax primitives
    Nav Footer Cursor        shell
    Preloader SmoothScroll   first-visit intro, Lenis
  lib/
    site.ts                  all Section 0 placeholders
    content.ts               all reused copy and project data
    schema.ts                JSON-LD
    split.ts                 text splitting
    gsap.ts                  plugin registry, media queries, deferMotion
```

### The rules that shape the code

**Content is never created by JavaScript.** Every word is in the server-rendered HTML. Animations only ever set hidden states *after* hydration (`gsap.set` inside `useGSAP`), so a crawler or a visitor with JS disabled gets the complete page. This is Section 7.1 of the spec and the reason the article in `/writing` can honestly claim the site is built the way it describes.

**Split text keeps an intact copy.** [src/lib/split.ts](src/lib/split.ts) rebuilds a heading into per-line masks and per-word spans, marks that copy `aria-hidden`, and leaves the original untouched in an `sr-only` sibling. Screen readers read the original; the animation drives the duplicate.

**Motion is deferred except in the hero.** `deferMotion` in [src/lib/gsap.ts](src/lib/gsap.ts) runs each section's setup on an idle callback. Building every ScrollTrigger during hydration cost ~390ms of blocking time; below-the-fold sections have no visible difference when set up a few frames later.

**Reduced motion is a real branch, not a dimmer.** Everything is inside `gsap.matchMedia()`. Under `prefers-reduced-motion: reduce` there is no Lenis, no custom cursor, no magnetic button, no hover previews, no scrub — just 0.2s opacity fades.

---

## QA

Run against a production build (`npm run build && npm start`), then:

```bash
npm run qa                # all four suites
npm run check:crawl       # Section 8 — copy in HTML, schema, llms/robots/sitemap
npm run qa:layout         # 360/768/1440, JS disabled, reduced motion, keyboard
npm run qa:motion         # hero typing, scrub reveals, hover preview, magnetic CTA, menu
npm run qa:budgets        # axe + Lighthouse + first-load JS
```

Screenshots and Lighthouse reports land in `.qa/` (git-ignored).

`npm run capture:screens` re-captures the live project sites at 1440px and 390px into `public/work/`. It skips any site it cannot reach, so a failed capture never replaces a good screenshot with a broken image.

### Where things stand

Measured locally against `npm start` (Lighthouse mobile, **devtools** throttling — see the note below):

| Route | Perf | A11y | SEO | Best pr. | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 84 | 100 | 100 | 100 | 2183ms | 0.003 | 360ms |
| `/writing/when-ai-…` | 91 | 100 | 100 | 100 | 1960ms | 0.001 | 220ms |
| `/works/kalimpong-bungalow` | 90 | 100 | 100 | 100 | 2197ms | 0.001 | 221ms |
| `/about` | 92 | 100 | 100 | 100 | 1863ms | 0.001 | 189ms |
| `/writing` | 92 | 100 | 100 | 100 | 1862ms | 0.001 | 183ms |

First-load JS: **83KB** (budget 200KB). axe: **zero violations** on every route. Crawlability, layout, and motion suites: **all passing**.

**The home page is 84 against a gate of 90 and is the one open item.** The cost is the shared shell — React hydration plus GSAP — not the sections: a home page rendering *only* the hero still measures 88/275ms, so removing content buys almost nothing. Cutting further would mean removing the hero's masked word reveal, which Section 4.2 specifies. Re-check on the deployed Vercel preview, which is the gate the spec actually names; a CDN with HTTP/2 and a machine that isn't also running the dev server should close a 5-point gap.

**A note on Lighthouse throttling.** These runs use `throttlingMethod: "devtools"` (real applied throttling) rather than Lighthouse's default `simulate`. Lantern's simulation charges every request ~562ms of modelled latency, which is calibrated for real origins and badly wrong against `localhost` — it reported LCP of 3.0s on a page whose *observed* LCP breakdown was 142ms. On the deployed preview either method is meaningful; use the default there.

### Checklist status

| Section 10 item | Status |
|---|---|
| `curl` of every route contains all visible copy | pass — `check:crawl`, 60 copy assertions |
| JS disabled → fully readable | pass — `qa:layout` checks every heading/paragraph is visible with JS off |
| Person + Article schemas validate | structure asserted locally; run Google's Rich Results Test on the deployed URL |
| `/llms.txt`, `/robots.txt`, `/sitemap.xml` correct | pass |
| `prefers-reduced-motion` verified | pass — no cursor, no Lenis, no pinning, nothing left faded |
| All Section 0 placeholders replaced | **two outstanding** — `WHATSAPP`, `DOMAIN` (see above) |
| WhatsApp link opens from a phone; OG card renders in WhatsApp | **needs a real device** once `WHATSAPP` is set |
| Lighthouse gates met on the deployed preview | **outstanding** — not deployed; local numbers above |
| 360/768/1440, no horizontal scroll | pass |
| Descriptive alt text; one `h1` per page | pass |
