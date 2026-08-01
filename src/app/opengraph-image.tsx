import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt =
  "Santam Kumai — Product & Design Engineer, Kalimpong. I make technology make sense.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "Kalimpong, India · Product & Design Engineer",
    headline: "I make technology make sense.",
    machine: '{ "readable_by": ["humans", "machines"] }',
  });
}
