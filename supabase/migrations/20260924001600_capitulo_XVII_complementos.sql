-- Capítulo XVII: Complementos sobre Aseos y Medidas (Artículos 67-72)
-- CAPÍTULO NUEVO COMPLETO - Todo PENDIENTE_CONFIRMACION

do $$
declare
  carta_id uuid;
  cat_aseo uuid;
  cat_medidas uuid;
  cat_convivencia uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_aseo from public.norm_categories where name = 'Aseo' limit 1;
  select id into cat_medidas from public.norm_categories where name = 'Medidas correctivas' limit 1;
  select id into cat_convivencia from public.norm_categories where name = 'Convivencia' limit 1;

  -- Artículo 67: Semana calendario y calendario de aseos
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Semana calendario (lunes-domingo) y calendario semanal de aseos', '67', 'XVII. Complementos sobre Aseos y Medidas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Semana calendario (lunes-domingo) y calendario semanal de aseos' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Para efectos de esta Carta, la semana calendario va desde el lunes a las 12:00 a.m. hasta el domingo a las 11:59 p.m.

El calendario semanal de aseos será elaborado y publicado por el representante de aseo conforme al Artículo 42. Indicar, para cada aseo, los datos del Artículo 18 y el nombre del revisor designado.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 67 Carta Interna. ADICIÓN PROPUESTA: definición semana calendario (lunes 00:00 - domingo 23:59) + obligación calendario semanal con datos Art. 18 + revisor.',
    'Requiere ratificación; base operativa del sistema de aseos.'
  ) on conflict do nothing;

  -- Artículo 68: Intercambio de aseos
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Intercambio de aseos - Autorización previa y límites', '68', 'XVII. Complementos sobre Aseos y Medidas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Intercambio de aseos - Autorización previa y límites' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Los residentes podrán intercambiar aseos entre sí con autorización previa del representante de aseo.

El intercambio deberá solicitarse antes de que venza la hora límite y quedar registrado. El responsable ante esta Carta es quien figure en el registro.

Un intercambio no podrá hacer que un residente supere el máximo de ocho aseos semanales (Artículo 16).',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 68 Carta Interna. ADICIÓN PROPUESTA: intercambio permitido con autorización previa, registro obligatorio, responsable = quien figure en registro, límite Art. 16 (máx 8/semana).',
    'Requiere ratificación; flexibilidad con controles.'
  ) on conflict do nothing;

  -- Artículo 69: Revisor designado y falta de revisor
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Revisor designado - Prohibición auto-revisión y suplencia', '69', 'XVII. Complementos sobre Aseos y Medidas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Revisor designado - Prohibición auto-revisión y suplencia' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El revisor será designado por el representante de aseo en el calendario semanal. Nadie podrá revisar su propio aseo.

Si a la hora límite no hay revisor disponible, el responsable avisará al representante de aseo y quedará constancia de la hora del aviso. La revisión la hará el representante de aseo o, en su defecto, otro representante de piso.

La falta de revisor no puede perjudicar al responsable. Si el aseo estaba terminado a la hora límite y el aviso se dio a tiempo, se considerará entregado a tiempo y se revisará a más tardar al día siguiente.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 69 Carta Interna. ADICIÓN PROPUESTA: designación en calendario, prohibición auto-revisión, suplencia (representante aseo → otro representante), protección responsable si aviso a tiempo.',
    'Requiere ratificación; cierra vacío crítico de revisión.'
  ) on conflict do nothing;

  -- Artículo 70: Cumplimiento de las medidas
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_medidas, 'Cumplimiento de medidas - Firmeza, programación 4 semanas y traslado excedentes', '70', 'XVII. Complementos sobre Aseos y Medidas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Cumplimiento de medidas - Firmeza, programación 4 semanas y traslado excedentes' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Una medida queda en firme cuando se notificó la decisión y venció el plazo para solicitar revisión sin que se haya pedido, o cuando la revisión ya fue resuelta.

Los aseos adicionales derivados de una medida en firme se programarán dentro de las cuatro semanas siguientes, respetando el máximo del Artículo 16. Los que excedan ese máximo se trasladarán a semanas posteriores.

Incumplir un aseo derivado de una medida tiene las mismas consecuencias que cualquier otro aseo (Artículos 17 y 20) y se registra.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 70 Carta Interna. ADICIÓN PROPUESTA: definición de "en firme" (notificación + plazo revisión vencido o resuelto) + programación 4 semanas + traslado excedentes Art. 16 + mismo régimen incumplimiento.',
    'Requiere ratificación; operatividad de medidas.'
  ) on conflict do nothing;

  -- Artículo 71: Incumplimiento de normas sobre espacios comunes
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_convivencia, 'Incumplimiento Arts. 35-36 - Requerimiento 24h, reincidencia 30d = 1 aseo, retiro objetos 48h', '71', 'XVII. Complementos sobre Aseos y Medidas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Incumplimiento Arts. 35-36 - Requerimiento 24h, reincidencia 30d = 1 aseo, retiro objetos 48h' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El incumplimiento de los Artículos 35 y 36 se tramitará así:
- La primera vez, el representante de aseo o un representante de piso hará un requerimiento escrito y el residente deberá corregir la situación dentro de las 24 horas siguientes.
- Si no la corrige, o si reincide dentro de los 30 días siguientes, la medida será un aseo adicional del área afectada.
- Los objetos personales que obstaculicen zonas comunes podrán ser retirados a un lugar seguro, previo aviso de 48 horas por el medio oficial, y el residente podrá recuperarlos.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 71 Carta Interna. ADICIÓN PROPUESTA: escalamiento 3 pasos (requerimiento 24h → reincidencia 30d = 1 aseo → retiro objetos 48h aviso oficial).',
    'Requiere ratificación; procedimiento escalonado para espacios comunes.'
  ) on conflict do nothing;

  -- Artículo 72: Daños - Reparación y responsabilidad
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_convivencia, 'Daños - Reparación 15 días, costo solo reposición, no sanción, no presunción', '72', 'XVII. Complementos sobre Aseos y Medidas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Daños - Reparación 15 días, costo solo reposición, no sanción, no presunción' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Una vez determinada la responsabilidad conforme al Artículo 37:
- El responsable deberá reparar o reponer el elemento dañado dentro de los 15 días siguientes a la decisión en firme, o acordar otro plazo con la Asamblea.
- El costo de la reparación o reposición se destina únicamente a arreglar o reponer el elemento. No es una sanción ni un beneficio personal (Artículo 27).
- Si no se puede determinar quién causó el daño, no se sancionará a nadie por presunción. El hecho se registra y la Asamblea decide cómo se atiende.
- No informar un daño cuando la omisión agrave el problema tendrá como medida un aseo adicional.
- La reparación del daño y las medidas de aseo son independientes, y ningún pago sustituye un aseo (Artículo 29).',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 72 Carta Interna. ADICIÓN PROPUESTA: 5 reglas (reparación 15 días, costo = reposición no sanción, no presunción, omisión informe = 1 aseo, independencia reparación/aseo + Art. 29).',
    'Requiere ratificación; separa responsabilidad civil de sanción.'
  ) on conflict do nothing;
end $$;