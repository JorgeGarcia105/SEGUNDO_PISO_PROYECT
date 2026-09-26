-- Políticas RLS para lectura anónima (contenido público sin login)

do $$
begin
  -- Norms
  if not exists (
    select 1 from pg_policies where tablename = 'norms' and policyname = 'norms_public_read_anon'
  ) then
    create policy norms_public_read_anon on public.norms for select to anon
      using (exists (select 1 from public.norm_versions v where v.norm_id = norms.id and v.status = 'VIGENTE'));
  end if;

  -- Norm versions
  if not exists (
    select 1 from pg_policies where tablename = 'norm_versions' and policyname = 'norm_versions_public_read_anon'
  ) then
    create policy norm_versions_public_read_anon on public.norm_versions for select to anon
      using (status = 'VIGENTE');
  end if;

  -- Norm categories
  if not exists (
    select 1 from pg_policies where tablename = 'norm_categories' and policyname = 'categories_public_read_anon'
  ) then
    create policy categories_public_read_anon on public.norm_categories for select to anon
      using (exists (select 1 from public.norms n join public.norm_versions v on v.norm_id = n.id where n.category_id = norm_categories.id and v.status = 'VIGENTE'));
  end if;

  -- Documents
  if not exists (
    select 1 from pg_policies where tablename = 'documents' and policyname = 'documents_public_read_anon'
  ) then
    create policy documents_public_read_anon on public.documents for select to anon
      using (status = 'publicado');
  end if;

  -- Assembly minutes
  if not exists (
    select 1 from pg_policies where tablename = 'assembly_minutes' and policyname = 'assemblies_public_read_anon'
  ) then
    create policy assemblies_public_read_anon on public.assembly_minutes for select to anon
      using (status = 'publicado');
  end if;

  -- Decisions
  if not exists (
    select 1 from pg_policies where tablename = 'decisions' and policyname = 'decisions_public_read_anon'
  ) then
    create policy decisions_public_read_anon on public.decisions for select to anon
      using (decision_type in ('DECISION_APROBADA', 'INFORMACION', 'INFORME'));
  end if;

  -- Cleaning zones
  if not exists (
    select 1 from pg_policies where tablename = 'cleaning_zones' and policyname = 'cleaning_zones_public_read_anon'
  ) then
    create policy cleaning_zones_public_read_anon on public.cleaning_zones for select to anon
      using (status = 'publicado');
  end if;

  -- Cleaning tasks
  if not exists (
    select 1 from pg_policies where tablename = 'cleaning_tasks' and policyname = 'cleaning_tasks_public_read_anon'
  ) then
    create policy cleaning_tasks_public_read_anon on public.cleaning_tasks for select to anon
      using (status = 'publicado');
  end if;

  -- Announcements
  if not exists (
    select 1 from pg_policies where tablename = 'announcements' and policyname = 'announcements_public_read_anon'
  ) then
    create policy announcements_public_read_anon on public.announcements for select to anon
      using (status = 'publicado' and (starts_at is null or starts_at <= now()) and (expires_at is null or expires_at >= now()));
  end if;
end $$;