-- JNMC Sahayak Production Schema
-- Medical Report + Prescription Management System
-- Roles: patient, doctor, admin, pharmacy

-- ============================================
-- PROFILES TABLE (source of truth for roles)
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('patient', 'doctor', 'admin', 'pharmacy')),
  full_name text not null,
  phone_number text,
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- PATIENTS TABLE
-- ============================================
create table if not exists public.patients (
  id uuid primary key references public.profiles(id) on delete cascade,
  date_of_birth date,
  gender text,
  blood_group text,
  address text,
  emergency_contact text,
  emergency_contact_name text,
  medical_history text,
  aadhaar_number text unique,
  jnmch_registration_id text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- DOCTORS TABLE
-- ============================================
create table if not exists public.doctors (
  id uuid primary key references public.profiles(id) on delete cascade,
  department text,
  designation text,
  specialization text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- PHARMACY STAFF TABLE
-- ============================================
create table if not exists public.pharmacy_staff (
  id uuid primary key references public.profiles(id) on delete cascade,
  license_number text,
  shift text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- DOCTOR-PATIENT ASSIGNMENTS
-- ============================================
create table if not exists public.doctor_patient_assignments (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.profiles(id) on delete cascade,
  patient_id uuid not null references public.profiles(id) on delete cascade,
  assigned_at timestamptz default now(),
  assigned_by uuid references public.profiles(id) on delete set null,
  unique(doctor_id, patient_id)
);

-- ============================================
-- PRESCRIPTIONS TABLE
-- ============================================
create table if not exists public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.profiles(id) on delete cascade,
  patient_id uuid not null references public.profiles(id) on delete cascade,
  pharmacy_id uuid references public.profiles(id) on delete set null,
  prescription_text text not null,
  status text not null default 'pending' check (status in ('pending', 'dispensed', 'cancelled')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- TEST REPORTS TABLE
-- ============================================
create table if not exists public.test_reports (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  verified_by uuid references public.profiles(id) on delete set null,
  report_number text unique not null,
  test_name text not null,
  test_category text not null default 'other' check (test_category in ('pathology', 'radiology', 'cardiology', 'microbiology', 'biochemistry', 'other')),
  department text not null,
  file_url text,
  file_name text,
  file_type text,
  file_size integer,
  status text not null default 'pending' check (status in ('pending', 'uploaded', 'verified', 'rejected')),
  sample_collected_at timestamptz,
  report_date timestamptz default now(),
  verified_at timestamptz,
  notes text,
  doctor_name text,
  technician_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text default 'info',
  is_read boolean default false,
  related_report_id uuid references public.test_reports(id) on delete cascade,
  created_at timestamptz default now()
);

-- ============================================
-- ACTIVITY LOGS TABLE
-- ============================================
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  resource_type text,
  resource_id uuid,
  details jsonb,
  created_at timestamptz default now()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.doctors enable row level security;
alter table public.pharmacy_staff enable row level security;
alter table public.doctor_patient_assignments enable row level security;
alter table public.prescriptions enable row level security;
alter table public.test_reports enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;

-- ============================================
-- RLS POLICIES: PROFILES
-- ============================================
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_staff" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_select_staff" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('doctor', 'admin', 'pharmacy')
    )
  );

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
  );

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- ============================================
-- RLS POLICIES: PATIENTS
-- ============================================
drop policy if exists "patients_select_own" on public.patients;
drop policy if exists "patients_select_staff" on public.patients;
drop policy if exists "patients_update_own" on public.patients;
drop policy if exists "patients_insert_own" on public.patients;

create policy "patients_select_own" on public.patients
  for select using (id = auth.uid());

create policy "patients_select_staff" on public.patients
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('doctor', 'admin', 'pharmacy')
    )
  );

create policy "patients_update_own" on public.patients
  for update using (id = auth.uid());

create policy "patients_insert_own" on public.patients
  for insert with check (id = auth.uid());

-- ============================================
-- RLS POLICIES: DOCTORS
-- ============================================
drop policy if exists "doctors_select_all" on public.doctors;
drop policy if exists "doctors_update_own" on public.doctors;
drop policy if exists "doctors_insert_own" on public.doctors;

create policy "doctors_select_all" on public.doctors
  for select using (auth.uid() is not null);

create policy "doctors_update_own" on public.doctors
  for update using (id = auth.uid());

create policy "doctors_insert_own" on public.doctors
  for insert with check (id = auth.uid());

-- ============================================
-- RLS POLICIES: PHARMACY STAFF
-- ============================================
drop policy if exists "pharmacy_select_all" on public.pharmacy_staff;
drop policy if exists "pharmacy_update_own" on public.pharmacy_staff;
drop policy if exists "pharmacy_insert_own" on public.pharmacy_staff;

create policy "pharmacy_select_all" on public.pharmacy_staff
  for select using (auth.uid() is not null);

create policy "pharmacy_update_own" on public.pharmacy_staff
  for update using (id = auth.uid());

create policy "pharmacy_insert_own" on public.pharmacy_staff
  for insert with check (id = auth.uid());

-- ============================================
-- RLS POLICIES: DOCTOR-PATIENT ASSIGNMENTS
-- ============================================
drop policy if exists "assignments_select_own" on public.doctor_patient_assignments;
drop policy if exists "assignments_select_admin" on public.doctor_patient_assignments;
drop policy if exists "assignments_insert_admin" on public.doctor_patient_assignments;
drop policy if exists "assignments_delete_admin" on public.doctor_patient_assignments;

create policy "assignments_select_own" on public.doctor_patient_assignments
  for select using (
    auth.uid() = doctor_id or auth.uid() = patient_id
  );

create policy "assignments_select_admin" on public.doctor_patient_assignments
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "assignments_insert_admin" on public.doctor_patient_assignments
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "assignments_delete_admin" on public.doctor_patient_assignments
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: PRESCRIPTIONS
-- ============================================
drop policy if exists "prescriptions_select_patient" on public.prescriptions;
drop policy if exists "prescriptions_select_doctor" on public.prescriptions;
drop policy if exists "prescriptions_select_pharmacy" on public.prescriptions;
drop policy if exists "prescriptions_select_admin" on public.prescriptions;
drop policy if exists "prescriptions_insert_doctor" on public.prescriptions;
drop policy if exists "prescriptions_update_doctor" on public.prescriptions;
drop policy if exists "prescriptions_update_pharmacy" on public.prescriptions;

create policy "prescriptions_select_patient" on public.prescriptions
  for select using (patient_id = auth.uid());

create policy "prescriptions_select_doctor" on public.prescriptions
  for select using (doctor_id = auth.uid());

create policy "prescriptions_select_pharmacy" on public.prescriptions
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'pharmacy'
    )
  );

create policy "prescriptions_select_admin" on public.prescriptions
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "prescriptions_insert_doctor" on public.prescriptions
  for insert with check (
    doctor_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'doctor'
    )
  );

create policy "prescriptions_update_doctor" on public.prescriptions
  for update using (
    doctor_id = auth.uid()
  );

create policy "prescriptions_update_pharmacy" on public.prescriptions
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'pharmacy'
    )
  );

-- ============================================
-- RLS POLICIES: TEST REPORTS
-- ============================================
drop policy if exists "reports_select_patient" on public.test_reports;
drop policy if exists "reports_select_staff" on public.test_reports;
drop policy if exists "reports_insert_staff" on public.test_reports;
drop policy if exists "reports_update_staff" on public.test_reports;

create policy "reports_select_patient" on public.test_reports
  for select using (patient_id = auth.uid());

create policy "reports_select_staff" on public.test_reports
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('doctor', 'admin', 'pharmacy')
    )
  );

create policy "reports_insert_staff" on public.test_reports
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin')
    )
  );

create policy "reports_update_staff" on public.test_reports
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin')
    )
  );

-- ============================================
-- RLS POLICIES: NOTIFICATIONS
-- ============================================
drop policy if exists "notifications_select_own" on public.notifications;
drop policy if exists "notifications_update_own" on public.notifications;
drop policy if exists "notifications_insert_staff" on public.notifications;

create policy "notifications_select_own" on public.notifications
  for select using (user_id = auth.uid());

create policy "notifications_update_own" on public.notifications
  for update using (user_id = auth.uid());

create policy "notifications_insert_staff" on public.notifications
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('doctor', 'admin', 'pharmacy')
    )
  );

-- ============================================
-- RLS POLICIES: ACTIVITY LOGS
-- ============================================
drop policy if exists "logs_select_admin" on public.activity_logs;
drop policy if exists "logs_insert_authenticated" on public.activity_logs;

create policy "logs_select_admin" on public.activity_logs
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "logs_insert_authenticated" on public.activity_logs
  for insert with check (auth.uid() is not null);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_phone on public.profiles(phone_number);
create index if not exists idx_patients_aadhaar on public.patients(aadhaar_number);
create index if not exists idx_patients_jnmch on public.patients(jnmch_registration_id);
create index if not exists idx_assignments_doctor on public.doctor_patient_assignments(doctor_id);
create index if not exists idx_assignments_patient on public.doctor_patient_assignments(patient_id);
create index if not exists idx_prescriptions_doctor on public.prescriptions(doctor_id);
create index if not exists idx_prescriptions_patient on public.prescriptions(patient_id);
create index if not exists idx_prescriptions_pharmacy on public.prescriptions(pharmacy_id);
create index if not exists idx_prescriptions_status on public.prescriptions(status);
create index if not exists idx_reports_patient on public.test_reports(patient_id);
create index if not exists idx_reports_status on public.test_reports(status);
create index if not exists idx_reports_date on public.test_reports(report_date);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_unread on public.notifications(user_id, is_read) where is_read = false;
create index if not exists idx_activity_logs_user on public.activity_logs(user_id);
create index if not exists idx_activity_logs_date on public.activity_logs(created_at);

-- ============================================
-- TRIGGER: Auto-create profile on signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _role text;
begin
  _role := coalesce(new.raw_user_meta_data ->> 'role', 'patient');

  -- Validate role
  if _role not in ('patient', 'doctor', 'admin', 'pharmacy') then
    _role := 'patient';
  end if;

  -- Insert profile
  insert into public.profiles (id, role, full_name, phone_number)
  values (
    new.id,
    _role,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'User'),
    coalesce(new.phone, new.raw_user_meta_data ->> 'phone_number', null)
  )
  on conflict (id) do nothing;

  -- Insert role-specific row
  if _role = 'patient' then
    insert into public.patients (id) values (new.id) on conflict (id) do nothing;
  elsif _role = 'doctor' then
    insert into public.doctors (id) values (new.id) on conflict (id) do nothing;
  elsif _role = 'pharmacy' then
    insert into public.pharmacy_staff (id) values (new.id) on conflict (id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================
-- TRIGGER: Auto-update updated_at
-- ============================================
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();

drop trigger if exists patients_updated_at on public.patients;
create trigger patients_updated_at before update on public.patients
  for each row execute function public.update_updated_at();

drop trigger if exists doctors_updated_at on public.doctors;
create trigger doctors_updated_at before update on public.doctors
  for each row execute function public.update_updated_at();

drop trigger if exists pharmacy_staff_updated_at on public.pharmacy_staff;
create trigger pharmacy_staff_updated_at before update on public.pharmacy_staff
  for each row execute function public.update_updated_at();

drop trigger if exists prescriptions_updated_at on public.prescriptions;
create trigger prescriptions_updated_at before update on public.prescriptions
  for each row execute function public.update_updated_at();

drop trigger if exists reports_updated_at on public.test_reports;
create trigger reports_updated_at before update on public.test_reports
  for each row execute function public.update_updated_at();
