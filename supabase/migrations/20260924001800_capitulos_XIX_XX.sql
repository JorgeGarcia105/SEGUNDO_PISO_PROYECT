-- Capítulos XIX y XX: Jerarquía, Vigencia, Socialización, Convivencia Complementaria (Artículos 79-84)
-- CAPÍTULOS NUEVOS - Todo PENDIENTE_CONFIRMACION

do $$
declare
  carta_id uuid;
  cat_general uuid;
  cat_seguridad uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_general from public.norm_categories where name = 'Convivencia' limit 1;
  select id into cat_seguridad from public.norm_categories where name = 'Seguridad' limit 1;

  -- Artículo 79: Jerarquía normativa
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Jerarquía normativa - 4 niveles: Constitución/Leyes → Protocolo casa/Federación → Carta → Asamblea', '79', 'XIX. Jerarquía Normativa, Vigencia y Socialización', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Jerarquía normativa - 4 niveles: Constitución/Leyes → Protocolo casa/Federación → Carta → Asamblea' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'En caso de contradicción entre normas, se aplicará el siguiente orden:
1. La Constitución y las leyes de Colombia.
2. El protocolo o reglamento general de la casa o residencia y las normas de la Federación.
3. La presente Carta Interna.
4. Las decisiones de la Asamblea de Piso, dentro de lo que esta Carta le permite.

La parte de la Carta que contradiga una norma superior no se aplicará en ese punto, y deberá proponerse su modificación conforme al Capítulo XIII.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 79 Carta Interna. ADICIÓN PROPUESTA: pirámide Kelseniana de 4 niveles; inaplicación automática de contradicciones + obligación modificar.',
    'Requiere ratificación; seguridad jurídica y supremacía constitucional.'
  ) on conflict do nothing;

  -- Artículo 80: Vigencia
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Vigencia de la Carta - Fecha aprobación asamblea, Carta anterior hasta entonces, Art. 54 para hechos previos', '80', 'XIX. Jerarquía Normativa, Vigencia y Socialización', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Vigencia de la Carta - Fecha aprobación asamblea, Carta anterior hasta entonces, Art. 54 para hechos previos' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Esta Carta entrará en vigencia en la fecha que la Asamblea fije al aprobarla, y quedará constancia en el acta correspondiente.

Hasta esa fecha seguirá aplicándose la Carta anterior.

Los hechos ocurridos antes de la vigencia se rigen por el Artículo 54.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 80 Carta Interna. ADICIÓN PROPUESTA: vigencia = fecha acta aprobación; ultratividad Carta anterior; irretroactividad Art. 54.',
    'Requiere ratificación; transición normativa ordenada.'
  ) on conflict do nothing;

  -- Artículo 81: Socialización
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Socialización - Cartelera, medio oficial, copia cada residente, Formato 5, modificaciones mismo medio', '81', 'XIX. Jerarquía Normativa, Vigencia y Socialización', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Socialización - Cartelera, medio oficial, copia cada residente, Formato 5, modificaciones mismo medio' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Aprobada la Carta, se publicará en la cartelera, se enviará por el medio oficial y se entregará una copia a cada residente.

Cada residente confirmará su recepción con el Formato 5. Esa confirmación no es requisito para que la Carta lo obligue (Artículo 2).

Las modificaciones posteriores se comunicarán por el mismo medio.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 81 Carta Interna. ADICIÓN PROPUESTA: 3 canales (cartelera + medio oficial + copia personal); Formato 5 acuse recibo (no condiciona obligatoriedad Art. 2); modificaciones mismo medio.',
    'Requiere ratificación; difusión efectiva y trazabilidad recepción.'
  ) on conflict do nothing;

  -- Artículo 82: Visitantes y pernocta
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Visitantes y pernocta - Acompañamiento zonas comunes, pernocta = Art. 17, ingreso = Art. 40', '82', 'XX. Convivencia Complementaria', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Visitantes y pernocta - Acompañamiento zonas comunes, pernocta = Art. 17, ingreso = Art. 40' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El residente que reciba a un visitante lo acompañará en las zonas comunes y responderá por su conducta conforme al Artículo 34.

La permanencia nocturna de un acompañante debe informarse y se controla según el Artículo 17.

El ingreso de visitantes se rige por el protocolo general de la casa (Artículo 40).',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 82 Carta Interna. ADICIÓN PROPUESTA (Cap. XX): remite a Arts. 34 (responsabilidad), 17 (acompañantes), 40 (protocolo ingreso). No crea nueva norma, evita vacíos por silencio.',
    'Requiere ratificación; remisiones cruzadas para evitar vacíos.'
  ) on conflict do nothing;

  -- Artículo 83: Alimentos y nevera
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Alimentos y nevera - Rotulado obligatorio, retiro 48h aviso, residuos no en zonas comunes', '83', 'XX. Convivencia Complementaria', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Alimentos y nevera - Rotulado obligatorio, retiro 48h aviso, residuos no en zonas comunes' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Los alimentos guardados en zonas comunes deberán estar rotulados con el nombre del residente y la fecha.

Los alimentos sin rotular o vencidos podrán ser retirados por el representante de aseo, previo aviso por el medio oficial con 48 horas de anticipación.

Los residuos de alimentos no se dejarán en zonas comunes.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 83 Carta Interna. ADICIÓN PROPUESTA: rotulado (nombre+fecha) obligatorio; retiro sin rotular/vencidos = representante aseo + aviso 48h medio oficial; residuos prohibidos en zonas comunes.',
    'Requiere ratificación; higiene y orden en nevera/zonas comunes.'
  ) on conflict do nothing;

  -- Artículo 84: Mascotas, humo y otras conductas no reguladas
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Mascotas, humo y conductas no reguladas - Protocolo casa/ley, silencio no autoriza, recurrentes = Asamblea regula', '84', 'XX. Convivencia Complementaria', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Mascotas, humo y conductas no reguladas - Protocolo casa/ley, silencio no autoriza, recurrentes = Asamblea regula' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Las mascotas, el humo de tabaco u otras sustancias y las demás conductas que no estén reguladas en esta Carta se rigen por el protocolo general de la casa y por la ley.

Ninguna de estas conductas se entenderá autorizada por el simple silencio de la Carta. Si afectan la convivencia, se tramitarán conforme al Artículo 55 y, si son recurrentes, la Asamblea deberá regularlas.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 84 Carta Interna. ADICIÓN PROPUESTA: cláusula de remisión general (protocolo casa + ley); silencio ≠ autorización; tramitación Art. 55; recurrentes → obligación Asamblea regular.',
    'Requiere ratificación; cláusula residual anti-vacíos.'
  ) on conflict do nothing;
end $$;