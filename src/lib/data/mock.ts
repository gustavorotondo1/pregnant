import { addDays, formatISO } from "date-fns";
import type { Appointment, HealthRecord, WeeklyGuide } from "@/types/domain";

const today = new Date();

export const mockHealthRecords: HealthRecord[] = [
  {
    id: "h1",
    user_id: "demo-user",
    record_date: formatISO(addDays(today, -14), { representation: "date" }),
    weight_kg: 63.2,
    blood_pressure_systolic: 110,
    blood_pressure_diastolic: 72,
    blood_glucose_fasting: 87,
    fetal_movements_count: 18,
  },
  {
    id: "h2",
    user_id: "demo-user",
    record_date: formatISO(addDays(today, -7), { representation: "date" }),
    weight_kg: 63.8,
    blood_pressure_systolic: 112,
    blood_pressure_diastolic: 73,
    blood_glucose_fasting: 89,
    fetal_movements_count: 20,
  },
  {
    id: "h3",
    user_id: "demo-user",
    record_date: formatISO(today, { representation: "date" }),
    weight_kg: 64.1,
    blood_pressure_systolic: 111,
    blood_pressure_diastolic: 74,
    blood_glucose_fasting: 90,
    fetal_movements_count: 23,
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "a1",
    user_id: "demo-user",
    title: "Consulta pre-natal",
    appointment_date: formatISO(addDays(today, 4)),
    location: "Clinica Materna",
    doctor_name: "Dra. Helena",
    status: "agendada",
    notes: "Levar exames de sangue do 2 trimestre",
  },
  {
    id: "a2",
    user_id: "demo-user",
    title: "Ultrassom morfologico",
    appointment_date: formatISO(addDays(today, -18)),
    location: "Centro de Imagem Vida",
    doctor_name: "Dr. Bruno",
    status: "concluida",
  },
];

export const mockWeeklyGuide: WeeklyGuide[] = Array.from({ length: 42 }).map((_, index) => {
  const week = index + 1;
  return {
    week,
    baby_development: `Na semana ${week}, o bebe segue seu desenvolvimento com foco em crescimento neurologico e estrutural.`,
    baby_size_comparison: week < 10 ? "Grao de lentilha" : week < 20 ? "Abacate pequeno" : "Melao pequeno",
    maternal_changes: "Mudancas hormonais e fisicas sao esperadas. Hidratacao e descanso ajudam no conforto.",
    common_symptoms: "Oscilacao de energia, sono alterado e variacoes gastrointestinais podem ocorrer.",
    nutrition_tips: "Priorizacao de proteinas magras, ferro, calcio e fibras com fracionamento das refeicoes.",
    exercise_tips: "Caminhada leve e alongamentos com liberacao medica sao recomendados.",
    care_tips: "Acompanhar pressao, glicemia quando indicado e manter consultas em dia.",
    highlights: "Marco importante da semana com evolucao progressiva de orgaos e movimentos.",
  };
});
