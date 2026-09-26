-- Tareas de Limpieza Detalladas (cleaning_tasks)
-- Una tarea por cada actividad del Capítulo II, con frecuencia, productos y criterios de verificación

do $$
declare
  carta_id uuid;
  zona_pasillo1 uuid;
  zona_pasillo2 uuid;
  zona_duchas uuid;
  zona_banos uuid;
  zona_cocina uuid;
  zona_lavado uuid;
  zona_terraza uuid;
  zona_cuarto uuid;
  task_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;

  select id into zona_pasillo1 from public.cleaning_zones where name = 'Pasillo 1' limit 1;
  select id into zona_pasillo2 from public.cleaning_zones where name = 'Pasillo 2' limit 1;
  select id into zona_duchas from public.cleaning_zones where name = 'Duchas' limit 1;
  select id into zona_banos from public.cleaning_zones where name = 'Baños' limit 1;
  select id into zona_cocina from public.cleaning_zones where name = 'Cocina' limit 1;
  select id into zona_lavado from public.cleaning_zones where name = 'Zona de lavado' limit 1;
  select id into zona_terraza from public.cleaning_zones where name = 'Terraza' limit 1;
  select id into zona_cuarto from public.cleaning_zones where name = 'Cuarto de aseo' limit 1;

  -- PASILLO 1 (Art. 5) - 9 tareas
  insert into public.cleaning_tasks (zone_id, title, instructions, frequency_note, source_document_id, status, created_at)
  values
  (zona_pasillo1, 'Barrer completamente el pasillo', 'Barrer toda la longitud del pasillo entre habitaciones 217-234', 'Cada asignación - 2 veces por aseo', carta_id, 'borrador', now()),
  (zona_pasillo1, 'Trapear completamente el pasillo', 'Trapear toda la longitud con solución de limpieza', 'Cada asignación - 2 veces por aseo', carta_id, 'borrador', now()),
  (zona_pasillo1, 'Repetir barrido y trapeado (2da vuelta)', 'Segunda pasada completa de barrido y trapeado', 'Cada asignación - 2 veces por aseo', carta_id, 'borrador', now()),
  (zona_pasillo1, 'Limpiar área del comedor', 'Limpiar mesas, sillas y piso del comedor adyacente', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_pasillo1, 'Limpiar zona gabinete de incendios', 'Limpiar alrededor y frente al gabinete, sin obstruir', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_pasillo1, 'Limpiar ventana hacia coliseo', 'Limpiar vidrio y marco de ventana del pasillo', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_pasillo1, 'Organizar elementos del área', 'Dejar sillas, mesas y elementos en su lugar', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_pasillo1, 'Retirar residuos generados', 'Recoger basura y residuos de la limpieza', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_pasillo1, 'Dejar piso seco', 'Verificar que no queden charcos ni humedad', 'Cada asignación - criterio de entrega', carta_id, 'borrador', now())
  on conflict do nothing;

  -- PASILLO 2 (Art. 6) - 10 tareas
  insert into public.cleaning_tasks (zone_id, title, instructions, frequency_note, source_document_id, status, created_at)
  values
  (zona_pasillo2, 'Barrer el pasillo', 'Barrer toda la longitud entre habitaciones 201-216', 'Cada asignación - 2 veces por aseo', carta_id, 'borrador', now()),
  (zona_pasillo2, 'Trapear el pasillo', 'Trapear toda la longitud con solución de limpieza', 'Cada asignación - 2 veces por aseo', carta_id, 'borrador', now()),
  (zona_pasillo2, 'Repetir barrido y trapeado (2da vuelta)', 'Segunda pasada completa', 'Cada asignación - 2 veces por aseo', carta_id, 'borrador', now()),
  (zona_pasillo2, 'Barrer sala de estar', 'Barrer piso de sala de estar adyacente', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_pasillo2, 'Trapear sala de estar', 'Trapear piso de sala de estar', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_pasillo2, 'Limpiar tapas de canecas', 'Limpiar tapas y bordes de canecas del área', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_pasillo2, 'Organizar muebles', 'Dejar muebles en posición correcta', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_pasillo2, 'Pasar trapo por sillones', 'Limpiar superficies de sillones con paño', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_pasillo2, 'Retirar residuos', 'Recoger basura y residuos de la limpieza', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_pasillo2, 'Dejar área organizada y seca', 'Verificar orden y piso seco', 'Cada asignación - criterio de entrega', carta_id, 'borrador', now())
  on conflict do nothing;

  -- DUCHAS (Art. 7) - 15 tareas + regla ducha libre
  insert into public.cleaning_tasks (zone_id, title, instructions, frequency_note, source_document_id, status, created_at)
  values
  (zona_duchas, 'Barrer pisos', 'Barrer piso de todas las duchas', 'Cada asignación - 2 veces por aseo', carta_id, 'borrador', now()),
  (zona_duchas, 'Restregar pisos', 'Restregar con cepillo y jabón', 'Cada asignación - 2 veces por aseo', carta_id, 'borrador', now()),
  (zona_duchas, 'Trapear pisos', 'Trapear con solución jabón/fab/límpido', 'Cada asignación - 2 veces por aseo', carta_id, 'borrador', now()),
  (zona_duchas, 'Repetir proceso (2da vuelta)', 'Segunda pasada completa barrer-restregar-trapeado', 'Cada asignación - 2 veces por aseo', carta_id, 'borrador', now()),
  (zona_duchas, 'Limpiar paredes', 'Limpiar azulejos y paredes de duchas', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_duchas, 'Lavar puertas', 'Lavar puertas de duchas con jabón', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_duchas, 'Secar puertas', 'Secar completamente puertas tras lavar', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_duchas, 'Limpiar manijas', 'Desinfectar manijas de puertas', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_duchas, 'Limpiar jaboneras', 'Limpiar y desinfectar jaboneras', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_duchas, 'Limpiar duchas (grifos/alcachofas)', 'Limpiar cabezales y grifos', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_duchas, 'Limpiar partes metálicas puertas', 'Limpiar bisagras, cerraduras, marcos metálicos', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_duchas, 'Limpiar rejilla pared pasillo', 'Limpiar rejilla de desagüe en pared', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_duchas, 'Retirar residuos', 'Recoger cabello, basura, envases vacíos', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_duchas, 'Organizar elementos utilizados', 'Dejar productos y utensilios en su lugar', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_duchas, 'Dejar área seca', 'Verificar piso y superficies secas', 'Cada asignación - criterio de entrega', carta_id, 'borrador', now())
  on conflict do nothing;

  -- Tarea especial: Ducha libre (Art. 7)
  insert into public.cleaning_tasks (zone_id, title, instructions, frequency_note, source_document_id, status, created_at)
  values
  (zona_duchas, 'Mantener al menos 1 ducha libre durante aseo', 'No ocupar todas las duchas simultáneamente; dejar 1 disponible para uso de residentes salvo finalización', 'Durante toda la asignación', carta_id, 'borrador', now())
  on conflict do nothing;

  -- BAÑOS (Art. 8) - 13 tareas
  insert into public.cleaning_tasks (zone_id, title, instructions, frequency_note, source_document_id, status, created_at)
  values
  (zona_banos, 'Limpiar espejos', 'Limpiar con limpiavidrios, sin rayas', 'Cada asignación - 2 ciclos piso', carta_id, 'borrador', now()),
  (zona_banos, 'Limpiar paredes', 'Limpiar azulejos y paredes', 'Cada asignación - 2 ciclos piso', carta_id, 'borrador', now()),
  (zona_banos, 'Limpiar pisos - 1er ciclo', 'Barrer y trapear con jabón y cloro', 'Cada asignación - 2 ciclos', carta_id, 'borrador', now()),
  (zona_banos, 'Limpiar pisos - 2do ciclo', 'Segunda pasada barrido y trapeado', 'Cada asignación - 2 ciclos', carta_id, 'borrador', now()),
  (zona_banos, 'Limpiar sanitarios', 'Limpiar y desinfectar tazas sanitarias', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_banos, 'Limpiar orinales', 'Limpiar y desinfectar orinales', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_banos, 'Limpiar puertas aluminio', 'Limpiar marcos y hojas de puertas', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_banos, 'Cambiar bolsas canecas', 'Retirar bolsa usada, colocar nueva', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_banos, 'Limpiar implementos utilizados', 'Enjuagar y dejar limpios trapeadores, cepillos', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_banos, 'Organizar cuarto de aseo', 'Dejar implementos en su lugar', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_banos, 'Retirar residuos generados', 'Basura, papel, envases', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_banos, 'Usar productos: jabón y cloro', 'Aplicar según corresponda por área', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_banos, 'Dejar piso seco', 'Verificar sin charcos ni humedad', 'Cada asignación - criterio de entrega', carta_id, 'borrador', now())
  on conflict do nothing;

  -- COCINA (Art. 9) - 15 tareas
  insert into public.cleaning_tasks (zone_id, title, instructions, frequency_note, source_document_id, status, created_at)
  values
  (zona_cocina, 'Limpiar debajo de cajones', 'Mover cajones, barrer y trapear debajo', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_cocina, 'Limpiar debajo de nevera', 'Mover nevera con cuidado, limpiar detrás y debajo', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_cocina, 'Frotar quemadores', 'Frotar con esponja y desengrasante', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_cocina, 'Frotar hornillas', 'Frotar superficie de hornillas', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_cocina, 'Lavar quemadores y hornillas', 'Enjuagar y secar tras frotar', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_cocina, 'Limpiar mesa comedor', 'Limpiar y desinfectar superficie', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_cocina, 'Limpiar microondas', 'Interior y exterior, plato giratorio', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_cocina, 'Limpiar mesa roja exterior', 'Limpiar mesa roja ubicada en exterior', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_cocina, 'Retirar utensilios fuera de lugar', 'Guardar ollas, cubiertos, trastes en su sitio', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_cocina, 'Limpiar piso', 'Barrer y trapear completamente', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_cocina, 'Dejar piso completamente seco', 'CRITERIO OBLIGATORIO: sin humedad', 'Cada asignación - NO ENTREGAR HÚMEDO', carta_id, 'borrador', now()),
  (zona_cocina, 'Revisar y limpiar desagüe', 'Limpiar trampa y rejilla desagüe', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_cocina, 'No dejar zonas húmedas', 'Secar todas las superficies', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_cocina, 'Organizar elementos utilizados', 'Productos, trapos, utensilios en su lugar', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_cocina, 'Entregar cuarto de aseo organizado', 'Verificar Art. 11', 'Cada asignación', carta_id, 'borrador', now())
  on conflict do nothing;

  -- ZONA DE LAVADO (Art. 10) - 10 tareas (provisionales)
  insert into public.cleaning_tasks (zone_id, title, instructions, frequency_note, source_document_id, status, created_at)
  values
  (zona_lavado, 'Barrer', 'Barrer piso completo', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_lavado, 'Trapear', 'Trapear con solución de limpieza', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_lavado, 'Limpiar superficies de trabajo', 'Encimeras, mesas, repisas', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_lavado, 'Limpiar alrededor de lavadoras/equipos', 'Atrás, lados, debajo accesible', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_lavado, 'Retirar residuos', 'Pelusas, basura, envases', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_lavado, 'Limpiar desagüe superficial', 'Rejilla y trampa accesible SIN manipular instalaciones', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_lavado, 'Dejar piso seco', 'Verificar sin humedad', 'Cada asignación - criterio de entrega', carta_id, 'borrador', now()),
  (zona_lavado, 'Organizar elementos de lavado', 'Detergentes, suavizantes, cestos en orden', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_lavado, 'Informar fugas/daños/desperfectos', 'Reportar a representante de aseo inmediatamente', 'Cada asignación - obligatorio', carta_id, 'borrador', now()),
  (zona_lavado, 'Dejar cuarto de aseo organizado', 'Verificar Art. 11', 'Cada asignación', carta_id, 'borrador', now())
  on conflict do nothing;

  -- TERRAZA (Art. 14 provisional) - 6 tareas
  insert into public.cleaning_tasks (zone_id, title, instructions, frequency_note, source_document_id, status, created_at)
  values
  (zona_terraza, 'Barrer', 'Barrer piso completo de terraza', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_terraza, 'Trapear', 'Trapear piso', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_terraza, 'Limpiar mesas', 'Limpiar superficies de mesas', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_terraza, 'Limpiar sillas', 'Limpiar asientos y respaldos', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_terraza, 'Retirar residuos', 'Basura, colillas, hojas', 'Cada asignación', carta_id, 'borrador', now()),
  (zona_terraza, 'Organizar elementos y dejar piso seco', 'Mesas/sillas en lugar, piso seco', 'Cada asignación - criterio de entrega', carta_id, 'borrador', now())
  on conflict do nothing;

  -- CUARTO DE ASEO (Art. 11) - 8 tareas
  insert into public.cleaning_tasks (zone_id, title, instructions, frequency_note, source_document_id, status, created_at)
  values
  (zona_cuarto, 'Lavar implementos utilizados', 'Trapeadores, cepillos, cubetas', 'Post-aseo - cuando corresponda', carta_id, 'borrador', now()),
  (zona_cuarto, 'Escurrir trapeadores y elementos', 'No dejar goteando', 'Post-aseo', carta_id, 'borrador', now()),
  (zona_cuarto, 'Guardar implementos en su lugar', 'Cada cosa en su gancho/estante', 'Post-aseo', carta_id, 'borrador', now()),
  (zona_cuarto, 'No dejar baldes con agua', 'Vaciar y secar baldes', 'Post-aseo - PROHIBIDO', carta_id, 'borrador', now()),
  (zona_cuarto, 'No dejar productos abiertos innecesariamente', 'Tapar y guardar productos', 'Post-aseo', carta_id, 'borrador', now()),
  (zona_cuarto, 'Informar faltantes productos/implementos', 'Reportar a representante de aseo', 'Post-aseo - obligatorio', carta_id, 'borrador', now()),
  (zona_cuarto, 'Dejar piso del cuarto seco', 'Sin charcos ni humedad', 'Post-aseo - criterio de entrega', carta_id, 'borrador', now()),
  (zona_cuarto, 'Mantener espacio organizado', 'Orden general del cuarto', 'Post-aseo', carta_id, 'borrador', now())
  on conflict do nothing;
end $$;