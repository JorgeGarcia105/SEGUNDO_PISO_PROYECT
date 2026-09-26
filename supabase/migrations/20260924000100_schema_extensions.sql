-- Extensiones de esquema para Carta Interna actualizada
-- Nuevos campos en tablas existentes y nuevas tablas de apoyo

-- 1. Extender tabla norms
alter table public.norms add column if not exists article_number text;
alter table public.norms add column if not exists chapter text;
alter table public.norms add column if not exists is_provisional boolean not null default false;
alter table public.norms add column if not exists drive_url text;
alter table public.norms add column if not exists source_document_id uuid references public.documents(id);

create index if not exists norms_chapter_idx on public.norms(chapter);
create index if not exists norms_article_idx on public.norms(article_number);

-- 2. Extender tabla norm_versions
alter table public.norm_versions add column if not exists version_label text;
alter table public.norm_versions add column if not exists ratification_date date;
alter table public.norm_versions add column if not exists ratified_by uuid references public.profiles(id);

-- 3. Nueva tabla: norm_annotations (notas, concordancias, referencias cruzadas)
create table if not exists public.norm_annotations (
  id uuid primary key default gen_random_uuid(),
  norm_id uuid not null references public.norms(id) on delete cascade,
  version_id uuid references public.norm_versions(id) on delete set null,
  annotation_type text not null check (annotation_type in ('concordancia', 'referencia_cruzada', 'nota_interna', 'observacion', 'vacío_detectado')),
  title text not null,
  content text not null,
  source_document_id uuid references public.documents(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists norm_annotations_norm_idx on public.norm_annotations(norm_id);
create index if not exists norm_annotations_version_idx on public.norm_annotations(version_id);

alter table public.norm_annotations enable row level security;

-- Policies idempotentes
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'norm_annotations' and policyname = 'norm_annotations_read'
  ) then
    create policy norm_annotations_read on public.norm_annotations for select to authenticated
      using (public.is_admin() or exists (
        select 1 from public.norm_versions nv
        join public.norms n on n.id = nv.norm_id
        where nv.id = norm_annotations.version_id
        and (nv.status = 'VIGENTE' or public.is_admin())
      ));
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'norm_annotations' and policyname = 'norm_annotations_admin_write'
  ) then
    create policy norm_annotations_admin_write on public.norm_annotations for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- 4. Nueva tabla: formats_control (Formatos 1-5 del Anexo C)
create table if not exists public.formats_control (
  id uuid primary key default gen_random_uuid(),
  format_number integer not null unique check (format_number between 1 and 5),
  title text not null,
  description text,
  article_reference text,
  template_content text,
  drive_url text,
  status public.publication_status not null default 'borrador',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.formats_control enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'formats_control' and policyname = 'formats_read'
  ) then
    create policy formats_read on public.formats_control for select to authenticated
      using (status = 'publicado' or public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'formats_control' and policyname = 'formats_admin_write'
  ) then
    create policy formats_admin_write on public.formats_control for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- 5. Trigger updated_at para nuevas tablas
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'norm_annotations_updated_at'
  ) then
    create trigger norm_annotations_updated_at
      before update on public.norm_annotations
      for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'formats_control_updated_at'
  ) then
    create trigger formats_control_updated_at
      before update on public.formats_control
      for each row execute function public.set_updated_at();
  end if;
end $$;

-- 6. Auditoria para nuevas tablas
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'norm_annotations_audit'
  ) then
    create trigger norm_annotations_audit
      after insert or update or delete on public.norm_annotations
      for each row execute function public.audit_row_change();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'formats_control_audit'
  ) then
    create trigger formats_control_audit
      after insert or update or delete on public.formats_control
      for each row execute function public.audit_row_change();
  end if;
end $$;

-- 7. Extender documents para tipo documento_externo y drive_url
alter table public.documents add column if not exists drive_url text;
alter table public.documents add column if not exists external_id text;
alter table public.documents add column if not exists source_document_id uuid references public.documents(id);