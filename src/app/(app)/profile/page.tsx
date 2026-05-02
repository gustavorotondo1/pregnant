import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Perfil da gestante
        </h1>
        <p className="text-sm text-[var(--text-2)]">Dados iniciais, privacidade e preferencias da conta.</p>
      </header>

      <Card>
        <p className="text-sm text-[var(--text-2)]">
          No primeiro acesso, conclua seu cadastro de gestacao com nome, peso inicial, semana atual, DPP e DUM.
        </p>
        <Link href="/onboarding" className="mt-3 inline-block text-sm font-semibold text-[var(--brand-700)] underline">
          Ir para onboarding
        </Link>
      </Card>

      <Card>
        <h2 className="mb-2 text-base font-semibold">Privacidade</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-2)]">
          <li>Modo privacidade para ocultar dados sensiveis</li>
          <li>Exportacao e exclusao de dados (LGPD/GDPR)</li>
          <li>Consentimento informado para tratamento de dados</li>
        </ul>
      </Card>
    </div>
  );
}
