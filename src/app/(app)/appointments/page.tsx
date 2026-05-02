"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { Card } from "@/components/ui/card";
import { mockAppointments } from "@/lib/data/mock";
import { formatDate } from "@/lib/utils";

export default function AppointmentsPage() {
  const [value, onChange] = useState<Date>(new Date());

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Consultas e lembretes
        </h1>
        <p className="text-sm text-[var(--text-2)]">Calendario com consultas, perguntas para o medico e historico.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-base font-semibold">Calendario</h2>
          <Calendar onChange={(date) => onChange(date as Date)} value={value} />
        </Card>
        <Card>
          <h2 className="mb-3 text-base font-semibold">Agendar consulta</h2>
          <AppointmentForm />
        </Card>
      </section>

      <Card>
        <h2 className="mb-3 text-base font-semibold">Historico recente</h2>
        <div className="space-y-2">
          {mockAppointments.map((appointment) => (
            <div key={appointment.id} className="rounded-xl border border-[var(--border-1)] p-3 text-sm">
              <p className="font-semibold">{appointment.title}</p>
              <p className="text-[var(--text-2)]">{formatDate(appointment.appointment_date)} • {appointment.location}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
