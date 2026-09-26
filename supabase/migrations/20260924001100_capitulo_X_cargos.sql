-- Capítulo X: Cargos Representativos (Artículos 41-44)

do $$
declare
  carta_id uuid;
  cat_resp uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_resp from public.norm_categories where name = 'Responsabilidades' limit 1;

  -- Artículo 41: Representantes de piso (actualiza N-24)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_resp, 'Representantes de piso - 3 cargos y 6 funciones', '41', 'X. Cargos Representativos', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Representantes de piso - 3 cargos y 6 funciones' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El piso contará con 3 representantes de piso. Funciones:
1. Coordinar actividades.
2. Recibir quejas.
3. Recibir sugerencias.
4. Servir como voceros.
5. Comunicar decisiones.
6. Coordinar con la Federación cuando corresponda.',
    'VIGENTE', carta_id,
    'Art. 41 Carta Interna. Actualiza N-24: especifica 3 cargos y 6 funciones numeradas.',
    'Ratificada; funciones explícitas y numeradas.'
  ) on conflict do nothing;

  -- Artículo 42: Representante de aseo (actualiza N-25)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_resp, 'Representante de aseo - 8 funciones y horarios de atención', '42', 'X. Cargos Representativos', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Representante de aseo - 8 funciones y horarios de atención' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Funciones del representante de aseo:
1. Gestionar materiales de aseo.
2. Reportar desperfectos.
3. Recibir solicitudes de materiales.
4. Elaborar la lista de aseos.
5. Publicar la asignación.
6. Llevar control de cumplimiento.
7. Informar problemas recurrentes.
8. Mantener actualizado el inventario.

Las peticiones de aseo se reciben los domingos de 7:00 p.m. a 10:00 p.m. y la lista debe entregarse a más tardar a las 10:30 p.m.',
    'VIGENTE', carta_id,
    'Art. 42 Carta Interna. Actualiza N-25: 8 funciones numeradas + horarios específicos (domingos 19:00-22:00, lista ≤22:30).',
    'Ratificada; horarios y funciones explícitos.'
  ) on conflict do nothing;

  -- Artículo 43: Fiscal (actualiza N-26)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_resp, 'Fiscal - 7 funciones y garantía de debido proceso', '43', 'X. Cargos Representativos', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Fiscal - 7 funciones y garantía de debido proceso' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Funciones del fiscal:
1. Verificar transparencia.
2. Revisar legalidad de las decisiones internas.
3. Resolver inconformidades.
4. Recibir solicitudes de autorización.
5. Revisar incumplimientos.
6. Garantizar el debido proceso.
7. Presentar casos ante la Asamblea cuando corresponda.',
    'VIGENTE', carta_id,
    'Art. 43 Carta Interna. Actualiza N-26: 7 funciones numeradas; énfasis en debido proceso y legalidad.',
    'Ratificada; funciones explícitas.'
  ) on conflict do nothing;

  -- Artículo 44: Tesorería (actualiza N-27)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_resp, 'Tesorería - 6 funciones de administración financiera', '44', 'X. Cargos Representativos', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Tesorería - 6 funciones de administración financiera' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Funciones de la tesorería:
1. Administrar recursos.
2. Registrar ingresos.
3. Registrar egresos.
4. Recaudar cuotas.
5. Presentar informes.
6. Conservar soportes de pagos.',
    'VIGENTE', carta_id,
    'Art. 44 Carta Interna. Actualiza N-27: 6 funciones numeradas; énfasis en rendición de cuentas y soportes.',
    'Ratificada; funciones explícitas.'
  ) on conflict do nothing;

  -- Nota: Duración y elección (Art. 28 original / N-28) se cubre en Capítulo XVIII Art. 73
end $$;