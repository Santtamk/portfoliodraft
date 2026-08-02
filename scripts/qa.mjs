/**
 * Visual + behavioural QA against a running server (Section 10 checklist).
 *   node scripts/qa.mjs [origin]
 *
 * Writes screenshots to .qa/ (git-ignored) and reports horizontal overflow,
 * JS-disabled readability, and reduced-motion behaviour.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const origin = process.argv[2] ?? "http://localhost:3000";
const OUT = ".qa";

const ROUTES = [
  ["home", "/"],
  ["about", "/about"],
  ["writing", "/writing"],
  ["article", "/writing/when-ai-talks-about-your-business"],
  ["case-kalimpong", "/works/kalimpong-bungalow"],
  ["case-satori", "/works/satori-stay"],
  ["case-teesta", "/works/teesta"],
  ["case-khata", "/works/khata"],
  ["case-rasid", "/works/rasid"],
];

const SIZES = [
  ["360", 360, 780],
  ["768", 768, 1024],
  ["1440", 1440, 900],
];

let failures = 0;
const fail = (m) => {
  failures += 1;
  console.log(`  FAIL  ${m}`);
};
const pass = (m) => console.log(`  ok    ${m}`);

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
}

/**
 * `body { overflow-x: clip }` stops a wide element from growing scrollWidth, so
 * measuring the document alone would hide real overflow. Element bounds are
 * checked too. Fixed decorations (the hover preview, the cursor) are parked
 * off-screen by design and are excluded.
 */
async function overflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;

    /**
     * An element can only push the page sideways if nothing between it and the
     * root clips or fixes it. Overscan inside `overflow:hidden` frames (the
     * hero tint, parallax images, sr-only copies) is intentional, and fixed
     * decorations sit outside the flow entirely.
     */
    function contained(el) {
      for (
        let node = el;
        node && node !== document.body;
        node = node.parentElement
      ) {
        const style = getComputedStyle(node);
        if (style.position === "fixed") return true;
        if (node !== el) {
          const x = style.overflowX;
          if (x === "hidden" || x === "clip" || x === "auto" || x === "scroll")
            return true;
        }
      }
      return false;
    }

    const offenders = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden")
          return false;
        return !contained(el);
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          cls: el.className?.toString?.().slice(0, 50),
          right: r.right,
          left: r.left,
        };
      })
      .filter((e) => e.right > doc.clientWidth + 1 || e.left < -1)
      .sort((a, b) => b.right - a.right)
      .slice(0, 3);

    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      offenders,
    };
  });
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

console.log(`\nQA — ${origin}\n`);

/* 1. Layout at each breakpoint, JS enabled. */
for (const [size, width, height] of SIZES) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  for (const [name, path] of ROUTES) {
    await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1800);
    await scrollThrough(page);

    const result = await overflow(page);
    if (result.scrollWidth > result.clientWidth + 1) {
      fail(
        `${name}@${size} horizontal scroll (${result.scrollWidth} > ${result.clientWidth})`,
      );
    } else if (result.offenders.length) {
      fail(
        `${name}@${size} element overflows viewport — ` +
          result.offenders
            .map(
              (o) =>
                `${o.tag}.${o.cls} [${Math.round(o.left)}..${Math.round(o.right)}]`,
            )
            .join(", "),
      );
    } else {
      pass(`${name}@${size} nothing overflows`);
    }

    await page.screenshot({
      path: `${OUT}/${name}-${size}.png`,
      fullPage: size === "1440",
    });
  }

  if (errors.length)
    fail(`console/page errors @${size}: ${errors.slice(0, 3).join(" | ")}`);
  else pass(`no console errors @${size}`);

  await context.close();
}

/* 2. JS disabled — the page must be complete and readable. */
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  for (const [name, path] of ROUTES) {
    await page.goto(`${origin}${path}`, { waitUntil: "domcontentloaded" });
    const hidden = await page.evaluate(() => {
      const bad = [];
      for (const el of document.querySelectorAll(
        "h1, h2, h3, p, li, blockquote",
      )) {
        if (!el.textContent?.trim()) continue;
        const style = getComputedStyle(el);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity) < 0.05
        ) {
          if (el.closest(".sr-only, .preloader")) continue;
          if (el.classList.contains("sr-only")) continue;
          bad.push(`${el.tagName}: ${el.textContent.trim().slice(0, 40)}`);
        }
      }
      return bad;
    });
    if (hidden.length)
      fail(`${name} no-JS hides: ${hidden.slice(0, 3).join(" | ")}`);
    else pass(`${name} no-JS complete`);
    await page.screenshot({ path: `${OUT}/nojs-${name}.png`, fullPage: true });
  }
  await context.close();
}

/* 3. Reduced motion — no cursor, no pinning, no smooth-scroll hijack. */
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.mouse.move(700, 400);
  await page.waitForTimeout(400);
  await scrollThrough(page);

  const state = await page.evaluate(() => {
    const dot = document.querySelector(".cursor-dot");
    return {
      cursorVisible: dot ? getComputedStyle(dot).display !== "none" : false,
      nativeCursorHidden:
        document.documentElement.classList.contains("has-cursor"),
      lenisActive: document.documentElement.classList.contains("lenis"),
      pinSpacers: document.querySelectorAll(".pin-spacer").length,
      faded: [...document.querySelectorAll("[data-statement], h1, h2")].filter(
        (el) => Number(getComputedStyle(el).opacity) < 0.9,
      ).length,
    };
  });

  if (!state.cursorVisible) pass("reduced-motion: no custom cursor");
  else fail("reduced-motion: cursor still visible");
  if (!state.nativeCursorHidden) pass("reduced-motion: native cursor intact");
  else fail("reduced-motion: native cursor hidden");
  if (!state.lenisActive) pass("reduced-motion: Lenis disabled");
  else fail("reduced-motion: Lenis still driving scroll");
  if (state.pinSpacers === 0) pass("reduced-motion: no pinning");
  else fail(`reduced-motion: ${state.pinSpacers} pin spacers`);
  if (state.faded === 0) pass("reduced-motion: nothing left faded out");
  else fail(`reduced-motion: ${state.faded} elements below full opacity`);

  await page.screenshot({
    path: `${OUT}/reduced-motion-home.png`,
    fullPage: true,
  });
  await context.close();
}

/* 4. Keyboard — skip link, focus ring, overlay menu focus trap. */
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => {
    const el = document.activeElement;
    return {
      text: el?.textContent?.trim(),
      outline: getComputedStyle(el).outlineColor,
    };
  });
  if (first.text?.toLowerCase().includes("skip"))
    pass("skip link is first tab stop");
  else fail(`first tab stop is "${first.text}"`);
  if (first.outline?.includes("240, 238, 233")) pass("cloud-dancer focus ring");
  else fail(`focus ring color ${first.outline}`);
  await context.close();
}

await browser.close();
console.log(
  failures === 0 ? "\nQA passed.\n" : `\n${failures} QA check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
