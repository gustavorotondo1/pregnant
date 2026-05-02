import { WellnessForm } from "@/components/forms/wellness-form";
import { Card } from "@/components/ui/card";

export default function WellnessPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Diario de bem-estar
        </h1>
        <p className="text-sm text-[var(--text-2)]">
          Um espaco acolhedor para registrar sentimentos, desconfortos e observacoes do dia.
        </p>
      </header>
      <Card>
        <WellnessForm />
      </Card>
    </div>
  );
}
