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
  context?: string;
  problem?: string;
  role?: string;
  approach?: string;
  outcome?: string;
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
      "A heritage bed & breakfast doesn't need to shout. The site moves calmly by design: large photography, uncluttered typography, and a direct booking path. Every choice serves the feeling of arriving somewhere quiet.",
    context:
      "Kalimpong Bungalow is a heritage bed & breakfast in the Himalayan foothills.",
    problem:
      "Standard hotel templates feel transactional and cluttered. Guests needed a calm digital experience that reflected the property's history while providing a straightforward path to inquire and book.",
    role:
      "Requirements gathering, user experience design, content hierarchy, and frontend development.",
    approach:
      "Started by understanding guest priorities when researching heritage stays. Structured content around room details and house history with clear, persistent contact triggers.",
    outcome:
      "Delivered a fast, responsive digital presence that represents the property authentically and connects prospective guests directly to booking.",
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
      "Mountain retreat visitors decide quickly based on atmosphere and clarity. The design highlights property visuals immediately with straightforward rate and booking access.",
    context:
      "Satori Stay is a boutique mountain retreat providing short-stay accommodation.",
    problem:
      "Visitors need immediate visual context and quick access to rates without navigating complex menu trees.",
    role:
      "Client consultation, layout structuring, mobile optimization, and web development.",
    approach:
      "Focused on immediate visual storytelling combined with accessible call-to-action buttons across all screen sizes.",
    outcome:
      "Created a clear, responsive website that lets guests explore room details and initiate bookings without friction.",
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
    slug: "teesta",
    name: "Teesta",
    category: "Commerce & Retail",
    oneLiner:
      "A working store for an independent clothing label: catalog, cart, checkout, and an inventory back office.",
    thinking:
      "An e-commerce tool serves two users: the shopper browsing products and the owner managing inventory. Teesta balances a quiet lookbook storefront with a functional back office where stock is reserved during checkout.",
    context:
      "Teesta is an independent apparel label selling limited production runs.",
    problem:
      "Small clothing brands face stock tracking issues when items sell concurrently, leading to accidental overselling.",
    role:
      "Requirement analysis, inventory workflow design, database modeling, and full storefront & back-office build.",
    approach:
      "Designed an inventory reservation mechanism during order placement paired with an uncluttered lookbook storefront.",
    outcome:
      "Built a complete storefront and stock management interface that keeps inventory numbers synchronized.",
    tech: ["Next.js", "TypeScript", "SQLite", "Tailwind"],
    card: {
      src: "/work/teesta-desktop-1.webp",
      alt: "Teesta clothing store homepage showing the hero garment illustration and shop call-to-action",
      width: 1440,
      height: 900,
    },
    shots: [
      {
        src: "/work/teesta-desktop-1.webp",
        alt: "Teesta clothing store homepage showing the hero garment illustration and shop call-to-action",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/teesta-desktop-2.webp",
        alt: "Teesta product page for the Kanchen Parka with size selection and add-to-bag button",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/teesta-mobile.webp",
        alt: "Teesta collection page on a phone, showing the product grid with category filters",
        width: 780,
        height: 1688,
      },
      {
        src: "/work/teesta-desktop-3.webp",
        alt: "Teesta back office showing the product table with per-size stock levels and publish toggles",
        width: 1440,
        height: 900,
      },
    ],
  },
  {
    slug: "rasid",
    name: "Rasid",
    category: "Money & Paperwork",
    oneLiner:
      "An invoice studio where the document is the interface: typeset like print, with automatic math underneath.",
    thinking:
      "Invoices require both visual polish and accurate calculations. Rasid pairs a live-editing A4 preview with automated handling for numbering, tax calculations, and status tracking.",
    context:
      "Freelancers and small businesses need professional invoicing without complex enterprise software.",
    problem:
      "Manual word processor templates introduce formatting glitches and calculation mistakes, while heavy SaaS tools are slow and expensive.",
    role:
      "Product research, UI layout design, calculation logic implementation, and frontend application build.",
    approach:
      "Created a split-screen workspace with a live print-ready A4 preview backed by automatic calculation engine.",
    outcome:
      "Delivered a practical invoice studio that generates clear documents and tracks client payment status.",
    tech: ["Next.js", "TypeScript", "SQLite", "Tailwind"],
    card: {
      src: "/work/rasid-desktop-1.webp",
      alt: "Rasid invoice editor with the form beside a live letterpress-style A4 invoice preview",
      width: 1440,
      height: 900,
    },
    shots: [
      {
        src: "/work/rasid-desktop-1.webp",
        alt: "Rasid invoice editor with the form beside a live letterpress-style A4 invoice preview",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/rasid-desktop-2.webp",
        alt: "Rasid desk dashboard showing outstanding, overdue, and paid-this-month totals",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/rasid-mobile.webp",
        alt: "A shared Rasid invoice opened on a phone, as a client would see it",
        width: 780,
        height: 1688,
      },
      {
        src: "/work/rasid-desktop-3.webp",
        alt: "Rasid landing page with a tilted sample invoice typeset in the letterpress theme",
        width: 1440,
        height: 900,
      },
    ],
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}

/** Section 4.3 */
export const WHAT_I_DO = [
  {
    index: "01",
    title: "Websites & Digital Products",
    body: "From public-facing websites to dashboards and internal tools, I work through the problem, user journey, and implementation—not just the visual layer.",
  },
  {
    index: "02",
    title: "Research & Solution Design",
    body: "Not every problem starts with a clear brief. I research unfamiliar subjects, compare possible approaches, and turn scattered information into something people can actually act on.",
  },
  {
    index: "03",
    title: "Client Projects & Delivery",
    body: "I work directly with clients to understand requirements, gather inputs, ask the right questions, and help move projects from vague ideas to clear deliverables.",
  },
  {
    index: "04",
    title: "Technology & AI Workflows",
    body: "I use modern tools, including AI, to research faster, explore solutions, and reduce repetitive work. The tool matters less than whether the result is actually useful.",
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
    text: "I start with the problem, not the tool. A website, tool, or workflow is only useful if it solves the right problem.",
    machine: "In practice: understanding first, build second.",
  },
  {
    text: "I'm comfortable in unfamiliar territory—researching unknown subjects, reading documentation, and working my way toward an answer.",
    machine: "In practice: no predefined process needed.",
  },
  {
    text: "If I don't understand something, I usually end up going down a rabbit hole until I do.",
    machine: "In practice: curious by default.",
  },
  {
    text: "I read documentation the way other people read the news.",
    machine: "In practice: release notes are my morning newspaper.",
  },
  {
    text: "Sometimes the best solution is the simplest one that actually works. I'll tell you when something doesn't need to be built.",
    emphasis: "doesn't",
    machine: "In practice: practical over complicated every time.",
  },
];

export type Article = {
  slug: string;
  title: string;
  description: string;
  teaser: string;
  date: string;
  dateLabel: string;
  readingTime: string;
};

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
} as const satisfies Article;

export const ARTICLE_PHONE_LISTENING = {
  slug: "is-your-phone-listening",
  title: "You Mention a Product Once, and the Ad Appears. Is Your Phone Listening?",
  description:
    "You talk about something with a friend and an ad for it shows up in your feed. Your phone almost certainly isn't listening. What's actually happening is stranger: a plain-language and technical explanation of how ad targeting really works.",
  teaser:
    "You talk about something, and the ad shows up. The mic is innocent. What's actually happening is stranger.",
  date: "2026-08-02",
  dateLabel: "August 2026",
  readingTime: "6 min",
} as const satisfies Article;

/** Newest first — the order the writing index and feeds list them in. */
export const ARTICLES: readonly Article[] = [ARTICLE_PHONE_LISTENING, ARTICLE];

/** The line that types itself under the hero headline — a live status note. */
export const MACHINE_VOICE_LINE =
  "Currently researching problems, building digital tools, and turning ideas into practical solutions.";

