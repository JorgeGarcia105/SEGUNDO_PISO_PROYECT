# Configuracion final de Supabase

Este procedimiento configura el proyecto remoto sin cargar normas, decisiones,
personas o sanciones que sigan pendientes de confirmacion documental.

## 1. Crear el proyecto cloud

1. Abrir el dashboard de Supabase e iniciar sesion.
2. Seleccionar `New project` dentro de una organizacion.
3. Usar un nombre como `segundo-piso`.
4. Elegir una region cercana a los usuarios.
5. Guardar la contrasena de base de datos en un gestor seguro.
6. Mantener el plan gratuito mientras el uso permanezca dentro de sus limites.
7. Esperar a que el proyecto termine de provisionarse.

Datos necesarios del dashboard:

- `Project URL`.
- `Project ref`.
- `publishable key`, visible en API settings. En proyectos legacy puede ser la
  clave `anon`.

La `service_role key` no debe ir al frontend ni al repositorio.

## 2. Autenticar la CLI

Desde la raiz del proyecto:

```bash
cd C:\Users\garci\OneDrive\Desktop\SEGUNDO_PISO_PROYECT
npx supabase --version
npx supabase login --token TU_TOKEN
```

El token debe ser un **Personal Access Token** de la cuenta Supabase y comienza
normalmente por `sbp_`. No es la clave `sb_publishable_...` del frontend, la clave
`anon` ni la contraseña de la base de datos. Debe escribirse directamente en la
terminal y no guardarse en archivos `.env`, commits ni mensajes.

Enlazar el workspace:

```bash
npx supabase link --project-ref TU_PROJECT_REF
```

Si solicita la contrasena de base de datos, escribirla directamente en el prompt.

## 3. Aplicar la migracion

La migracion versionada es:

```text
supabase/migrations/20260921180000_initial_schema.sql
```

Ese archivo incluye el esquema revisado de:

```text
database/migrations/001_initial_schema.sql
```

Aplicar en el proyecto remoto:

```bash
npx supabase db push
```

En Git Bash, una vez autenticado, se puede ejecutar de forma segura en una sola
linea para impedir que `db push` corra si `link` falla:

```bash
npx supabase link --project-ref ovsygrniqvekiaucwcwz && npx supabase db push
```

Verificar en SQL Editor:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

Deben aparecer, entre otras, `profiles`, `profile_roles`, `documents`, `norms`,
`norm_versions`, `decisions`, `norm_changes`, `cleaning_assignments`,
`announcements` y `audit_events`.

## 4. Cargar la informacion documental inicial

Ejecutar el procedimiento de [carga-documental.md](carga-documental.md). La
carga contiene fuentes, normas pendientes, zonas de aseo y decisiones historicas.
No contiene personas, asignaciones personales ni sanciones vigentes.

## 5. Crear el administrador inicial

1. Ir a `Authentication > Users`.
2. Crear un usuario con correo autorizado y una contrasena temporal fuerte.
3. Copiar el UUID del usuario creado.
4. Abrir `SQL Editor`.
5. Copiar [database/bootstrap-admin.sql](../database/bootstrap-admin.sql).
6. Sustituir las dos apariciones del UUID de ejemplo por el UUID real.
7. Ejecutar el script.
8. Cerrar sesion y volver a iniciar sesion desde la aplicacion cuando exista el
   formulario de autenticacion.

El vinculo se realiza por UUID de Auth, no por correo.

## 6. Crear usuario de prueba

En `Authentication > Users`, crear otro usuario sin asignarle fila en
`profile_roles`. Ese usuario representa el rol `usuario` autenticado.

No usar la misma cuenta para probar ambos roles.

## 7. Configurar el frontend

Crear `frontend/.env.local` a partir de `.env.example`:

```dotenv
VITE_SUPABASE_URL=https://TU_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_PUBLISHABLE_KEY
```

Reglas:

- `.env.local` no se debe versionar.
- La clave `publishable` puede estar en el frontend porque RLS debe proteger la base.
- Para proyectos legacy, `VITE_SUPABASE_ANON_KEY` sigue siendo compatible.
- Nunca usar `service_role` en `VITE_*`.
- Reiniciar Vite después de modificar variables.

El proyecto todavía no tiene backend implementado. Cuando se cree, copiar
`backend/.env.example` como `backend/.env.local` o `backend/.env` y pegar allí la
nueva `SUPABASE_SECRET_KEY` generada en Supabase Dashboard. Esa variable solo debe
ser leída por procesos server-side o Edge Functions. No pegarla en el frontend,
en `.env.example`, en una variable `VITE_*`, en código del navegador ni en commits.

Iniciar:

```bash
cd C:\Users\garci\OneDrive\Desktop\SEGUNDO_PISO_PROYECT\frontend
npm run dev
```

## 8. Probar RLS

Usar [database/rls-smoke-tests.sql](../database/rls-smoke-tests.sql) y dos
sesiones autenticadas.

Usuario normal:

- Puede consultar contenido publicado y sus asignaciones propias.
- No puede insertar avisos.
- No puede modificar normas, documentos o actas.
- No puede consultar auditoria.
- No puede consultar asignaciones de otra persona.

Administrador:

- Puede crear un borrador.
- Puede modificar contenido autorizado.
- Puede consultar auditoria.
- No puede administrar roles si no es superadministrador.

Superadministrador:

- Puede gestionar `profile_roles`.

Nunca ejecutar las pruebas con `service_role`, porque esa clave evita RLS.

## 9. Configuracion de Auth

En `Authentication > URL Configuration`:

- Para desarrollo local: `http://localhost:5173`.
- Añadir la URL de Vercel cuando exista el despliegue.
- Configurar confirmacion de correo segun la politica del proyecto.
- No habilitar proveedores sociales hasta que sean necesarios.

## 10. Checklist

- [ ] Proyecto cloud creado.
- [ ] CLI autenticada y workspace enlazado.
- [ ] Migracion aplicada sin errores.
- [ ] Carga documental inicial revisada.
- [ ] Administrador creado por UUID.
- [ ] Usuario normal de prueba creado.
- [ ] Variables frontend configuradas.
- [ ] RLS probado con ambas cuentas.
- [ ] Ninguna clave secreta guardada en el repositorio.
- [ ] Ninguna norma pendiente publicada como vigente.
