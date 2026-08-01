import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { ARTICLE } from "@/lib/content";
import { PERSON, SITE_URL } from "@/lib/site";

const description =
  "Notes on making sense of technology — plain-language writing on the web, AI, and the tools businesses actually need.";

export const metadata: Metadata = {
  title: `Writing — ${PERSON.name}`,
  description,
  alternates: { canonical: "/writing" },
  openGraph: {
    title: `Writing — ${PERSON.name}`,
    description,
    url: `${SITE_URL}/writing`,
  },
};

export default function WritingIndex() {
  return (
    <div className="shell pt-36 pb-24 md:pt-48">
      <Eyebrow>{"// writing"}</Eyebrow>
      <h1 className="display-1 mt-6 max-w-[14ch]">
        Notes on making sense of technology.
      </h1>

      <Reveal className="mt-16 md:mt-24">
        <article className="border-t border-hairline">
          <Link href={`/writing/${ARTICLE.slug}`} className="group block py-10">
            <p className="machine flex flex-wrap items-center gap-x-3">
              <span>{ARTICLE.dateLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{ARTICLE.readingTime}</span>
            </p>
            <h2 className="display-2 mt-5 max-w-[22ch] transition-colors group-hover:text-pine">
              {ARTICLE.title}
            </h2>
            <p className="measure mt-6 text-lg text-ink/75">{ARTICLE.teaser}</p>
            <p className="machine mt-8">Read the article ↗</p>
          </Link>
        </article>
      </Reveal>
    </div>
  );
}
