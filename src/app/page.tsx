"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

function BearIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* ears */}
      <circle cx="7" cy="8" r="4.5" fill="currentColor" opacity="0.85" />
      <circle cx="25" cy="8" r="4.5" fill="currentColor" opacity="0.85" />
      <circle cx="7" cy="8" r="2.5" fill="currentColor" opacity="0.45" />
      <circle cx="25" cy="8" r="2.5" fill="currentColor" opacity="0.45" />
      {/* head */}
      <circle cx="16" cy="18" r="12" fill="currentColor" opacity="0.85" />
      {/* muzzle */}
      <ellipse cx="16" cy="22" rx="5" ry="3.5" fill="currentColor" opacity="0.45" />
      {/* eyes */}
      <circle cx="11.5" cy="16" r="1.8" fill="white" />
      <circle cx="20.5" cy="16" r="1.8" fill="white" />
      <circle cx="12" cy="16.3" r="1" fill="#3b2a1c" />
      <circle cx="21" cy="16.3" r="1" fill="#3b2a1c" />
      {/* nose */}
      <ellipse cx="16" cy="20.5" rx="1.8" ry="1.2" fill="#3b2a1c" />
    </svg>
  );
}

export default function Home() {
  const supabase = useMemo(() => createClient(), []);
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    if (!supabase) {
      toast.info("Configure o Supabase no .env.local para ativar login Google.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      toast.error("Não foi possível iniciar login com Google.");
    }
    setIsLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,var(--brand-100),transparent_40%),radial-gradient(circle_at_90%_30%,var(--sky-100),transparent_35%),linear-gradient(145deg,var(--surface-2),var(--surface-3))]" />
      <main className="fade-in-up w-full max-w-3xl rounded-3xl border border-[var(--border-1)] bg-[var(--surface-1)]/95 p-6 shadow-xl backdrop-blur md:p-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="rounded-2xl bg-[var(--brand-100)] p-3 text-[var(--brand-700)]">
            <BearIcon size={22} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-3)]">Pregnant</p>
            <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
              Sua jornada de gestação, com cuidado em cada detalhe
            </h1>
          </div>
        </div>
        <p className="mb-8 text-[var(--text-2)]">
          Acompanhe semana a semana o desenvolvimento do bebê, organize consultas, registre sinais importantes e
          construa um diário afetuoso da gravidez.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={signInWithGoogle} disabled={isLoading}>
            {isLoading ? "Conectando..." : "Entrar com Google"}
          </Button>
          <Link href="/dashboard" className="text-sm font-semibold text-[var(--brand-700)] underline-offset-4 hover:underline">
            Entrar em modo demonstração
          </Link>
        </div>
      </main>
      <footer className="absolute bottom-3 text-xs text-[var(--text-3)]">LGPD by design: você controla seus dados.</footer>
    </div>
  );
}
