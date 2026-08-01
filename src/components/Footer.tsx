import Link from "next/link";
import { GITHUB, LINKEDIN } from "@/lib/site";

export function Footer() {
  return (
    <footer className="surface-ink">
      <div className="shell border-t border-hairline py-10">
        <div className="machine flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p>
              Santam Kumai · Product &amp; Design Engineer · Kalimpong, India
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
              className="transition-colors hover:text-mist"
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
                  className="transition-colors hover:text-mist"
                >
                  LinkedIn
                </a>
              </>
            ) : null}
            <span aria-hidden="true">·</span>
            <Link
              href="/writing"
              prefetch={false}
              className="transition-colors hover:text-mist"
            >
              Writing
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
