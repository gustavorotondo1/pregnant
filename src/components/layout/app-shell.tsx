"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  FileHeart,
  HeartPulse,
  House,
  NotebookPen,
  LogOut,
  Sparkles,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const menu = [
  { href: "/dashboard", label: "Dashboard", icon: House },
  { href: "/health", label: "Saúde", icon: HeartPulse },
  { href: "/wellness", label: "Diario", icon: NotebookPen },
  { href: "/appointments", label: "Consultas", icon: CalendarDays },
  { href: "/documents", label: "Documentos", icon: FileHeart },
  { href: "/guide", label: "Guia semanal", icon: Stethoscope },
  { href: "/tools", label: "Ferramentas", icon: Sparkles },
  { href: "/profile", label: "Perfil", icon: UserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--surface-2)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,var(--brand-100),transparent_35%),radial-gradient(circle_at_90%_10%,var(--sky-100),transparent_30%),linear-gradient(180deg,var(--surface-2),var(--surface-3))]" />
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[260px_1fr] md:px-6">
        <aside className="rounded-2xl border border-[var(--border-1)] bg-[var(--surface-1)] p-4 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-3)]">Pregnant</p>
            <h1 className="text-xl font-bold text-[var(--text-1)]">Acompanhamento gentil 🐻</h1>
          </div>
          <nav className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-[var(--brand-100)] text-[var(--brand-700)]"
                      : "text-[var(--text-2)] hover:bg-[var(--surface-2)]",
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6">
            <ThemeToggle />
            <Button variant="ghost" className="mt-2 w-full justify-start" onClick={handleSignOut}>
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </aside>
        <main className="rounded-2xl border border-[var(--border-1)] bg-[var(--surface-1)] p-4 shadow-sm md:p-6">{children}</main>
      </div>
    </div>
  );
}
