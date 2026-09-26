-- Storage bucket para documentos PDF
-- Ejecutar después del schema inicial

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  true,
  52428800, -- 50MB
  array['application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Política: lectura pública para archivos en bucket documents
create policy "Public read access for documents"
on storage.objects for select
using (bucket_id = 'documents');

-- Política: solo admins pueden subir/eliminar
create policy "Admin write access for documents"
on storage.objects for insert
with check (
  bucket_id = 'documents'
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.profiles p
    join public.profile_roles pr on pr.profile_id = p.id
    where p.id = auth.uid()
    and pr.role in ('administrador', 'superadministrador')
  )
);

create policy "Admin update access for documents"
on storage.objects for update
using (
  bucket_id = 'documents'
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.profiles p
    join public.profile_roles pr on pr.profile_id = p.id
    where p.id = auth.uid()
    and pr.role in ('administrador', 'superadministrador')
  )
)
with check (
  bucket_id = 'documents'
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.profiles p
    join public.profile_roles pr on pr.profile_id = p.id
    where p.id = auth.uid()
    and pr.role in ('administrador', 'superadministrador')
  )
);

create policy "Admin delete access for documents"
on storage.objects for delete
using (
  bucket_id = 'documents'
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.profiles p
    join public.profile_roles pr on pr.profile_id = p.id
    where p.id = auth.uid()
    and pr.role in ('administrador', 'superadministrador')
  )
);