-- Capítulo III: Asignación de Aseos (Artículos 12-17)
-- Versiones actualizadas y nuevas reglas provisionales

do $$
declare
  carta_id uuid;
  cat_aseo uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_aseo from public.norm_categories where name = 'Aseo' limit 1;

  -- Artículo 12: Número de aseos (actualización de N-11)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Número de aseos para nuevos residentes y distribución general', '12', 'III. Asignación de Aseos', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Número de aseos para nuevos residentes y distribución general' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Los nuevos residentes realizarán tres aseos semanales durante 52 semanas de residencia.

La Asamblea podrá establecer excepciones debidamente justificadas.

Regla provisional. La Carta fija el número de aseos de los nuevos residentes, pero no el de los demás. Los demás residentes realizarán el número de aseos semanales que fije la Asamblea, el cual se publicará en el calendario semanal. Mientras la Asamblea no lo fije, el representante de aseo distribuirá los aseos de forma equitativa entre los residentes, respetando el máximo del Artículo 16.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 12 Carta Interna. Actualiza N-11: fija 3 aseos/semana x 52 semanas para nuevos; regla provisional para resto de residentes.',
    'Parcialmente ratificada (nuevos residentes). Regla provisional para distribución general requiere ratificación.'
  ) on conflict do nothing;

  -- Artículo 13: Orden de asignación (actualización de N-14)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Orden de asignación de aseos', '13', 'III. Asignación de Aseos', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Orden de asignación de aseos' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'La asignación seguirá el siguiente orden:

1. Residentes con aseos derivados de medidas correctivas.
2. Nuevos ingresos.
3. Residentes con obligación adicional por acompañante.
4. Residentes restantes según el sistema de rotación.

Se tendrán en cuenta los descansos de semanas anteriores.',
    'VIGENTE', carta_id,
    'Art. 13 Carta Interna. Actualiza N-14: orden priorizado con 4 niveles y consideración de descansos.',
    'Ratificada; orden de prioridad explícito.'
  ) on conflict do nothing;

  -- Artículo 14: Distribución de zonas (actualización de N-12/N-13 + terraza provisional)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Distribución de zonas en grupos de prelación y terraza provisional', '14', 'III. Asignación de Aseos', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Distribución de zonas en grupos de prelación y terraza provisional' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'La asignación tendrá como referencia los siguientes grupos:

Grupo A (prelación lunes): Cocina, baños y zona de lavado, siempre y cuando sea lunes.
Grupo B (prelación general): Duchas, pasillo 1, terraza, pasillo 2 y zona de lavado.

La zona de lavado figura en ambos grupos, por lo que puede asignarse desde cualquiera de ellos.

Regla provisional. La terraza está incluida en la asignación pero la Carta no define sus tareas. Mientras la Asamblea no decida otra cosa, el responsable de la terraza deberá: barrer, trapear, limpiar mesas y sillas, retirar residuos, organizar los elementos y dejar el piso seco.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 14 Carta Interna. Unifica N-12 y N-13 en dos grupos; añade terraza con tareas provisionales.',
    'Grupos A/B ratificados; tareas de terraza provisionales requieren ratificación.'
  ) on conflict do nothing;

  -- Artículo 15: Descansos (actualización de N-20)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Sistema de descansos y conservación de historial', '15', 'III. Asignación de Aseos', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Sistema de descansos y conservación de historial' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Cuando se hayan cubierto los cupos de asignación, se otorgarán descansos siguiendo el orden correspondiente a las personas que hayan descansado previamente.

El sistema de asignación deberá conservar el historial de descansos para evitar que una misma persona sea favorecida o perjudicada injustificadamente.',
    'VIGENTE', carta_id,
    'Art. 15 Carta Interna. Actualiza N-20: añade obligación de conservar historial de descansos.',
    'Ratificada; versión con trazabilidad de descansos.'
  ) on conflict do nothing;

  -- Artículo 16: Máximo de aseos (actualización de N-18)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Máximo de 8 aseos semanales y traslado de excedentes', '16', 'III. Asignación de Aseos', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Máximo de 8 aseos semanales y traslado de excedentes' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Ningún residente podrá ser asignado a más de ocho aseos durante una misma semana.

Si una medida correctiva ocasiona que el residente supere este límite, los aseos adicionales deberán trasladarse a semanas posteriores mediante decisión del fiscal o de la instancia competente.

No se podrán eliminar sanciones para cumplir el límite.',
    'VIGENTE', carta_id,
    'Art. 16 Carta Interna. Actualiza N-18: añade mecanismo de traslado de excedentes y prohibición de eliminar sanciones.',
    'Ratificada; versión con mecanismo de traslado y protección de sanciones.'
  ) on conflict do nothing;

  -- Artículo 17: Acompañantes (actualización de N-21)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Aseo adicional por acompañante (3 noches/semana)', '17', 'III. Asignación de Aseos', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Aseo adicional por acompañante (3 noches/semana)' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Cuando un residente tenga un acompañante durante tres noches por semana, deberá realizar un aseo adicional. Para efectos de control:

- El residente deberá informar la permanencia del acompañante.
- El conteo se realizará por semana calendario.
- La obligación adicional corresponderá al residente responsable.
- El incumplimiento del aseo adicional tendrá las mismas consecuencias que cualquier otro aseo.

Regla provisional. La Carta solo regula expresamente el caso de tres noches. Mientras la Asamblea no apruebe una escala, con menos de tres noches por semana calendario no se genera aseo adicional, y con tres o más noches se genera un solo aseo adicional por semana. No se aplicará ninguna progresión adicional sin aprobación.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 17 Carta Interna. Actualiza N-21: añade regla provisional para <3 y ≥3 noches/semana.',
    'Caso 3 noches ratificado; escala para otros casos provisional requiere ratificación.'
  ) on conflict do nothing;
end $$;