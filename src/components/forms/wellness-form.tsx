"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const options = [
  "Enjoada/Nauseas",
  "Cansada/Sonolenta",
  "Energizada",
  "Dores nas costas",
  "Dores abdominais/Colicas",
  "Azia/Refluxo",
  "Insonia",
  "Ansiedade",
  "Feliz/Empolgada",
  "Inchaco nas pernas",
  "Fome excessiva",
  "Constipacao",
];

export function WellnessForm() {
  const [selected, setSelected] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  return (
    <form className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-semibold text-[var(--text-2)]">Como estou me sentindo hoje?</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((option) => {
            const active = selected.includes(option);
            return (
              <button
                type="button"
                key={option}
                onClick={() =>
                  setSelected((prev) =>
                    prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
                  )
                }
                className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                  active
                    ? "border-[var(--brand-400)] bg-[var(--brand-100)] text-[var(--brand-700)]"
                    : "border-[var(--border-1)] bg-[var(--surface-1)] text-[var(--text-2)]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[var(--text-2)]" htmlFor="notes">
          Observacoes adicionais
        </label>
        <Textarea id="notes" rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} />
      </div>
      <Button type="button">Salvar diario</Button>
    </form>
  );
}
