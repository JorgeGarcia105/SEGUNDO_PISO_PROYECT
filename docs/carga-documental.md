# Carga documental inicial

## Qué se carga

`database/seed-documental.sql` carga de forma idempotente:

- `Carta Interna 2do Piso RGSB.pdf` como fuente normativa base;
- `Asambleas Piso 2.pdf` como fuente histórica de actas;
- categorías documentales;
- 33 normas transcritas de la Carta;
- 8 zonas de aseo;
- 4 actas históricas identificadas;
- decisiones del plan piloto de cocina, caso 220, caso Alex Viveros y borrador de
  modificación de Carta.

## Qué no se carga

- personas o habitaciones como padrón actual;
- administradores;
- asignaciones personales de aseo;
- sanciones aplicables automáticamente;
- cuotas o intereses como reglas vigentes;
- horarios ambiguos;
- datos inventados;
- PDFs en Storage, porque requieren configurar el bucket y cargar archivos desde
  la cuenta autorizada.

## Estado de las normas

Las versiones iniciales se guardan como `PENDIENTE_CONFIRMACION`. La razón se
conserva en `source_note`: son transcripciones de la Carta y el análisis las
identifica como `VIGENTE_POR_CARTA`, pero aún no existe confirmación institucional
posterior.

Esto permite avanzar en edición y revisión sin exponer a usuarios una regla como
vigente antes de aprobarla.

## Cómo cargar en Supabase

Después de aplicar la migración:

1. Abrir Supabase SQL Editor con una cuenta autorizada.
2. Copiar el contenido de `database/seed-documental.sql`.
3. Ejecutarlo una sola vez; puede repetirse porque usa comprobaciones idempotentes.
4. Revisar cantidades:

```sql
select count(*) from public.documents;
select count(*) from public.norms;
select count(*) from public.norm_versions;
select count(*) from public.cleaning_zones;
select count(*) from public.assembly_minutes;
select count(*) from public.decisions;
```

5. Revisar que ninguna versión inicial tenga estado `VIGENTE`:

```sql
select n.title, v.status, v.source_note
from public.norms n
join public.norm_versions v on v.norm_id = n.id
order by n.title;
```

## Revisión administrativa posterior

Para cada norma, el administrador debe verificar el PDF original y decidir:

- mantener `PENDIENTE_CONFIRMACION`;
- cambiar a `VIGENTE` con nota de confirmación;
- crear una nueva versión por modificación aprobada;
- marcar `HISTORICA`, `DEROGADA` o `NO_VERIFICADO`.

No editar el texto histórico para corregirlo. Si existe una corrección, crear una
nueva versión y conservar la anterior.
