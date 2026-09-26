-- Capítulo VII: Ruido y Convivencia (Artículos 31-34)
-- Actualización de N-30 a N-34, N-38, N-22

do $$
declare
  carta_id uuid;
  cat_convivencia uuid;
  cat_medidas uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_convivencia from public.norm_categories where name = 'Convivencia' limit 1;
  select id into cat_medidas from public.norm_categories where name = 'Medidas correctivas' limit 1;

  -- Artículo 31: Horarios de ruido (actualiza N-30, N-31, N-32, N-33)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_convivencia, 'Horarios permitidos de ruido - Con conflicto domingo/festivos', '31', 'VII. Ruido y Convivencia', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Horarios permitidos de ruido - Con conflicto domingo/festivos' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Los horarios en los que se permite ruido son:

- Domingo a jueves: 10:00 a.m. a 21:00
- Viernes y sábado: 10:00 a.m. a 02:00 (del día siguiente)
- Domingo: después de las 09:00 a.m. hasta las 21:00
- Si es festivo: hasta las 02:00 del lunes festivo
- Festivo entre semana: desde el día anterior al festivo hasta las 02:00 del festivo

Regla provisional. El domingo aparece en dos franjas (10:00 a.m. y 9:00 a.m.). Mientras la Asamblea no lo aclare, prevalece la franja específica del domingo. Igualmente, la Asamblea debe precisar a qué día se refiere la extensión por festivo.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 31 Carta Interna. Unifica N-30, N-31, N-32, N-33. CONFLICTO DOCUMENTADO: domingo 9:00 vs 10:00. Regla provisional: prevalece franja específica (9:00).',
    'Requiere ratificación por Asamblea para resolver conflicto domingo 9:00 vs 10:00 y definir extensión festiva.'
  ) on conflict do nothing;

  -- Artículo 32: Ruido excesivo (actualiza N-34)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_convivencia, 'Ruido excesivo - Criterio de molestia intensa en madrugada', '32', 'VII. Ruido y Convivencia', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Ruido excesivo - Criterio de molestia intensa en madrugada' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'No se entenderá que todo ruido está prohibido durante las horas permitidas.

El ruido será considerado incumplimiento cuando, por su intensidad, duración o circunstancias, genere una afectación injustificada a la convivencia. Como referencia, el ruido deja de ser tolerable cuando causa una molestia intensa a los residentes, especialmente durante la madrugada.',
    'VIGENTE', carta_id,
    'Art. 32 Carta Interna. Actualiza N-34: criterio objetivo "molestia intensa en madrugada" como referencia.',
    'Ratificada; criterio objetivo para discrecionalidad.'
  ) on conflict do nothing;

  -- Artículo 33: Medida por ruido (actualiza N-22)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_medidas, 'Medida por ruido - 3 aseos ornato + 3 aseos piso', '33', 'VII. Ruido y Convivencia', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Medida por ruido - 3 aseos ornato + 3 aseos piso' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'La medida establecida es: 3 aseos de ornato + 3 aseos de piso.

Para evitar una sanción arbitraria, la queja deberá registrar:
- Fecha;
- Hora;
- Lugar;
- Conducta;
- Persona responsable, si se conoce;
- Descripción;
- Evidencia disponible;
- Personas afectadas, cuando corresponda.

Regla provisional. La Carta no define qué son un aseo de ornato y un aseo de piso. Mientras la Asamblea no los defina, el representante de aseo designará las zonas y las publicará antes de asignarlas: el aseo de piso será el de cualquiera de las áreas del Capítulo II, y el aseo de ornato el de presentación y orden de zonas comunes como sala, comedor y terraza.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 33 Carta Interna. Actualiza N-22: medida 3+3 + 8 campos obligatorios en queja + regla provisional para definir ornato/piso.',
    'Requiere ratificación por Asamblea; definición de "aseo ornato" y "aseo piso" provisional.'
  ) on conflict do nothing;

  -- Artículo 34: Responsabilidad por visitantes
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_convivencia, 'Responsabilidad del residente por conducta de visitantes', '34', 'VII. Ruido y Convivencia', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Responsabilidad del residente por conducta de visitantes' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El residente que invite o aloje a una persona será responsable de procurar que esta respete las normas del segundo piso. Si un visitante incumple las normas:
- Se registrará el hecho.
- Se notificará al residente responsable.
- El residente podrá presentar sus descargos.
- La medida, si corresponde, se aplicará conforme al procedimiento.',
    'VIGENTE', carta_id,
    'Art. 34 Carta Interna. Responsabilidad solidaria del residente anfitrión por visitantes.',
    'Ratificada; procedimiento estándar de notificación y descargos.'
  ) on conflict do nothing;
end $$;