-- Capítulo VIII: Espacios Comunes (Artículos 35-37)

do $$
declare
  carta_id uuid;
  cat_convivencia uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_convivencia from public.norm_categories where name = 'Convivencia' limit 1;

  -- Artículo 35: Uso adecuado (actualiza N-35)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_convivencia, 'Uso adecuado de espacios comunes - Lista exhaustiva', '35', 'VIII. Espacios Comunes', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Uso adecuado de espacios comunes - Lista exhaustiva' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Después de utilizar un espacio común, el residente deberá dejarlo en condiciones adecuadas. Esto incluye:
- Cocina;
- Baños;
- Pasillos;
- Sala;
- Comedor;
- Terraza;
- Zona de lavado;
- Cuarto de aseo.',
    'VIGENTE', carta_id,
    'Art. 35 Carta Interna. Actualiza N-35: lista exhaustiva de 8 espacios comunes.',
    'Ratificada; lista completa para verificación.'
  ) on conflict do nothing;

  -- Artículo 36: Elementos personales
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_convivencia, 'Elementos personales en zonas comunes - Prohibición y retiro', '36', 'VIII. Espacios Comunes', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Elementos personales en zonas comunes - Prohibición y retiro' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'No deberán dejarse permanentemente objetos personales en zonas comunes que obstaculicen el paso, generen suciedad o impidan utilizar el espacio.

Los objetos abandonados podrán ser reportados al representante.',
    'VIGENTE', carta_id,
    'Art. 36 Carta Interna. Prohíbe objetos que obstaculicen, ensucien o impidan uso; reporte al representante.',
    'Ratificada.'
  ) on conflict do nothing;

  -- Artículo 37: Daños (actualiza N-36 parcialmente)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_convivencia, 'Daños a espacios comunes - Informe y atribución de responsabilidad', '37', 'VIII. Espacios Comunes', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Daños a espacios comunes - Informe y atribución de responsabilidad' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Quien ocasione un daño deberá informarlo inmediatamente.

No informar un daño podrá considerarse una conducta independiente cuando la omisión agrave el problema.

Antes de atribuir responsabilidad deberá determinarse:
- Qué ocurrió.
- Cuándo ocurrió.
- Qué evidencia existe.
- Si existía daño previo.
- Quién tenía acceso al elemento.
- Si existe responsabilidad comprobable.',
    'VIGENTE', carta_id,
    'Art. 37 Carta Interna. Protocolo de 6 pasos para atribución de responsabilidad por daños; omisión de informe = conducta independiente.',
    'Ratificada; protocolo estructurado de investigación.'
  ) on conflict do nothing;
end $$;