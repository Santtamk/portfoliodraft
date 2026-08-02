import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

/**
 * Decorative mono annotation. Always aria-hidden — per Section 3.3 these never
 * carry information that isn't already in the readable copy.
 */
export function MachineNote({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={`machine ${className}`}>
      {children}
    </span>
  );
}

type BarVariant = "ink" | "marigold" | "ghost";

const barVariants: Record<BarVariant, string> = {
  ink: "bar-button",
  marigold: "bar-button bar-button-marigold",
  ghost: "bar-button bar-button-ghost",
};

type BarLinkProps = ComponentProps<typeof Link> & {
  variant?: BarVariant;
  /** Arrow glyph on the right edge. */
  arrow?: string;
};

/**
 * The layout's primary action: a full-width hard-edged bar, label on the left,
 * arrow on the right that nudges over on hover.
 */
export function BarLink({
  variant = "ink",
  arrow = "→",
  className = "",
  children,
  ...props
}: BarLinkProps) {
  return (
    <Link className={`${barVariants[variant]} ${className}`} {...props}>
      <span>{children}</span>
      <span aria-hidden="true" className="bar-arrow">
        {arrow}
      </span>
    </Link>
  );
}

/** Compact inline button, used only where a full bar would be too heavy. */
export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: "primary" | "ghost" }) {
  const variants = {
    primary: "metal-silver",
    ghost:
      "shadow-[inset_0_0_0_1px_var(--surface-line)] text-[var(--surface-text)] hover:shadow-[inset_0_0_0_1px_var(--surface-text)]",
  };

  return (
    <Link
      className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[0.9375rem] font-medium transition-[background-color,box-shadow] duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * Styled frame used wherever a real screenshot doesn't exist (a capture that
 * failed, or a project added before its screens are taken). Never renders a
 * broken image.
 */
export function PlaceholderFrame({
  label,
  className = "",
  ratio = "aspect-[16/10]",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={`${ratio} ${className} relative grid place-items-center overflow-hidden border border-hairline bg-[color-mix(in_srgb,var(--color-pine)_9%,var(--surface))]`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-moss) 0 1px, transparent 1px 12px)",
        }}
      />
      <p className="machine relative bg-[var(--surface)] px-4 py-2 text-center uppercase tracking-[0.12em]">
        {label}
      </p>
    </div>
  );
}
