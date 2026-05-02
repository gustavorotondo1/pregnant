export type SymptomOption =
  | "Enjoada/Nauseas"
  | "Cansada/Sonolenta"
  | "Energizada"
  | "Dores nas costas"
  | "Dores abdominais/Colicas"
  | "Azia/Refluxo"
  | "Insonia"
  | "Ansiedade"
  | "Feliz/Empolgada"
  | "Inchaco nas pernas"
  | "Fome excessiva"
  | "Constipacao";

export interface UserProfile {
  id: string;
  full_name: string;
  initial_weight_kg: number;
  current_gestation_week: number;
  due_date: string;
  lmp_date: string;
  created_at: string;
}

export interface HealthRecord {
  id: string;
  user_id: string;
  record_date: string;
  weight_kg?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  blood_glucose_fasting?: number;
  blood_glucose_postprandial?: number;
  fundal_height_cm?: number;
  fetal_movements_count?: number;
  edema_location?: string;
  edema_intensity?: number;
  baby_heart_rate_bpm?: number;
  uncommon_symptoms?: string;
}

export interface WellnessDiaryEntry {
  id: string;
  user_id: string;
  entry_date: string;
  feelings: SymptomOption[];
  notes?: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  title: string;
  appointment_date: string;
  location?: string;
  doctor_name?: string;
  notes?: string;
  status: "agendada" | "concluida" | "cancelada";
}

export interface WeeklyGuide {
  week: number;
  baby_development: string;
  baby_size_comparison: string;
  maternal_changes: string;
  common_symptoms: string;
  nutrition_tips: string;
  exercise_tips: string;
  care_tips: string;
  highlights: string;
}
