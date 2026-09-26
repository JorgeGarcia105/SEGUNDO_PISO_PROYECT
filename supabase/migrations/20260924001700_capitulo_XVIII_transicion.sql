-- Capítulo XVIII: Cargos, Cuotas y Transición (Artículos 73-78)
-- CAPÍTULO NUEVO COMPLETO - Todo PENDIENTE_CONFIRMACION

do $$
declare
  carta_id uuid;
  cat_resp uuid;
  cat_general uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_resp from public.norm_categories where name = 'Responsabilidades' limit 1;
  select id into cat_general from public.norm_categories where name = 'Convivencia' limit 1;

  -- Artículo 73: Elección de cargos
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_resp, 'Elección de cargos - Convocatoria 15 días, postulación sin medidas vencidas, mayoría simple, fiscal incompatible', '73', 'XVIII. Cargos, Cuotas y Transición', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Elección de cargos - Convocatoria 15 días, postulación sin medidas vencidas, mayoría simple, fiscal incompatible' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'La Asamblea de Piso elegirá los cargos del Capítulo X en una reunión convocada dentro de los primeros 15 días de cada año calendario.

Podrán postularse los residentes que no tengan medidas correctivas vencidas sin cumplir.

Cada residente tiene un voto. Se elige por mayoría simple de los presentes; si hay empate se repite la votación y, si persiste, se decide por sorteo.

El cargo de fiscal es incompatible con cualquier otro cargo, para garantizar su independencia.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 73 Carta Interna. ADICIÓN PROPUESTA: convocatoria ≤15 días año, requisito sin medidas vencidas, mayoría simple + desempate (re-votación → sorteo), incompatibilidad fiscal.',
    'Requiere ratificación; reglas electorales completas.'
  ) on conflict do nothing;

  -- Artículo 74: Vacantes
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_resp, 'Vacantes de cargos - Comunicación escrita, funciones 15 días máx, elección 15 días, suplencia representantes', '74', 'XVIII. Cargos, Cuotas y Transición', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Vacantes de cargos - Comunicación escrita, funciones 15 días máx, elección 15 días, suplencia representantes' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Quien renuncie a un cargo deberá comunicarlo por escrito al fiscal (o a un representante de piso, si quien renuncia es el fiscal) y continuará sus funciones hasta que se elija su reemplazo, por un máximo de 15 días.

La Asamblea elegirá al reemplazo dentro de los 15 días siguientes a la vacante, por el resto del período.

Mientras tanto, los representantes de piso asumirán las funciones urgentes del cargo vacante.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 74 Carta Interna. ADICIÓN PROPUESTA: renuncia escrita, continuidad ≤15 días, elección sustituto ≤15 días (resto período), suplencia temporal representantes.',
    'Requiere ratificación; continuidad institucional.'
  ) on conflict do nothing;

  -- Artículo 75: Revocatoria
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_resp, 'Revocatoria de cargos - 1/3 firmas, causales, descargos, mayoría simple con quórum', '75', 'XVIII. Cargos, Cuotas y Transición', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Revocatoria de cargos - 1/3 firmas, causales, descargos, mayoría simple con quórum' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Un cargo podrá ser revocado por la Asamblea de Piso por incumplimiento reiterado de sus funciones, extralimitación de ellas o conflicto de intereses no declarado.

La revocatoria puede solicitarse por escrito, con motivos, y firmada por al menos un tercio de los residentes.

La persona podrá presentar descargos conforme al Artículo 48, y la decisión se tomará por mayoría simple de los presentes, con el quórum del Artículo 3.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 75 Carta Interna. ADICIÓN PROPUESTA: 3 causales (incumplimiento, extralimitación, conflicto interés), iniciativa 1/3 residentes, descargos Art. 48, mayoría simple + quórum Art. 3.',
    'Requiere ratificación; control democrático de cargos.'
  ) on conflict do nothing;

  -- Artículo 76: Cuotas y recursos
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_general, 'Cuotas y recursos - Asamblea fija monto/destino/fecha, tesorería informa semestral, destino aprobado, pago tardío = recordatorio, no sustituye aseo', '76', 'XVIII. Cargos, Cuotas y Transición', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Cuotas y recursos - Asamblea fija monto/destino/fecha, tesorería informa semestral, destino aprobado, pago tardío = recordatorio, no sustituye aseo' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Las cuotas del piso, cuando existan, serán fijadas por la Asamblea, que definirá su monto, su destino y la fecha de pago.

La tesorería entregará soporte de cada pago y presentará a la Asamblea un informe de ingresos y egresos al menos una vez por semestre.

Los recursos solo podrán usarse para el destino aprobado por la Asamblea.

La consecuencia del pago tardío será la que la Asamblea defina. Mientras no la defina, la tesorería enviará un recordatorio por el medio oficial. En ningún caso el pago de una cuota sustituye un aseo (Artículo 29).',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 76 Carta Interna. ADICIÓN PROPUESTA: Asamblea fija monto/destino/fecha; tesorería: soporte + informe semestral; destino vinculante; pago tardío = lo que diga Asamblea (fallback: recordatorio); Art. 29: cuota ≠ aseo.',
    'Requiere ratificación; régimen financiero transparente.'
  ) on conflict do nothing;

  -- Artículo 77: Ingreso de residentes
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_resp, 'Ingreso de residentes - Entrega Carta + acuse Formato 5, explicación aseos/quejas, orden Art. 13', '77', 'XVIII. Cargos, Cuotas y Transición', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Ingreso de residentes - Entrega Carta + acuse Formato 5, explicación aseos/quejas, orden Art. 13' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Al ingresar, todo residente recibirá una copia de la Carta y firmará el acuse de recibo del Formato 5.

El representante de aseo le explicará sus aseos (Artículo 12), el sistema de asignación y la ruta para presentar quejas.

El nuevo residente quedará dentro del orden de asignación del Artículo 13.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 77 Carta Interna. ADICIÓN PROPUESTA: onboarding obligatorio (Carta + Formato 5 + explicación Art. 12/13/ruta quejas); entra en orden Art. 13.',
    'Requiere ratificación; integración normativa de nuevos.'
  ) on conflict do nothing;

  -- Artículo 78: Retiro de residentes
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_resp, 'Retiro de residentes - Aviso anticipado, cumplimiento pendientes, llaves protocolo general', '78', 'XVIII. Cargos, Cuotas y Transición', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Retiro de residentes - Aviso anticipado, cumplimiento pendientes, llaves protocolo general' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El residente que vaya a retirarse definitivamente lo informará al representante de aseo y al fiscal con anticipación suficiente para reorganizar la lista de aseos.

Deberá cumplir sus aseos y medidas pendientes antes de su salida. Las que no alcance a cumplir quedarán registradas y se retomarán si vuelve a residir en el piso.

Entregará las llaves y demás elementos de acceso conforme al protocolo general de la residencia.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 78 Carta Interna. ADICIÓN PROPUESTA: aviso anticipado (reorganización lista), obligación cumplir pendientes (registran si no), reingreso reactiva pendientes, llaves = protocolo general.',
    'Requiere ratificación; salida ordenada y continuidad obligaciones.'
  ) on conflict do nothing;
end $$;