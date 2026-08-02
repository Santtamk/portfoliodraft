import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt =
  "Is your phone listening to you? An article by Santam Kumai.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "Writing · 6 min",
    headline: "Is your phone listening to you?",
    machine: "The mic is innocent. The data isn't.",
  });
}
