-- Capítulo VI: Medidas Correctivas (Artículos 27-30)
-- Actualización y expansión de N-15 a N-19

do $$
declare
  carta_id uuid;
  cat_medidas uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_medidas from public.norm_categories where name = 'Medidas correctivas' limit 1;

  -- Artículo 27: Naturaleza de las medidas
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_medidas, 'Naturaleza y finalidad de las medidas correctivas', '27', 'VI. Medidas Correctivas', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Naturaleza y finalidad de las medidas correctivas' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Las medidas correctivas buscan:
- Restablecer la convivencia;
- Compensar el trabajo no realizado;
- Corregir incumplimientos;
- Mantener la limpieza;
- Proteger los espacios comunes.

No se entenderán como mecanismos para generar beneficios económicos personales.',
    'VIGENTE', carta_id,
    'Art. 27 Carta Interna. Principios rectores de las medidas; prohíbe fines económicos.',
    'Ratificada; principios fundamentales.'
  ) on conflict do nothing;

  -- Artículo 28: Medidas por incumplimiento de aseo (actualiza N-15)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_medidas, 'Medidas por incumplimiento de aseo - 3 aseos + repetición', '28', 'VI. Medidas Correctivas', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Medidas por incumplimiento de aseo - 3 aseos + repetición' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'La medida por no realizar el aseo asignado es:
- Tres aseos adicionales.
- Repetición del mismo aseo incumplido.

Esta medida es consistente con lo establecido en los Artículos 19 y 20.',
    'VIGENTE', carta_id,
    'Art. 28 Carta Interna. Actualiza N-15: medida unificada (3 + repetición) consistente con Arts. 19-20.',
    'Ratificada; versión unificada y consistente.'
  ) on conflict do nothing;

  -- Artículo 29: Imposibilidad de pagar la medida (actualiza N-19)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_medidas, 'Prohibición de sustitución económica de medidas de aseo', '29', 'VI. Medidas Correctivas', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Prohibición de sustitución económica de medidas de aseo' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Las medidas correctivas de aseo no podrán ser sustituidas por un pago económico.',
    'VIGENTE', carta_id,
    'Art. 29 Carta Interna. Actualiza N-19: prohibición absoluta de pago por medidas de aseo.',
    'Ratificada; principio fundamental sin excepciones.'
  ) on conflict do nothing;

  -- Artículo 30: Acumulación
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_medidas, 'Acumulación de medidas y prohibición de doble sanción', '30', 'VI. Medidas Correctivas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Acumulación de medidas y prohibición de doble sanción' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Las medidas correctivas se acumularán cuando provengan de incumplimientos independientes. Por ejemplo: no hacer el aseo, hacer ruido y dañar un espacio común son tres conductas distintas, y cada una será analizada individualmente.

Sin embargo, no podrá sancionarse dos veces el mismo hecho bajo la misma norma, salvo que la segunda medida corresponda expresamente a un incumplimiento diferente.

Adición propuesta. El segundo párrafo se añade para evitar duplicidad de sanciones.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 30 Carta Interna. ADICIÓN PROPUESTA: regla de acumulación por conductas independientes + prohibición de bis in idem (doble sanción mismo hecho).',
    'Requiere ratificación por Asamblea; principio non bis in idem.'
  ) on conflict do nothing;
end $$;