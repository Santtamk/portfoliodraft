import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { fontVariables } from "@/lib/fonts";
import { personSchema, websiteSchema } from "@/lib/schema";
import { PERSON, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${PERSON.name} — Developer & Technology Advisor, Kalimpong`,
  description:
    "I make technology make sense. Custom websites, digital tools, and plain-language technical help from Kalimpong, India.",
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  openGraph: {
    type: "website",
    siteName: `${PERSON.name} — ${PERSON.jobTitle}`,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#101011",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        <JsonLd data={[personSchema, websiteSchema]} />
      </head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=G-5M7N9J3Y58"
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5M7N9J3Y58');
          `}
        </Script>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Preloader />
        <SmoothScroll />
        <Cursor />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
