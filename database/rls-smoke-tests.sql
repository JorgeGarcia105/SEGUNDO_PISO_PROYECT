-- Pruebas manuales para ejecutar en un entorno controlado.
-- Estas consultas se ejecutan desde clientes autenticados distintos.
-- No usar service_role para probar RLS: esa clave omite las políticas.

-- 1. Con un usuario autenticado normal: debe devolver filas publicadas.
select id, title, status
from public.documents
where status = 'publicado';

-- 2. Con un usuario normal: debe fallar o afectar 0 filas al intentar insertar.
insert into public.announcements (title, body, status)
values ('PRUEBA RLS - NO PUBLICAR', 'Debe ser rechazado para usuario normal.', 'borrador');

-- 3. Con un administrador: debe permitir crear un borrador.
insert into public.announcements (title, body, status, created_by)
values ('PRUEBA RLS - BORRAR', 'Registro temporal de validación.', 'borrador', auth.uid())
returning id;

-- 4. Con un administrador, sustituir el UUID obtenido y eliminar el registro.
-- delete from public.announcements where id = 'UUID_DEL_REGISTRO_TEMPORAL';

-- 5. Con un usuario normal: su asignación propia debe ser visible; la de otra
-- persona no debe ser visible.
select id, profile_id, scheduled_for, status
from public.cleaning_assignments;

-- 6. Con un administrador: debe poder consultar auditoría.
select table_name, record_id, action, changed_by, changed_at
from public.audit_events
order by changed_at desc
limit 20;

-- 7. Con un usuario normal: la consulta anterior debe devolver 0 filas.
