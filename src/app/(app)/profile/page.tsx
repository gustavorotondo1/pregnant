"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!supabase) return;
    setDeleting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/"); return; }

    // Deleta o perfil (cascade vai apagar todos os dados via FK)
    const { error } = await supabase.from("users").delete().eq("id", user.id);
    if (error) {
      toast.error("Nao foi possivel excluir o perfil. Tente novamente.");
      setDeleting(false);
      return;
    }

    await supabase.auth.signOut();
    toast.success("Conta excluida com sucesso.");
    router.push("/");
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Perfil da gestante
        </h1>
        <p className="text-sm text-[var(--text-2)]">Dados iniciais, privacidade e preferencias da conta.</p>
      </header>

      <Card>
        <h2 className="mb-2 text-base font-semibold">Dados do cadastro</h2>
        <p className="text-sm text-[var(--text-2)]">
          Para atualizar nome, semana, data provável do parto ou data da última menstruação, acesse o cadastro novamente.
        </p>
        <Link href="/onboarding" className="mt-3 inline-block text-sm font-semibold text-[var(--brand-700)] underline-offset-4 hover:underline">
          Editar cadastro
        </Link>
      </Card>

      <Card>
        <h2 className="mb-2 text-base font-semibold text-red-700">Excluir conta</h2>
        <p className="mb-4 text-sm text-[var(--text-2)]">
          Isso apagará permanentemente todos os seus dados: saúde, consultas, diário e documentos. Essa ação não pode ser desfeita.
        </p>
        {!confirming ? (
          <Button
            onClick={() => setConfirming(true)}
            className="border border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
          >
            Excluir minha conta
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-red-700">Tem certeza? Todos os dados serão perdidos.</p>
            <div className="flex gap-3">
              <Button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {deleting ? "Excluindo..." : "Sim, excluir tudo"}
              </Button>
              <Button
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className="border border-[var(--border-1)] bg-transparent text-[var(--text-1)] hover:bg-[var(--surface-2)]"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
