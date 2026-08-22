import { EMAIL, SITE_URL, WHATSAPP_PLAIN_HREF } from "@/lib/site";

/** Section 8.3 — generated so the domain lives in exactly one place. */
export const dynamic = "force-static";

const BODY = `# Santam Kumai

Technology, Research & Digital Delivery generalist based in Kalimpong, West Bengal, India.

Santam works across technology, research, digital products, and client delivery. He helps
understand messy problems, explore options, gather requirements, and turn ideas into
practical websites, tools, workflows, and digital projects. Websites are what people usually
hire him for; broad technical understanding, research depth, and clear communication are why
they keep his number.

## Work
- Kalimpong Bungalow — heritage bed & breakfast website: https://kalimpongbungalow.com (case: ${SITE_URL}/works/kalimpong-bungalow)
- Satori Stay — mountain retreat website: https://avinaybnb.vercel.app (case: ${SITE_URL}/works/satori-stay)
- Teesta — end-to-end e-commerce store for a clothing label, with inventory back office (case: ${SITE_URL}/works/teesta)
- Rasid — invoice studio for freelancers and small businesses (case: ${SITE_URL}/works/rasid)

## Writing
- You Mention a Product Once, and the Ad Appears. Is Your Phone Listening?: ${SITE_URL}/writing/is-your-phone-listening
- When Someone Asks AI About Your Business, What Does It Say?: ${SITE_URL}/writing/when-ai-talks-about-your-business

## Contact
- WhatsApp: ${WHATSAPP_PLAIN_HREF}
- Email: ${EMAIL}
`;

export function GET() {
  return new Response(BODY, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
