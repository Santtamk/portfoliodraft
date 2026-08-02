import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { ReadingProgress } from "@/components/ReadingProgress";
import { Eyebrow } from "@/components/ui";
import { ARTICLE_PHONE_LISTENING as ARTICLE } from "@/lib/content";
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

/** Diagram panel. Sits on the charcoal surface so the tokens adapt. */
function Figure({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure
      className={`${col} surface-pine mt-12 rounded-[2px] border border-hairline p-5 md:p-7`}
    >
      {children}
      <figcaption className="machine mt-5 border-t border-hairline pt-4">
        {caption}
      </figcaption>
    </figure>
  );
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
      <JsonLd data={articleSchema(ARTICLE)} />

      <article id="article" className="shell pt-36 pb-24 md:pt-48">
        <div className="lg:mx-auto lg:grid lg:w-fit lg:grid-cols-[9rem_minmax(0,65ch)] lg:gap-x-12">
          <div className={col}>
            <Eyebrow>Writing</Eyebrow>
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
            It&rsquo;s happened to you. You&rsquo;re having tea with a friend,
            talking about trekking shoes. Just talking, phone face-down on the
            table. That evening you open Instagram, and there they are. The
            exact shoes. Maybe the exact brand.
          </P>

          <P>
            Your stomach drops a little. The only explanation that makes sense
            is the creepy one: <em>the phone was listening.</em>
          </P>

          <P>
            It almost certainly wasn&rsquo;t. But the real explanation
            isn&rsquo;t comforting. In some ways it&rsquo;s stranger: the
            advertising industry knows you well enough that it{" "}
            <strong className="font-medium">doesn&rsquo;t need</strong> your
            microphone.
          </P>

          <H2 id="the-short-answer" label="The verdict">
            First, the short answer: no
          </H2>

          <P>
            People have genuinely checked. In 2018, researchers at Northeastern
            University tested over 17,000 popular apps, watching every byte
            each one sent out, waiting for secret audio. They found none. Not
            one app quietly recorded conversations and shipped them to
            advertisers. (They did catch a few apps doing other shady things,
            like recording the screen, but no hot mics.)
          </P>

          <P>
            There&rsquo;s also a boring, practical argument. Constantly
            processing audio drains battery and data in ways both engineers
            and the phone&rsquo;s own battery-usage screen would notice
            immediately. Both Apple and Android also show an indicator dot
            whenever any app touches the microphone. A conspiracy this size,
            involving thousands of companies, with this many ways to get
            caught, and after fifteen years nobody has produced solid technical
            evidence of it.
          </P>

          <P>
            And the deciding reason is the least flattering one:{" "}
            <strong className="font-medium">
              listening would be expensive, illegal, and (this is the part
              that stings) unnecessary.
            </strong>{" "}
            The ad appeared through channels far cheaper than audio.
          </P>

          <H2 id="how-the-trick-works" label="The trick">
            How the trick actually works
          </H2>

          <P>
            Here&rsquo;s the plain-language version. That ad found you through
            some mix of these:
          </P>

          <P>
            <strong className="font-medium">
              1. You were with your friend, and the system knows it.
            </strong>
            <br />
            Your phones sat on the same table, on the same Wi-Fi, in the same
            location. Ad systems treat &ldquo;these two devices spend time
            together&rdquo; as a relationship. If your friend searched for
            those shoes yesterday (and they probably did; that&rsquo;s why
            they brought them up), showing <em>you</em> the same product is an
            obvious, cheap bet.
          </P>

          <Figure caption="Fig. 1 · No microphone required: shared places and shared networks already connect you.">
            <svg
              viewBox="0 0 640 320"
              role="img"
              aria-label="Diagram: two phones on the same table and Wi-Fi are linked by the ad platform, so a friend's search becomes your ad."
              className="w-full font-mono"
              fontSize={12}
            >
              <rect
                x={70}
                y={36}
                width={160}
                height={56}
                rx={2}
                fill="none"
                style={{ stroke: "var(--surface-line)" }}
              />
              <text x={150} y={68} textAnchor="middle" fill="currentColor">
                your phone
              </text>
              <rect
                x={410}
                y={36}
                width={160}
                height={56}
                rx={2}
                fill="none"
                style={{ stroke: "var(--surface-line)" }}
              />
              <text x={490} y={68} textAnchor="middle" fill="currentColor">
                friend&rsquo;s phone
              </text>
              <line
                x1={230}
                y1={64}
                x2={410}
                y2={64}
                strokeDasharray="4 4"
                style={{ stroke: "var(--surface-line)" }}
              />
              <text
                x={320}
                y={52}
                textAnchor="middle"
                style={{ fill: "var(--surface-muted)" }}
              >
                same table · same wi-fi
              </text>
              <line
                x1={150}
                y1={92}
                x2={280}
                y2={170}
                style={{ stroke: "var(--surface-line)" }}
              />
              <line
                x1={490}
                y1={92}
                x2={360}
                y2={170}
                style={{ stroke: "var(--surface-line)" }}
              />
              <rect
                x={170}
                y={170}
                width={300}
                height={64}
                rx={2}
                fill="none"
                style={{ stroke: "var(--surface-line)" }}
              />
              <text x={320} y={196} textAnchor="middle" fill="currentColor">
                ad platform
              </text>
              <text
                x={320}
                y={216}
                textAnchor="middle"
                style={{ fill: "var(--surface-muted)" }}
              >
                &ldquo;these devices are related&rdquo;
              </text>
              <line
                x1={320}
                y1={234}
                x2={320}
                y2={264}
                style={{ stroke: "var(--surface-line)" }}
              />
              <text x={320} y={290} textAnchor="middle" fill="currentColor">
                their search yesterday becomes your ad today
              </text>
            </svg>
          </Figure>

          <P>
            <strong className="font-medium">
              2. You already left a trail and forgot.
            </strong>
            <br />
            A glance at a shoe review three weeks ago. A trekking video you
            didn&rsquo;t skip. A friend&rsquo;s photo you lingered on. None of
            it felt like &ldquo;shopping,&rdquo; so you don&rsquo;t remember
            it. But it was all recorded, and it all points the same direction.
          </P>

          <P>
            <strong className="font-medium">
              3. People like you buy things like this.
            </strong>
            <br />
            This is the piece most people underestimate. Advertisers build
            &ldquo;lookalike audiences&rdquo;: find everyone who bought the
            shoes, then find everyone whose behaviour resembles theirs in age,
            place, interests, the accounts they follow, and the hours
            they&rsquo;re online. If ten thousand people who look
            statistically like you bought trekking shoes this month, you were
            getting that ad anyway. The conversation didn&rsquo;t trigger the
            ad. The same forces that led to the ad (season, your circle, your
            feeds) also led to the conversation.
          </P>

          <P>
            <strong className="font-medium">
              4. The ad was probably there before. You just didn&rsquo;t see
              it.
            </strong>
            <br />
            Psychologists call it the frequency illusion. You scroll past
            hundreds of ads a week and register almost none. After the
            conversation, &ldquo;trekking shoes&rdquo; is suddenly loaded in
            your mind, and <em>now</em> the ad jumps out. The ads for things
            you never discussed? Invisible. Nobody texts a friend saying
            &ldquo;weird, I got an ad for something we never talked
            about.&rdquo; The misses are forgotten; the one spooky hit becomes
            a story.
          </P>

          <H2 id="the-technical-version" label="Under the hood">
            The technical version
          </H2>

          <P>
            For the readers who want the machinery, here&rsquo;s what&rsquo;s
            under the hood.
          </P>

          <P>
            Your phone carries an{" "}
            <strong className="font-medium">advertising ID</strong>, a
            resettable serial number that apps can read and attach events to.
            Every app with an ad or analytics SDK inside it (most of them)
            reports what you do alongside that ID. Data brokers merge these
            streams, plus purchase data and location pings, into a profile,
            then link your phone, laptop, and TV into one identity using
            logins and shared IP addresses. That linking is called a{" "}
            <strong className="font-medium">device graph</strong>, and
            it&rsquo;s how two phones on one home Wi-Fi end up seeing related
            ads.
          </P>

          <P>
            Then, every time a page or feed with ad space loads, an auction
            runs. This is{" "}
            <strong className="font-medium">real-time bidding</strong>. In
            roughly a tenth of a second, the ad exchange broadcasts
            &ldquo;user with these traits is looking at ad slot,&rdquo;
            advertisers&rsquo; systems consult their models and bid, and the
            winner&rsquo;s ad renders before the page finishes loading. The
            targeting models are trained on billions of these events. They
            don&rsquo;t need to hear you say &ldquo;trekking shoes.&rdquo;
            They predicted weeks ago that you were the kind of person about to
            want them, with accuracy that feels like eavesdropping.
          </P>

          <Figure caption="Fig. 2 · The auction that picks the ad runs in about a tenth of a second.">
            <svg
              viewBox="0 0 640 200"
              role="img"
              aria-label="Timeline: the feed opens, the ad slot is announced to an auction, advertisers bid, and the winning ad renders, all within roughly 100 milliseconds."
              className="w-full font-mono"
              fontSize={12}
            >
              <line
                x1={50}
                y1={120}
                x2={590}
                y2={120}
                style={{ stroke: "var(--surface-line)" }}
              />
              <circle cx={70} cy={120} r={3.5} fill="currentColor" />
              <circle cx={240} cy={120} r={3.5} fill="currentColor" />
              <circle cx={410} cy={120} r={3.5} fill="currentColor" />
              <circle cx={560} cy={120} r={3.5} fill="currentColor" />
              <text x={70} y={96} textAnchor="middle" fill="currentColor">
                feed opens
              </text>
              <text x={240} y={96} textAnchor="middle" fill="currentColor">
                ad slot announced
              </text>
              <text x={410} y={96} textAnchor="middle" fill="currentColor">
                advertisers bid
              </text>
              <text x={560} y={96} textAnchor="middle" fill="currentColor">
                winning ad renders
              </text>
              <text
                x={70}
                y={148}
                textAnchor="middle"
                style={{ fill: "var(--surface-muted)" }}
              >
                0 ms
              </text>
              <text
                x={240}
                y={148}
                textAnchor="middle"
                style={{ fill: "var(--surface-muted)" }}
              >
                ~30 ms
              </text>
              <text
                x={410}
                y={148}
                textAnchor="middle"
                style={{ fill: "var(--surface-muted)" }}
              >
                ~70 ms
              </text>
              <text
                x={560}
                y={148}
                textAnchor="middle"
                style={{ fill: "var(--surface-muted)" }}
              >
                ~100 ms
              </text>
              <text
                x={320}
                y={184}
                textAnchor="middle"
                style={{ fill: "var(--surface-muted)" }}
              >
                one auction per ad slot, every time a page or feed loads
              </text>
            </svg>
          </Figure>

          <P>
            That&rsquo;s the honest summary of the whole phenomenon:{" "}
            <strong className="font-medium">
              it&rsquo;s not surveillance of your voice. It&rsquo;s prediction
              from your behaviour, and prediction got good enough to feel like
              magic.
            </strong>
          </P>

          <H2 id="what-you-can-do" label="The controls">
            What you can do about it
          </H2>

          <P>
            You can&rsquo;t opt out of prediction entirely, but you can blunt
            it. Reset or delete your advertising ID (both iOS and Android let
            you, under privacy settings; on iPhone it&rsquo;s &ldquo;Allow
            Apps to Request to Track,&rdquo; which you can simply turn off).
            Audit which apps have microphone and location permission, and
            revoke what doesn&rsquo;t obviously need it. Not because of secret
            listening, but because location is one of the strongest targeting
            signals there is. And in your Google and Meta account settings,
            turn off ad personalisation. You&rsquo;ll see the same number of
            ads, just dumber ones. Some people find that reassuring. Others
            miss the relevant ads within a week. Both are reasonable.
          </P>

          <P>
            The point of understanding this isn&rsquo;t paranoia. It&rsquo;s
            calibration. The scary story about the microphone distracts from
            the true story, which is quieter and bigger: an industry that
            models your behaviour well enough to finish your sentences. Once
            you see how it works, the spooky moments stop being spooky.
            They&rsquo;re just statistics, wearing a good costume.
          </P>

          <p
            className={`${col} mt-16 border-t border-hairline pt-10 text-lg italic text-ink/80`}
          >
            — Santam Kumai builds websites and digital tools, and explains
            technology in plain language. Got a &ldquo;my phone is doing
            something weird&rdquo; question?{" "}
            <a
              href={WHATSAPP_PLAIN_HREF}
              target="_blank"
              rel="noopener"
              className="underline decoration-marigold underline-offset-4"
            >
              WhatsApp him
            </a>
            ; it&rsquo;s really him replying.
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
