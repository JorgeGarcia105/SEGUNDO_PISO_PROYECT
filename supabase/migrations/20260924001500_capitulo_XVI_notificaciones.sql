-- Capítulo XVI: Notificaciones, Plazos y Pruebas (Artículos 61-66)
-- CAPÍTULO NUEVO COMPLETO - Todo PENDIENTE_CONFIRMACION

do $$
declare
  carta_id uuid;
  cat_general uuid;
  cat_quejas uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_general from public.norm_categories where name = 'Convivencia' limit 1;
  select id into cat_quejas from public.norm_categories where name = 'Quejas' limit 1;

  -- Artículo 61: Medio oficial de comunicación
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Medio oficial de comunicación - Cartelera y mensajería', '61', 'XVI. Notificaciones, Plazos y Pruebas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Medio oficial de comunicación - Cartelera y mensajería' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El piso tendrá un medio oficial de comunicación, que será la cartelera del piso y el grupo de mensajería que la Asamblea designe.

Las asignaciones de aseo, las citaciones, las decisiones y los demás avisos previstos en esta Carta se comunicarán por ese medio.

Mientras la Asamblea no designe el grupo, se usará el que el piso ya emplee para sus comunicaciones colectivas.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 61 Carta Interna. ADICIÓN PROPUESTA: medio oficial = cartelera + grupo mensajería (Asamblea designa); fallback a grupo actual.',
    'Requiere ratificación; define canal oficial vinculante.'
  ) on conflict do nothing;

  -- Artículo 62: Notificación
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Notificación - Medios, perfeccionamiento y prueba de envío', '62', 'XVI. Notificaciones, Plazos y Pruebas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Notificación - Medios, perfeccionamiento y prueba de envío' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Las notificaciones se harán por el medio oficial y, cuando sea posible, también en la cartelera.

Se entenderá que la persona quedó notificada el día calendario siguiente a la publicación o al envío del mensaje, o desde el momento en que confirme su recibo, si lo hace antes.

Quien notifica deberá conservar prueba del envío o de la publicación, como una captura de pantalla, un registro o una fotografía.

Ninguna medida correctiva podrá ejecutarse sin que la persona afectada haya sido notificada de la decisión.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 62 Carta Interna. ADICIÓN PROPUESTA: perfeccionamiento notificación (día siguiente o confirmación), obligación de prueba (captura/registro/foto), prohibición ejecutar sin notificar.',
    'Requiere ratificación; garantía procesal fundamental.'
  ) on conflict do nothing;

  -- Artículo 63: Cómputo de plazos
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Cómputo de plazos - Días calendario, inicio, festivos y prórroga', '63', 'XVI. Notificaciones, Plazos y Pruebas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Cómputo de plazos - Días calendario, inicio, festivos y prórroga' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Los plazos de esta Carta se cuentan en días calendario, salvo que se indique otra cosa.

El plazo empieza a contar el día siguiente a la notificación.

Si el último día del plazo es festivo, el plazo se extiende hasta el siguiente día no festivo.

El fiscal podrá ampliar un plazo por causa justa, y la ampliación quedará registrada.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 63 Carta Interna. ADICIÓN PROPUESTA: 4 reglas de cómputo (calendario, día siguiente, festivos, prórroga fiscal registrada).',
    'Requiere ratificación; seguridad jurídica en plazos.'
  ) on conflict do nothing;

  -- Artículo 64: Plazo para presentar quejas
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_quejas, 'Plazos de caducidad para quejas - 15 días (aseo) y 30 días (resto)', '64', 'XVI. Notificaciones, Plazos y Pruebas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Plazos de caducidad para quejas - 15 días (aseo) y 30 días (resto)' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Las quejas por incumplimiento de aseo deberán presentarse dentro de los 15 días siguientes al hecho.

Las quejas por los demás hechos deberán presentarse dentro de los 30 días siguientes a la fecha en que el hecho ocurrió o en que la persona afectada lo conoció.

Vencido el plazo, el hecho se registra pero no da lugar a medida correctiva, salvo que se trate de un daño o de una situación que afecte la seguridad.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 64 Carta Interna. ADICIÓN PROPUESTA: caducidad 15 días (aseo) y 30 días (resto); excepción daños/seguridad; hecho se registra pero no sanciona.',
    'Requiere ratificación; plazos de caducidad diferenciados.'
  ) on conflict do nothing;

  -- Artículo 65: Pruebas
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_quejas, 'Pruebas admisibles y prohibidas - Valoración por fiscal', '65', 'XVI. Notificaciones, Plazos y Pruebas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Pruebas admisibles y prohibidas - Valoración por fiscal' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Serán admisibles las pruebas verificables, como fotografías o videos de las zonas comunes, mensajes, registros de revisión de aseo, listas de asignación y testimonios.

No se admitirán ni podrán tomarse pruebas en baños, duchas ni habitaciones, ni las obtenidas violando la intimidad de las personas.

El fiscal valorará las pruebas en conjunto y dejará constancia en la decisión de cuáles tuvo en cuenta (Artículo 49).',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 65 Carta Interna. ADICIÓN PROPUESTA: lista de pruebas admisibles + prohibición absoluta (intimidad) + valoración fiscal con registro en decisión.',
    'Requiere ratificación; garantías de intimidad y estándar probatorio.'
  ) on conflict do nothing;

  -- Artículo 66: Reserva, buena fe y prohibición de represalias
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_quejas, 'Reserva, buena fe y prohibición de represalias', '66', 'XVI. Notificaciones, Plazos y Pruebas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Reserva, buena fe y prohibición de represalias' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Las quejas se tramitarán con reserva. El fiscal y los representantes solo darán a conocer la identidad de quien reporta cuando sea necesario para que el implicado pueda defenderse.

Presentar una queja a sabiendas de que es falsa es una conducta contraria a la buena fe y se tramitará conforme al Artículo 55.

Está prohibida cualquier represalia contra quien presente una queja de buena fe o participe como testigo en un procedimiento. La represalia se tramitará conforme al Artículo 55.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 66 Carta Interna. ADICIÓN PROPUESTA: reserva de identidad (excepción defensa), denuncia falsa = Art. 55, prohibición absoluta de represalias = Art. 55.',
    'Requiere ratificación; protección a denunciantes y testigos.'
  ) on conflict do nothing;
end $$;