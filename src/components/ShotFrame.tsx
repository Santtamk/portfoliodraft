import Image from "next/image";
import { Parallax } from "@/components/motion";
import type { Shot } from "@/lib/content";

/**
 * A screenshot in a fixed-aspect frame.
 *
 * The frame is deliberately shorter than the image's natural aspect: the image
 * always renders at full width (`h-auto`, never cropped sideways — these are
 * screenshots, and cutting off the right-hand side of a headline is the one
 * thing that makes them useless), and the leftover height becomes the overscan
 * the parallax drifts within.
 */
export function ShotFrame({
  shot,
  aspect,
  sizes,
  parallax = 0,
  priority = false,
  className = "",
}: {
  shot: Shot;
  /** Tailwind aspect utility for the frame. */
  aspect: string;
  sizes: string;
  /** yPercent drift. Keep below the overscan the frame leaves. */
  parallax?: number;
  priority?: boolean;
  className?: string;
}) {
  const image = (
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        sizes={sizes}
        priority={priority}
        className="h-auto w-full"
      />
    </div>
  );

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[2px] bg-[color-mix(in_srgb,var(--color-pine)_6%,var(--surface))] ${aspect} ${className}`}
    >
      {parallax > 0 ? (
        <Parallax amount={parallax} className="absolute inset-0">
          {image}
        </Parallax>
      ) : (
        image
      )}
    </div>
  );
}
