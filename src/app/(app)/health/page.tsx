import { HealthRecordForm } from "@/components/forms/health-record-form";
import { Card } from "@/components/ui/card";

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Registros de saude
        </h1>
        <p className="text-sm text-[var(--text-2)]">
          Registre diariamente peso, pressao, glicemia, altura uterina, edema e sinais importantes.
        </p>
      </header>

      <Card>
        <h2 className="mb-3 text-base font-semibold">Novo registro</h2>
        <HealthRecordForm />
      </Card>

      <Card>
        <h2 className="mb-2 text-base font-semibold">Tracker de sintomas incomuns</h2>
        <p className="text-sm text-[var(--text-2)]">
          Area pronta para registrar sinais atipicos e compartilhar rapidamente com a equipe medica.
        </p>
      </Card>
    </div>
  );
}
