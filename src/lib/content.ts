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
      "A heritage bed & breakfast doesn't need to shout. The site moves slowly on purpose: large photography, calm type, and a booking path that never makes the guest hunt. Every choice serves the feeling of arriving somewhere quiet.",
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
      "Mountain retreat visitors decide in seconds: does this place feel right, and can I book it fast? The design answers both immediately, with photography-led atmosphere up top and clear calls to action always within reach.",
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
      "A working store for an independent clothing label: catalog, cart, checkout, and a back office for inventory.",
    thinking:
      "A shop has two customers: the person buying and the person restocking at eleven at night. Teesta gives both the same care. A quiet, lookbook-style storefront in front, and a back office where stock, orders, and product changes are two clicks. The shelf can never oversell: every order checks and reserves inventory in one atomic step.",
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
    slug: "khata",
    name: "Khata",
    category: "Operational Tools",
    oneLiner:
      "A front-desk system for small guesthouses: every room, every night, and the whole month on one screen.",
    thinking:
      "Most small guesthouses run on a paper ledger and a good memory, and both fail on a busy weekend. Khata is that ledger, made honest: arrivals and departures for today, a month board where every room-night is visible at a glance, and a booking form that checks the calendar before it saves, so a double booking can't be written, only politely refused.",
    tech: ["Next.js", "TypeScript", "SQLite", "Tailwind"],
    card: {
      src: "/work/khata-desktop-2.webp",
      alt: "Khata calendar board showing a month of bookings across eight guesthouse rooms",
      width: 1440,
      height: 900,
    },
    shots: [
      {
        src: "/work/khata-desktop-2.webp",
        alt: "Khata calendar board showing a month of bookings across eight guesthouse rooms",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/khata-desktop-1.webp",
        alt: "Khata dashboard with today's arrivals, departures, in-house guests, and occupancy",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/khata-mobile.webp",
        alt: "Khata dashboard on a phone, showing today's stats and check-in buttons",
        width: 780,
        height: 1688,
      },
      {
        src: "/work/khata-desktop-3.webp",
        alt: "Khata bookings table with stay dates, totals, sources, and status workflow actions",
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
      "An invoice studio where the document is the interface: typeset like print, with the boring machinery done right underneath.",
    thinking:
      "Everyone judges an invoice in two seconds, and everyone underestimates the software behind a good one. Rasid puts the document at the centre, a properly typeset A4 sheet you edit live in three typographic voices, while the engine quietly handles what generic tools fumble: numbering that never skips, GST that splits itself, the amount in words, share links for clients, and a desk that knows who still owes you.",
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
    title: "Websites & web apps",
    body: "Fast, custom-built, designed around how your visitors actually think, not around a template. From a heritage B&B to an operations dashboard.",
  },
  {
    index: "02",
    title: "Digital problem-solving",
    body: "“Can this be automated?” “Why is this so slow?” “How do I connect X to Y?” These are the questions with no obvious person to ask. I'm that person. I figure things out, and I explain the answer in your language.",
  },
  {
    index: "03",
    title: "A technical brain on your side",
    body: "Choosing tools, understanding what's possible, avoiding expensive mistakes. If you've ever nodded along in a tech conversation while understanding nothing, talk to me instead.",
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
    text: "I can explain how a WhatsApp message reaches a business dashboard, why one site loads instantly and another crawls, and what today's smartest tools can genuinely do, in words your grandmother would follow.",
    machine: "In practice: I explain the how and the why in plain words, every time.",
    href: "/writing/when-ai-talks-about-your-business",
  },
  {
    text: "When a new tool ships, I've usually tried it before it trends. Knowing what exists is half of solving any problem.",
    machine: "In practice: by the time a tool is trending, I've already formed an opinion.",
  },
  {
    text: "I read documentation the way other people read the news.",
    machine: "In practice: release notes are my morning newspaper.",
  },
  {
    text: "Good technology is invisible. My job is choosing the right pieces and wiring them so you never have to think about them.",
    machine: "In practice: if you never think about your website, I did my job.",
  },
  {
    text: "I'll tell you when something doesn't need to be built. That advice is free, and it's saved my clients more than anything I've charged.",
    emphasis: "doesn't",
    machine: "In practice: I'd rather save you a build than sell you one.",
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
  "Currently building booking sites and dashboards, and answering odd questions on WhatsApp.";
