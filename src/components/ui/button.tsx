"use client";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary:
      "bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)] focus-visible:outline-[var(--brand-500)]",
    secondary:
      "bg-[var(--surface-2)] text-[var(--text-1)] hover:bg-[var(--surface-3)] focus-visible:outline-[var(--brand-300)]",
    ghost:
      "bg-transparent text-[var(--text-2)] hover:bg-[var(--surface-2)] focus-visible:outline-[var(--brand-300)]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
