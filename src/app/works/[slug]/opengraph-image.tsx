import { PROJECTS, getProject } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) {
    return ogImage({
      eyebrow: "// selected-work",
      headline: "Selected work",
      machine: "{}",
    });
  }

  return ogImage({
    eyebrow: `// ${project.category}`,
    headline: project.name,
    machine: `{ "case_study": "${project.slug}" }`,
  });
}
