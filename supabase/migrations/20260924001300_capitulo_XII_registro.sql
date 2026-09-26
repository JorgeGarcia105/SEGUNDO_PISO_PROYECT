-- Capítulo XII: Registro de Medidas (Artículos 51-52)

do $$
declare
  carta_id uuid;
  cat_medidas uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_medidas from public.norm_categories where name = 'Medidas correctivas' limit 1;

  -- Artículo 51: Cumplimiento
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_medidas, 'Cumplimiento de medidas - Verificación obligatoria y prohibición marca manual', '51', 'XII. Registro de Medidas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Cumplimiento de medidas - Verificación obligatoria y prohibición marca manual' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Una medida de aseo solamente se considerará cumplida cuando el aseo haya sido realizado y aprobado.

No se podrá marcar manualmente como cumplida sin dejar constancia de quién verificó el cumplimiento.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 51 Carta Interna. ADICIÓN PROPUESTA: cumplimiento = realizado Y aprobado; prohíbe marca manual sin verificador.',
    'Requiere ratificación; trazabilidad de verificación.'
  ) on conflict do nothing;

  -- Artículo 52: Reincidencia
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_medidas, 'Registro de reincidencias - Sin sanción automática mayor', '52', 'XII. Registro de Medidas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Registro de reincidencias - Sin sanción automática mayor' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El sistema de registro deberá anotar las reincidencias. No se aplicará automáticamente una sanción mayor por reincidencia hasta que la Asamblea la apruebe expresamente.

Adición propuesta. Se registra la reincidencia, pero no se crea una nueva pena sin aprobación.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 52 Carta Interna. ADICIÓN PROPUESTA: registro de reincidencias obligatorio; prohibición de escala automática sin aprobación Asamblea.',
    'Requiere ratificación; principio de legalidad en escalamiento.'
  ) on conflict do nothing;
end $$;