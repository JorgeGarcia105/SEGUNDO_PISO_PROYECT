-- Capítulo IV: Horarios y Entrega de Aseos (Artículos 18-23)
-- CAPÍTULO NUEVO - Todo PENDIENTE_CONFIRMACION (adiciones propuestas)

do $$
declare
  carta_id uuid;
  cat_aseo uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_aseo from public.norm_categories where name = 'Aseo' limit 1;

  -- Artículo 18: Hora de entrega
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Hora de entrega de aseos - Datos obligatorios en calendario', '18', 'IV. Horarios y Entrega de Aseos', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Hora de entrega de aseos - Datos obligatorios en calendario' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Cada asignación deberá indicar:
- Día;
- Hora de inicio;
- Hora límite;
- Zona;
- Responsable.

La hora límite deberá quedar registrada en el calendario semanal publicado. Si la hora límite no fue publicada, no podrá imponerse una sanción por retraso, para que nadie sea sancionado por una hora que nunca conoció.

Adición propuesta. Norma nueva que cierra el vacío sobre la hora de entrega.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 18 Carta Interna. ADICIÓN PROPUESTA: norma nueva que define datos obligatorios de asignación y protege contra sanciones sin hora publicada.',
    'Requiere ratificación por Asamblea.'
  ) on conflict do nothing;

  -- Artículo 19: Entrega tardía
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Entrega tardía (hasta 1 hora) y tratamiento de mayor retraso', '19', 'IV. Horarios y Entrega de Aseos', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Entrega tardía (hasta 1 hora) y tratamiento de mayor retraso' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Si el residente entrega el aseo dentro de la hora siguiente a la hora límite, la medida correctiva es:
- Un aseo adicional.
- Repetición del mismo aseo la semana siguiente.

Regla provisional. La Carta no dice qué ocurre si la entrega se hace después de esa hora. Mientras la Asamblea no decida otra cosa, una entrega con más de una hora de retraso se trata como no entrega (Artículo 20).',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 19 Carta Interna. ADICIÓN PROPUESTA: define medida para 1 hora de tolerancia y regla provisional para >1 hora.',
    'Requiere ratificación por Asamblea; regla provisional para >1 hora.'
  ) on conflict do nothing;

  -- Artículo 20: No entrega
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'No entrega de aseo - Medida correctiva', '20', 'IV. Horarios y Entrega de Aseos', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'No entrega de aseo - Medida correctiva' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Si el residente no realiza el aseo, la medida correctiva es:
- Tres aseos adicionales.
- Repetición del mismo aseo incumplido.
- El incumplimiento quedará registrado.',
    'VIGENTE', carta_id,
    'Art. 20 Carta Interna. Ratifica medida base de no entrega (consistente con Art. 28/N-15).',
    'Ratificada; consistente con medidas correctivas base.'
  ) on conflict do nothing;

  -- Artículo 21: Justificación de retrasos
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Justificación de retrasos ante fiscal', '21', 'IV. Horarios y Entrega de Aseos', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Justificación de retrasos ante fiscal' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El residente podrá solicitar autorización al fiscal para entregar el aseo fuera del horario sin recibir sanción cuando exista una causa justa y razonable.

La solicitud deberá hacerse antes del vencimiento de la obligación, salvo situaciones imprevisibles o de fuerza mayor.

La autorización deberá quedar registrada.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 21 Carta Interna. ADICIÓN PROPUESTA: procedimiento de autorización previa ante fiscal.',
    'Requiere ratificación por Asamblea.'
  ) on conflict do nothing;

  -- Artículo 22: Ausencia temporal
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Ausencia temporal y reorganización de aseos', '22', 'IV. Horarios y Entrega de Aseos', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Ausencia temporal y reorganización de aseos' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El residente que vaya a abandonar temporalmente la residencia deberá informar su ausencia con anticipación suficiente para que pueda determinarse quién realizará el aseo correspondiente a la semana de su ausencia.

Una ausencia no comunicada no elimina automáticamente la obligación de aseo.

Adición propuesta. El segundo párrafo cierra el vacío sobre ausencias no informadas.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 22 Carta Interna. ADICIÓN PROPUESTA: obligación de informar ausencia y consecuencia de no hacerlo.',
    'Requiere ratificación por Asamblea.'
  ) on conflict do nothing;

  -- Artículo 23: Semanas académicas
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Omisión de aseos por semanas académicas - Controles', '23', 'IV. Horarios y Entrega de Aseos', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Omisión de aseos por semanas académicas - Controles' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Se podrán omitir aseos por semanas académicas. Para evitar abusos:
- La semana académica deberá estar previamente definida.
- La excepción deberá registrarse.
- No podrá solicitarse después de iniciado el incumplimiento.
- La excepción no genera sanción.
- La excepción no debe afectar injustificadamente a los demás residentes.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 23 Carta Interna. ADICIÓN PROPUESTA: 5 controles anti-abuso para semanas académicas.',
    'Requiere ratificación por Asamblea; define "semana académica" y registros obligatorios.'
  ) on conflict do nothing;
end $$;