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

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-[2px] font-medium transition-colors duration-200";

const sizes = {
  md: "px-6 py-3.5 text-[0.9375rem]",
  lg: "px-8 py-5 text-lg md:px-12 md:py-6 md:text-xl",
} as const;

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "ghost";
  size?: keyof typeof sizes;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  const variants = {
    primary:
      "bg-marigold text-ink hover:bg-[#d1912c] focus-visible:outline-offset-4",
    ghost:
      "border border-[var(--surface-line)] text-[var(--surface-text)] hover:border-[var(--surface-text)]",
  };

  return (
    <Link
      className={`${buttonBase} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * Styled frame used wherever a real screenshot doesn't exist (RouteKind, or a
 * capture that failed). Never renders a broken image.
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
      className={`${ratio} ${className} relative grid place-items-center overflow-hidden rounded-[2px] border border-hairline bg-[color-mix(in_srgb,var(--color-pine)_9%,var(--surface))]`}
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
