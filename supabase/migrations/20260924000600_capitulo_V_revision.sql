-- Capítulo V: Revisión de Aseos (Artículos 24-26)
-- CAPÍTULO NUEVO - Todo PENDIENTE_CONFIRMACION

do $$
declare
  carta_id uuid;
  cat_aseo uuid;
  cat_medidas uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_aseo from public.norm_categories where name = 'Aseo' limit 1;
  select id into cat_medidas from public.norm_categories where name = 'Medidas correctivas' limit 1;

  -- Artículo 24: Revisión
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Revisión de aseos - Registro obligatorio por revisor', '24', 'V. Revisión de Aseos', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Revisión de aseos - Registro obligatorio por revisor' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Todo aseo deberá ser revisado por el revisor designado conforme al Artículo 69. El revisor deberá registrar, de forma legible:
- Nombre;
- Habitación;
- Fecha;
- Hora;
- Resultado;
- Observaciones.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 24 Carta Interna. ADICIÓN PROPUESTA: 6 campos obligatorios en registro de revisión; remite a Art. 69 para designación.',
    'Requiere ratificación por Asamblea; conecta con Art. 69 (revisor designado).'
  ) on conflict do nothing;

  -- Artículo 25: Revisión incorrecta
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_medidas, 'Revisión y firma sin cumplimiento estricto - Sanción al revisor', '25', 'V. Revisión de Aseos', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Revisión y firma sin cumplimiento estricto - Sanción al revisor' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El residente que revise y firme un aseo sin que se hayan cumplido estrictamente las instrucciones:
- Recibirá tres aseos adicionales.
- El aseo será considerado no entregado.
- El responsable original recibirá la medida correspondiente al aseo no realizado.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 25 Carta Interna. ADICIÓN PROPUESTA: sanción al revisor (3 aseos) + aseo considerado no entregado + medida al responsable original.',
    'Requiere ratificación por Asamblea; complementa N-17 (firma sin verificar).'
  ) on conflict do nothing;

  -- Artículo 26: Conflicto entre residente y revisor
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Conflicto residente-revisor - Procedimiento de escalamiento', '26', 'V. Revisión de Aseos', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Conflicto residente-revisor - Procedimiento de escalamiento' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Si el residente considera que el revisor rechazó injustificadamente el aseo:
- Podrá solicitar revisión al representante de aseo.
- Si continúa la inconformidad, podrá acudir al fiscal.
- El fiscal revisará las evidencias disponibles.
- La decisión deberá quedar registrada.
- No podrá sancionarse definitivamente mientras exista una controversia pendiente sobre el hecho, salvo medida provisional debidamente justificada.

Adición propuesta. Norma nueva que cierra el vacío sobre desacuerdos con el revisor.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 26 Carta Interna. ADICIÓN PROPUESTA: procedimiento de 3 niveles (representante → fiscal → registro) + protección contra sanción durante controversia.',
    'Requiere ratificación por Asamblea; garantía de debido proceso en revisión.'
  ) on conflict do nothing;
end $$;