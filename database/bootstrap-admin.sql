-- Ejecutar en Supabase SQL Editor después de crear el usuario en Auth.
-- Sustituir SOLO el UUID por el id del usuario administrador creado en Auth.
-- No guardar correos, contraseñas ni tokens en el repositorio.

insert into public.profiles (id, display_name, is_active)
values ('34e3b78c-e827-4ee2-8eaa-5af7f3549f30', 'Administrador inicial', true)
on conflict (id) do update set is_active = true, updated_at = now();

insert into public.profile_roles (profile_id, role)
values ('34e3b78c-e827-4ee2-8eaa-5af7f3549f30', 'administrador')
on conflict (profile_id, role) do nothing;

select p.id, p.display_name, pr.role
from public.profiles p
join public.profile_roles pr on pr.profile_id = p.id
where p.id = '34e3b78c-e827-4ee2-8eaa-5af7f3549f30';
