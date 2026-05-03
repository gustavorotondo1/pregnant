"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { createClient } from "@/lib/supabase/client";
import { Bell, BellOff, Check, Clock } from "lucide-react";

interface Reminder {
  id: string;
  type: "appointment" | "weight" | "vitamin" | "milestone";
  title: string;
  description: string;
  time?: string; // HH:MM
  enabled: boolean;
  daysInAdvance?: number;
}

const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: "weight_weekly",
    type: "weight",
    title: "Registro semanal de peso",
    description: "Lembrete para pesar e registrar toda segunda-feira.",
    time: "08:00",
    enabled: true,
  },
  {
    id: "vitamin_daily",
    type: "vitamin",
    title: "Vitaminas e medicamentos",
    description: "Lembrete diário para tomar ácido fólico, ferro e outros suplementos.",
    time: "09:00",
    enabled: true,
  },
  {
    id: "appointment_1d",
    type: "appointment",
    title: "Consulta — 1 dia antes",
    description: "Notificação na véspera de cada consulta agendada.",
    enabled: true,
    daysInAdvance: 1,
  },
  {
    id: "appointment_1h",
    type: "appointment",
    title: "Consulta — 1 hora antes",
    description: "Notificação 1 hora antes do horário da consulta.",
    enabled: true,
    daysInAdvance: 0,
  },
];

const MILESTONES: { week: number; message: string }[] = [
  { week: 8, message: "Semana 8 — O coraçãozinho do bebê já bate! 🫀" },
  { week: 12, message: "Semana 12 — Fim do 1º trimestre! Risco de aborto espontâneo reduz bastante. 🎉" },
  { week: 16, message: "Semana 16 — Em breve você pode sentir os primeiros movimentos do bebê! 🐣" },
  { week: 20, message: "Semana 20 — Metade da gestação! Ultrassom morfológico do 2º trimestre. 👶" },
  { week: 24, message: "Semana 24 — O bebê já ouve sua voz e reconhece sons! 🎵" },
  { week: 28, message: "Semana 28 — Início do 3º trimestre! Bebê pesa cerca de 1 kg. ⭐" },
  { week: 32, message: "Semana 32 — O bebê pratica a respiração e abre os olhos! 👀" },
  { week: 36, message: "Semana 36 — Bebê quase pronto! Pode nascer a qualquer momento a partir da semana 37. 🐻" },
  { week: 40, message: "Semana 40 — Data provável do parto! Muita força, mamãe! 💛" },
];

const typeColor: Record<Reminder["type"], string> = {
  appointment: "bg-[var(--brand-100)] text-[var(--brand-700)]",
  weight: "bg-amber-100 text-amber-700",
  vitamin: "bg-emerald-100 text-emerald-700",
  milestone: "bg-purple-100 text-purple-700",
};

const typeLabel: Record<Reminder["type"], string> = {
  appointment: "Consulta",
  weight: "Peso",
  vitamin: "Vitamina",
  milestone: "Marco",
};

export default function RemindersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [reminders, setReminders] = useState<Reminder[]>(DEFAULT_REMINDERS);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [milestonesSeen, setMilestonesSeen] = useState<number[]>([]);
  const [nextAppointments, setNextAppointments] = useState<{ title: string; appointment_date: string }[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profile } = await supabase
        .from("users")
        .select("current_gestation_week")
        .eq("id", user.id)
        .maybeSingle();
      if (profile) setCurrentWeek(profile.current_gestation_week);

      const { data: appts } = await supabase
        .from("appointments")
        .select("title, appointment_date")
        .eq("user_id", user.id)
        .eq("status", "agendada")
        .gte("appointment_date", new Date().toISOString())
        .order("appointment_date", { ascending: true })
        .limit(5);
      if (appts) setNextAppointments(appts);
    });

    const stored = localStorage.getItem("milestones_seen");
    if (stored) setMilestonesSeen(JSON.parse(stored));
  }, [supabase]);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("Seu navegador não suporta notificações.");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      toast.success("Notificações ativadas!");
      new Notification("Pregnant 🐻", {
        body: "Lembretes ativados com sucesso! Você receberá avisos importantes.",
        icon: "/icon-192.png",
      });
    } else {
      toast.error("Permissão negada. Ative nas configurações do navegador.");
    }
  };

  const testNotification = (reminder: Reminder) => {
    if (permission !== "granted") {
      toast.info("Ative as notificações primeiro.");
      return;
    }
    new Notification(`Pregnant — ${reminder.title}`, {
      body: reminder.description,
      icon: "/icon-192.png",
    });
    toast.success(`Notificação de teste enviada: "${reminder.title}"`);
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const dismissMilestone = (week: number) => {
    const updated = [...milestonesSeen, week];
    setMilestonesSeen(updated);
    localStorage.setItem("milestones_seen", JSON.stringify(updated));
  };

  const activeMilestone =
    currentWeek !== null
      ? MILESTONES.filter(
          (m) => m.week <= currentWeek && !milestonesSeen.includes(m.week)
        ).at(-1)
      : null;

  const upcomingMilestone =
    currentWeek !== null
      ? MILESTONES.find((m) => m.week > currentWeek)
      : null;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Notificações e lembretes
        </h1>
        <p className="text-sm text-[var(--text-2)]">
          Configure alertas para consultas, vitaminas, peso e marcos da gestação.
        </p>
      </header>

      {/* Permissão */}
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {permission === "granted" ? (
            <Bell size={18} className="text-emerald-600" />
          ) : (
            <BellOff size={18} className="text-[var(--text-3)]" />
          )}
          <div>
            <p className="text-sm font-semibold">
              {permission === "granted"
                ? "Notificações ativadas"
                : permission === "denied"
                ? "Notificações bloqueadas"
                : "Notificações desativadas"}
            </p>
            <p className="text-xs text-[var(--text-3)]">
              {permission === "denied"
                ? "Ative nas configurações do seu navegador."
                : permission === "granted"
                ? "Você receberá lembretes neste dispositivo."
                : "Ative para receber lembretes importantes."}
            </p>
          </div>
        </div>
        {permission !== "granted" && permission !== "denied" && (
          <Button onClick={requestPermission}>Ativar notificações</Button>
        )}
        {permission === "granted" && (
          <Badge className="bg-emerald-100 text-emerald-700">✓ Ativo</Badge>
        )}
      </Card>

      {/* Marco atual */}
      {activeMilestone && (
        <Card className="border-[var(--brand-300)] bg-[var(--brand-100)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand-700)]">Marco desta semana</p>
              <p className="mt-1 text-sm font-medium text-[var(--text-1)]">{activeMilestone.message}</p>
            </div>
            <button
              onClick={() => dismissMilestone(activeMilestone.week)}
              className="shrink-0 rounded-xl p-1 hover:bg-[var(--brand-200)] transition"
              title="Marcar como visto"
            >
              <Check size={16} className="text-[var(--brand-700)]" />
            </button>
          </div>
        </Card>
      )}

      {/* Próximo marco */}
      {upcomingMilestone && (
        <Card>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-3)]">Próximo marco</p>
          <p className="mt-1 text-sm text-[var(--text-2)]">
            <strong>Semana {upcomingMilestone.week}</strong> — {upcomingMilestone.message.split("—")[1]?.trim()}
          </p>
          <p className="mt-1 text-xs text-[var(--text-3)]">
            Faltam {currentWeek !== null ? upcomingMilestone.week - currentWeek : "—"} semanas.
          </p>
        </Card>
      )}

      {/* Próximas consultas */}
      {nextAppointments.length > 0 && (
        <Card>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <Clock size={16} />
            Próximas consultas
          </h2>
          <div className="space-y-2">
            {nextAppointments.map((appt) => (
              <div
                key={appt.appointment_date}
                className="flex items-center justify-between rounded-xl border border-[var(--border-1)] px-3 py-2 text-sm"
              >
                <span className="font-medium">{appt.title}</span>
                <span className="text-[var(--text-3)]">
                  {new Date(appt.appointment_date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Lista de lembretes */}
      <Card>
        <h2 className="mb-4 text-base font-semibold">Configurar lembretes</h2>
        <div className="space-y-3">
          {reminders.map((r) => (
            <div
              key={r.id}
              className={`flex items-start justify-between gap-3 rounded-xl border p-3 transition ${
                r.enabled ? "border-[var(--border-1)] bg-[var(--surface-1)]" : "border-dashed border-[var(--border-1)] bg-[var(--surface-2)] opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={r.enabled}
                  onChange={() => toggleReminder(r.id)}
                  className="mt-1 h-4 w-4 accent-[var(--brand-600)]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{r.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${typeColor[r.type]}`}>
                      {typeLabel[r.type]}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-3)]">{r.description}</p>
                  {r.time && (
                    <p className="mt-1 text-xs text-[var(--text-3)]">
                      Horário: <strong>{r.time}</strong>
                    </p>
                  )}
                </div>
              </div>
              {r.enabled && (
                <button
                  onClick={() => testNotification(r)}
                  className="shrink-0 rounded-xl border border-[var(--border-1)] px-2 py-1 text-xs hover:bg-[var(--surface-2)] transition"
                  title="Testar notificação"
                >
                  Testar
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[var(--text-3)]">
          Os lembretes funcionam enquanto o site estiver aberto no navegador. Para notificações mesmo com o site fechado, instale o app (PWA) na tela inicial do celular.
        </p>
      </Card>

      {/* Todos os marcos */}
      <Card>
        <h2 className="mb-3 text-base font-semibold">Marcos da gestação</h2>
        <div className="space-y-2">
          {MILESTONES.map((m) => {
            const passed = currentWeek !== null && m.week <= currentWeek;
            return (
              <div
                key={m.week}
                className={`flex items-start gap-3 rounded-xl border px-3 py-2 text-sm ${
                  passed ? "border-[var(--brand-200)] bg-[var(--brand-100)]" : "border-[var(--border-1)]"
                }`}
              >
                <span className={`mt-0.5 shrink-0 text-base ${passed ? "text-[var(--brand-600)]" : "text-[var(--text-3)]"}`}>
                  {passed ? "✓" : "○"}
                </span>
                <span className={passed ? "text-[var(--text-1)]" : "text-[var(--text-3)]"}>
                  {m.message}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
