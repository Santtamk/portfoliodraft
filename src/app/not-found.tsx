import type { Metadata } from "next";
import { BarLink, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found — Santam Kumai",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="shell flex min-h-svh flex-col justify-center pt-36 pb-24">
      <Eyebrow>404</Eyebrow>
      <h1 className="display-1 mt-6 max-w-[14ch]">
        That page isn&rsquo;t here.
      </h1>
      <p className="mt-8 max-w-[46ch] text-lg text-ink/80">
        The link is either old or slightly wrong. The work, the writing, and the
        way to reach me are all one click away.
      </p>
      <div className="mt-10 flex max-w-xl flex-col gap-2">
        <BarLink href="/">Back home</BarLink>
        <BarLink href="/#work" variant="ghost">
          See my work
        </BarLink>
      </div>
    </div>
  );
}
