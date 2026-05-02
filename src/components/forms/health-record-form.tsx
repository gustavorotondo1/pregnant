"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  weightKg: z.number().min(30).max(250),
  systolic: z.number().min(70).max(220),
  diastolic: z.number().min(40).max(140),
  glucoseFasting: z.number().min(40).max(300),
});

type FormData = z.infer<typeof schema>;

export function HealthRecordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 md:grid-cols-2">
      <label className="grid gap-1 text-sm text-[var(--text-2)]">
        Peso (kg)
        <Input type="number" step="0.1" {...register("weightKg", { valueAsNumber: true })} />
        {errors.weightKg && <span className="text-xs text-red-600">Peso invalido.</span>}
      </label>
      <label className="grid gap-1 text-sm text-[var(--text-2)]">
        Pressao sistolica
        <Input type="number" {...register("systolic", { valueAsNumber: true })} />
        {errors.systolic && <span className="text-xs text-red-600">Valor invalido.</span>}
      </label>
      <label className="grid gap-1 text-sm text-[var(--text-2)]">
        Pressao diastolica
        <Input type="number" {...register("diastolic", { valueAsNumber: true })} />
        {errors.diastolic && <span className="text-xs text-red-600">Valor invalido.</span>}
      </label>
      <label className="grid gap-1 text-sm text-[var(--text-2)]">
        Glicemia em jejum
        <Input type="number" {...register("glucoseFasting", { valueAsNumber: true })} />
        {errors.glucoseFasting && <span className="text-xs text-red-600">Valor invalido.</span>}
      </label>
      <div className="md:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar registro"}
        </Button>
      </div>
    </form>
  );
}
