-- Capítulos XIII, XIV, XV: Modificación, Casos No Previstos, Principios (Artículos 53-59)

do $$
declare
  carta_id uuid;
  cat_general uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_general from public.norm_categories where name = 'Convivencia' limit 1;

  -- Artículo 53: Modificación
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Modificación de la Carta - 6 elementos obligatorios', '53', 'XIII. Modificación de la Carta', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Modificación de la Carta - 6 elementos obligatorios' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Toda modificación deberá indicar:
- Norma modificada.
- Texto anterior.
- Texto nuevo.
- Fecha de aprobación.
- Instancia que aprobó.
- Fecha de entrada en vigencia.

Nota. Las actas de 2026 muestran que estaba prevista una modificación de la Carta para el 03/09/2026. Esta versión debe incorporar las decisiones efectivamente adoptadas en esa reunión antes de su aprobación.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 53 Carta Interna. ADICIÓN PROPUESTA: 6 elementos obligatorios en toda modificación; referencia a modificación prevista 03/09/2026.',
    'Requiere ratificación; Formato 4 Anexo C para control.'
  ) on conflict do nothing;

  -- Artículo 54: No retroactividad
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'No retroactividad de modificaciones normativas', '54', 'XIII. Modificación de la Carta', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'No retroactividad de modificaciones normativas' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Una modificación normativa se aplicará hacia el futuro.

Los hechos ocurridos antes de su entrada en vigencia se evaluarán bajo la norma vigente al momento del hecho, salvo que la instancia competente determine expresamente otra cosa y ello sea compatible con las reglas superiores aplicables.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 54 Carta Interna. ADICIÓN PROPUESTA: principio de irretroactividad con excepción calificada.',
    'Requiere ratificación; principio jurídico fundamental.'
  ) on conflict do nothing;

  -- Artículo 55: Casos no contemplados
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Casos no previstos - Procedimiento y prohibición de sanción arbitraria', '55', 'XIV. Casos No Previstos', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Casos no previstos - Procedimiento y prohibición de sanción arbitraria' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Cuando ocurra una situación que no esté expresamente regulada:
- Se registrará el caso.
- No se inventará una sanción inmediatamente.
- El fiscal y los representantes analizarán provisionalmente la situación.
- El residente involucrado podrá presentar sus argumentos.
- Cuando sea necesario, el caso será llevado a Asamblea.
- Si la situación es recurrente, deberá proponerse una modificación de la Carta.
- La nueva norma deberá quedar registrada para futuros casos.
- Ningún vacío de la Carta podrá utilizarse para crear arbitrariamente una medida correctiva.

Regla provisional. Si el caso no se resuelve en el piso, sigue la ruta de escalamiento del Artículo 45. Mientras se decide, el fiscal y los representantes podrán acordar una medida provisional justificada y registrada, pero ninguna medida definitiva podrá imponerse sin decisión de la Asamblea. Si la Asamblea decide, esa decisión rige para casos iguales mientras no se modifique la Carta.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 55 Carta Interna. ADICIÓN PROPUESTA: procedimiento de 8 pasos + regla provisional de medida provisional + efecto erga omnes de decisiones de Asamblea.',
    'Requiere ratificación; cierra vacíos legales con garantías.'
  ) on conflict do nothing;

  -- Artículo 56: Igualdad
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Principio de igualdad en aplicación de normas', '56', 'XV. Principios de Aplicación', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Principio de igualdad en aplicación de normas' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Las normas deberán aplicarse de la misma manera a residentes en situaciones equivalentes.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 56 Carta Interna. ADICIÓN PROPUESTA (Cap. XV completo): principio de igualdad.',
    'Requiere ratificación; principio transversal.'
  ) on conflict do nothing;

  -- Artículo 57: Proporcionalidad
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Principio de proporcionalidad de medidas', '57', 'XV. Principios de Aplicación', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Principio de proporcionalidad de medidas' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'La medida deberá corresponder al incumplimiento demostrado.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 57 Carta Interna. ADICIÓN PROPUESTA: principio de proporcionalidad.',
    'Requiere ratificación; límite a discrecionalidad sancionatoria.'
  ) on conflict do nothing;

  -- Artículo 58: Evidencia
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Principio de evidencia verificable', '58', 'XV. Principios de Aplicación', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Principio de evidencia verificable' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Las decisiones deberán basarse en información verificable cuando esta esté disponible.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 58 Carta Interna. ADICIÓN PROPUESTA: decisiones basadas en evidencia verificable.',
    'Requiere ratificación; estándar probatorio.'
  ) on conflict do nothing;

  -- Artículo 59: Transparencia
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Principio de transparencia y explicabilidad', '59', 'XV. Principios de Aplicación', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Principio de transparencia y explicabilidad' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Las decisiones deberán poder ser explicadas y consultadas por las personas directamente involucradas.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 59 Carta Interna. ADICIÓN PROPUESTA: derecho a explicación y consulta de decisiones.',
    'Requiere ratificación; rendición de cuentas.'
  ) on conflict do nothing;

  -- Artículo 60: Trazabilidad
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Trazabilidad de modificaciones, decisiones, revisiones y medidas', '60', 'XV. Principios de Aplicación', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Trazabilidad de modificaciones, decisiones, revisiones y medidas' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Las modificaciones, decisiones, revisiones y medidas correctivas deberán conservar un registro histórico.

Adición propuesta. Este capítulo completo es una adición propuesta.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 60 Carta Interna. ADICIÓN PROPUESTA: obligación de registro histórico completo (auditoría).',
    'Requiere ratificación; base para auditoría (audit_events).'
  ) on conflict do nothing;
end $$;