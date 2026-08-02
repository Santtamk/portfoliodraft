# Santam Kumai — Portfolio

Built to `PORTFOLIO-MASTER-SPEC.md`, with the visual layer redirected to the editorial layout language of stateofaidesign.com (per request): one bold grotesque at every scale, mono machine labels, hard ink rules, chapter numbers, full-width bar buttons, flat color-blocked sections, and a viewport-filling footer wordmark. Next.js 16 (App Router) · TypeScript · Tailwind v4 · GSAP · Lenis. Every route is statically generated; there is no CMS, no backend, and no contact form.

**Where the design deviates from the spec's Section 3** (all at the owner's request, all content/crawlability rules still enforced): Instrument Serif is gone — Switzer Semibold with tight negative tracking is the display voice; border radius is 0; the testimonial sits on a full-bleed gold band; the reading-light effect floors at 0.45 opacity (0.15 failed WCAG large-text contrast mid-scroll). The palette is now **graphite + Cloud Dancer**: a warm graphite ground (`#101011`), charcoal panels, soft platinum type, and Pantone 11-4201 Cloud Dancer — the 2026 Colour of the Year, a warm white (`#f0eee9`) — as the single accent: cloud-white metal bars and tiles, one bright Cloud Dancer band (the testimonial), and white highlights. The giant headlines and footer wordmark carry a warm silver-gradient sheen (`background-clip: text` / SVG gradient), and the action bars are brushed-metal gradients with a transform-only sheen sweep on hover. The machine-voice styling was also humanized: no `//` labels, no JSON lines, no snake_case — plain-language labels and asides throughout.

**Token naming caveat:** the CSS variable names kept their layout roles when the site went dark, so their values inverted — `--color-mist` is now the dark ground and `--color-ink` is the platinum used for text and rules on it. `text-ink` = light text, `bg-mist` = dark background. The comment block in [globals.css](src/app/globals.css) is the source of truth.

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
| `EMAIL` | `santtamk@gmail.com` | Rendered as a real, visible `mailto:` link in the Contact section and in `Person` schema. |
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

### The layout system

Type: `display-1` (clamp to 7.5rem, -0.05em), `display-2`, `display-chapter` (the 01/02/03 blocks), `eyebrow`/`machine` mono labels. Devices: `bar-button` (+ `-marigold`, `-ghost` variants) for the full-width label-left/arrow-right action bars, `surface-pine`/`surface-ink`/`surface-marigold` for color-blocked sections, and the footer's `WordmarkLine` (SVG `textLength`, so "Santam / Kumai" spans exactly the shell width at every viewport with no overflow).

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

Accessibility, SEO, best-practices: **100 / 100 / 100 on every route** (Lighthouse), and **zero axe violations** on every route. CLS ≤ 0.004 everywhere. Crawlability (60 copy assertions, schema, llms/robots/sitemap), layout (360/768/1440, no-JS, reduced-motion, keyboard), and interaction suites: **all passing** after the redesign.

**Performance scores could not be measured reliably on this machine.** Identical builds measured article-route TBT anywhere from 230ms to 420ms depending on what else the computer was doing (IDE + browser background spikes dominate under Lighthouse's 4× CPU throttle). The best clean runs measured 94–95 perf on the article and 91+ on other routes; hot/loaded runs measured 76–88. Treat the deployed Vercel preview — the gate the spec actually names — as the source of truth, and run `npm run qa:budgets https://<preview-url>` there.

**First-load JS is ~216KB gzipped on the wire** against the spec's "< ~200KB" soft budget (measured properly via CDP `encodedDataLength`; an earlier 83KB figure in this README's history under-counted chunked responses). The weight is React 19 + the Next 16 runtime (~130KB) plus GSAP + ScrollTrigger + Lenis (~45KB); there is no meaningful trim left that doesn't remove specified motion.

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
| Lighthouse gates met on the deployed preview | **outstanding** — not deployed; local perf unmeasurable (see above), a11y/SEO/BP at 100 |
| 360/768/1440, no horizontal scroll | pass |
| Descriptive alt text; one `h1` per page | pass |
