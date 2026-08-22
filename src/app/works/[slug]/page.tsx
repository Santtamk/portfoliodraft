import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { ShotFrame } from "@/components/ShotFrame";
import { BarLink, Eyebrow, PlaceholderFrame } from "@/components/ui";
import { PROJECTS, getProject } from "@/lib/content";
import { projectSchema } from "@/lib/schema";
import { PERSON, SITE_URL, WHATSAPP_HREF } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const title = `${project.name} — Case Study — ${PERSON.name}`;
  return {
    title,
    description: project.oneLiner,
    alternates: { canonical: `/works/${project.slug}` },
    openGraph: {
      title,
      description: project.oneLiner,
      url: `${SITE_URL}/works/${project.slug}`,
      type: "article",
    },
  };
}

export default async function CasePage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((item) => item.slug === project.slug);
  const previous = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <article>
      <JsonLd data={projectSchema(project)} />

      <header className="shell pt-36 pb-16 md:pt-48 md:pb-24">
        <Eyebrow>{project.category}</Eyebrow>
        <h1 className="display-1 mt-6 max-w-[12ch]">{project.name}</h1>
        <p className="mt-8 max-w-[52ch] text-lg text-ink/80">
          {project.oneLiner}
        </p>
        {project.live ? (
          <p className="machine mt-8">
            <a
              href={project.live}
              target="_blank"
              rel="noopener"
              className="underline decoration-[var(--surface-line)] underline-offset-4 transition-colors hover:text-ink"
            >
              Visit the live site ↗
            </a>
          </p>
        ) : null}
      </header>

      <div className="shell flex flex-col gap-8 md:gap-14">
        {project.shots.length > 0 ? (
          project.shots.map((shot, index) => {
            const portrait = shot.height > shot.width;
            return (
              <figure
                key={shot.src}
                className={portrait ? "mx-auto w-full max-w-[340px]" : ""}
              >
                <ShotFrame
                  shot={shot}
                  aspect={portrait ? "aspect-[390/700]" : "aspect-[16/8.6]"}
                  sizes={
                    portrait
                      ? "(min-width: 768px) 340px, 100vw"
                      : "(min-width: 1440px) 1312px, 100vw"
                  }
                  parallax={6}
                  /* The first shot is this page's LCP element — lazy-loading it
                     cost ~1.9s of load delay. */
                  priority={index === 0}
                />
              </figure>
            );
          })
        ) : (
          <PlaceholderFrame label={`${project.name} · case study`} />
        )}
      </div>

      <section
        className="section-y"
        aria-labelledby={`thinking-${project.slug}`}
      >
        <Reveal className="shell">
          <h2
            id={`thinking-${project.slug}`}
            className="display-2 max-w-[14ch]"
          >
            The thinking
          </h2>
          <p className="measure mt-8 text-lg leading-relaxed text-ink/80 md:text-xl">
            {project.thinking}
          </p>

          {project.problem || project.role ? (
            <div className="mt-16 grid gap-10 border-t border-ink/60 pt-12 md:grid-cols-2 md:gap-14">
              {project.context || project.problem ? (
                <div>
                  <h3 className="machine text-marigold">Context &amp; Problem</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink/80 md:text-lg">
                    {project.context ? `${project.context} ` : ""}
                    {project.problem}
                  </p>
                </div>
              ) : null}

              {project.role ? (
                <div>
                  <h3 className="machine text-marigold">My Role</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink/80 md:text-lg">
                    {project.role}
                  </p>
                </div>
              ) : null}

              {project.approach ? (
                <div>
                  <h3 className="machine text-marigold">The Approach</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink/80 md:text-lg">
                    {project.approach}
                  </p>
                </div>
              ) : null}

              {project.outcome ? (
                <div>
                  <h3 className="machine text-marigold">Practical Outcome</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink/80 md:text-lg">
                    {project.outcome}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </Reveal>
      </section>

      <section className="shell border-t border-ink/60 py-10">
        <h2 className="sr-only">Built with</h2>
        <p className="machine">{project.tech.join(" · ")}</p>
      </section>

      <section className="surface-pine grain section-y" aria-label="Next steps">
        <div className="shell flex flex-col gap-10">
          <p className="display-2 max-w-[16ch]">Want something like this?</p>
          <BarLink
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener"
            variant="marigold"
          >
            WhatsApp me
          </BarLink>
        </div>
      </section>

      <nav
        aria-label="More projects"
        className="shell grid gap-6 border-t border-ink/60 py-12 sm:grid-cols-2"
      >
        <Link href={`/works/${previous.slug}`} className="group">
          <span className="machine">Previous</span>
          <span className="mt-2 block text-xl transition-colors group-hover:text-marigold md:text-2xl">
            {previous.name}
          </span>
        </Link>
        <Link href={`/works/${next.slug}`} className="group sm:text-right">
          <span className="machine">Next</span>
          <span className="mt-2 block text-xl transition-colors group-hover:text-marigold md:text-2xl">
            {next.name}
          </span>
        </Link>
      </nav>
    </article>
  );
}
