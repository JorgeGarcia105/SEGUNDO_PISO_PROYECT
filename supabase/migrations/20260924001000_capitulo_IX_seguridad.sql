-- Capítulo IX: Seguridad (Artículos 38-40)
-- Incluye Art. 38 v2: MODIFICACIÓN FUNDAMENTAL - Prohibición sustancias ilícitas

do $$
declare
  carta_id uuid;
  cat_seguridad uuid;
  cat_convivencia uuid;
  norm_id uuid;
  norm_sustancias_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_seguridad from public.norm_categories where name = 'Seguridad' limit 1;
  select id into cat_convivencia from public.norm_categories where name = 'Convivencia' limit 1;

  -- Artículo 38: Sustancias prohibidas - VERSION 2 (MODIFICACIÓN FUNDAMENTAL)
  -- Primero verificar si existe la norma original (N-39)
  select n.id into norm_sustancias_id from public.norms n
  where n.title like '%Sustancias%' or n.title like '%ilegal%' limit 1;

  if norm_sustancias_id is null then
    insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
    values (cat_seguridad, 'Sustancias ilícitas - Prohibición absoluta', '38', 'IX. Seguridad', true, carta_id)
    returning id into norm_sustancias_id;
  else
    update public.norms set article_number = '38', chapter = 'IX. Seguridad', is_provisional = true
    where id = norm_sustancias_id;
  end if;

  -- Versión 1: Original (permisiva) - mantener para historial
  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_sustancias_id, 1, 'v1',
    'El texto visible dice que son permitidas en el piso siempre que no se afecte al prójimo ni la convivencia.',
    'HISTORICA', carta_id,
    'Art. 38 v1 (Carta original). Versión histórica permisiva: "permitidas si no afectan convivencia".',
    'Versión original derogada por v2.'
  ) on conflict do nothing;

  -- Versión 2: NUEVA - Prohibición absoluta (PENDIENTE_CONFIRMACION)
  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_sustancias_id, 2, 'v2',
    'Queda prohibida cualquier conducta relacionada con sustancias ilícitas que contravenga la legislación colombiana, las normas de la residencia o que afecte la seguridad y convivencia.

Las normas internas del piso no constituyen autorización para realizar actividades ilegales.

Modificación propuesta. Este artículo reemplaza la cláusula anterior, que permitía sustancias ilegales en el piso siempre que no se afectara al prójimo ni la convivencia. Se elimina para que la Carta no contradiga normas superiores.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 38 v2 Carta Interna. MODIFICACIÓN FUNDAMENTAL: prohíbe sustancias ilícitas (vs v1 permisiva). Requiere ratificación expresa por Asamblea.',
    'PENDIENTE_CONFIRMACION hasta ratificación expresa por Asamblea. Cambio de permisiva a prohibitiva.'
  ) on conflict do nothing;

  -- Artículo 39: Emergencias
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_seguridad, 'Protocolo de emergencias - Prioridad seguridad personas', '39', 'IX. Seguridad', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Protocolo de emergencias - Prioridad seguridad personas' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Ante una emergencia:
- Se deberá priorizar la seguridad de las personas.
- Se deberá informar inmediatamente a los responsables correspondientes.
- Se deberá seguir el protocolo general de la residencia.
- No se deberá manipular infraestructura peligrosa sin autorización.
- Se deberá registrar posteriormente el incidente cuando corresponda.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 39 Carta Interna. ADICIÓN PROPUESTA: 5 pasos de emergencia; remite a protocolo general de la residencia (pendiente).',
    'Requiere ratificación; depende de protocolo general de la casa (N-40 PENDIENTE).'
  ) on conflict do nothing;

  -- Artículo 40: Acceso
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_seguridad, 'Acceso a la residencia - Protocolo general y prohibición compartir credenciales', '40', 'IX. Seguridad', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Acceso a la residencia - Protocolo general y prohibición compartir credenciales' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El acceso a la residencia estará sujeto al protocolo general de la casa o residencia.

No se podrán compartir llaves, tarjetas, códigos o mecanismos de acceso cuando las normas generales de la residencia lo prohíban.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 40 Carta Interna. ADICIÓN PROPUESTA: remite a protocolo general; prohíbe compartir credenciales.',
    'Requiere ratificación; depende de protocolo general de la casa (N-41 PENDIENTE).'
  ) on conflict do nothing;
end $$;