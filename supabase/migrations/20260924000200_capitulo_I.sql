-- Capítulo I: Disposiciones Generales
-- Artículos 1, 2, 3 de la Carta Interna actualizada

do $$
declare
  carta_id uuid;
  cat_general uuid;
  cat_medidas uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;

  select id into cat_general from public.norm_categories where name = 'Convivencia' limit 1;
  select id into cat_medidas from public.norm_categories where name = 'Medidas correctivas' limit 1;

  -- Artículo 1: Objeto
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Objeto de la Carta Interna', '1', 'I. Disposiciones Generales', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Objeto de la Carta Interna' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'La presente Carta Interna tiene como finalidad establecer las normas de convivencia, limpieza, organización, uso de espacios comunes, asignación de aseos, medidas correctivas, procedimiento de quejas y responsabilidades de los residentes del segundo piso.

Las disposiciones serán aplicables a:
- Residentes permanentes.
- Residentes nuevos.
- Residentes temporales.
- Acompañantes, en cuanto las conductas realizadas por estos sean responsabilidad del residente que los recibe.
- Visitantes, respecto de las normas de convivencia del segundo piso.',
    'VIGENTE', carta_id,
    'Art. 1 Carta Interna. Norma base de alcance y sujetos obligados.',
    'Ratificada en versión original de Carta.'
  ) on conflict do nothing;

  -- Artículo 2: Responsabilidad general
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Responsabilidad general de los residentes', '2', 'I. Disposiciones Generales', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Responsabilidad general de los residentes' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Todos los residentes son responsables de contribuir al mantenimiento, limpieza, seguridad y convivencia adecuada del segundo piso.

El desconocimiento de una norma publicada y vigente no exime de su cumplimiento.

Las normas deberán estar disponibles para consulta permanente por los residentes.',
    'VIGENTE', carta_id,
    'Art. 2 Carta Interna. Principio de responsabilidad compartida e ignorancia no exime.',
    'Ratificada en versión original de Carta.'
  ) on conflict do nothing;

  -- Artículo 3: Cumplimiento de las normas
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Cumplimiento de las normas y validez de decisiones de asamblea', '3', 'I. Disposiciones Generales', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Cumplimiento de las normas y validez de decisiones de asamblea' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Todo residente deberá:
- Cumplir las normas de la presente Carta.
- Cumplir las decisiones válidamente adoptadas por la Asamblea de Piso.
- Respetar las asignaciones de aseo.
- Respetar los espacios y bienes comunes.
- Informar oportunamente situaciones que puedan afectar la convivencia.
- Atender las comunicaciones relacionadas con procedimientos disciplinarios.
- Cumplir las medidas correctivas impuestas conforme al procedimiento establecido.

Regla provisional. Se entiende que una decisión de la Asamblea de Piso es válida cuando fue convocada con anticipación y publicada, contó con la asistencia de al menos la mitad más uno de los residentes, fue aprobada por mayoría simple de los presentes y quedó registrada en acta. La Asamblea podrá ratificar o modificar estas reglas.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 3 Carta Interna. Incluye regla provisional sobre validez de asambleas (requiere ratificación).',
    'Pendiente de ratificación por Asamblea la regla provisional de validez.'
  ) on conflict do nothing;
end $$;