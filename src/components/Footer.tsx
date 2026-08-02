import Link from "next/link";
import { GITHUB, LINKEDIN } from "@/lib/site";

/**
 * One line of the viewport-filling wordmark. SVG `textLength` stretches the
 * word to exactly the shell width at every viewport — no vw guesswork, no
 * overflow. Decorative: the name is already in the readable footer text.
 */
function WordmarkLine({ word }: { word: string }) {
  const gradientId = `metal-${word.toLowerCase()}`;
  return (
    <svg
      viewBox="0 0 1000 232"
      className="block w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#faf9f6" />
          <stop offset="0.38" stopColor="#e6e4de" />
          <stop offset="0.55" stopColor="#9c9a93" />
          <stop offset="0.74" stopColor="#f0eee9" />
          <stop offset="1" stopColor="#c0beb7" />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="222"
        textLength="1000"
        lengthAdjust="spacingAndGlyphs"
        fill={`url(#${gradientId})`}
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: "300px",
          letterSpacing: "-0.04em",
        }}
      >
        {word}
      </text>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="surface-ink">
      <div className="shell border-t border-ink/20 py-10">
        <div className="machine flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p>
              Santam Kumai · Developer &amp; Technology Advisor · Kalimpong, India
            </p>
            <p>
              Built by hand. Understood before built. Readable by humans and
              machines.
            </p>
          </div>

          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>© 2026</span>
            <span aria-hidden="true">·</span>
            <a
              href={GITHUB}
              rel="noopener"
              target="_blank"
              className="transition-colors hover:text-ink"
            >
              GitHub
            </a>
            {LINKEDIN ? (
              <>
                <span aria-hidden="true">·</span>
                <a
                  href={LINKEDIN}
                  rel="noopener"
                  target="_blank"
                  className="transition-colors hover:text-ink"
                >
                  LinkedIn
                </a>
              </>
            ) : null}
            <span aria-hidden="true">·</span>
            <Link
              href="/writing"
              prefetch={false}
              className="transition-colors hover:text-ink"
            >
              Writing
            </Link>
          </p>
        </div>
      </div>

      {/* The reference's closing move: the name at viewport scale. */}
      {/* The reference's closing move: the name at viewport scale. */}
      <div className="shell space-y-2 pb-6 md:space-y-3">
        <WordmarkLine word="Santam" />
        <WordmarkLine word="Kumai" />
      </div>
    </footer>
  );
}
