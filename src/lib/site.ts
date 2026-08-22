/**
 * Single source of truth for every value marked as a placeholder in
 * PORTFOLIO-MASTER-SPEC.md Section 0. Edit here, nowhere else.
 *
 * Anything still set to a DEFAULT_* sentinel below is a value that has to be
 * confirmed by Santam before the site goes to a real domain. `npm run
 * check:placeholders` fails the build while a sentinel is still in place.
 */

/** Sentinels — see README "Before you ship". */
export const DEFAULT_WHATSAPP = "919800000000";
export const DEFAULT_DOMAIN = "santam.dev";

/** Full WhatsApp number, country code first, digits only. */
export const WHATSAPP = "918967390163";

/** Public contact email, rendered as a real visible mailto: link. */
export const EMAIL = "santtamk@gmail.com";

/** Production domain, no protocol, no trailing slash. */
export const DOMAIN = DEFAULT_DOMAIN;

/** Canonical origin built from DOMAIN. */
export const SITE_URL = `https://${DOMAIN}`;

export const GITHUB = "https://github.com/santamkumai";

/** Optional. Empty string means "omit everywhere" (schema, footer). */
export const LINKEDIN = "";

/**
 * Kalimpong Bungalow testimonial attribution. Stays as "Client" until the
 * client confirms permission to be named.
 */
export const CLIENT_NAME = "Client";

/**
 * Portrait of Santam for the About page. Empty string means the portrait block
 * is skipped entirely (Section 4.9).
 */
export const PHOTO = "/santam-portrait.jpg";

export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP}?text=Hi%20Santam`;
/** Bare link, used in prose and llms.txt where no prefilled text is wanted. */
export const WHATSAPP_PLAIN_HREF = `https://wa.me/${WHATSAPP}`;
export const EMAIL_HREF = `mailto:${EMAIL}`;

export const PERSON = {
  name: "Santam Kumai",
  jobTitle: "Technology, Research & Digital Delivery",
  location: "Kalimpong, India",
  description:
    "Generalist working across technology, research, and digital delivery in Kalimpong, India. Helps turn messy problems and ideas into practical websites, tools, workflows, and digital solutions.",
} as const;
