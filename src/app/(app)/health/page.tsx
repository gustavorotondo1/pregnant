import { HealthRecordForm } from "@/components/forms/health-record-form";
import { Card } from "@/components/ui/card";

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Registros de saúde
        </h1>
        <p className="text-sm text-[var(--text-2)]">
          Registre diariamente peso, pressão, glicemia, altura uterina, edema e sinais importantes.
        </p>
      </header>

      <Card>
        <h2 className="mb-3 text-base font-semibold">Novo registro</h2>
        <HealthRecordForm />
      </Card>

      <Card>
        <h2 className="mb-2 text-base font-semibold">Tracker de sintomas incomuns</h2>
        <p className="text-sm text-[var(--text-2)]">
          Área pronta para registrar sinais atípicos e compartilhar rapidamente com a equipe médica.
        </p>
      </Card>
    </div>
  );
}
