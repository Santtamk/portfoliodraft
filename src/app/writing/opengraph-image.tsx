import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt =
  "Writing by Santam Kumai — notes on making sense of technology.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "// writing",
    headline: "Notes on making sense of technology.",
    machine: '{ "articles": 1, "jargon": 0 }',
  });
}
