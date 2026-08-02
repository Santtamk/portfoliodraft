import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

/** Section 8.5 — 1200×630, pine ground, serif headline, mono line at the foot. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#161614";
const MIST = "#DEDCD6";
const PINE = "#131314";
const MARIGOLD = "#F0EEE9";
const MOSS = "#A3A19B";

async function font(file: string) {
  return readFile(path.join(process.cwd(), "src", "og-fonts", file));
}

/**
 * This card travels on WhatsApp, so it stays deliberately plain: one large
 * headline, one mono line, no imagery to compress into mush at thumbnail size.
 */
export async function ogImage({
  eyebrow,
  headline,
  machine,
}: {
  eyebrow: string;
  headline: string;
  machine: string;
}) {
  const [sans, code] = await Promise.all([
    font("Switzer-Semibold.ttf"),
    font("FragmentMono-Regular.ttf"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: PINE,
        padding: "72px 80px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            backgroundColor: MARIGOLD,
          }}
        />
        <div
          style={{
            fontFamily: "Fragment Mono",
            fontSize: 22,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: MOSS,
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontFamily: "Switzer",
          fontWeight: 600,
          fontSize: headline.length > 46 ? 76 : 96,
          lineHeight: 0.98,
          letterSpacing: "-0.04em",
          color: MIST,
          maxWidth: 1000,
        }}
      >
        {headline}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid rgba(239,241,236,0.18)`,
          paddingTop: 28,
        }}
      >
        <div
          style={{
            fontFamily: "Fragment Mono",
            fontSize: 20,
            color: MOSS,
            maxWidth: 860,
            overflow: "hidden",
          }}
        >
          {machine}
        </div>
        <div
          style={{
            fontFamily: "Fragment Mono",
            fontSize: 20,
            color: INK,
            backgroundColor: MARIGOLD,
            padding: "10px 18px",
            borderRadius: 2,
          }}
        >
          santam
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Switzer", data: sans, style: "normal", weight: 600 },
        { name: "Fragment Mono", data: code, style: "normal", weight: 400 },
      ],
    },
  );
}
