import type { Article, Project } from "@/lib/content";
import { EMAIL, GITHUB, LINKEDIN, PERSON, SITE_URL } from "@/lib/site";

const sameAs = [GITHUB, LINKEDIN].filter(Boolean);

/** Section 8.2 — Person, present on every page. */
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: PERSON.name,
  jobTitle: PERSON.jobTitle,
  description: PERSON.description,
  url: SITE_URL,
  email: `mailto:${EMAIL}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kalimpong",
    addressRegion: "West Bengal",
    addressCountry: "IN",
  },
  ...(sameAs.length ? { sameAs } : {}),
  knowsAbout: [
    "Web development",
    "Product design",
    "Frontend engineering",
    "TypeScript",
    "Next.js",
    "Web performance",
    "Automation",
    "Digital strategy",
  ],
} as const;

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: `${PERSON.name} — ${PERSON.jobTitle}`,
  url: SITE_URL,
  description: PERSON.description,
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#person` },
} as const;

/** Section 8.2 — case pages. */
export function projectSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": project.live ? "WebSite" : "CreativeWork",
    name: project.name,
    description: project.oneLiner,
    url: project.live ?? `${SITE_URL}/works/${project.slug}`,
    ...(project.live
      ? { mainEntityOfPage: `${SITE_URL}/works/${project.slug}` }
      : {}),
    genre: project.category,
    creator: { "@id": `${SITE_URL}/#person` },
  };
}

/** Section 8.2 — article pages. */
export function articleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: `${SITE_URL}/writing/${article.slug}`,
    url: `${SITE_URL}/writing/${article.slug}`,
    inLanguage: "en",
  };
}
