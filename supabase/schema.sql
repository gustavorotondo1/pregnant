create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  initial_weight_kg numeric(5,2) not null check (initial_weight_kg > 0),
  current_gestation_week int not null check (current_gestation_week between 1 and 42),
  due_date date not null,
  lmp_date date not null,
  privacy_mode_enabled boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.health_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  record_date date not null default current_date,
  weight_kg numeric(5,2),
  blood_pressure_systolic int,
  blood_pressure_diastolic int,
  blood_glucose_fasting numeric(6,2),
  blood_glucose_postprandial numeric(6,2),
  fundal_height_cm numeric(5,2),
  fetal_movements_count int,
  edema_location text,
  edema_intensity int check (edema_intensity between 0 and 5),
  baby_heart_rate_bpm int,
  uncommon_symptoms text,
  created_at timestamptz default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  appointment_date timestamptz not null,
  location text,
  doctor_name text,
  notes text,
  reminder_enabled boolean default true,
  status text not null default 'agendada' check (status in ('agendada', 'concluida', 'cancelada')),
  created_at timestamptz default now()
);

create table if not exists public.questions_for_doctor (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  question text not null,
  is_answered boolean default false,
  created_at timestamptz default now(),
  answered_at timestamptz
);

create table if not exists public.wellness_diary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  entry_date date not null default current_date,
  feelings text[] not null default '{}',
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  category text not null check (category in ('ultrassom', 'laboratorio', 'foto_barriga', 'outro')),
  trimester int check (trimester between 1 and 3),
  file_path text not null,
  file_name text not null,
  mime_type text,
  created_at timestamptz default now()
);

create table if not exists public.weekly_content (
  week int primary key check (week between 1 and 42),
  baby_development text not null,
  baby_size_comparison text not null,
  maternal_changes text not null,
  common_symptoms text not null,
  nutrition_tips text not null,
  exercise_tips text not null,
  care_tips text not null,
  highlights text not null
);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  user_id uuid,
  action text not null,
  entity text not null,
  created_at timestamptz default now()
);

alter table public.users enable row level security;
alter table public.health_records enable row level security;
alter table public.appointments enable row level security;
alter table public.questions_for_doctor enable row level security;
alter table public.wellness_diary enable row level security;
alter table public.documents enable row level security;
alter table public.audit_log enable row level security;

create policy "users own profile" on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "health own" on public.health_records
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "appointments own" on public.appointments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "questions own" on public.questions_for_doctor
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "wellness own" on public.wellness_diary
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "documents own" on public.documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "audit own" on public.audit_log
  for select using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('pregnancy-docs', 'pregnancy-docs', false)
on conflict (id) do nothing;
