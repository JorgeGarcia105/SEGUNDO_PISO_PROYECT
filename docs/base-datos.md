# Base de datos

## Estado

La primera migración está en
`database/migrations/001_initial_schema.sql`. Está preparada para PostgreSQL de
Supabase y no contiene datos reales.

El flujo de Supabase CLI usa
`supabase/migrations/20260921180000_initial_schema.sql`, que incluye el archivo
revisado de `database/migrations` mediante `\ir`. Así se conserva una copia
legible del esquema y, a la vez, la CLI puede aplicar una migración versionada.

## Decisiones

- `documents` conserva las fuentes originales y su checksum.
- `decisions` registra lo ocurrido en un acta sin convertirlo en norma.
- `norm_versions` contiene el texto versionado y su estado documental.
- `norm_changes` solo relaciona una decisión con una versión cuando existe una
  confirmación explícita.
- Las asignaciones de aseo, revisiones y excepciones están separadas.
- `audit_events` registra INSERT, UPDATE y DELETE con valores anterior y nuevo.

## Estados importantes

Las normas pueden ser `VIGENTE`, `MODIFICADA`, `DEROGADA`, `HISTORICA`,
`PENDIENTE_CONFIRMACION` o `NO_VERIFICADO`.

Las decisiones distinguen `PROPUESTA`, `VOTACION`, `DECISION_APROBADA`,
`DECISION_RECHAZADA`, `EXCEPCION_INDIVIDUAL`, `INFORMACION`, `INFORME` y
`PENDIENTE_CONFIRMACION`.

## Aplicación

1. Crear un proyecto en el dashboard de Supabase y conservar su `project ref`.
2. Autenticar la CLI sin enviar el secreto por chat. En la terminal del proyecto:

   ```bash
   npx supabase login --token TU_TOKEN_INTRODUCIDO_LOCALMENTE
   ```

   El token debe ser un Personal Access Token con formato `sbp_...`. No usar la
   clave `sb_publishable_...` del frontend. Debe escribirse directamente en la
   terminal o inyectarse desde el gestor de secretos local; no debe guardarse en
   el repositorio.

3. Enlazar el workspace:

   ```bash
   npx supabase link --project-ref TU_PROJECT_REF
   ```

   Solo si el enlace termina correctamente, aplicar la migración:

   ```bash
   npx supabase db push
   ```

4. Crear el primer usuario en Auth.
5. Crear su fila en `profiles` y asignarle `administrador` mediante una operación
   controlada de bootstrap.
6. Configurar las variables del frontend a partir de `.env.example`.
7. Verificar con una cuenta de usuario y otra de administrador que RLS impide las
   escrituras no autorizadas.

La carga segura de fuentes, normas pendientes, zonas y decisiones históricas está
en [carga-documental.md](carga-documental.md). No crea personas ni asignaciones
personales.

## Pendiente técnico

- Decidir si se usa Supabase CLI y una carpeta `supabase/` como flujo oficial.
- Añadir tipos generados desde el esquema real.
- Configurar buckets de Storage y sus políticas.
- Probar las políticas con usuarios de cada rol en un proyecto Supabase real.
- Ejecutar `supabase start` y `supabase db lint --local` si Docker Desktop estará
   disponible para pruebas locales.
