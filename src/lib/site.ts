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
export const WHATSAPP = DEFAULT_WHATSAPP;

/** Public contact email, rendered as a real visible mailto: link. */
export const EMAIL = "team@1947.io";

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
export const PHOTO = "";

export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP}?text=Hi%20Santam`;
/** Bare link, used in prose and llms.txt where no prefilled text is wanted. */
export const WHATSAPP_PLAIN_HREF = `https://wa.me/${WHATSAPP}`;
export const EMAIL_HREF = `mailto:${EMAIL}`;

export const PERSON = {
  name: "Santam Kumai",
  jobTitle: "Product & Design Engineer",
  location: "Kalimpong, India",
  description:
    "Product and design engineer in Kalimpong, India. Builds custom websites, web apps, and digital tools, and helps businesses and non-technical people solve technology problems in plain language.",
} as const;
