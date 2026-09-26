-- Capítulo XI: Quejas y Medidas Correctivas (Artículos 45-50)
-- Procedimiento completo con reglas provisionales

do $$
declare
  carta_id uuid;
  cat_quejas uuid;
  cat_medidas uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_quejas from public.norm_categories where name = 'Quejas' limit 1;
  select id into cat_medidas from public.norm_categories where name = 'Medidas correctivas' limit 1;

  -- Artículo 45: Principio de debido proceso (actualiza N-37, N-38)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_quejas, 'Debido proceso - Ruta de 4 niveles y reglas provisionales de escalamiento', '45', 'XI. Quejas y Medidas Correctivas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Debido proceso - Ruta de 4 niveles y reglas provisionales de escalamiento' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Ninguna medida correctiva deberá imponerse únicamente con base en una acusación sin posibilidad de conocer el hecho y presentar una explicación.

La ruta del procedimiento es:
1. Implicado / Fiscalía o Representante
2. Redactar oficio
3. Asamblea de Piso
4. Fiscal General → Federación → Asamblea General (última instancia)

Regla provisional. La Carta indica la ruta pero no dice cuándo se pasa de un nivel a otro. Mientras la Asamblea no decida otra cosa:
(1) Un caso sube al siguiente nivel cuando el implicado no está de acuerdo con la decisión, cuando la instancia no tiene competencia o no decide a tiempo, o cuando el caso no está previsto en la Carta;
(2) Si el fiscal o un representante es parte del caso o tiene un interés directo, se aparta y lo reemplaza otro representante de piso;
(3) Si la Asamblea de Piso no logra reunirse o no decide dentro de los 15 días calendario siguientes al oficio, el caso sube al Fiscal General;
(4) Mientras está en curso una revisión no se ejecuta la medida, salvo medida provisional debidamente justificada;
(5) Cada instancia registra su decisión conforme al Artículo 49.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 45 Carta Interna. Actualiza N-37/N-38: ruta de 4 niveles + 5 reglas provisionales de escalamiento, recusación, plazos (15 días), suspensión de medidas, registro obligatorio.',
    'Requiere ratificación por Asamblea; reglas provisionales detalladas de escalamiento.'
  ) on conflict do nothing;

  -- Artículo 46: Reporte
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_quejas, 'Reporte de queja - 8 campos obligatorios', '46', 'XI. Quejas y Medidas Correctivas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Reporte de queja - 8 campos obligatorios' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Todo reporte deberá contener, en la medida de lo posible:
- Fecha.
- Hora.
- Lugar.
- Persona involucrada.
- Descripción.
- Norma presuntamente incumplida.
- Evidencia disponible.
- Persona que reporta.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 46 Carta Interna. ADICIÓN PROPUESTA: 8 campos obligatorios en reporte (Formato 1 Anexo C).',
    'Requiere ratificación; base para Formato 1.'
  ) on conflict do nothing;

  -- Artículo 47: Notificación
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_quejas, 'Notificación al involucrado - 5 elementos obligatorios', '47', 'XI. Quejas y Medidas Correctivas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Notificación al involucrado - 5 elementos obligatorios' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'La persona involucrada será notificada conforme al Artículo 62 y deberá conocer:
- Qué conducta se le atribuye;
- Cuándo ocurrió;
- Qué norma se considera incumplida;
- Qué evidencia existe;
- Qué medida podría aplicarse.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 47 Carta Interna. ADICIÓN PROPUESTA: 5 elementos obligatorios en notificación; remite a Art. 62 (medio oficial).',
    'Requiere ratificación; conecta con Art. 62.'
  ) on conflict do nothing;

  -- Artículo 48: Descargos
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_quejas, 'Derecho a descargos - 6 facultades del residente', '48', 'XI. Quejas y Medidas Correctivas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Derecho a descargos - 6 facultades del residente' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El residente podrá:
- Explicar lo ocurrido.
- Presentar evidencia.
- Señalar errores.
- Presentar testigos cuando corresponda.
- Solicitar revisión.
- Presentar una justificación.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 48 Carta Interna. ADICIÓN PROPUESTA: 6 facultades de defensa; base para Formato 2.',
    'Requiere ratificación; garantía de defensa.'
  ) on conflict do nothing;

  -- Artículo 49: Decisión
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_quejas, 'Decisión fundamentada - 7 elementos obligatorios', '49', 'XI. Quejas y Medidas Correctivas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Decisión fundamentada - 7 elementos obligatorios' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'La decisión deberá indicar:
- Hecho.
- Norma aplicada.
- Evidencia.
- Descargos.
- Decisión.
- Medida.
- Fecha.
- Responsable de la decisión.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 49 Carta Interna. ADICIÓN PROPUESTA: 8 elementos obligatorios en decisión (hecho, norma, evidencia, descargos, decisión, medida, fecha, responsable); base para registro Cap. XII.',
    'Requiere ratificación; trazabilidad completa.'
  ) on conflict do nothing;

  -- Artículo 50: Apelación
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_quejas, 'Apelación - 6 causales y plazos provisionales', '50', 'XI. Quejas y Medidas Correctivas', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Apelación - 6 causales y plazos provisionales' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El residente podrá solicitar revisión de una decisión cuando considere que:
- El hecho no ocurrió;
- Se identificó incorrectamente al responsable;
- La evidencia es insuficiente;
- Se aplicó una norma incorrecta;
- Existe una justificación válida;
- Se incumplió el procedimiento.

La revisión la resuelve la instancia inmediatamente superior en la ruta del Artículo 45: una decisión del fiscal o de los representantes se revisa en la Asamblea de Piso; una decisión de la Asamblea de Piso se revisa ante el Fiscal General y, si continúa la inconformidad, ante la Federación y en última instancia ante la Asamblea General.

Regla provisional. La Carta no fija plazos para este procedimiento. Mientras la Asamblea no decida otra cosa:
- Los descargos se presentan dentro de los 3 días calendario siguientes a la notificación;
- La decisión se emite dentro de los 8 días calendario siguientes a los descargos;
- Y la revisión se solicita dentro de los 5 días calendario siguientes a la decisión.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 50 Carta Interna. ADICIÓN PROPUESTA: 6 causales de apelación + 3 plazos provisionales (3 días descargos, 8 días decisión, 5 días apelación).',
    'Requiere ratificación por Asamblea; plazos provisionales operativos.'
  ) on conflict do nothing;
end $$;