import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-[var(--border-1)] bg-[var(--surface-1)] px-3 py-2.5 text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:border-[var(--brand-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-200)]",
        className,
      )}
      {...props}
    />
  );
}
