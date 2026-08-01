/**
 * Section 10 checklist: fails while any Section 0 placeholder is unresolved.
 * Two things are checked:
 *   1. No `[TOKEN]` literals survive anywhere in src/ or the built output.
 *   2. No sentinel default in lib/site.ts is still in place.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const TOKENS = /\[(WHATSAPP|EMAIL|DOMAIN|GITHUB|LINKEDIN|CLIENT_NAME|PHOTO)\]/g;
const ROOTS = ["src", "public"];

let failures = 0;
const fail = (m) => {
  failures += 1;
  console.log(`  FAIL  ${m}`);
};
const pass = (m) => console.log(`  ok    ${m}`);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

console.log("\nPlaceholders (Section 0)\n");

const TEXT = /\.(tsx?|jsx?|css|md|txt|json|mjs)$/;
let scanned = 0;
const hits = [];

for (const root of ROOTS) {
  try {
    for await (const file of walk(root)) {
      if (!TEXT.test(file)) continue;
      scanned += 1;
      const body = await readFile(file, "utf8");
      const found = body.match(TOKENS);
      // The scripts and site.ts document the tokens on purpose.
      if (found && !file.includes("check-") && !file.endsWith("site.ts")) {
        hits.push(`${file}: ${[...new Set(found)].join(", ")}`);
      }
    }
  } catch {
    /* directory may not exist */
  }
}

if (hits.length === 0) pass(`no [TOKEN] literals in ${scanned} files`);
else hits.forEach((h) => fail(h));

const site = await readFile("src/lib/site.ts", "utf8");
const value = (name) =>
  site.match(new RegExp(`export const ${name} = ([^;]+);`))?.[1]?.trim();

if (value("WHATSAPP") === "DEFAULT_WHATSAPP")
  fail("WHATSAPP is still the placeholder number — set it in src/lib/site.ts");
else pass("WHATSAPP set");

if (value("DOMAIN") === "DEFAULT_DOMAIN")
  fail("DOMAIN is still the placeholder domain — set it in src/lib/site.ts");
else pass("DOMAIN set");

for (const name of ["EMAIL", "GITHUB"]) {
  const v = value(name);
  if (v && v !== '""') pass(`${name} set`);
  else fail(`${name} is empty`);
}

console.log(
  failures === 0
    ? "\nAll Section 0 placeholders resolved.\n"
    : `\n${failures} placeholder issue(s) — see README "Before you ship".\n`,
);
process.exit(failures === 0 ? 0 : 1);
