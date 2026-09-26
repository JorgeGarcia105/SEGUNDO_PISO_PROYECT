-- Capítulo II: Normas de Limpieza (Artículos 4-11)
-- Versiones detalladas y expandidas de la Carta Interna actualizada

do $$
declare
  carta_id uuid;
  cat_aseo uuid;
  cat_medidas uuid;
  norm_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into cat_aseo from public.norm_categories where name = 'Aseo' limit 1;
  select id into cat_medidas from public.norm_categories where name = 'Medidas correctivas' limit 1;

  -- Artículo 4: Responsabilidad de limpieza (expansión de N-01)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Responsabilidad de limpieza y distribución de tareas', '4', 'II. Normas de Limpieza', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Responsabilidad de limpieza y distribución de tareas' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'La limpieza de las zonas comunes es responsabilidad de todos los residentes.

Las tareas se distribuirán mediante el sistema de aseos establecido en esta Carta.

Cada residente deberá realizar la totalidad de las tareas correspondientes al área que le sea asignada.

No se considerará cumplido un aseo por realizar solamente una parte de las actividades.',
    'VIGENTE', carta_id,
    'Art. 4 Carta Interna. Expansión de N-01: añade obligatoriedad de tareas completas y no parciales.',
    'Ratificada en versión original; expandida con obligación de completitud.'
  ) on conflict do nothing;

  -- Artículo 5: Pasillo 1 (expansión detallada de N-02)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Pasillo 1 - Tareas detalladas', '5', 'II. Normas de Limpieza', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Pasillo 1 - Tareas detalladas' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Corresponde al sector comprendido entre las habitaciones 217 y 234. El responsable deberá:

1. Barrer completamente el pasillo.
2. Trapear completamente el pasillo.
3. Repetir el proceso de barrido y trapeado dos veces.
4. Limpiar el área del comedor.
5. Limpiar la zona del gabinete de incendios.
6. Limpiar la ventana del pasillo que da hacia el coliseo.
7. Dejar los elementos del área organizados.
8. Retirar residuos generados durante la limpieza.
9. Dejar el piso seco.',
    'VIGENTE', carta_id,
    'Art. 5 Carta Interna. Expansión detallada de N-02 con 9 tareas específicas numeradas.',
    'Ratificada; versión detallada para verificación objetiva.'
  ) on conflict do nothing;

  -- Artículo 6: Pasillo 2 (expansión detallada de N-03)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Pasillo 2 - Tareas detalladas', '6', 'II. Normas de Limpieza', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Pasillo 2 - Tareas detalladas' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Corresponde al sector comprendido entre las habitaciones 201 y 216. El responsable deberá:

1. Barrer el pasillo.
2. Trapear el pasillo.
3. Repetir el proceso dos veces.
4. Barrer la sala de estar.
5. Trapear la sala de estar.
6. Limpiar las tapas de las canecas.
7. Organizar los muebles.
8. Pasar trapo por los sillones.
9. Retirar residuos.
10. Dejar el área organizada y seca.',
    'VIGENTE', carta_id,
    'Art. 6 Carta Interna. Expansión detallada de N-03 con 10 tareas específicas numeradas.',
    'Ratificada; versión detallada para verificación objetiva.'
  ) on conflict do nothing;

  -- Artículo 7: Duchas (expansión detallada de N-04 + N-05)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Duchas - Tareas detalladas y regla ducha libre', '7', 'II. Normas de Limpieza', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Duchas - Tareas detalladas y regla ducha libre' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El responsable deberá:

1. Barrer los pisos.
2. Restregar los pisos.
3. Trapear los pisos.
4. Repetir el proceso dos veces.
5. Limpiar las paredes.
6. Lavar las puertas.
7. Secar las puertas.
8. Limpiar las manijas.
9. Limpiar las jaboneras.
10. Limpiar las duchas.
11. Limpiar las partes metálicas de las puertas.
12. Limpiar la rejilla ubicada en la pared del pasillo.
13. Retirar residuos.
14. Organizar los elementos utilizados.
15. Dejar el área seca.

Durante la realización del aseo deberá permanecer por lo menos una ducha disponible, salvo el tiempo estrictamente necesario para finalizar la limpieza de las demás.',
    'VIGENTE', carta_id,
    'Art. 7 Carta Interna. Unifica N-04 y N-05: 15 tareas + regla de ducha libre obligatoria.',
    'Ratificada; versión unificada y detallada.'
  ) on conflict do nothing;

  -- Artículo 8: Baños (expansión detallada de N-06)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Baños - Tareas detalladas con productos', '8', 'II. Normas de Limpieza', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Baños - Tareas detalladas con productos' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El responsable deberá:

1. Limpiar espejos.
2. Limpiar paredes.
3. Limpiar pisos.
4. Limpiar sanitarios.
5. Limpiar orinales.
6. Limpiar puertas de aluminio.
7. Barrer.
8. Trapear.
9. Realizar dos ciclos de limpieza del piso.
10. Cambiar las bolsas de las canecas.
11. Limpiar los implementos utilizados.
12. Organizar el cuarto de aseo.
13. Retirar los residuos generados.

La limpieza se realizará utilizando los productos establecidos para el área, incluyendo jabón y cloro cuando corresponda.',
    'VIGENTE', carta_id,
    'Art. 8 Carta Interna. Expansión de N-06 con 13 tareas y especificación de productos (jabón y cloro).',
    'Ratificada; versión detallada con productos.'
  ) on conflict do nothing;

  -- Artículo 9: Cocina (expansión detallada de N-08)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Cocina - Tareas detalladas y piso seco obligatorio', '9', 'II. Normas de Limpieza', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Cocina - Tareas detalladas y piso seco obligatorio' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El responsable deberá:

1. Limpiar debajo de los cajones.
2. Limpiar debajo de la nevera.
3. Frotar quemadores.
4. Frotar hornillas.
5. Lavar quemadores y hornillas.
6. Limpiar la mesa del comedor.
7. Limpiar el microondas.
8. Limpiar la mesa roja ubicada en el exterior.
9. Retirar los utensilios de cocina que están fuera de lugar.
10. Limpiar el piso.
11. Dejar el piso completamente seco.
12. Revisar y limpiar adecuadamente el área del desagüe.
13. No dejar zonas húmedas.
14. Organizar los elementos utilizados.
15. Entregar organizado el cuarto de aseo.

En ningún caso se entregará la cocina con el piso húmedo o con utensilios fuera de lugar.',
    'VIGENTE', carta_id,
    'Art. 9 Carta Interna. Expansión de N-08 con 15 tareas, énfasis en piso seco y desagüe.',
    'Ratificada; versión detallada con criterio de piso seco obligatorio.'
  ) on conflict do nothing;

  -- Artículo 10: Zona de lavado (NUEVO - era PENDIENTE_CONFIRMACION)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Zona de lavado - Tareas provisionales', '10', 'II. Normas de Limpieza', true, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Zona de lavado - Tareas provisionales' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'El responsable deberá:

1. Barrer.
2. Trapear.
3. Limpiar superficies de trabajo.
4. Limpiar el área alrededor de lavadoras y demás equipos.
5. Retirar residuos.
6. Limpiar el desagüe superficial sin manipular instalaciones.
7. Dejar el piso seco.
8. Organizar los elementos de lavado.
9. Informar cualquier fuga, daño o desperfecto.
10. Dejar el cuarto de aseo organizado.

Regla provisional. La Carta actual menciona la zona de lavado como área de aseo, pero no desarrolla sus tareas. Esta lista se establece provisionalmente para eliminar el vacío y deberá ser ratificada por la Asamblea.',
    'PENDIENTE_CONFIRMACION', carta_id,
    'Art. 10 Carta Interna. NUEVA norma: la Carta original no tenía tareas desarrolladas. Lista provisional sujeta a ratificación.',
    'Pendiente de ratificación por Asamblea. Reemplaza N-07 que era PENDIENTE_CONFIRMACION sin tareas.'
  ) on conflict do nothing;

  -- Artículo 11: Cuarto de aseo (expansión de N-09)
  insert into public.norms (category_id, title, article_number, chapter, is_provisional, source_document_id)
  values (cat_aseo, 'Cuarto de aseo - Entrega y organización post-aseo', '11', 'II. Normas de Limpieza', false, carta_id)
  on conflict do nothing
  returning id into norm_id;

  if norm_id is null then
    select id into norm_id from public.norms where title = 'Cuarto de aseo - Entrega y organización post-aseo' limit 1;
  end if;

  insert into public.norm_versions (norm_id, version_number, version_label, text_content, status, source_document_id, source_note, approval_note)
  values (
    norm_id, 1, 'v1',
    'Después de realizar cualquier aseo, el responsable deberá:

1. Lavar los implementos utilizados cuando corresponda.
2. Escurrir trapeadores y demás elementos.
3. Guardar los implementos en su lugar.
4. No dejar baldes con agua.
5. No dejar productos abiertos innecesariamente.
6. Informar si falta algún producto o implemento.
7. Dejar el piso del cuarto de aseo seco.
8. Mantener el espacio organizado.',
    'VIGENTE', carta_id,
    'Art. 11 Carta Interna. Expansión de N-09 con 8 tareas específicas post-aseo.',
    'Ratificada; versión detallada para verificación de entrega.'
  ) on conflict do nothing;
end $$;