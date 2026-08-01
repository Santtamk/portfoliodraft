/**
 * Section 9 hard gates: Lighthouse (mobile, throttled) + axe accessibility +
 * first-load JS budget.
 *   node scripts/qa-budgets.mjs [origin]
 */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import lighthouse from "lighthouse";
import { mkdir, writeFile } from "node:fs/promises";

const origin = process.argv[2] ?? "http://localhost:3000";
const OUT = ".qa";

const GATES = { performance: 90, accessibility: 95, seo: 100 };
const VITALS = { lcp: 2500, cls: 0.05, tbt: 300 };

const ROUTES = [
  ["home", "/"],
  ["article", "/writing/when-ai-talks-about-your-business"],
  ["case", "/works/kalimpong-bungalow"],
  ["about", "/about"],
  ["writing", "/writing"],
];

let failures = 0;
const fail = (m) => {
  failures += 1;
  console.log(`  FAIL  ${m}`);
};
const pass = (m) => console.log(`  ok    ${m}`);

await mkdir(OUT, { recursive: true });
console.log(`\nBudgets & accessibility — ${origin}\n`);

/* ---------------------------------------------------------------- axe ---- */
{
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  for (const [name, path] of ROUTES) {
    const page = await context.newPage();
    await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    if (results.violations.length === 0) {
      pass(`axe ${name}: no violations`);
    } else {
      for (const v of results.violations) {
        fail(
          `axe ${name}: ${v.id} (${v.impact}) — ${v.nodes.length} node(s): ${v.nodes[0]?.html?.slice(0, 90)}`,
        );
      }
    }
    await page.close();
  }
  await context.close();
  await browser.close();
}

/* -------------------------------------------------------- first-load JS -- */
{
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  let bytes = 0;
  page.on("response", async (response) => {
    const type = response.headers()["content-type"] ?? "";
    if (!type.includes("javascript")) return;
    const encoded = Number(response.headers()["content-length"] ?? 0);
    if (encoded) bytes += encoded;
    else {
      try {
        bytes += (await response.body()).length;
      } catch {
        /* ignore */
      }
    }
  });
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const kb = Math.round(bytes / 1024);
  if (kb < 200) pass(`first-load JS ${kb}KB (budget 200KB)`);
  else fail(`first-load JS ${kb}KB exceeds the 200KB budget`);
  await browser.close();
}

/* --------------------------------------------------------- lighthouse ---- */
{
  const browser = await chromium.launch({ args: ["--remote-debugging-port=9222"] });
  const port = 9222;

  for (const [name, path] of ROUTES) {
    /**
     * `devtools` throttling actually applies the mobile network/CPU limits.
     * The default `simulate` (Lantern) projects a trace onto a network model
     * calibrated for real origins, and against localhost it charges every
     * request a synthetic 562ms of latency — on this site that inflated LCP
     * from an observed ~140ms to a reported 3.0s. Re-verify on the deployed
     * Vercel preview, where either method is meaningful.
     */
    const result = await lighthouse(
      `${origin}${path}`,
      {
        port,
        output: "json",
        logLevel: "error",
        throttlingMethod: "devtools",
        screenEmulation: { disabled: false },
      },
      undefined,
    );

    const lhr = result.lhr;
    const scores = {
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
      "best-practices": Math.round(lhr.categories["best-practices"].score * 100),
    };
    const lcp = lhr.audits["largest-contentful-paint"].numericValue;
    const cls = lhr.audits["cumulative-layout-shift"].numericValue;
    const tbt = lhr.audits["total-blocking-time"].numericValue;

    console.log(
      `\n${name}: perf ${scores.performance} · a11y ${scores.accessibility} · seo ${scores.seo} · bp ${scores["best-practices"]}`,
    );
    console.log(
      `  LCP ${Math.round(lcp)}ms · CLS ${cls.toFixed(3)} · TBT ${Math.round(tbt)}ms`,
    );

    for (const [key, min] of Object.entries(GATES)) {
      if (scores[key] >= min) pass(`${name} ${key} ${scores[key]} ≥ ${min}`);
      else fail(`${name} ${key} ${scores[key]} < ${min}`);
    }
    if (lcp <= VITALS.lcp) pass(`${name} LCP ${Math.round(lcp)}ms`);
    else fail(`${name} LCP ${Math.round(lcp)}ms > ${VITALS.lcp}ms`);
    if (cls <= VITALS.cls) pass(`${name} CLS ${cls.toFixed(3)}`);
    else fail(`${name} CLS ${cls.toFixed(3)} > ${VITALS.cls}`);
    if (tbt <= VITALS.tbt) pass(`${name} TBT ${Math.round(tbt)}ms`);
    else fail(`${name} TBT ${Math.round(tbt)}ms > ${VITALS.tbt}ms (INP proxy)`);

    await writeFile(`${OUT}/lighthouse-${name}.json`, JSON.stringify(lhr, null, 2));
  }

  await browser.close();
}

console.log(failures === 0 ? "\nBudgets passed.\n" : `\n${failures} budget check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
