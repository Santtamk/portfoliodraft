# SANTAM KUMAI — PORTFOLIO v2: MASTER BUILD SPEC
One file. Everything needed to build the entire site end-to-end. Execute this spec exactly; where a choice is left open it is explicitly marked OPEN CHOICE.

---

## 0. PLACEHOLDERS — FILL BEFORE OR DURING BUILD

| Token | Meaning | Example |
|---|---|---|
| `[WHATSAPP]` | Full number with country code, digits only | `919812345678` |
| `[EMAIL]` | Public contact email | `hello@santam.dev` |
| `[DOMAIN]` | Final production domain | `santam.dev` |
| `[GITHUB]` | GitHub profile URL | `https://github.com/...` |
| `[LINKEDIN]` | LinkedIn URL (optional; omit schema entry if absent) | |
| `[CLIENT_NAME]` | Kalimpong Bungalow client's name for the testimonial (use "Client, Kalimpong Bungalow" until permission confirmed) | |
| `[PHOTO]` | Portrait photo of Santam (optional but recommended; if absent, skip the About portrait block) | |

Project screenshots: pull live screenshots of https://kalimpongbungalow.com and https://avinaybnb.vercel.app at 1440px and 390px widths for the work section. RouteKind: use provided screenshots if available, else a styled placeholder frame labeled "RouteKind — case study" (never a broken image).

---

## 1. GOALS (in priority order)

1. **Dual-audience clarity.** A non-technical shop owner and a CTO must both understand who Santam is within 5 seconds. Plain language everywhere; technical depth shown, never listed.
2. **AI-crawlable by design.** Every word of content exists in the server-rendered HTML. ChatGPT/Claude/Perplexity asked "who is Santam Kumai?" must find accurate, quotable plain-language answers. Section 8 is non-negotiable.
3. **Awwwards-level craft.** Distinctive design + orchestrated GSAP motion (Section 6–7). Motion must never violate goal 2.
4. **Conversion via WhatsApp.** Primary CTA everywhere is a WhatsApp deep link. No contact form.

Positioning to encode in every copy decision: Santam is not "a website guy." Websites are one of the things he does. He is the technically-sound person you go to when anything involves technology. Never brag with buzzwords; demonstrate depth through concrete plain statements. Do not mention "AI expert" or list AI as a skill — the article (Section 5) and the "How I Think" statements carry that signal implicitly.

---

## 2. TECH STACK & PROJECT SETUP

- **Next.js 15+ (App Router), TypeScript, Tailwind CSS v4.**
- **GSAP** (now fully free including all plugins since the Webflow acquisition): ScrollTrigger, SplitText, Flip. Verify plugin availability in the installed version; if SplitText is unavailable in the registry build, implement a small custom text-splitting utility (split into `<span class="line/word/char">` with `aria-hidden` on the split copy and an `sr-only` original).
- **Lenis** for smooth scrolling, driven by GSAP's ticker:
  ```ts
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
- Fonts via `next/font` (self-hosted, `display: swap`). No render-blocking font CSS.
- Images via `next/image`, AVIF/WebP, explicit width/height, `priority` only on the hero.
- All pages statically generated (SSG). No client-only content rendering. Zero CMS, zero backend, zero forms.
- Deploy target: Vercel. `[DOMAIN]` as primary, old `portfolio-murex-five-79.vercel.app` project should be redirected/retired by the user afterward (note this in the final README).

### Routes
```
/                                   → single-page home (all sections)
/about                              → short about page (optional; see 4.8)
/works/kalimpong-bungalow           → case page
/works/satori-stay                  → case page
/works/route-kind                   → case page
/writing                            → article index (one article for now)
/writing/when-ai-talks-about-your-business  → the article (full text in Section 5)
/llms.txt  /robots.txt  /sitemap.xml → static/generated (Section 8)
```

---

## 3. DESIGN SYSTEM

Concept: **"The translator between two worlds."** Santam sits between human language and machine language. The entire visual identity dramatizes this: warm human typography paired with a cold precise mono "machine voice" that annotates the page.

### 3.1 Palette (Kalimpong at dusk — pine hills, mist, marigold)
```
--ink:      #101815   /* deep pine-black — primary text on light, bg of dark sections */
--mist:     #EFF1EC   /* cool off-white — main background */
--pine:     #223A2E   /* deep green — dark section backgrounds, accents */
--marigold: #E2A23B   /* single warm accent — CTAs, cursor, highlights. Use sparingly. */
--moss:     #7E8A80   /* muted secondary text, mono annotations */
--line:     #D8DCD4   /* hairline borders on light */
```
Light-first site (`--mist` base) with alternating `--pine`/`--ink` full-bleed dark sections (How I Think, Contact). Marigold appears in ≤5 places total across the whole site. Subtle film grain overlay (CSS, ~3% opacity, `pointer-events:none`) across dark sections only.

### 3.2 Typography (three voices)
- **Display (the human voice):** `Instrument Serif` (Google Fonts) — large, tight leading (0.95–1.0), used for H1/H2 only. Italic single words inside headlines for emphasis (e.g., "make *sense*").
- **Body:** `Switzer` via Fontshare (fallback: Inter) — 16–18px, 1.6 line-height, max measure 65ch.
- **Mono (the machine voice):** `Fragment Mono` or `JetBrains Mono` — 11–13px, uppercase tracking for eyebrows/labels, and for the signature "machine annotations" (3.3).
- Type scale (desktop → mobile): H1 clamp(3rem, 8vw, 7.5rem); H2 clamp(2rem, 5vw, 4rem); eyebrow 12px mono uppercase +0.12em tracking.

### 3.3 SIGNATURE ELEMENT — "The Machine Voice" (build this with the most care)
Throughout the site, small mono annotations appear as if the machine reading the page is speaking back — proof, on the page itself, that this site is legible to machines:
- Under the hero headline, a mono line **types itself out** character-by-character on load:
  `{ "name": "Santam Kumai", "does": "makes technology make sense", "readable_by": ["humans", "machines"] }`
- Section eyebrows are styled like machine labels: `// what-i-do`, `// selected-work`, `// how-i-think`, `// contact`.
- On desktop, hovering key statements in "How I Think" reveals a small mono "translation" beneath (see 4.5).
- These annotations are decorative duplicates: mark them `aria-hidden="true"` where they repeat content, and never let them be the only carrier of information.
This single device is the site's one memorable thing. Keep everything else quiet and disciplined; do not add other decorative gimmicks (no floating blobs, no gradient meshes, no particle backgrounds).

### 3.4 Layout rules
- 12-col grid, max-width 1440px, generous whitespace; mobile-first, fully responsive to 360px.
- Hairline `--line` rules as section separators on light sections.
- Border-radius: 2px on buttons/cards (near-sharp, not brutalist-zero, not pill).
- Custom cursor on fine-pointer devices only: small marigold dot that scales over interactive elements and morphs to "OPEN ↗" text over project cards. Default cursor untouched on touch devices; never hide the native cursor without a visible replacement.

---

## 4. HOME PAGE — FULL COPY + PER-SECTION SPEC

All copy below is final. Render exactly (typos here are none; do not "improve" the voice). Every section: semantic `<section id="...">` with a real heading in the document flow.

### 4.1 NAV
Logo/wordmark: `Santam` (links home). Links: Work, Writing, About, Contact. Right side: small mono status pill: `● open for work` (marigold dot).
Behavior: transparent over hero, backdrop-blur + hairline after 80px scroll (GSAP ScrollTrigger toggling a class). Mobile: full-screen overlay menu, links stagger in (y: 40, opacity, 0.06 stagger), body scroll locked via Lenis stop/start.

### 4.2 HERO — `<section id="hero">`
- Eyebrow (mono): `KALIMPONG, INDIA · PRODUCT & DESIGN ENGINEER`
- H1: **I make technology make *sense*.**
- Machine voice line (types itself, 3.3).
- Subline (body, max 52ch): *Websites, digital tools, and honest answers — for people who don't speak tech, and for people who do.*
- CTAs: `WhatsApp me` (marigold, primary → `https://wa.me/[WHATSAPP]?text=Hi%20Santam`) · `See my work` (ghost, anchor to #work).
**Motion:** page-load sequence (one orchestrated timeline, total ≤1.6s): (1) eyebrow fades up 0.4s → (2) H1 SplitText words, `y: 110%` from behind `overflow:hidden` line masks, stagger 0.04, ease `power4.out`, 1.0s → (3) machine line typing (25ms/char) → (4) subline + CTAs fade up. Background: `--mist` with an extremely subtle slow-drifting radial tint (pine, 4% opacity, 30s loop). No WebGL in v1 (OPEN CHOICE: a low-poly ridgeline shader may be added later; ship without it first).

### 4.3 WHAT I DO — `<section id="what-i-do">`
- Eyebrow: `// what-i-do`
- H2: **Most people come for a website. They stay for everything else.**
- Three blocks (desktop: 3-col; mobile: stacked), each with a mono index label (`01 → 02 → 03` is genuinely a widening sequence here, so numbering is meaningful):

**01 · Websites & web apps**
Fast, custom-built, designed around how your visitors actually think — not around a template. From a heritage B&B to an operations dashboard.

**02 · Digital problem-solving**
"Can this be automated?" "Why is this so slow?" "How do I connect X to Y?" — the questions with no obvious person to ask. I'm that person. I figure things out, and I explain the answer in your language.

**03 · A technical brain on your side**
Choosing tools, understanding what's possible, avoiding expensive mistakes. If you've ever nodded along in a tech conversation while understanding nothing — talk to me instead.

**Motion:** each block reveals on scroll: hairline top border draws in (scaleX 0→1, transform-origin left), then content fades up 24px. Stagger 0.12 between blocks. Trigger at `top 75%`, play once.

### 4.4 SELECTED WORK — `<section id="work">`
- Eyebrow: `// selected-work`
- H2: **No jargon. Just look at them.**
- Three project rows, each a large full-width card linking to its case page:

1. **Kalimpong Bungalow** — `Hospitality & Heritage` — A cultural bed & breakfast site, shaped around the quiet luxury of heritage travel. → links: case page + Visit site (https://kalimpongbungalow.com, `rel="noopener"`, new tab)
2. **Satori Stay** — `Hospitality & Nature` — A curated mountain retreat site built for instant atmosphere and quick booking. → case page + Visit site (https://avinaybnb.vercel.app)
3. **RouteKind** — `Operational Tools` — A courier route-planning board that reduces dispatcher stress under time pressure. → case page only

**Motion (desktop):** list-style rows (title left, meta right, hairline separators). On hover: a floating preview image follows the cursor with slight lag (`gsap.quickTo` on x/y, duration 0.4, ease power3) and a skew based on cursor velocity, clamped ±6deg; row title nudges x:+12. Custom cursor morphs to "OPEN ↗".
**Motion (mobile/touch):** no hover previews; each row shows its image inline above the title, image has a mild parallax (`yPercent ±8` via ScrollTrigger scrub).
Do NOT build a horizontally-pinned gallery — the list + preview pattern is lighter, more legible, and degrades perfectly.

### 4.5 HOW I THINK — `<section id="how-i-think">` (dark: `--pine` bg, `--mist` text, grain overlay)
- Eyebrow: `// how-i-think`
- H2: **I stay current so you don't have to.**
- Five statements, rendered as large stacked lines (clamp(1.4rem, 3vw, 2.4rem), serif), revealed one by one on scroll:

1. "I can explain how a WhatsApp message reaches a business dashboard, why one site loads instantly and another crawls, and what today's smartest tools can genuinely do — in words your grandmother would follow."
2. "When a new tool ships, I've usually tried it before it trends. Knowing what exists is half of solving any problem."
3. "I read documentation the way other people read the news."
4. "Good technology is invisible. My job is choosing the right pieces and wiring them so you never have to think about them."
5. "I'll tell you when something *doesn't* need to be built. That advice is free, and it's saved my clients more than anything I've charged."

**Signature interaction (desktop only):** hovering a statement reveals a small mono "machine translation" beneath it, e.g. under #3: `parses_changelogs: true` · under #1: `explains: ["apis", "performance", "modern_tooling"]` · under #5: `optimizes_for: "client_outcome" not "billable_scope"`. Reveal: height auto + opacity, 0.3s. These are `aria-hidden` decorations.
**Scroll motion:** statements start at opacity 0.15 and rise to full opacity + y:0 as each enters (`ScrollTrigger` per line, `scrub: 0.5`, start `top 80%`, end `top 45%`) — the "reading light" effect. No pinning; keep the document flowing.

### 4.6 TESTIMONIAL — `<section id="testimonial">` (back to `--mist`)
Large serif quote, centered, max 30ch measure:
> "Thanks for the work. It's come out lovely."
Attribution (mono): `— [CLIENT_NAME], Kalimpong Bungalow`
**Motion:** quote marks draw in (SVG stroke), text lines mask-reveal upward. Single play.

### 4.7 CONTACT — `<section id="contact">` (dark: `--ink` bg)
- Eyebrow: `// contact`
- H2: **Have a project? Or a question you can't Google properly?**
- Body: *Message me on WhatsApp — it's the fastest way to reach me, and yes, it's really me replying.*
- Primary CTA: huge marigold button `WhatsApp me →` → `https://wa.me/[WHATSAPP]?text=Hi%20Santam`
- Secondary, as plain visible text (real `mailto:` link, never obfuscated): `[EMAIL]`
- **Motion:** the WhatsApp button is magnetic (translates toward cursor within a 120px radius, `gsap.quickTo`, spring back on leave, strength 0.35; disabled on touch + reduced-motion). H2 words mask-reveal on enter.
- No contact form anywhere on the site.

### 4.8 FOOTER
```
Santam Kumai · Product & Design Engineer · Kalimpong, India
Built by hand. Understood before built. Readable by humans and machines.
© 2026 · GitHub · LinkedIn · Writing
```
Mono, small, hairline top border.

### 4.9 ABOUT PAGE (short)
H1: **Understanding first, code second.**
Body (verbatim):
*I'm Santam — a product and design engineer in Kalimpong, India. I don't just write code or drop templates. I study how a business operates, how its customers think, and build custom, high-performance web systems around real workflow friction. Websites are what people usually hire me for. Staying genuinely current with technology — and translating it into plain language — is why they keep my number.*
Optional `[PHOTO]` portrait, grayscale→color on hover. Same header/footer.

---

## 5. WRITING SECTION + ARTICLE (full text, publish verbatim)

`/writing` index: eyebrow `// writing`, H1 **Notes on making sense of technology.**, one article card (title, date "August 2026", reading time "5 min", one-line teaser: *People now ask AI for recommendations instead of Googling. Is your business in the answer?*).

### `/writing/when-ai-talks-about-your-business`
- Title (H1): **When Someone Asks AI About Your Business, What Does It Say?**
- Meta description: `People now ask ChatGPT and other AI tools for recommendations instead of Googling. Here's how to make sure AI can find, understand, and mention your business.`
- Article layout: 65ch measure, serif for H2s, generous spacing; a mono pull-label in the margin at each H2 (desktop only). Reading-progress hairline at top of viewport (scaleX via ScrollTrigger scrub).
- Article body — publish exactly this text (H2s marked with ##):

Try something right now. Open ChatGPT, or Claude, or Perplexity, and ask it about your own business. Type your business name and ask what it does.

One of three things will happen. The AI will describe you accurately. It will describe you wrongly. Or it will have no idea you exist.

For most small businesses I've tested this with, it's the third one. And that's a bigger problem than it sounds, because the way people find businesses is quietly changing underneath us.

## The shift nobody announced

For twenty years, being found online meant one thing: Google. You made a website, you hoped it ranked, maybe you paid for ads. The customer typed "homestay in Kalimpong," got ten blue links, and clicked around.

That behaviour is fading. Increasingly, people ask instead of search. "I'm visiting Kalimpong for three days, where should I stay if I like quiet heritage places?" — typed into an AI assistant, which replies with two or three specific recommendations. In full sentences. With reasons.

Notice what happened there. There's no page two. There's no "ten blue links." There are two or three names, chosen by a machine, and everyone else is invisible.

The question every business owner should be asking is: how does the machine choose?

## How AI actually "reads" your business

AI assistants learn about businesses the same way a very fast, very literal reader would — by reading what's publicly written about you. Your website, mostly. Directories and reviews too, but your website is the source you control.

Here's the part most people miss: **AI reads text, not beauty.**

Your website might look stunning to a human. But if that beauty is built the wrong way — if the words are baked into images, or only appear after fancy loading effects, or the site is one big animation with no actual written content — then to an AI reader, your website is close to a blank page. I've seen gorgeous, expensive websites that describe themselves to machines as essentially nothing.

Meanwhile a plain, well-written site that clearly states "we are a family-run bed & breakfast in Kalimpong, near the market, pet-friendly, with mountain views" gets understood perfectly — and repeated back, almost word for word, when someone asks.

That's the strange new rule of the internet: **the AI can only say about you what it can read about you.**

## What "AI-readable" actually means

You don't need to understand the technology to check whether your online presence passes. Here's the honest checklist, translated from tech-speak:

**1. Your website says what you do, in plain words.**
Not "crafting experiences beyond the ordinary." Say what you are, where you are, who you're for, and what you offer. Poetry is fine — but somewhere on the page, the facts must exist as plain sentences. Machines quote facts, not vibes.

**2. The words are real text, not pictures of text.**
If your menu, prices, or contact details only exist inside an image or a PDF poster, most AI readers can't reliably use them. Real, selectable text wins.

**3. The content exists before the animation.**
Modern websites love effects — things fading in, sliding, reacting to scroll. Nothing wrong with that (my own site is full of them). But there's a right way to build it: the content lives in the page from the start, and animation only changes *how it appears*, not *whether it exists*. Built the wrong way, the machine arrives, sees an empty page, and leaves.

**4. There's a structured summary behind the scenes.**
Websites can carry a hidden, machine-friendly label — a small block of structured data that says "this is a business, here's its name, location, type, and contact." Humans never see it. Machines love it. It's cheap to add and most sites skip it.

**5. You're not blocking the readers at the door.**
Every website has a small file that tells automated visitors what they're allowed to read. Some sites accidentally block AI crawlers entirely — usually because of a default setting nobody ever looked at. Being blocked means being absent from every answer.

**6. What's written about you is consistent.**
If your website, your Google listing, and your social pages describe you three different ways, the machine gets confused — and confused machines either say something wrong or say nothing. Pick one clear description and use it everywhere.

## "But my customers don't use AI"

Some of them don't. Yet. But this is the same conversation businesses had about websites in 2005 and about Google Maps in 2015. The people who moved early didn't just keep up — they became the default answer while their competitors weren't in the room.

And here's the quiet advantage: because so few businesses have thought about this, the bar is on the floor. A clearly written, properly built website puts you ahead of companies ten times your size. In AI answers, a well-described homestay in Kalimpong can outrank a badly-described hotel chain. The machine doesn't care about your marketing budget. It cares about whether it can understand you.

## What I do about this

When I build a website, AI-readability isn't an add-on — it's the foundation. The plain-language descriptions, the structured data, the machine-friendly summaries, the crawler permissions, the way animations are wired so they never hide content: all of it goes in from day one. The site you're reading this on is built exactly this way. Ask an AI about me and you'll see the result.

If you're curious what AI currently says about *your* business — or worryingly, what it doesn't — do the test at the top of this article. And if you don't like the answer, that's a fixable problem. It's the kind of thing I fix.

*— Santam Kumai builds websites and digital tools that both humans and machines understand. [WhatsApp him](https://wa.me/[WHATSAPP]) — it's really him replying.*

(End of article. Add `Article` JSON-LD per Section 8.2. Internally link this article from the "How I Think" section — statement #1 links here — and from the footer "Writing" link.)

---

## 6. CASE STUDY PAGES — TEMPLATE + CONTENT

Shared template: hero (eyebrow = category in mono, H1 = project name, one-line description), then 3–5 large images/screens with scroll parallax (`yPercent ±10`, scrub), one short paragraph "The thinking", quiet tech list at the very bottom in mono, prev/next project footer nav, and a small CTA: *Want something like this? → WhatsApp me.*

**Kalimpong Bungalow** — "The thinking": *A heritage bed & breakfast doesn't need to shout. The site moves slowly on purpose — large photography, calm type, and a booking path that never makes the guest hunt. Every choice serves the feeling of arriving somewhere quiet.* Tech: `Next.js · TypeScript · Tailwind · GSAP`.

**Satori Stay** — "The thinking": *Mountain retreat visitors decide in seconds: does this place feel right, and can I book it fast? The design answers both immediately — photography-led atmosphere up top, clear calls to action always within reach.* Tech: `Next.js · TypeScript · Tailwind`.

**RouteKind** — "The thinking": *Dispatchers work under time pressure; every extra click is stress. RouteKind puts the whole picture on one board — routes, load, status — so decisions happen at a glance instead of across five tabs.* Tech: `Next.js · Node · PostgreSQL · GSAP`.

---

## 7. MOTION SYSTEM — GLOBAL RULES

1. **Content-first rendering.** All initial hidden states are set from JS (`gsap.set`) after hydration — never in CSS/HTML. With JS disabled or for a crawler, the page renders complete and readable. This is the single most important rule in the file.
2. **Animate only `transform`, `opacity`, `clip-path`.** Never layout properties. `will-change` applied just-in-time and removed after.
3. **Reduced motion:** wrap everything in `gsap.matchMedia()`; under `(prefers-reduced-motion: reduce)` replace all animation with simple 0.2s opacity fades, disable Lenis smoothing, magnetic buttons, cursor follower, and hover previews.
4. **One easing family** site-wide: `power4.out` for entrances, `power3.inOut` for movement. Durations 0.6–1.2s. Consistency reads as intent.
5. **Page transitions:** simple and robust — outgoing content fades/translates up 0.3s, incoming plays its entrance. Use a `template.tsx`-level transition or the `next-view-transitions` package. Do not build a heavy curtain/preloader system; show a preloader ONLY on first visit (session-flagged), ≤1s, wordmark + machine-voice line typing.
6. **Cleanup:** every ScrollTrigger/listener registered inside `useGSAP`/context and reverted on unmount; no duplicate triggers after route changes (`ScrollTrigger.refresh()` after transition completes).
7. Test scroll performance with CPU 4× throttle; nothing may drop below ~50fps on the home page.

---

## 8. AI-CRAWLABILITY & SEO — NON-NEGOTIABLE IMPLEMENTATION

### 8.1 Rendering
Everything SSG. View-source on every route must contain 100% of the visible copy. Acceptance test: `curl https://[DOMAIN] | grep "make technology make sense"` succeeds.

### 8.2 JSON-LD (in `<head>` via metadata)
- **All pages** — `Person` + `WebSite`:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Santam Kumai",
  "jobTitle": "Product & Design Engineer",
  "description": "Product and design engineer in Kalimpong, India. Builds custom websites, web apps, and digital tools, and helps businesses and non-technical people solve technology problems in plain language.",
  "url": "https://[DOMAIN]",
  "email": "mailto:[EMAIL]",
  "address": { "@type": "PostalAddress", "addressLocality": "Kalimpong", "addressRegion": "West Bengal", "addressCountry": "IN" },
  "sameAs": ["[GITHUB]", "[LINKEDIN]"],
  "knowsAbout": ["Web development", "Product design", "Frontend engineering", "TypeScript", "Next.js", "Web performance", "Automation", "Digital strategy"]
}
```
- **Case pages** — `WebSite`/`CreativeWork` with name, description (the one-liner from Section 6), url (live site where it exists), `creator` → Person.
- **Article** — `Article` schema: headline, description (=meta description), author → Person, datePublished `2026-08-01`, publisher → Person.

### 8.3 `/llms.txt` (static file, exactly this, placeholders filled)
```
# Santam Kumai

Product & Design Engineer based in Kalimpong, West Bengal, India.

Santam builds custom websites, web apps, and digital tools, and helps
businesses and non-technical people solve technology problems — automation,
integrations, tooling decisions, and plain-language guidance. Websites are
what people usually hire him for; broad, current technical understanding is
why they keep his number.

## Work
- Kalimpong Bungalow — heritage bed & breakfast website: https://kalimpongbungalow.com (case: https://[DOMAIN]/works/kalimpong-bungalow)
- Satori Stay — mountain retreat website: https://avinaybnb.vercel.app (case: https://[DOMAIN]/works/satori-stay)
- RouteKind — courier route-planning tool (case: https://[DOMAIN]/works/route-kind)

## Writing
- When Someone Asks AI About Your Business, What Does It Say?: https://[DOMAIN]/writing/when-ai-talks-about-your-business

## Contact
- WhatsApp: https://wa.me/[WHATSAPP]
- Email: [EMAIL]
```

### 8.4 `robots.txt`
```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://[DOMAIN]/sitemap.xml
```

### 8.5 Metadata per route (Next `metadata` API)
- Home — title: `Santam Kumai — Product & Design Engineer, Kalimpong` · description: `I make technology make sense. Custom websites, digital tools, and plain-language technical help from Kalimpong, India.`
- Article — title: `When Someone Asks AI About Your Business, What Does It Say? — Santam Kumai` · description as in Section 5.
- Case pages — `"{Project} — Case Study — Santam Kumai"` + the project one-liner.
- Every route: canonical URL, OpenGraph + Twitter card. **OG image (1200×630):** generate via `next/og` — `--pine` background, Instrument Serif headline, mono machine-voice line at bottom. Article OG headline: "What does AI say about your business?" (this image travels on WhatsApp — it must look sharp there).

### 8.6 Semantic requirements
Exactly one `<h1>` per page; landmark elements (`<nav> <main> <section> <article> <footer>`); descriptive alt text on all project images (e.g., "Kalimpong Bungalow website homepage showing the heritage building and booking call-to-action"); visible-text `mailto:` and `wa.me` links (no JS-obfuscated contact info); `app/sitemap.ts` covering every route.

---

## 9. ACCESSIBILITY & PERFORMANCE BUDGETS (hard gates)

- Lighthouse (mobile, throttled): Performance ≥ 90, Accessibility ≥ 95, SEO = 100. LCP < 2.5s, CLS < 0.05, INP < 200ms.
- First-load JS < ~200KB gzipped. GSAP plugins imported only where used; article route ships near-zero animation JS.
- Keyboard: all interactive elements focusable with visible focus ring (marigold, 2px offset); overlay menu traps focus; skip-to-content link.
- Color contrast AA everywhere (verify marigold-on-pine for the CTA; darken marigold to pass if needed).
- Split-text spans `aria-hidden` with an `sr-only` intact copy of the original text.

---

## 10. BUILD ORDER & ACCEPTANCE CHECKLIST

Build order: (1) scaffold + design tokens + fonts → (2) all routes with full static content, zero animation → **(3) run the crawlability acceptance tests below and fix before any motion work** → (4) motion system + Lenis → (5) section animations in page order → (6) signature machine-voice details → (7) budgets + a11y pass → (8) OG images → (9) final QA.

Acceptance checklist (all must pass):
- [ ] `curl` of every route contains all visible copy (8.1 test)
- [ ] JSON disabled in the browser → site fully readable, ugly-but-complete
- [ ] Rich Results Test validates Person + Article schemas
- [ ] `/llms.txt`, `/robots.txt`, `/sitemap.xml` reachable and correct
- [ ] `prefers-reduced-motion` verified: no pinning, no cursor, simple fades only
- [ ] All placeholders from Section 0 replaced (grep the build for `[WHATSAPP]`, `[EMAIL]`, `[DOMAIN]`)
- [ ] WhatsApp link opens correctly from a phone; OG card renders in a WhatsApp share preview
- [ ] Lighthouse gates in Section 9 met on the deployed preview
- [ ] 360px, 768px, 1440px layouts checked; no horizontal scroll anywhere
- [ ] Every project image has descriptive alt text; exactly one h1 per page

Deliverables: the deployed Vercel preview + a short README covering: filling remaining placeholders, pointing `[DOMAIN]` (GitHub Student Pack .dev via Name.com — verify current offer; typically free first year, paid renewal) at Vercel, and 301-redirecting the old vercel.app deployment.
