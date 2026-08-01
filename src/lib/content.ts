/**
 * All site copy that is reused across routes. Copy is final per the master
 * spec — do not paraphrase.
 */

export type Shot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  name: string;
  category: string;
  oneLiner: string;
  /** Live URL, when the project is publicly visitable. */
  live?: string;
  thinking: string;
  tech: string[];
  /** Card / hover-preview image. Undefined → styled placeholder frame. */
  card?: Shot;
  /** Case-page scroll images. Empty → placeholder frames. */
  shots: Shot[];
};

export const PROJECTS: Project[] = [
  {
    slug: "kalimpong-bungalow",
    name: "Kalimpong Bungalow",
    category: "Hospitality & Heritage",
    oneLiner:
      "A cultural bed & breakfast site, shaped around the quiet luxury of heritage travel.",
    live: "https://kalimpongbungalow.com",
    thinking:
      "A heritage bed & breakfast doesn't need to shout. The site moves slowly on purpose — large photography, calm type, and a booking path that never makes the guest hunt. Every choice serves the feeling of arriving somewhere quiet.",
    tech: ["Next.js", "TypeScript", "Tailwind", "GSAP"],
    card: {
      src: "/work/kalimpong-bungalow-desktop-1.webp",
      alt: "Kalimpong Bungalow website homepage showing the heritage building and booking call-to-action",
      width: 1440,
      height: 900,
    },
    shots: [
      {
        src: "/work/kalimpong-bungalow-desktop-1.webp",
        alt: "Kalimpong Bungalow website homepage showing the heritage building and booking call-to-action",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/kalimpong-bungalow-desktop-2.webp",
        alt: "Kalimpong Bungalow website scrolled to the section introducing the house and its history",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/kalimpong-bungalow-mobile.webp",
        alt: "Kalimpong Bungalow website on a phone, showing the mobile homepage and booking button",
        width: 780,
        height: 1688,
      },
      {
        src: "/work/kalimpong-bungalow-desktop-3.webp",
        alt: "Kalimpong Bungalow website further down the page, showing rooms and guest information",
        width: 1440,
        height: 900,
      },
    ],
  },
  {
    slug: "satori-stay",
    name: "Satori Stay",
    category: "Hospitality & Nature",
    oneLiner:
      "A curated mountain retreat site built for instant atmosphere and quick booking.",
    live: "https://avinaybnb.vercel.app",
    thinking:
      "Mountain retreat visitors decide in seconds: does this place feel right, and can I book it fast? The design answers both immediately — photography-led atmosphere up top, clear calls to action always within reach.",
    tech: ["Next.js", "TypeScript", "Tailwind"],
    card: {
      src: "/work/satori-stay-desktop-1.webp",
      alt: "Satori Stay website homepage showing the mountain retreat photography and booking call-to-action",
      width: 1440,
      height: 900,
    },
    shots: [
      {
        src: "/work/satori-stay-desktop-1.webp",
        alt: "Satori Stay website homepage showing the mountain retreat photography and booking call-to-action",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/satori-stay-desktop-2.webp",
        alt: "Satori Stay website scrolled to the section describing the retreat and its surroundings",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/satori-stay-mobile.webp",
        alt: "Satori Stay website on a phone, showing the mobile homepage and booking button",
        width: 780,
        height: 1688,
      },
      {
        src: "/work/satori-stay-desktop-3.webp",
        alt: "Satori Stay website further down the page, showing rooms and rates",
        width: 1440,
        height: 900,
      },
    ],
  },
  {
    slug: "route-kind",
    name: "RouteKind",
    category: "Operational Tools",
    oneLiner:
      "A courier route-planning board that reduces dispatcher stress under time pressure.",
    thinking:
      "Dispatchers work under time pressure; every extra click is stress. RouteKind puts the whole picture on one board — routes, load, status — so decisions happen at a glance instead of across five tabs.",
    tech: ["Next.js", "Node", "PostgreSQL", "GSAP"],
    shots: [],
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}

/** Section 4.3 */
export const WHAT_I_DO = [
  {
    index: "01",
    title: "Websites & web apps",
    body: "Fast, custom-built, designed around how your visitors actually think — not around a template. From a heritage B&B to an operations dashboard.",
  },
  {
    index: "02",
    title: "Digital problem-solving",
    body: "“Can this be automated?” “Why is this so slow?” “How do I connect X to Y?” — the questions with no obvious person to ask. I'm that person. I figure things out, and I explain the answer in your language.",
  },
  {
    index: "03",
    title: "A technical brain on your side",
    body: "Choosing tools, understanding what's possible, avoiding expensive mistakes. If you've ever nodded along in a tech conversation while understanding nothing — talk to me instead.",
  },
] as const;

/**
 * Section 4.5. `text` renders as-is; `emphasis` marks the single word set in
 * display italic. `machine` is a decorative aria-hidden annotation.
 */
export type Statement = {
  text: string;
  machine: string;
  emphasis?: string;
  href?: string;
};

export const HOW_I_THINK: Statement[] = [
  {
    text: "I can explain how a WhatsApp message reaches a business dashboard, why one site loads instantly and another crawls, and what today's smartest tools can genuinely do — in words your grandmother would follow.",
    machine: 'explains: ["apis", "performance", "modern_tooling"]',
    href: "/writing/when-ai-talks-about-your-business",
  },
  {
    text: "When a new tool ships, I've usually tried it before it trends. Knowing what exists is half of solving any problem.",
    machine: 'tried_at: "release" not "hype_peak"',
  },
  {
    text: "I read documentation the way other people read the news.",
    machine: "parses_changelogs: true",
  },
  {
    text: "Good technology is invisible. My job is choosing the right pieces and wiring them so you never have to think about them.",
    machine: 'success_metric: "you_never_noticed"',
  },
  {
    text: "I'll tell you when something doesn't need to be built. That advice is free, and it's saved my clients more than anything I've charged.",
    emphasis: "doesn't",
    machine: 'optimizes_for: "client_outcome" not "billable_scope"',
  },
];

/** Section 5 */
export const ARTICLE = {
  slug: "when-ai-talks-about-your-business",
  title: "When Someone Asks AI About Your Business, What Does It Say?",
  description:
    "People now ask ChatGPT and other AI tools for recommendations instead of Googling. Here's how to make sure AI can find, understand, and mention your business.",
  teaser:
    "People now ask AI for recommendations instead of Googling. Is your business in the answer?",
  date: "2026-08-01",
  dateLabel: "August 2026",
  readingTime: "5 min",
} as const;

/** The mono line that types itself under the hero headline (Section 3.3). */
export const MACHINE_VOICE_LINE =
  '{ "name": "Santam Kumai", "does": "makes technology make sense", "readable_by": ["humans", "machines"] }';
