/**
 * Interaction QA — the states a full-page screenshot can't capture.
 *   node scripts/qa-motion.mjs [origin]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const origin = process.argv[2] ?? "http://localhost:3000";
const OUT = ".qa";
let failures = 0;
const fail = (m) => {
  failures += 1;
  console.log(`  FAIL  ${m}`);
};
const pass = (m) => console.log(`  ok    ${m}`);

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

console.log(`\nInteraction QA — ${origin}\n`);

/* Hero entrance: the machine line types itself out to the full string. */
await page.goto(`${origin}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const early = await page.locator("[data-hero='machine']").textContent();
await page.waitForTimeout(5000);
const late = await page.locator("[data-hero='machine']").textContent();
const FULL =
  "Currently building booking sites and dashboards, and answering odd questions on WhatsApp.";

if (late === FULL) pass("machine line completes");
else fail(`machine line ended as: ${late}`);
if (early !== late) pass(`machine line types (had ${early?.length ?? 0} chars early)`);
else fail("machine line never animated");

/**
 * After splitting, the h1 holds two copies: the untouched original (sr-only,
 * what assistive tech reads) and the aria-hidden animated copy (what is seen).
 * Both must read as the authored headline.
 */
const HEADLINE = "I make technology make sense.";
const heading = await page.evaluate(() => {
  const h = document.querySelector("h1");
  const sr = h?.querySelector(".sr-only");
  const visible = h?.querySelector('[aria-hidden="true"]');
  const words = [...(visible?.querySelectorAll(".split-word") ?? [])].map((w) => w.textContent);
  return {
    accessible: sr?.textContent?.replace(/\s+/g, " ").trim(),
    visible: words.join(" ").replace(/\s+([.,;:!?])/g, "$1"),
  };
});

if (heading.accessible === HEADLINE) pass("h1 accessible name intact");
else fail(`h1 accessible name: "${heading.accessible}"`);
if (heading.visible === HEADLINE) pass("h1 visible split words intact");
else fail(`h1 visible words: "${heading.visible}"`);

const srCopy = await page.locator("h1 .sr-only").count();
if (srCopy === 1) pass("split leaves an sr-only original");
else fail(`${srCopy} sr-only copies in h1`);

const ariaHidden = await page.evaluate(() => {
  const h = document.querySelector("h1");
  const holder = [...(h?.children ?? [])].find((c) => c.getAttribute("aria-hidden") === "true");
  return Boolean(holder?.querySelector(".split-line .split-word"));
});
if (ariaHidden) pass("split copy is aria-hidden");
else fail("split copy not aria-hidden");

await page.screenshot({ path: `${OUT}/motion-hero.png` });

/* How I Think — statements must reach full opacity as they scroll through. */
await page.evaluate(() => {
  document.querySelector("#how-i-think")?.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(1200);
const opacities = await page.$$eval("[data-statement]", (els) =>
  els.map((el) => Number(getComputedStyle(el).opacity)),
);
if (opacities.some((o) => o > 0.95)) pass(`statements reach full opacity (${opacities.map((o) => o.toFixed(2)).join(", ")})`);
else fail(`no statement reached full opacity: ${opacities.join(", ")}`);

/* Hover translation on a statement. */
await page.hover("[data-statement]");
await page.waitForTimeout(600);
const noteHeight = await page.$eval("[data-statement] [data-translation]", (el) => el.getBoundingClientRect().height);
if (noteHeight > 5) pass(`machine translation opens (${Math.round(noteHeight)}px)`);
else fail(`machine translation did not open (${noteHeight}px)`);
await page.screenshot({ path: `${OUT}/motion-how-i-think.png` });

/* Work — hover preview follows the cursor and becomes visible. */
await page.evaluate(() => document.querySelector("#work")?.scrollIntoView({ block: "center" }));
await page.waitForTimeout(800);
const row = page.locator("[data-row]").first();
const box = await row.boundingBox();
await page.mouse.move(box.x + 200, box.y + 40);
await page.mouse.move(box.x + 320, box.y + 50, { steps: 12 });
await page.waitForTimeout(800);
const previewState = await page.evaluate(() => {
  const el = document.querySelector('[aria-hidden="true"].fixed.w-\\[420px\\]') ??
    [...document.querySelectorAll("div")].find((d) => d.className.includes("w-[420px]"));
  if (!el) return null;
  const style = getComputedStyle(el);
  return { opacity: Number(style.opacity), visibility: style.visibility, transform: style.transform };
});
if (previewState && previewState.opacity > 0.5 && previewState.visibility === "visible")
  pass("hover preview visible and tracking");
else fail(`hover preview state: ${JSON.stringify(previewState)}`);

const cursorState = await page.evaluate(() => {
  const dot = document.querySelector(".cursor-dot");
  return dot ? { width: getComputedStyle(dot).width, label: Number(getComputedStyle(dot.querySelector("span")).opacity) } : null;
});
if (cursorState && parseFloat(cursorState.width) > 40) pass(`cursor morphed to OPEN (${cursorState.width})`);
else fail(`cursor did not morph: ${JSON.stringify(cursorState)}`);
await page.screenshot({ path: `${OUT}/motion-work-hover.png` });

/* Contact — magnetic button reacts to a nearby pointer. */
await page.evaluate(() => document.querySelector("#contact")?.scrollIntoView({ block: "center" }));
await page.waitForTimeout(900);
const cta = page.locator("[data-magnetic]");
const ctaBox = await cta.boundingBox();
await page.mouse.move(ctaBox.x + ctaBox.width / 2 + 60, ctaBox.y + ctaBox.height / 2 + 30, { steps: 10 });
await page.waitForTimeout(800);
const shifted = await cta.evaluate((el) => getComputedStyle(el).transform);
if (shifted !== "none" && shifted !== "matrix(1, 0, 0, 1, 0, 0)") pass(`magnetic CTA responds (${shifted})`);
else fail("magnetic CTA did not move");
await page.screenshot({ path: `${OUT}/motion-contact.png` });

/* Mobile overlay menu — opens, staggers, traps focus, locks scroll. */
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const mpage = await mobile.newPage();
await mpage.goto(`${origin}/`, { waitUntil: "networkidle" });
await mpage.waitForTimeout(1200);
await mpage.getByRole("button", { name: /menu/i }).click();
await mpage.waitForTimeout(900);
const menu = await mpage.evaluate(() => {
  const panel = document.querySelector("#mobile-menu");
  if (!panel) return null;
  return {
    visible: getComputedStyle(panel).opacity > 0.9,
    links: panel.querySelectorAll("a").length,
    locked: document.body.style.overflow === "hidden",
  };
});
if (menu?.visible && menu.links >= 4 && menu.locked) pass("overlay menu opens, 4+ links, scroll locked");
else fail(`overlay menu state: ${JSON.stringify(menu)}`);
await mpage.screenshot({ path: `${OUT}/motion-mobile-menu.png` });

await mpage.keyboard.press("Escape");
await mpage.waitForTimeout(400);
const closed = await mpage.evaluate(() => ({
  gone: !document.querySelector("#mobile-menu"),
  unlocked: document.body.style.overflow !== "hidden",
}));
if (closed.gone && closed.unlocked) pass("Escape closes menu and restores scroll");
else fail(`menu after Escape: ${JSON.stringify(closed)}`);

/* Nav sticks after 80px. */
await mpage.evaluate(() => window.scrollTo(0, 400));
await mpage.waitForTimeout(600);
const stuck = await mpage.evaluate(() => document.querySelector("[data-nav]")?.classList.contains("is-stuck"));
if (stuck) pass("nav switches to stuck state past 80px");
else fail("nav never became stuck");

await mobile.close();
await context.close();
await browser.close();
console.log(failures === 0 ? "\nInteraction QA passed.\n" : `\n${failures} interaction check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
