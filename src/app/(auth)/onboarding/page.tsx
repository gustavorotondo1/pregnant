"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  fullName: z.string().min(3, "Digite nome completo."),
  initialWeight: z.number().min(30).max(250),
  currentWeek: z.number().min(1).max(42),
  dueDate: z.string().min(1, "Informe a DPP."),
  lmpDate: z.string().min(1, "Informe a DUM."),
});

type OnboardingData = z.infer<typeof schema>;

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    async function fillInitialName() {
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name;
      if (typeof fullName === "string" && fullName.length > 0) {
        setValue("fullName", fullName);
      }
    }

    fillInitialName();
  }, [setValue, supabase]);

  const onSubmit = async (values: OnboardingData) => {
    if (!supabase) {
      toast.error("Supabase nao configurado no ambiente.");
      return;
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      toast.error("Sessao invalida. Faca login novamente.");
      router.push("/");
      return;
    }

    const { error } = await supabase.from("users").upsert(
      {
        id: user.id,
        full_name: values.fullName,
        initial_weight_kg: values.initialWeight,
        current_gestation_week: values.currentWeek,
        due_date: values.dueDate,
        lmp_date: values.lmpDate,
      },
      { onConflict: "id" },
    );

    if (error) {
      toast.error("Nao foi possivel salvar seu perfil.");
      return;
    }

    toast.success("Perfil salvo com sucesso.");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-xl py-6">
      <Card>
        <h1 className="mb-1 text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Primeiro acesso
        </h1>
        <p className="mb-4 text-sm text-[var(--text-2)]">Vamos personalizar seu acompanhamento de gestacao.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
          <label className="grid gap-1 text-sm">
            Nome completo
            <Input {...register("fullName")} />
            {errors.fullName && <span className="text-xs text-red-600">{errors.fullName.message}</span>}
          </label>
          <label className="grid gap-1 text-sm">
            Peso inicial (kg)
            <Input type="number" step="0.1" {...register("initialWeight", { valueAsNumber: true })} />
            {errors.initialWeight && <span className="text-xs text-red-600">Peso inicial invalido.</span>}
          </label>
          <label className="grid gap-1 text-sm">
            Semana atual
            <Input type="number" {...register("currentWeek", { valueAsNumber: true })} />
            {errors.currentWeek && <span className="text-xs text-red-600">Semana deve estar entre 1 e 42.</span>}
          </label>
          <label className="grid gap-1 text-sm">
            DPP
            <Input type="date" {...register("dueDate")} />
            {errors.dueDate && <span className="text-xs text-red-600">Informe a DPP.</span>}
          </label>
          <label className="grid gap-1 text-sm">
            DUM
            <Input type="date" {...register("lmpDate")} />
            {errors.lmpDate && <span className="text-xs text-red-600">Informe a DUM.</span>}
          </label>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Concluir cadastro"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
