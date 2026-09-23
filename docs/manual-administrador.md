# Manual de administración

## Responsabilidad

El administrador gestiona información respaldada por documentos. No debe crear una
norma, sanción, horario, cuota o cargo basándose únicamente en una interpretación
personal.

La cadena obligatoria es:

`Fuente -> Decisión -> Modificación -> Norma vigente`

Si falta un vínculo o una aprobación, usar `PENDIENTE_CONFIRMACION`.

## Preparación inicial

1. Crear el usuario en Supabase Auth.
2. Crear su perfil y asignar `administrador` con
   [database/bootstrap-admin.sql](../database/bootstrap-admin.sql).
3. Confirmar que el administrador puede consultar `audit_events`.
4. Crear un usuario normal de prueba y verificar que no puede escribir.
5. Revisar las matrices documentales antes de cargar información.

## Registrar una fuente

Guardar:

- título original;
- tipo de documento;
- fecha del documento;
- archivo original;
- checksum;
- descripción;
- estado de publicación.

Las actas y PDFs originales deben conservarse sin sobrescribir.

## Registrar una norma

1. Crear la categoría solo si corresponde al contenido documental.
2. Crear el título de la norma.
3. Crear una versión con el texto fiel al documento.
4. Relacionar el documento fuente.
5. Asignar estado documental.
6. Registrar observaciones o texto no verificable.
7. Publicar únicamente después de la revisión autorizada.

## Registrar una decisión de acta

Clasificarla como una sola de estas opciones:

- propuesta;
- votación;
- decisión aprobada;
- decisión rechazada;
- excepción individual;
- información;
- informe;
- pendiente de confirmación.

Indicar alcance: general, temporal, individual, externo o no determinado.

## Convertir una decisión en modificación

Solo realizarlo si el acta o documento demuestra:

- decisión aprobada;
- norma afectada;
- alcance general o temporal explícito;
- fecha de inicio y fin cuando aplique;
- responsable de confirmación;
- relación con la nueva versión normativa.

Nunca reemplazar la versión anterior. Crear una nueva versión y conservar el
historial.

## Medidas correctivas

Registrar siempre persona/caso, incumplimiento, fuente, fecha, alcance, medida,
evidencia, estado, responsable y seguimiento. Una medida de un caso individual no
se convierte en catálogo general.

## Auditoría

Consultar `audit_events` para verificar:

- usuario que cambió el registro;
- fecha y acción;
- valor anterior;
- valor nuevo.

No borrar auditoría para corregir un registro. Crear una corrección documentada.

## Acciones sensibles

Requieren revisión adicional:

- asignar roles;
- publicar una norma;
- archivar documentos;
- aplicar medidas correctivas;
- modificar relaciones entre decisiones y normas;
- tratar datos personales o evidencias.
