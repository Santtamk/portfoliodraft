import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { ReadingProgress } from "@/components/ReadingProgress";
import { Eyebrow } from "@/components/ui";
import { ARTICLE } from "@/lib/content";
import { articleSchema } from "@/lib/schema";
import { PERSON, SITE_URL, WHATSAPP_PLAIN_HREF } from "@/lib/site";

const title = `${ARTICLE.title} — ${PERSON.name}`;

export const metadata: Metadata = {
  title,
  description: ARTICLE.description,
  alternates: { canonical: `/writing/${ARTICLE.slug}` },
  openGraph: {
    title,
    description: ARTICLE.description,
    url: `${SITE_URL}/writing/${ARTICLE.slug}`,
    type: "article",
    publishedTime: ARTICLE.date,
    authors: [PERSON.name],
  },
};

/** Body column. Everything readable sits in the second grid track. */
const col = "lg:col-start-2";

function P({ children }: { children: ReactNode }) {
  return <p className={`${col} mt-6 text-lg leading-[1.7]`}>{children}</p>;
}

/**
 * Section heading with its mono pull-label in the left margin (desktop only).
 * The label is decorative — Section 3.3.
 */
function H2({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <>
      <p
        aria-hidden="true"
        className="machine mt-16 hidden lg:col-start-1 lg:block lg:pt-4 lg:text-right"
      >
        {label}
      </p>
      <h2 id={id} className={`${col} display-2 mt-16 max-w-[18ch]`}>
        {children}
      </h2>
    </>
  );
}

export default function ArticlePage() {
  return (
    <>
      <ReadingProgress target="#article" />
      <JsonLd data={articleSchema} />

      <article id="article" className="shell pt-36 pb-24 md:pt-48">
        <div className="lg:mx-auto lg:grid lg:w-fit lg:grid-cols-[9rem_minmax(0,65ch)] lg:gap-x-12">
          <div className={col}>
            <Eyebrow>{"// writing"}</Eyebrow>
            <h1 className="display-1 mt-6 text-[clamp(2.25rem,5.5vw,4.5rem)]">
              {ARTICLE.title}
            </h1>
            <p className="machine mt-8 flex flex-wrap items-center gap-x-3">
              <span>{ARTICLE.dateLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{ARTICLE.readingTime}</span>
              <span aria-hidden="true">·</span>
              <span>Santam Kumai</span>
            </p>
          </div>

          <div className={`${col} mt-12 border-t border-hairline`} />

          <P>
            Try something right now. Open ChatGPT, or Claude, or Perplexity, and
            ask it about your own business. Type your business name and ask what
            it does.
          </P>

          <P>
            One of three things will happen. The AI will describe you
            accurately. It will describe you wrongly. Or it will have no idea
            you exist.
          </P>

          <P>
            For most small businesses I&rsquo;ve tested this with, it&rsquo;s
            the third one. And that&rsquo;s a bigger problem than it sounds,
            because the way people find businesses is quietly changing
            underneath us.
          </P>

          <H2 id="the-shift-nobody-announced" label="// the-shift">
            The shift nobody announced
          </H2>

          <P>
            For twenty years, being found online meant one thing: Google. You
            made a website, you hoped it ranked, maybe you paid for ads. The
            customer typed &ldquo;homestay in Kalimpong,&rdquo; got ten blue
            links, and clicked around.
          </P>

          <P>
            That behaviour is fading. Increasingly, people ask instead of
            search. &ldquo;I&rsquo;m visiting Kalimpong for three days, where
            should I stay if I like quiet heritage places?&rdquo; — typed into
            an AI assistant, which replies with two or three specific
            recommendations. In full sentences. With reasons.
          </P>

          <P>
            Notice what happened there. There&rsquo;s no page two. There&rsquo;s
            no &ldquo;ten blue links.&rdquo; There are two or three names,
            chosen by a machine, and everyone else is invisible.
          </P>

          <P>
            The question every business owner should be asking is: how does the
            machine choose?
          </P>

          <H2 id="how-ai-reads-your-business" label="// how-ai-reads">
            How AI actually &ldquo;reads&rdquo; your business
          </H2>

          <P>
            AI assistants learn about businesses the same way a very fast, very
            literal reader would — by reading what&rsquo;s publicly written
            about you. Your website, mostly. Directories and reviews too, but
            your website is the source you control.
          </P>

          <P>
            Here&rsquo;s the part most people miss:{" "}
            <strong className="font-medium">AI reads text, not beauty.</strong>
          </P>

          <P>
            Your website might look stunning to a human. But if that beauty is
            built the wrong way — if the words are baked into images, or only
            appear after fancy loading effects, or the site is one big animation
            with no actual written content — then to an AI reader, your website
            is close to a blank page. I&rsquo;ve seen gorgeous, expensive
            websites that describe themselves to machines as essentially
            nothing.
          </P>

          <P>
            Meanwhile a plain, well-written site that clearly states &ldquo;we
            are a family-run bed &amp; breakfast in Kalimpong, near the market,
            pet-friendly, with mountain views&rdquo; gets understood perfectly —
            and repeated back, almost word for word, when someone asks.
          </P>

          <P>
            That&rsquo;s the strange new rule of the internet:{" "}
            <strong className="font-medium">
              the AI can only say about you what it can read about you.
            </strong>
          </P>

          <H2 id="what-ai-readable-means" label="// the-checklist">
            What &ldquo;AI-readable&rdquo; actually means
          </H2>

          <P>
            You don&rsquo;t need to understand the technology to check whether
            your online presence passes. Here&rsquo;s the honest checklist,
            translated from tech-speak:
          </P>

          <P>
            <strong className="font-medium">
              1. Your website says what you do, in plain words.
            </strong>
            <br />
            Not &ldquo;crafting experiences beyond the ordinary.&rdquo; Say what
            you are, where you are, who you&rsquo;re for, and what you offer.
            Poetry is fine — but somewhere on the page, the facts must exist as
            plain sentences. Machines quote facts, not vibes.
          </P>

          <P>
            <strong className="font-medium">
              2. The words are real text, not pictures of text.
            </strong>
            <br />
            If your menu, prices, or contact details only exist inside an image
            or a PDF poster, most AI readers can&rsquo;t reliably use them.
            Real, selectable text wins.
          </P>

          <P>
            <strong className="font-medium">
              3. The content exists before the animation.
            </strong>
            <br />
            Modern websites love effects — things fading in, sliding, reacting
            to scroll. Nothing wrong with that (my own site is full of them).
            But there&rsquo;s a right way to build it: the content lives in the
            page from the start, and animation only changes{" "}
            <em>how it appears</em>, not <em>whether it exists</em>. Built the
            wrong way, the machine arrives, sees an empty page, and leaves.
          </P>

          <P>
            <strong className="font-medium">
              4. There&rsquo;s a structured summary behind the scenes.
            </strong>
            <br />
            Websites can carry a hidden, machine-friendly label — a small block
            of structured data that says &ldquo;this is a business, here&rsquo;s
            its name, location, type, and contact.&rdquo; Humans never see it.
            Machines love it. It&rsquo;s cheap to add and most sites skip it.
          </P>

          <P>
            <strong className="font-medium">
              5. You&rsquo;re not blocking the readers at the door.
            </strong>
            <br />
            Every website has a small file that tells automated visitors what
            they&rsquo;re allowed to read. Some sites accidentally block AI
            crawlers entirely — usually because of a default setting nobody ever
            looked at. Being blocked means being absent from every answer.
          </P>

          <P>
            <strong className="font-medium">
              6. What&rsquo;s written about you is consistent.
            </strong>
            <br />
            If your website, your Google listing, and your social pages describe
            you three different ways, the machine gets confused — and confused
            machines either say something wrong or say nothing. Pick one clear
            description and use it everywhere.
          </P>

          <H2 id="but-my-customers-dont-use-ai" label="// objection">
            &ldquo;But my customers don&rsquo;t use AI&rdquo;
          </H2>

          <P>
            Some of them don&rsquo;t. Yet. But this is the same conversation
            businesses had about websites in 2005 and about Google Maps in 2015.
            The people who moved early didn&rsquo;t just keep up — they became
            the default answer while their competitors weren&rsquo;t in the
            room.
          </P>

          <P>
            And here&rsquo;s the quiet advantage: because so few businesses have
            thought about this, the bar is on the floor. A clearly written,
            properly built website puts you ahead of companies ten times your
            size. In AI answers, a well-described homestay in Kalimpong can
            outrank a badly-described hotel chain. The machine doesn&rsquo;t
            care about your marketing budget. It cares about whether it can
            understand you.
          </P>

          <H2 id="what-i-do-about-this" label="// how-i-build">
            What I do about this
          </H2>

          <P>
            When I build a website, AI-readability isn&rsquo;t an add-on —
            it&rsquo;s the foundation. The plain-language descriptions, the
            structured data, the machine-friendly summaries, the crawler
            permissions, the way animations are wired so they never hide
            content: all of it goes in from day one. The site you&rsquo;re
            reading this on is built exactly this way. Ask an AI about me and
            you&rsquo;ll see the result.
          </P>

          <P>
            If you&rsquo;re curious what AI currently says about <em>your</em>{" "}
            business — or worryingly, what it doesn&rsquo;t — do the test at the
            top of this article. And if you don&rsquo;t like the answer,
            that&rsquo;s a fixable problem. It&rsquo;s the kind of thing I fix.
          </P>

          <p
            className={`${col} mt-16 border-t border-hairline pt-10 text-lg italic text-ink/80`}
          >
            — Santam Kumai builds websites and digital tools that both humans
            and machines understand.{" "}
            <a
              href={WHATSAPP_PLAIN_HREF}
              target="_blank"
              rel="noopener"
              className="underline decoration-marigold underline-offset-4"
            >
              WhatsApp him
            </a>{" "}
            — it&rsquo;s really him replying.
          </p>

          <p className={`${col} machine mt-12`}>
            <Link href="/writing" className="underline underline-offset-4">
              ← All writing
            </Link>
          </p>
        </div>
      </article>
    </>
  );
}
