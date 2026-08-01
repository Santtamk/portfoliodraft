import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "About Santam Kumai — understanding first, code second.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "// about",
    headline: "Understanding first, code second.",
    machine: '{ "based_in": "Kalimpong, India" }',
  });
}
