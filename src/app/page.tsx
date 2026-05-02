"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

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
      toast.error("Nao foi possivel iniciar login com Google.");
    }
    setIsLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,var(--brand-100),transparent_40%),radial-gradient(circle_at_90%_30%,var(--sky-100),transparent_35%),linear-gradient(145deg,var(--surface-2),var(--surface-3))]" />
      <main className="fade-in-up w-full max-w-3xl rounded-3xl border border-[var(--border-1)] bg-[var(--surface-1)]/95 p-6 shadow-xl backdrop-blur md:p-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="rounded-2xl bg-[var(--brand-100)] p-3 text-[var(--brand-700)]">
            <HeartPulse size={22} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-3)]">Pregnant</p>
            <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
              Sua jornada de gestacao, com cuidado em cada detalhe
            </h1>
          </div>
        </div>
        <p className="mb-8 text-[var(--text-2)]">
          Acompanhe semana a semana o desenvolvimento do bebe, organize consultas, registre sinais importantes e
          construa um diario afetuoso da gravidez.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={signInWithGoogle} disabled={isLoading}>
            {isLoading ? "Conectando..." : "Entrar com Google"}
          </Button>
          <Link href="/dashboard" className="text-sm font-semibold text-[var(--brand-700)] underline-offset-4 hover:underline">
            Entrar em modo demonstracao
          </Link>
        </div>
      </main>
      <footer className="absolute bottom-3 text-xs text-[var(--text-3)]">LGPD by design: voce controla seus dados.</footer>
    </div>
  );
}
