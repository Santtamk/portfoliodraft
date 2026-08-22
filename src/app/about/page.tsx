import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion";
import { BarLink, Eyebrow } from "@/components/ui";
import { PERSON, PHOTO, SITE_URL, WHATSAPP_HREF } from "@/lib/site";

const description =
  "Santam Kumai works across technology, research, and digital delivery in Kalimpong, India, turning messy problems and ideas into practical digital solutions.";

export const metadata: Metadata = {
  title: `About — ${PERSON.name}`,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About — ${PERSON.name}`,
    description,
    url: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <article className="shell pt-36 pb-24 md:pt-48">
      <Eyebrow>About</Eyebrow>

      <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
        <Reveal>
          <h1 className="display-1 max-w-[14ch]">
            Understanding first, practical delivery second.
          </h1>
          <p className="measure mt-10 text-lg leading-relaxed text-ink/80">
            I&rsquo;m Santam, based in Kalimpong, India. My official title is
            Chief of Staff at a small consulting and tech firm, but in practice,
            I work as a hands-on generalist across technology, research, digital
            products, and client delivery.
          </p>
          <p className="measure mt-6 text-lg leading-relaxed text-ink/80">
            I don&rsquo;t just write code or drop templates. I help figure out
            what problem actually needs solving, research possible options, gather
            client requirements, and turn vague ideas into clear, practical
            websites, tools, and workflows. Websites are what people usually hire
            me for; broad technical understanding, research depth, and clear
            communication are why they keep my number.
          </p>
          <div className="mt-12">
            <BarLink
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener"
              variant="marigold"
            >
              WhatsApp me
            </BarLink>
          </div>
        </Reveal>

        {PHOTO ? (
          <figure className="self-start overflow-hidden rounded-[2px]">
            <Image
              src={PHOTO}
              alt="Portrait of Santam Kumai, developer and technology advisor, in Kalimpong"
              width={640}
              height={800}
              sizes="(min-width: 1024px) 320px, 100vw"
              className="h-auto w-full"
            />
          </figure>
        ) : null}
      </div>
    </article>
  );
}
