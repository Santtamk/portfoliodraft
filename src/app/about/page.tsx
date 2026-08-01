import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { PERSON, PHOTO, SITE_URL, WHATSAPP_HREF } from "@/lib/site";

const description =
  "Santam Kumai is a product and design engineer in Kalimpong, India, building custom, high-performance web systems around real workflow friction.";

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
      <Eyebrow>{"// about"}</Eyebrow>

      <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
        <Reveal>
          <h1 className="display-1 max-w-[12ch]">
            Understanding first, code second.
          </h1>
          <p className="measure mt-10 text-lg leading-relaxed text-ink/80">
            I&rsquo;m Santam — a product and design engineer in Kalimpong,
            India. I don&rsquo;t just write code or drop templates. I study how
            a business operates, how its customers think, and build custom,
            high-performance web systems around real workflow friction. Websites
            are what people usually hire me for. Staying genuinely current with
            technology — and translating it into plain language — is why they
            keep my number.
          </p>
          <div className="mt-12">
            <ButtonLink href={WHATSAPP_HREF} target="_blank" rel="noopener">
              WhatsApp me
            </ButtonLink>
          </div>
        </Reveal>

        {PHOTO ? (
          <figure className="group self-start overflow-hidden rounded-[2px]">
            <Image
              src={PHOTO}
              alt="Portrait of Santam Kumai, product and design engineer, in Kalimpong"
              width={640}
              height={800}
              sizes="(min-width: 1024px) 320px, 100vw"
              className="h-auto w-full grayscale transition-[filter] duration-500 group-hover:grayscale-0"
            />
          </figure>
        ) : null}
      </div>
    </article>
  );
}
