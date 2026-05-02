import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { WeightChart } from "@/components/charts/weight-chart";
import { mockAppointments, mockHealthRecords, mockWeeklyGuide } from "@/lib/data/mock";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const currentWeek = 24;
  const currentGuide = mockWeeklyGuide[currentWeek - 1];
  const nextAppointment = mockAppointments.find((appointment) => appointment.status === "agendada");
  const chartData = mockHealthRecords.map((record) => ({
    date: formatDate(record.record_date),
    weight: record.weight_kg ?? 0,
  }));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Badge>Semana {currentWeek}</Badge>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Dashboard da gestacao
        </h1>
        <p className="text-sm text-[var(--text-2)]">
          Visao geral de saude, desenvolvimento do bebe e proximos compromissos.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-2 text-base font-semibold text-[var(--text-1)]">Resumo semanal</h2>
          <p className="mb-3 text-sm text-[var(--text-2)]">{currentGuide.baby_development}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <p className="text-sm"><strong>Tamanho comparativo:</strong> {currentGuide.baby_size_comparison}</p>
            <p className="text-sm"><strong>Mudancas no corpo:</strong> {currentGuide.maternal_changes}</p>
          </div>
        </Card>
        <Card>
          <h2 className="mb-2 text-base font-semibold text-[var(--text-1)]">Proxima consulta</h2>
          {nextAppointment ? (
            <div className="space-y-1 text-sm text-[var(--text-2)]">
              <p className="font-semibold text-[var(--text-1)]">{nextAppointment.title}</p>
              <p>{formatDate(nextAppointment.appointment_date)}</p>
              <p>{nextAppointment.location}</p>
              <p>{nextAppointment.doctor_name}</p>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-2)]">Nenhuma consulta agendada.</p>
          )}
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-[var(--text-1)]">Evolucao do peso</h2>
          <WeightChart data={chartData} />
        </Card>
        <Card>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-1)]">Indicadores recentes</h2>
          <ul className="space-y-2 text-sm text-[var(--text-2)]">
            <li>Pressao: 111/74 mmHg</li>
            <li>Glicemia jejum: 90 mg/dL</li>
            <li>Movimentos fetais: 23/dia</li>
            <li>Bem-estar: Feliz/Empolgada</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
