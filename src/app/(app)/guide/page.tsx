"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { mockWeeklyGuide } from "@/lib/data/mock";

export default function GuidePage() {
  const [week, setWeek] = useState(24);
  const guide = useMemo(() => mockWeeklyGuide[week - 1], [week]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Guia semanal personalizado
        </h1>
        <p className="text-sm text-[var(--text-2)]">Conteudo completo da semana 1 a 42 para mae e bebe.</p>
      </header>

      <Card>
        <label className="mb-2 block text-sm font-semibold">Selecione a semana</label>
        <input
          type="range"
          min={1}
          max={42}
          value={week}
          onChange={(event) => setWeek(Number(event.target.value))}
          className="w-full"
        />
        <p className="mt-2 text-sm text-[var(--text-2)]">Semana atual no guia: {week}</p>
      </Card>

      <Card className="space-y-2 text-sm text-[var(--text-2)]">
        <p><strong>Desenvolvimento do bebe:</strong> {guide.baby_development}</p>
        <p><strong>Tamanho comparativo:</strong> {guide.baby_size_comparison}</p>
        <p><strong>Mudancas no corpo:</strong> {guide.maternal_changes}</p>
        <p><strong>Sintomas comuns:</strong> {guide.common_symptoms}</p>
        <p><strong>Alimentacao:</strong> {guide.nutrition_tips}</p>
        <p><strong>Exercicios:</strong> {guide.exercise_tips}</p>
        <p><strong>Cuidados:</strong> {guide.care_tips}</p>
        <p><strong>Curiosidades e marcos:</strong> {guide.highlights}</p>
      </Card>
    </div>
  );
}
