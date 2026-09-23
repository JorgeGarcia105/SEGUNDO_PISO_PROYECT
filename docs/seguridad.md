# Seguridad

## Implementado en la migración

- Supabase Auth como identidad.
- Roles `usuario`, `administrador` y `superadministrador`.
- Row Level Security habilitado en todas las tablas.
- Usuarios autenticados pueden consultar únicamente contenido publicado o sus
  propias asignaciones, según el módulo.
- Solo administradores pueden modificar contenido operativo.
- Solo superadministradores pueden modificar asignaciones de roles.
- Auditoría de cambios con usuario, fecha, acción, valor anterior y valor nuevo.
- `norm_changes` requiere una decisión y una nota de confirmación.

## Reglas de operación

- El frontend no es una barrera de autorización suficiente.
- No se debe exponer la `service_role` key en el frontend.
- Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` son las
  previstas para el cliente web; `VITE_SUPABASE_ANON_KEY` queda como compatibilidad
  para proyectos con claves legacy.
- Las variables server-side deben copiarse desde `backend/.env.example` a
  `backend/.env.local` o `backend/.env`. Allí se puede pegar `SUPABASE_SECRET_KEY`;
  nunca debe llevar prefijo `VITE_`.
- Los datos de incumplimientos y medidas correctivas requieren revisión de
  visibilidad y retención antes de cargarse.
- Los documentos originales deben ser inmutables y su checksum debe conservarse.

## Verificación pendiente

Las políticas deben probarse en un proyecto Supabase real con cuentas de usuario,
administrador y superadministrador. Esta verificación aún no se ha ejecutado porque
no se ha creado ni conectado un proyecto remoto.
