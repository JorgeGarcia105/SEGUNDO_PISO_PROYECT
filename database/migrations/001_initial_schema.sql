-- SegundoPiso: esquema inicial documental y de trazabilidad.
-- No incluye datos reales ni convierte decisiones de acta en normas vigentes.

create extension if not exists pgcrypto;

create type public.app_role as enum ('usuario', 'administrador', 'superadministrador');
create type public.publication_status as enum ('borrador', 'publicado', 'archivado');
create type public.source_type as enum ('carta_interna', 'acta', 'documento_externo', 'confirmacion_institucional');
create type public.norm_status as enum ('VIGENTE', 'MODIFICADA', 'DEROGADA', 'HISTORICA', 'PENDIENTE_CONFIRMACION', 'NO_VERIFICADO');
create type public.decision_type as enum ('PROPUESTA', 'VOTACION', 'DECISION_APROBADA', 'DECISION_RECHAZADA', 'EXCEPCION_INDIVIDUAL', 'INFORMACION', 'INFORME', 'PENDIENTE_CONFIRMACION');
create type public.scope_type as enum ('GENERAL', 'TEMPORAL', 'INDIVIDUAL', 'EXTERNO', 'NO_DETERMINADO');
create type public.cleaning_assignment_status as enum ('PROGRAMADO', 'ENTREGADO', 'VERIFICADO', 'INCUMPLIDO', 'CANCELADO', 'PENDIENTE_CONFIRMACION');
create type public.violation_status as enum ('ABIERTO', 'EN_INVESTIGACION', 'DESCARGOS_PRESENTADOS', 'RESUELTO', 'ARCHIVADO');
create type public.measure_type as enum ('ASEO_ADICIONAL', 'MULTA_ECONOMICA', 'RESTRICCION_USO', 'AMONESTACION', 'OTRA');
create type public.measure_status as enum ('PENDIENTE', 'EN_EJECUCION', 'COMPLETADA', 'INCUMPLIDA', 'CANCELADA');
create type public.case_event_type as enum ('CREACION', 'INVESTIGACION', 'DESCARGOS', 'AUDIENCIA', 'RESOLUCION', 'APELACION', 'EJECUCION_MEDIDA', 'CIERRE', 'NOTA');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  room_label text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profile_roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  primary key (profile_id, role)
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  document_type public.source_type not null,
  storage_path text,
  checksum text,
  document_date date,
  description text,
  status public.publication_status not null default 'borrador',
  is_immutable boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.norm_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.norms (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.norm_categories(id),
  title text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.norm_versions (
  id uuid primary key default gen_random_uuid(),
  norm_id uuid not null references public.norms(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  text_content text not null,
  status public.norm_status not null default 'PENDIENTE_CONFIRMACION',
  valid_from date,
  valid_until date,
  source_document_id uuid references public.documents(id),
  source_note text,
  approval_note text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (norm_id, version_number),
  check (valid_until is null or valid_from is null or valid_until >= valid_from)
);

create table public.assembly_minutes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  meeting_date date,
  document_id uuid references public.documents(id),
  participants_note text,
  topics text,
  observations text,
  status public.publication_status not null default 'borrador',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  assembly_id uuid references public.assembly_minutes(id) on delete set null,
  title text not null,
  detail text not null,
  decision_type public.decision_type not null,
  scope public.scope_type not null default 'NO_DETERMINADO',
  affected_person_note text,
  affected_norm_id uuid references public.norms(id),
  approved_at date,
  valid_from date,
  valid_until date,
  source_note text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (valid_until is null or valid_from is null or valid_until >= valid_from)
);

create table public.norm_changes (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null references public.decisions(id),
  norm_id uuid not null references public.norms(id),
  previous_version_id uuid references public.norm_versions(id),
  new_version_id uuid references public.norm_versions(id),
  confirmation_note text not null,
  confirmed_by uuid references public.profiles(id),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  check (new_version_id is not null or confirmed_at is null)
);

create table public.cleaning_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  source_document_id uuid references public.documents(id),
  status public.publication_status not null default 'borrador',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cleaning_tasks (
  id uuid primary key default gen_random_uuid(),
  zone_id uuid not null references public.cleaning_zones(id) on delete cascade,
  title text not null,
  instructions text,
  frequency_note text,
  source_document_id uuid references public.documents(id),
  status public.publication_status not null default 'borrador',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cleaning_assignments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.cleaning_tasks(id),
  profile_id uuid references public.profiles(id),
  assignment_note text,
  scheduled_for date,
  due_at timestamptz,
  status public.cleaning_assignment_status not null default 'PENDIENTE_CONFIRMACION',
  source_document_id uuid references public.documents(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cleaning_reviews (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.cleaning_assignments(id) on delete cascade,
  reviewer_id uuid references public.profiles(id),
  reviewed_at timestamptz,
  result_note text,
  evidence_path text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  is_important boolean not null default false,
  starts_at timestamptz,
  expires_at timestamptz,
  status public.publication_status not null default 'borrador',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at is null or starts_at is null or expires_at >= starts_at)
);

create table public.violations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  detail text not null,
  violation_date date not null,
  reported_by uuid references public.profiles(id),
  reported_at timestamptz not null default now(),
  affected_profile_id uuid references public.profiles(id),
  source_norm_id uuid references public.norms(id),
  source_decision_id uuid references public.decisions(id),
  source_document_id uuid references public.documents(id),
  status public.violation_status not null default 'ABIERTO',
  scope public.scope_type not null default 'INDIVIDUAL',
  evidence_note text,
  resolution_note text,
  resolved_by uuid references public.profiles(id),
  resolved_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.corrective_measures (
  id uuid primary key default gen_random_uuid(),
  violation_id uuid not null references public.violations(id) on delete cascade,
  measure_type public.measure_type not null,
  detail text not null,
  quantity integer,
  unit text,
  status public.measure_status not null default 'PENDIENTE',
  assigned_to uuid references public.profiles(id),
  assigned_by uuid references public.profiles(id),
  assigned_at timestamptz,
  due_at timestamptz,
  completed_at timestamptz,
  completion_note text,
  source_document_id uuid references public.documents(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.case_events (
  id uuid primary key default gen_random_uuid(),
  violation_id uuid not null references public.violations(id) on delete cascade,
  event_type public.case_event_type not null,
  description text not null,
  event_date timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.case_evidence (
  id uuid primary key default gen_random_uuid(),
  violation_id uuid not null references public.violations(id) on delete cascade,
  title text not null,
  description text,
  storage_path text,
  checksum text,
  evidence_type text,
  uploaded_by uuid references public.profiles(id),
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id uuid,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  old_data jsonb,
  new_data jsonb,
  changed_by uuid references public.profiles(id),
  changed_at timestamptz not null default now()
);

create index documents_status_idx on public.documents(status);
create index norm_versions_status_idx on public.norm_versions(status);
create index norm_versions_source_idx on public.norm_versions(source_document_id);
create index assembly_minutes_date_idx on public.assembly_minutes(meeting_date desc);
create index decisions_type_scope_idx on public.decisions(decision_type, scope);
create index cleaning_assignments_date_idx on public.cleaning_assignments(scheduled_for);
create index announcements_active_idx on public.announcements(status, starts_at, expires_at);
create index violations_status_idx on public.violations(status);
create index violations_profile_idx on public.violations(affected_profile_id);
create index violations_norm_idx on public.violations(source_norm_id);
create index corrective_measures_violation_idx on public.corrective_measures(violation_id);
create index corrective_measures_status_idx on public.corrective_measures(status);
create index case_events_violation_idx on public.case_events(violation_id);
create index case_evidence_violation_idx on public.case_evidence(violation_id);
create index audit_events_record_idx on public.audit_events(table_name, record_id, changed_at desc);

create or replace function public.current_user_has_role(required_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profile_roles
    where profile_id = auth.uid() and role = required_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_has_role('administrador')
      or public.current_user_has_role('superadministrador');
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_events(table_name, record_id, action, old_data, new_data, changed_by)
  values (
    tg_table_name,
    coalesce(new.id, old.id),
    tg_op,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end,
    auth.uid()
  );
  return coalesce(new, old);
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['profiles', 'documents', 'norm_categories', 'norms', 'assembly_minutes', 'decisions', 'cleaning_zones', 'cleaning_tasks', 'cleaning_assignments', 'announcements', 'violations', 'corrective_measures'] loop
    execute format('create trigger %I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['documents', 'norms', 'norm_versions', 'assembly_minutes', 'decisions', 'norm_changes', 'cleaning_zones', 'cleaning_tasks', 'cleaning_assignments', 'cleaning_reviews', 'announcements', 'violations', 'corrective_measures', 'case_events', 'case_evidence'] loop
    execute format('create trigger %I_audit after insert or update or delete on public.%I for each row execute function public.audit_row_change()', table_name, table_name);
  end loop;
end;
$$;

alter table public.profiles enable row level security;
alter table public.profile_roles enable row level security;
alter table public.documents enable row level security;
alter table public.norm_categories enable row level security;
alter table public.norms enable row level security;
alter table public.norm_versions enable row level security;
alter table public.assembly_minutes enable row level security;
alter table public.decisions enable row level security;
alter table public.norm_changes enable row level security;
alter table public.cleaning_zones enable row level security;
alter table public.cleaning_tasks enable row level security;
alter table public.cleaning_assignments enable row level security;
alter table public.cleaning_reviews enable row level security;
alter table public.announcements enable row level security;
alter table public.violations enable row level security;
alter table public.corrective_measures enable row level security;
alter table public.case_events enable row level security;
alter table public.case_evidence enable row level security;
alter table public.audit_events enable row level security;

create policy profiles_read_self_or_admin on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy profiles_admin_write on public.profiles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy roles_read_self_or_admin on public.profile_roles for select to authenticated
  using (profile_id = auth.uid() or public.is_admin());
create policy roles_superadmin_write on public.profile_roles for all to authenticated
  using (public.current_user_has_role('superadministrador'))
  with check (public.current_user_has_role('superadministrador'));

create policy documents_public_read on public.documents for select to authenticated
  using (status = 'publicado' or public.is_admin());
create policy documents_admin_write on public.documents for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy categories_public_read on public.norm_categories for select to authenticated
  using (public.is_admin() or exists (select 1 from public.norms n join public.norm_versions v on v.norm_id = n.id where n.category_id = norm_categories.id and v.status = 'VIGENTE'));
create policy categories_admin_write on public.norm_categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy norms_public_read on public.norms for select to authenticated
  using (public.is_admin() or exists (select 1 from public.norm_versions v where v.norm_id = norms.id and v.status = 'VIGENTE'));
create policy norms_admin_write on public.norms for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy norm_versions_public_read on public.norm_versions for select to authenticated
  using (status = 'VIGENTE' or public.is_admin());
create policy norm_versions_admin_write on public.norm_versions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy assemblies_public_read on public.assembly_minutes for select to authenticated
  using (status = 'publicado' or public.is_admin());
create policy assemblies_admin_write on public.assembly_minutes for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy decisions_public_read on public.decisions for select to authenticated
  using (public.is_admin() or decision_type in ('DECISION_APROBADA', 'INFORMACION', 'INFORME'));
create policy decisions_admin_write on public.decisions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy norm_changes_admin_only on public.norm_changes for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy cleaning_public_read on public.cleaning_zones for select to authenticated
  using (status = 'publicado' or public.is_admin());
create policy cleaning_admin_write on public.cleaning_zones for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy cleaning_tasks_public_read on public.cleaning_tasks for select to authenticated
  using (status = 'publicado' or public.is_admin());
create policy cleaning_tasks_admin_write on public.cleaning_tasks for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy assignments_read_own_or_admin on public.cleaning_assignments for select to authenticated
  using (profile_id = auth.uid() or public.is_admin());
create policy assignments_admin_write on public.cleaning_assignments for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy reviews_read_own_or_admin on public.cleaning_reviews for select to authenticated
  using (exists (select 1 from public.cleaning_assignments a where a.id = assignment_id and a.profile_id = auth.uid()) or public.is_admin());
create policy reviews_admin_write on public.cleaning_reviews for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy announcements_public_read on public.announcements for select to authenticated
  using ((status = 'publicado' and (starts_at is null or starts_at <= now()) and (expires_at is null or expires_at >= now())) or public.is_admin());
create policy announcements_admin_write on public.announcements for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy violations_read_own_or_admin on public.violations for select to authenticated
  using (affected_profile_id = auth.uid() or reported_by = auth.uid() or public.is_admin());
create policy violations_admin_write on public.violations for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy measures_read_own_or_admin on public.corrective_measures for select to authenticated
  using (exists (select 1 from public.violations v where v.id = violation_id and (v.affected_profile_id = auth.uid() or v.reported_by = auth.uid())) or public.is_admin());
create policy measures_admin_write on public.corrective_measures for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy case_events_read_own_or_admin on public.case_events for select to authenticated
  using (exists (select 1 from public.violations v where v.id = violation_id and (v.affected_profile_id = auth.uid() or v.reported_by = auth.uid())) or public.is_admin());
create policy case_events_admin_write on public.case_events for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy case_evidence_read_own_or_admin on public.case_evidence for select to authenticated
  using (exists (select 1 from public.violations v where v.id = violation_id and (v.affected_profile_id = auth.uid() or v.reported_by = auth.uid())) or public.is_admin());
create policy case_evidence_admin_write on public.case_evidence for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy audit_admin_read on public.audit_events for select to authenticated
  using (public.is_admin());

revoke all on public.audit_events from anon, authenticated;
grant select on public.audit_events to authenticated;
