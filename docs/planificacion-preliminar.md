# SegundoPiso - planificacion preliminar

Esta es una propuesta para revisar, no una autorizacion para comenzar la
implementacion.

La validacion documental ampliada se encuentra en [fase-0-levantamiento.md](fase-0-levantamiento.md),
[matriz-normativa.md](matriz-normativa.md), [matriz-contradicciones.md](matriz-contradicciones.md),
[matriz-decisiones-actas.md](matriz-decisiones-actas.md), [levantamiento-aseos.md](levantamiento-aseos.md)
y [matriz-medidas-correctivas.md](matriz-medidas-correctivas.md). Esas matrices
son la base de evidencia; esta planificacion no agrega normas de convivencia.

## Arquitectura propuesta

- Frontend: React + TypeScript + Vite, organizado por modulos de dominio.
- Persistencia y autenticacion: Supabase PostgreSQL, Auth y Storage.
- Hosting: Vercel en plan gratuito, sujeto a limites vigentes.
- Repositorio y CI basico: GitHub.
- Capas: paginas/componentes; hooks/casos de uso; servicios de dominio;
  adaptadores Supabase; tipos y validaciones.
- Seguridad: Auth, roles en base de datos, RLS, funciones protegidas y auditoria.

Esta opcion conserva el objetivo de costo cero inicial sin agregar infraestructura
propia. El costo cero depende de no superar limites gratuitos.

## Modelo de informacion inicial

Entidades propuestas:

- `profiles`, `roles`, `profile_roles`.
- `rooms`, `people`, `residents`, `resident_periods`.
- `norm_categories`, `norms`, `norm_versions`, `norm_sources`.
- `assembly_minutes`, `assembly_attendees`, `assembly_items`, `decisions`,
  `norm_changes`.
- `cleaning_zones`, `cleaning_tasks`, `cleaning_instructions`, `cleaning_rules`,
  `cleaning_assignments`, `cleaning_reviews`, `cleaning_exceptions`.
- `violations`, `corrective_measures`, `case_events`, `case_evidence`.
- `announcements`, `documents`, `document_links`.
- `representative_roles`, `representative_assignments`.
- `audit_events` y, si hace falta detalle, `audit_event_changes`.

Decisiones de modelado:

- Una norma tiene versiones; el estado aplica a la version, no solo al titulo.
- Una fuente puede ser PDF, acta, documento externo o confirmacion institucional.
- Una decision de acta queda separada de `norm_changes`; solo una aprobacion crea o
  modifica una version normativa.
- Las excepciones individuales no mutan la norma general.
- Las actas originales se conservan como documentos inmutables con metadatos y hash.
- Incumplimientos y medidas tienen permisos mas restrictivos que la consulta publica.

## Roles iniciales

- Usuario: lectura de contenido publicado y documentos publicos.
- Administrador: CRUD de contenido y casos autorizados; consulta de auditoria.
- Superadministrador: solo si el MVP demuestra necesidad, para roles y ajustes
  sensibles.

La base de datos debe rechazar escrituras de un usuario normal aunque intente llamar
directamente a Supabase.

## Navegacion propuesta

Inicio, Normas, Aseos, Calendario, Actas, Avisos y Documentos para lectura.

Administracion, visible y accesible solo con permisos, con submodulos para normas,
aseos, actas, avisos, documentos, personas/cargos, incumplimientos y auditoria.

## Backlog inicial

### EPIC: Gobierno documental y trazabilidad

Historia: como administrador quiero registrar fuentes y actas sin perder el
original para demostrar el origen de cada dato. **Prioridad P0**

- Criterios: documento original, fecha, tipo, estado, hash y relaciones visibles.
- Tareas: Storage; documentos; actas; relaciones fuente-norma; permisos.

Historia: como administrador quiero convertir una decision en modificacion solo
despues de confirmar alcance y vigencia. **Prioridad P0**

- Criterios: estado pendiente; aprobacion; version normativa; enlace al acta.
- Tareas: decisiones; cambios normativos; flujo de confirmacion; auditoria.

### EPIC: Autenticacion y permisos

Historia: como usuario quiero iniciar y cerrar sesion para consultar contenido
autorizado. **Prioridad P0**

- Criterios: sesion, logout, rutas protegidas y errores claros.
- Tareas: Auth; perfiles; roles; guardas; RLS; pruebas de acceso.

Historia: como administrador quiero gestionar contenido sin editar codigo.
**Prioridad P0**

- Criterios: CRUD, validacion, desactivacion, confirmacion destructiva y auditoria.
- Tareas: layout administrativo; formularios; servicios; politicas RLS.

### EPIC: Normativa

Historia: como usuario quiero consultar normas vigentes, historicas y pendientes
sin confundir sus estados. **Prioridad P0**

- Criterios: categorias, filtros, fuente, actas relacionadas y estado visible.
- Tareas: modelo versionado; listado; detalle; busqueda; pruebas.

### EPIC: Aseos y horarios

Historia: como residente quiero consultar mis aseos, instrucciones, horario y
estado de revision. **Prioridad P0**

- Criterios: zona, tarea, instrucciones, responsable, fecha, revision y excepcion.
- Tareas: catalogo; calendario; asignaciones; revisiones; vista mobile.

Historia: como administrador quiero registrar incumplimientos de aseo con evidencia
y medida respaldada documentalmente. **Prioridad P0**

- Criterios: fuente, alcance, estado, descargos, responsable y seguimiento.
- Tareas: casos; evidencias; permisos restrictivos; auditoria.

### EPIC: Actas y acuerdos

Historia: como usuario quiero leer actas historicas y distinguir sus decisiones
de las normas vigentes. **Prioridad P0**

- Criterios: fecha, titulo, documento original, decisiones y etiquetas de estado.
- Tareas: listado; detalle; filtros; enlaces a normas y acuerdos.

### EPIC: Avisos y documentos

Historia: como administrador quiero publicar avisos normales o importantes con
vigencia y expiracion. **Prioridad P0**

- Criterios: prioridad, fechas, visibilidad y desactivacion.
- Tareas: CRUD; inicio; orden; estados vacios.

### EPIC: Calidad y despliegue

Historia: como equipo quiero desplegar con variables de entorno y documentacion
repetible. **Prioridad P1**

- Criterios: `.env.example`, README, migraciones, seed DEMO separado y pipeline.
- Tareas: lint; typecheck; pruebas; guia Supabase/Vercel; respaldo.

## Riesgos iniciales

- Publicar como vigente una regla que solo fue una propuesta.
- Registrar datos personales historicos sin base legal o retencion definida.
- Confiar en el frontend para permisos.
- Interpretar texto danado del PDF sin validacion visual.
- Sobrecargar el MVP con cuotas, finanzas o sanciones no confirmadas.
- Llegar al limite gratuito por Storage, consultas o usuarios.

## Criterio para pasar a Fase 2

La implementacion solo debe comenzar despues de aprobar: estado de cada norma,
fuentes faltantes, modelo de confirmacion, roles, alcance del MVP, politica de
datos personales y prioridad de las contradicciones de Fase 0.

## Revision de arquitectura despues de la validacion

### Respaldado directamente por los documentos

- Se necesitan documentos fuente, actas, decisiones, responsables, normas,
  asignaciones de aseo, verificaciones, quejas y medidas correctivas porque esas
  entidades aparecen en los documentos.
- Se necesita distinguir Carta, acta, propuesta, votacion, excepcion e informe.
- Se necesita conservar la relación entre fuente y norma cuando pueda determinarse.
- Se necesita registrar estados pendientes porque existen diferencias de aseos,
  medidas, horarios, terraza/lavandería y cargos.
- Se necesita historial de cambios para no sobrescribir actas ni versiones de
  normas.

### Decisiones técnicas del proyecto, no reglas documentales

- React, TypeScript, Vite, Supabase, PostgreSQL, Auth, Storage, Vercel y GitHub.
- Separación por capas y módulos.
- Uso de RLS, auditoría técnica, validación de formularios y pruebas.
- Modelo de perfiles/roles y protección de rutas.
- Uso de hashes y almacenamiento inmutable de PDFs.

Estas decisiones son compatibles con el objetivo de costo y seguridad solicitado,
pero no provienen de la Carta ni de las actas.

### Propuestas aún no aprobadas

- Entidades y nombres exactos del modelo listado en esta planificación.
- Visibilidad pública de cada módulo y documentos.
- El alcance de Superadministrador.
- La división exacta entre Usuario y Administrador.
- La forma de representar excepciones, medidas económicas y residentes especiales.
- La fecha y el contenido del primer MVP.

### Cambios exigidos por la validación

1. No usar una tabla de “normas modificadas” como si toda decisión posterior
   reemplazara la Carta; debe existir una entidad intermedia de decisión y una
   aprobación explícita de modificación.
2. Separar `propuesta`, `votacion`, `decision_aprobada`, `decision_rechazada`,
   `informacion`, `informe`, `excepcion_individual` y `pendiente_confirmacion`.
3. Registrar alcance (general, temporal, individual, externo) y vigencia con
   fechas, no solo un estado general.
4. Modelar medidas correctivas con fuente, caso, persona afectada y evidencia para
   evitar convertir excepciones como el caso 220 o Alex Viveros en reglas.
5. Tratar horarios de ruido y aseos como versiones o registros con fuente, porque
   hay diferencias textuales y de evento.
6. No cargar datos reales de personas como seed hasta confirmar padrón, finalidad,
   permisos y retención.
7. Incluir `NO_VERIFICADO` además de `PENDIENTE_CONFIRMACION` para fragmentos cuyo
   texto no puede leerse o fecharse con seguridad.

## Decisiones que pueden aprobarse antes del desarrollo

- Mantener la separación Fuente -> Decisión -> Modificación -> Norma vigente.
- Mantener actas originales inmutables y normas versionadas.
- Adoptar autenticación, autorización en base de datos y RLS como requisitos
  técnicos.
- Adoptar el objetivo de infraestructura gratuita con Supabase/Vercel, sujeto a
  sus límites y a una futura revisión de costos.
- No publicar automáticamente como vigente ninguna regla encontrada únicamente en
  actas.

## Decisiones que no deben aprobarse todavía

- Horario actual de ruido, aseos, terraza o lavandería.
- Catálogo definitivo de sanciones o medidas económicas.
- Personas y cargos actuales.
- Sustancias, acceso y emergencia como contenido operativo sin documentos externos.
- Migraciones o datos iniciales con información real.
