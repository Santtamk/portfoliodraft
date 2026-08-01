import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt =
  "What does AI say about your business? An article by Santam Kumai.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "// writing · 5 min",
    headline: "What does AI say about your business?",
    machine: '{ "answer_source": "what_it_can_read_about_you" }',
  });
}
