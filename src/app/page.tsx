import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { HowIThink } from "@/components/sections/HowIThink";
import { Testimonial } from "@/components/sections/Testimonial";
import { WhatIDo } from "@/components/sections/WhatIDo";
import { Work } from "@/components/sections/Work";
import { PERSON, SITE_URL } from "@/lib/site";

const description =
  "I make technology make sense. Custom websites, digital tools, and plain-language technical help from Kalimpong, India.";

export const metadata: Metadata = {
  title: `${PERSON.name} — Product & Design Engineer, Kalimpong`,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${PERSON.name} — Product & Design Engineer, Kalimpong`,
    description,
    url: SITE_URL,
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <WhatIDo />
      <Work />
      <HowIThink />
      <Testimonial />
      <Contact />
    </>
  );
}
