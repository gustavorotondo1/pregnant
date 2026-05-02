"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  title: z.string().min(3, "Digite um titulo."),
  appointmentDate: z.string().min(1, "Selecione data e hora."),
  location: z.string().min(2, "Digite o local."),
  questions: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function AppointmentForm() {
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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <label className="grid gap-1 text-sm text-[var(--text-2)]">
        Titulo da consulta
        <Input {...register("title")} />
        {errors.title && <span className="text-xs text-red-600">{errors.title.message}</span>}
      </label>
      <label className="grid gap-1 text-sm text-[var(--text-2)]">
        Data e hora
        <Input type="datetime-local" {...register("appointmentDate")} />
        {errors.appointmentDate && <span className="text-xs text-red-600">{errors.appointmentDate.message}</span>}
      </label>
      <label className="grid gap-1 text-sm text-[var(--text-2)]">
        Local
        <Input {...register("location")} />
        {errors.location && <span className="text-xs text-red-600">{errors.location.message}</span>}
      </label>
      <label className="grid gap-1 text-sm text-[var(--text-2)]">
        Perguntas para o medico
        <Textarea rows={4} {...register("questions")} />
      </label>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Agendar consulta"}
      </Button>
    </form>
  );
}
