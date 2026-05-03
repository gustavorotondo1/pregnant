import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { WeightChart } from "@/components/charts/weight-chart";
import { createClient } from "@/lib/supabase/server";
import { mockWeeklyGuide } from "@/lib/data/mock";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: profile } = supabase
    ? await supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return { data: null };
        return supabase.from("users").select("*").eq("id", user.id).maybeSingle();
      })
    : { data: null };

  const { data: appointments } = supabase && profile
    ? await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", profile.id)
        .eq("status", "agendada")
        .order("appointment_date", { ascending: true })
        .limit(1)
    : { data: null };

  const { data: healthRecords } = supabase && profile
    ? await supabase
        .from("health_records")
        .select("record_date, weight_kg")
        .eq("user_id", profile.id)
        .order("record_date", { ascending: true })
    : { data: null };

  const { data: lastHealth } = supabase && profile
    ? await supabase
        .from("health_records")
        .select("blood_pressure_systolic, blood_pressure_diastolic, blood_glucose_fasting, fetal_movements_count")
        .eq("user_id", profile.id)
        .order("record_date", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };

  const { data: lastWellness } = supabase && profile
    ? await supabase
        .from("wellness_diary")
        .select("feelings")
        .eq("user_id", profile.id)
        .order("entry_date", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };

  const currentWeek = profile?.current_gestation_week ?? 1;
  const currentGuide = mockWeeklyGuide[currentWeek - 1];
  const nextAppointment = appointments?.[0] ?? null;
  const chartData = (healthRecords ?? []).map((r) => ({
    date: formatDate(r.record_date),
    weight: r.weight_kg ?? 0,
  }));

  const babyName = profile?.baby_name ? `${profile.baby_name} — ` : "";

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Badge>Semana {currentWeek}</Badge>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          {babyName}Dashboard da gestação
        </h1>
        <p className="text-sm text-[var(--text-2)]">
          Visão geral de saúde, desenvolvimento do bebê e próximas consultas.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-2 text-base font-semibold text-[var(--text-1)]">Resumo semanal 🐾</h2>
          {currentGuide ? (
            <>
              <p className="mb-3 text-sm text-[var(--text-2)]">{currentGuide.baby_development}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <p className="text-sm"><strong>Tamanho comparativo:</strong> {currentGuide.baby_size_comparison}</p>
                <p className="text-sm"><strong>Mudanças no corpo:</strong> {currentGuide.maternal_changes}</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-[var(--text-2)]">Conteudo da semana {currentWeek} ainda nao disponivel.</p>
          )}
        </Card>
        <Card>
          <h2 className="mb-2 text-base font-semibold text-[var(--text-1)]">Próxima consulta</h2>
          {nextAppointment ? (
            <div className="space-y-1 text-sm text-[var(--text-2)]">
              <p className="font-semibold text-[var(--text-1)]">{nextAppointment.title}</p>
              <p>{formatDate(nextAppointment.appointment_date)}</p>
              {nextAppointment.location && <p>{nextAppointment.location}</p>}
              {nextAppointment.doctor_name && <p>{nextAppointment.doctor_name}</p>}
            </div>
          ) : (
            <div className="space-y-2 text-sm text-[var(--text-2)]">
              <p>Nenhuma consulta agendada.</p>
              <Link href="/appointments" className="font-semibold text-[var(--brand-700)] underline-offset-4 hover:underline">Agendar consulta</Link>
            </div>
          )}
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-[var(--text-1)]">Evolução do peso</h2>
          {chartData.length > 0 ? (
            <WeightChart data={chartData} />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-[var(--text-2)]">
              <p>Nenhum registro de peso ainda.</p>
              <Link href="/health" className="mt-2 font-semibold text-[var(--brand-700)] underline-offset-4 hover:underline">Registrar saude</Link>
            </div>
          )}
        </Card>
        <Card>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-1)]">Indicadores recentes</h2>
          {lastHealth ? (
            <ul className="space-y-2 text-sm text-[var(--text-2)]">
              {lastHealth.blood_pressure_systolic && (
                <li>Pressao: {lastHealth.blood_pressure_systolic}/{lastHealth.blood_pressure_diastolic} mmHg</li>
              )}
              {lastHealth.blood_glucose_fasting && (
                <li>Glicemia jejum: {lastHealth.blood_glucose_fasting} mg/dL</li>
              )}
              {lastHealth.fetal_movements_count && (
                <li>Movimentos fetais: {lastHealth.fetal_movements_count}/dia</li>
              )}
              {lastWellness?.feelings && lastWellness.feelings.length > 0 && (
                <li>Bem-estar: {lastWellness.feelings.join(", ")}</li>
              )}
            </ul>
          ) : (
            <div className="text-sm text-[var(--text-2)]">
              <p>Nenhum dado registrado.</p>
              <Link href="/health" className="mt-2 inline-block font-semibold text-[var(--brand-700)] underline-offset-4 hover:underline">Adicionar registro</Link>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
