/**
 * Captures the live project sites at 1440px and 390px (Section 0) and writes
 * optimised .webp into public/work/. Run with: node scripts/capture-screens.mjs
 *
 * Re-runnable. Skips a target if the live site is unreachable, leaving the
 * previous capture (or the styled placeholder frame) in place — the site must
 * never render a broken image.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "work");

const targets = [
  { slug: "kalimpong-bungalow", url: "https://kalimpongbungalow.com" },
  { slug: "satori-stay", url: "https://avinaybnb.vercel.app" },
];

/** Desktop scroll stops, expressed in viewport heights. */
const STOPS = [0, 1, 2];

async function toWebp(buffer, file, width) {
  const out = await sharp(buffer)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  await writeFile(path.join(OUT, file), out);
  console.log(`  wrote ${file} (${Math.round(out.length / 1024)}kb)`);
}

async function settle(page) {
  await page.waitForTimeout(2500);
  await page.evaluate(() => {
    // Force any scroll-triggered content to reveal before we photograph it.
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
}

async function capture(browser, { slug, url }) {
  console.log(`\n${slug} — ${url}`);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  } catch {
    console.log("  unreachable — keeping existing assets");
    await context.close();
    return false;
  }

  await settle(page);

  for (const stop of STOPS) {
    await page.evaluate((s) => window.scrollTo(0, window.innerHeight * s), stop);
    await page.waitForTimeout(1400);
    const buf = await page.screenshot({ type: "png" });
    await toWebp(buf, `${slug}-desktop-${stop + 1}.webp`, 1440);
  }

  await context.close();

  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const mobile = await mobileCtx.newPage();
  await mobile.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await settle(mobile);
  const mbuf = await mobile.screenshot({ type: "png" });
  await toWebp(mbuf, `${slug}-mobile.webp`, 780);
  await mobileCtx.close();

  return true;
}

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

for (const target of targets) {
  try {
    await capture(browser, target);
  } catch (error) {
    console.log(`  failed: ${error.message}`);
  }
}

await browser.close();
console.log("\ndone");
