-- JNMC Sahayak Database Schema
-- Medical Test Report Management System

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User roles enum
do $$ begin
  create type user_role as enum ('patient', 'doctor', 'lab_staff', 'admin');
exception when duplicate_object then null;
end $$;

-- Report status enum
do $$ begin
  create type report_status as enum ('pending', 'uploaded', 'verified', 'rejected');
exception when duplicate_object then null;
end $$;

-- Test category enum
do $$ begin
  create type test_category as enum ('pathology', 'radiology', 'cardiology', 'microbiology', 'biochemistry', 'other');
exception when duplicate_object then null;
end $$;

-- ============================================
-- PROFILES TABLE
-- Stores user profile information linked to auth.users
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'patient',
  full_name text not null,
  phone text,
  aadhaar_number text unique,
  jnmch_registration_id text unique,
  department text,
  designation text,
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- PATIENTS TABLE
-- Additional patient-specific information
-- ============================================
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  date_of_birth date,
  gender text,
  blood_group text,
  address text,
  emergency_contact text,
  emergency_contact_name text,
  medical_history text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- TEST REPORTS TABLE
-- Stores all medical test reports
-- ============================================
create table if not exists public.test_reports (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  verified_by uuid references public.profiles(id) on delete set null,
  
  -- Report details
  report_number text unique not null,
  test_name text not null,
  test_category test_category not null default 'other',
  department text not null,
  
  -- File information
  file_url text,
  file_name text,
  file_type text,
  file_size integer,
  
  -- Status and dates
  status report_status not null default 'pending',
  sample_collected_at timestamptz,
  report_date timestamptz default now(),
  verified_at timestamptz,
  
  -- Additional info
  notes text,
  doctor_name text,
  technician_name text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- ACTIVITY LOGS TABLE
-- Tracks all system activities for audit
-- ============================================
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- Stores user notifications
-- ============================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text default 'info',
  is_read boolean default false,
  related_report_id uuid references public.test_reports(id) on delete cascade,
  created_at timestamptz default now()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.test_reports enable row level security;
alter table public.activity_logs enable row level security;
alter table public.notifications enable row level security;

-- ============================================
-- RLS POLICIES FOR PROFILES
-- ============================================

-- Drop existing policies if they exist
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_staff" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;

-- Everyone can view their own profile
create policy "profiles_select_own" on public.profiles 
  for select using (auth.uid() = id);

-- Doctors and admins can view all profiles
create policy "profiles_select_staff" on public.profiles 
  for select using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() 
      and role in ('doctor', 'lab_staff', 'admin')
    )
  );

-- Users can update their own profile
create policy "profiles_update_own" on public.profiles 
  for update using (auth.uid() = id);

-- Users can insert their own profile
create policy "profiles_insert_own" on public.profiles 
  for insert with check (auth.uid() = id);

-- ============================================
-- RLS POLICIES FOR PATIENTS
-- ============================================

drop policy if exists "patients_select_own" on public.patients;
drop policy if exists "patients_select_staff" on public.patients;
drop policy if exists "patients_update_own" on public.patients;
drop policy if exists "patients_insert_own" on public.patients;

-- Patients can view their own patient record
create policy "patients_select_own" on public.patients 
  for select using (profile_id = auth.uid());

-- Staff can view all patient records
create policy "patients_select_staff" on public.patients 
  for select using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() 
      and role in ('doctor', 'lab_staff', 'admin')
    )
  );

-- Patients can update their own record
create policy "patients_update_own" on public.patients 
  for update using (profile_id = auth.uid());

-- Patients can insert their own record
create policy "patients_insert_own" on public.patients 
  for insert with check (profile_id = auth.uid());

-- ============================================
-- RLS POLICIES FOR TEST REPORTS
-- ============================================

drop policy if exists "reports_select_patient" on public.test_reports;
drop policy if exists "reports_select_staff" on public.test_reports;
drop policy if exists "reports_insert_staff" on public.test_reports;
drop policy if exists "reports_update_staff" on public.test_reports;

-- Patients can view their own reports
create policy "reports_select_patient" on public.test_reports 
  for select using (patient_id = auth.uid());

-- Staff can view all reports
create policy "reports_select_staff" on public.test_reports 
  for select using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() 
      and role in ('doctor', 'lab_staff', 'admin')
    )
  );

-- Lab staff and admins can insert reports
create policy "reports_insert_staff" on public.test_reports 
  for insert with check (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() 
      and role in ('lab_staff', 'admin')
    )
  );

-- Lab staff and admins can update reports
create policy "reports_update_staff" on public.test_reports 
  for update using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() 
      and role in ('lab_staff', 'admin')
    )
  );

-- ============================================
-- RLS POLICIES FOR ACTIVITY LOGS
-- ============================================

drop policy if exists "logs_select_admin" on public.activity_logs;
drop policy if exists "logs_insert_authenticated" on public.activity_logs;

-- Only admins can view activity logs
create policy "logs_select_admin" on public.activity_logs 
  for select using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() 
      and role = 'admin'
    )
  );

-- Anyone authenticated can insert logs (for their own actions)
create policy "logs_insert_authenticated" on public.activity_logs 
  for insert with check (auth.uid() is not null);

-- ============================================
-- RLS POLICIES FOR NOTIFICATIONS
-- ============================================

drop policy if exists "notifications_select_own" on public.notifications;
drop policy if exists "notifications_update_own" on public.notifications;
drop policy if exists "notifications_insert_staff" on public.notifications;

-- Users can view their own notifications
create policy "notifications_select_own" on public.notifications 
  for select using (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
create policy "notifications_update_own" on public.notifications 
  for update using (user_id = auth.uid());

-- Staff can insert notifications for any user
create policy "notifications_insert_staff" on public.notifications 
  for insert with check (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() 
      and role in ('lab_staff', 'admin')
    )
  );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_aadhaar on public.profiles(aadhaar_number);
create index if not exists idx_profiles_jnmch_id on public.profiles(jnmch_registration_id);
create index if not exists idx_reports_patient on public.test_reports(patient_id);
create index if not exists idx_reports_status on public.test_reports(status);
create index if not exists idx_reports_date on public.test_reports(report_date);
create index if not exists idx_reports_category on public.test_reports(test_category);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_unread on public.notifications(user_id, is_read) where is_read = false;
create index if not exists idx_activity_logs_user on public.activity_logs(user_id);
create index if not exists idx_activity_logs_date on public.activity_logs(created_at);

-- ============================================
-- FUNCTION: Auto-create profile on signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, phone, aadhaar_number, jnmch_registration_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'User'),
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'patient'),
    coalesce(new.raw_user_meta_data ->> 'phone', null),
    coalesce(new.raw_user_meta_data ->> 'aadhaar_number', null),
    coalesce(new.raw_user_meta_data ->> 'jnmch_registration_id', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Trigger for auto-creating profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================
-- FUNCTION: Update updated_at timestamp
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

-- Triggers for updated_at
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();

drop trigger if exists patients_updated_at on public.patients;
create trigger patients_updated_at before update on public.patients
  for each row execute function public.update_updated_at();

drop trigger if exists reports_updated_at on public.test_reports;
create trigger reports_updated_at before update on public.test_reports
  for each row execute function public.update_updated_at();
