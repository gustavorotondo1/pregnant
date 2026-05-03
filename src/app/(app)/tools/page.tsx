"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { calculateGestationalWeek } from "@/lib/utils";

export default function ToolsPage() {
  const [lmpDate, setLmpDate] = useState("");
  const [contractionStart, setContractionStart] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  const week = useMemo(() => (lmpDate ? calculateGestationalWeek(lmpDate) : null), [lmpDate]);

  const startContraction = () => setContractionStart(Date.now());
  const stopContraction = () => {
    if (!contractionStart) return;
    setDuration(Math.round((Date.now() - contractionStart) / 1000));
    setContractionStart(null);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Ferramentas adicionais
        </h1>
        <p className="text-sm text-[var(--text-2)]">Calculadoras e checklists para facilitar o dia a dia.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-base font-semibold">Calculadora gestacional (data da última menstruação)</h2>
          <input
            type="date"
            value={lmpDate}
            onChange={(event) => setLmpDate(event.target.value)}
            className="w-full rounded-xl border border-[var(--border-1)] px-3 py-2"
          />
          <p className="mt-3 text-sm text-[var(--text-2)]">{week ? `Você está na semana ${week}.` : "Selecione a data da última menstruação."}</p>
        </Card>

        <Card>
          <h2 className="mb-3 text-base font-semibold">Contador de contrações</h2>
          <div className="flex gap-2">
            <button onClick={startContraction} className="rounded-xl bg-[var(--brand-600)] px-4 py-2 text-sm text-white">
              Iniciar
            </button>
            <button onClick={stopContraction} className="rounded-xl bg-[var(--surface-2)] px-4 py-2 text-sm">
              Parar
            </button>
          </div>
          <p className="mt-3 text-sm text-[var(--text-2)]">
            {duration ? `Duração da última contração: ${duration}s` : "Sem medição ainda."}
          </p>
        </Card>
      </section>

      <Card>
        <h2 className="mb-2 text-base font-semibold">Checklists essenciais</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-2)]">
          <li>Enxoval do bebê</li>
          <li>Mala da maternidade</li>
          <li>Nomes favoritos e descartados</li>
          <li>Itens para o pós-parto</li>
        </ul>
      </Card>
    </div>
  );
}
