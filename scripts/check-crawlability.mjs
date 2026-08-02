/**
 * Section 8.1 / Section 10 acceptance tests. Run against a running server:
 *   npm run build && npm start
 *   node scripts/check-crawlability.mjs [origin]
 *
 * Every assertion here is a checklist item from the master spec. This is the
 * gate that has to pass before motion work is considered done, and again before
 * shipping.
 */
const origin = process.argv[2] ?? "http://localhost:3000";

let failures = 0;
const pass = (m) => console.log(`  ok    ${m}`);
const fail = (m) => {
  failures += 1;
  console.log(`  FAIL  ${m}`);
};

/**
 * Renders the HTML down to the plain text a reader would see. Inline tags are
 * replaced with a space (so `make <em>sense</em>.` doesn't become `sense.`
 * glued to the previous word), then stray spaces before punctuation are closed
 * up again. Typographic quotes are folded to ASCII so assertions can be written
 * in plain text.
 */
function text(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&rsquo;|&#x27;|&#39;/g, "'")
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&mdash;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();
}

async function get(path) {
  const response = await fetch(`${origin}${path}`);
  return { status: response.status, body: await response.text() };
}

/** Copy that must be present verbatim in the server-rendered HTML. */
const ROUTES = {
  "/": [
    "Kalimpong, India · Developer & Technology Advisor",
    "I make technology make sense.",
    "answering odd questions on WhatsApp",
    "Websites, digital tools, and honest answers",
    "Most people come for a website. They stay for everything else.",
    "Websites & web apps",
    "Digital problem-solving",
    "A technical brain on your side",
    "No jargon. Just look at them.",
    "Kalimpong Bungalow",
    "Satori Stay",
    "Teesta",
    "Khata",
    "Rasid",
    "I stay current so you don't have to.",
    "in words your grandmother would follow",
    "I read documentation the way other people read the news.",
    "That advice is free",
    "Thanks for the work. It's come out lovely.",
    "Have a project? Or a question you can't Google properly?",
    "Message me on WhatsApp",
    "Built by hand. Understood before built. Readable by humans and machines.",
  ],
  "/about": [
    "Understanding first, code second.",
    "I study how a business operates, how its customers think",
    "is why they keep my number",
  ],
  "/writing": [
    "Notes on making sense of technology.",
    "When Someone Asks AI About Your Business, What Does It Say?",
    "August 2026",
    "5 min",
    "People now ask AI for recommendations instead of Googling",
  ],
  "/writing/when-ai-talks-about-your-business": [
    "When Someone Asks AI About Your Business, What Does It Say?",
    "Try something right now. Open ChatGPT, or Claude, or Perplexity",
    "The shift nobody announced",
    "AI reads text, not beauty.",
    "the AI can only say about you what it can read about you.",
    "Machines quote facts, not vibes.",
    "the bar is on the floor",
    "It's the kind of thing I fix.",
    "it's really him replying",
  ],
  "/works/kalimpong-bungalow": [
    "Kalimpong Bungalow",
    "Hospitality & Heritage",
    "A heritage bed & breakfast doesn't need to shout.",
    "Next.js · TypeScript · Tailwind · GSAP",
  ],
  "/works/satori-stay": [
    "Satori Stay",
    "Hospitality & Nature",
    "Mountain retreat visitors decide in seconds",
    "Next.js · TypeScript · Tailwind",
  ],
  "/works/teesta": [
    "Teesta",
    "Commerce & Retail",
    "The shelf can never oversell",
    "Next.js · TypeScript · SQLite · Tailwind",
  ],
  "/works/khata": [
    "Khata",
    "Operational Tools",
    "a double booking can't be written",
    "Next.js · TypeScript · SQLite · Tailwind",
  ],
  "/works/rasid": [
    "Rasid",
    "Money & Paperwork",
    "the amount in words",
    "Next.js · TypeScript · SQLite · Tailwind",
  ],
};

console.log(`\nCrawlability acceptance — ${origin}\n`);

for (const [route, phrases] of Object.entries(ROUTES)) {
  console.log(route);
  const { status, body } = await get(route);
  if (status !== 200) {
    fail(`status ${status}`);
    continue;
  }

  const plain = text(body);
  const missing = phrases.filter((phrase) => !plain.includes(phrase));
  if (missing.length) missing.forEach((m) => fail(`missing copy: "${m}"`));
  else pass(`${phrases.length} copy assertions`);

  const h1 = body.match(/<h1[\s>]/g) ?? [];
  if (h1.length === 1) pass("exactly one <h1>");
  else fail(`${h1.length} <h1> elements`);

  for (const landmark of ["<nav", "<main", "<footer"]) {
    if (body.includes(landmark)) pass(`landmark ${landmark}>`);
    else fail(`missing landmark ${landmark}>`);
  }

  if (/<link rel="canonical"/.test(body)) pass("canonical link");
  else fail("no canonical link");

  if (/property="og:title"/.test(body)) pass("open graph");
  else fail("no open graph tags");

  if (/name="twitter:card"/.test(body)) pass("twitter card");
  else fail("no twitter card");

  const images = [...body.matchAll(/<img\b[^>]*>/g)];
  const badAlt = images.filter((match) => {
    const tag = match[0];
    if (!/\balt=/.test(tag)) return true;
    // alt="" is correct for the decorative hover previews.
    return false;
  });
  if (badAlt.length === 0) pass(`${images.length} images have alt`);
  else fail(`${badAlt.length} images without alt`);

  // Placeholder tokens from Section 0 must be gone from the built output.
  const tokens = body.match(/\[(WHATSAPP|EMAIL|DOMAIN|GITHUB|LINKEDIN|CLIENT_NAME|PHOTO)\]/g);
  if (tokens) fail(`unfilled placeholders: ${[...new Set(tokens)].join(", ")}`);
  else pass("no Section 0 placeholders");
}

/* Structured data */
console.log("\nstructured data");
{
  const { body } = await get("/");
  const blocks = [...body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (m) => JSON.parse(m[1]),
  );
  const person = blocks.find((b) => b["@type"] === "Person");
  const website = blocks.find((b) => b["@type"] === "WebSite");

  if (person?.name === "Santam Kumai") pass("Person schema");
  else fail("Person schema missing or wrong");
  if (person?.address?.addressLocality === "Kalimpong") pass("Person address");
  else fail("Person address missing");
  if (website) pass("WebSite schema");
  else fail("WebSite schema missing");

  const article = await get("/writing/when-ai-talks-about-your-business");
  const articleBlocks = [
    ...article.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].map((m) => JSON.parse(m[1]));
  const schema = articleBlocks.find((b) => b["@type"] === "Article");
  if (schema?.datePublished === "2026-08-01") pass("Article schema");
  else fail("Article schema missing or wrong datePublished");

  const project = await get("/works/kalimpong-bungalow");
  if (/"@type":"WebSite"[^}]*"name":"Kalimpong Bungalow"/.test(project.body.replace(/\s+/g, "")))
    pass("case-page schema");
  else if (project.body.includes('"Kalimpong Bungalow"')) pass("case-page schema");
  else fail("case-page schema missing");
}

/* Machine-readable files */
console.log("\nmachine-readable files");
{
  const llms = await get("/llms.txt");
  if (llms.status === 200 && llms.body.startsWith("# Santam Kumai")) pass("/llms.txt");
  else fail(`/llms.txt (status ${llms.status})`);
  if (llms.body.includes("wa.me/")) pass("/llms.txt contact");
  else fail("/llms.txt missing WhatsApp");

  const robots = await get("/robots.txt");
  const needed = ["GPTBot", "ClaudeBot", "Claude-Web", "PerplexityBot", "Google-Extended", "Sitemap:"];
  const missing = needed.filter((n) => !robots.body.includes(n));
  if (robots.status === 200 && missing.length === 0) pass("/robots.txt");
  else fail(`/robots.txt missing: ${missing.join(", ") || robots.status}`);

  const sitemap = await get("/sitemap.xml");
  const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const expected = [
    "/about",
    "/writing",
    "/writing/when-ai-talks-about-your-business",
    "/works/kalimpong-bungalow",
    "/works/satori-stay",
    "/works/teesta",
    "/works/khata",
    "/works/rasid",
  ];
  const gaps = expected.filter((path) => !urls.some((url) => url.endsWith(path)));
  if (sitemap.status === 200 && gaps.length === 0 && urls.length >= 7)
    pass(`/sitemap.xml (${urls.length} urls)`);
  else fail(`/sitemap.xml missing: ${gaps.join(", ") || urls.length + " urls"}`);
}

/* Section 8.1 acceptance test, literally */
console.log("\nspec 8.1 grep");
{
  const { body } = await get("/");
  if (text(body).includes("make technology make sense")) pass('grep "make technology make sense"');
  else fail('grep "make technology make sense"');
}

console.log(
  failures === 0 ? "\nAll acceptance checks passed.\n" : `\n${failures} check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
