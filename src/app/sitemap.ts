import type { MetadataRoute } from "next";
import { ARTICLES, PROJECTS } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/** Section 8.6 — every route, no exceptions. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(ARTICLES[0].date);

  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified, priority: 0.7 },
    { url: `${SITE_URL}/writing`, lastModified, priority: 0.7 },
    ...ARTICLES.map((article) => ({
      url: `${SITE_URL}/writing/${article.slug}`,
      lastModified: new Date(article.date),
      priority: 0.8,
    })),
    ...PROJECTS.map((project) => ({
      url: `${SITE_URL}/works/${project.slug}`,
      lastModified,
      priority: 0.8,
    })),
  ];
}
