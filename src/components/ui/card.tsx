import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[var(--border-1)] bg-[var(--surface-1)] p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}
