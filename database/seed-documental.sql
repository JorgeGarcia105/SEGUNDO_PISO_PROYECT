-- SegundoPiso: carga documental inicial.
-- Idempotente por titulo/nombre. No convierte la Carta ni las actas en vigencia
-- institucional: las versiones normativas quedan con el estado documental correspondiente.
-- Estados según matriz-normativa.md: VIGENTE (VIGENTE_POR_CARTA), PENDIENTE_CONFIRMACION, NO_VERIFICADO.

insert into public.documents (title, document_type, description, status, is_immutable)
select 'Carta Interna 2do Piso RGSB.pdf', 'carta_interna',
       'Fuente normativa base del Segundo Piso. Requiere confirmación de vigencia institucional.',
       'publicado', true
where not exists (
  select 1 from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf'
);

insert into public.documents (title, document_type, description, status, is_immutable)
select 'Asambleas Piso 2.pdf', 'acta',
       'Compilación histórica de actas, propuestas, votaciones, decisiones e informes.',
       'publicado', true
where not exists (
  select 1 from public.documents where title = 'Asambleas Piso 2.pdf'
);

do $$
declare
  carta_id uuid;
  actas_id uuid;
  category_id uuid;
  existing_norm_id uuid;
  item jsonb;
  existing_zone_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into actas_id from public.documents where title = 'Asambleas Piso 2.pdf' limit 1;

  insert into public.norm_categories (name, description)
  values
    ('Aseo', 'Limpieza, asignaciones e instrucciones de zonas comunes.'),
    ('Medidas correctivas', 'Medidas documentadas; no implica que todas estén vigentes.'),
    ('Responsabilidades', 'Cargos y funciones del Segundo Piso.'),
    ('Convivencia', 'Respeto, ruido y uso de espacios comunes.'),
    ('Quejas', 'Debido proceso y escalamiento.'),
    ('Seguridad', 'Emergencias, acceso y contenido pendiente de validación.')
  on conflict (name) do update set description = excluded.description, updated_at = now();

  for item in select * from jsonb_array_elements($norms$
  [
    {"category":"Aseo","title":"Responsabilidad común de aseo","text":"La limpieza de las zonas comunes es responsabilidad de todos los residentes.","status":"VIGENTE","source_note":"N-01. VIGENTE_POR_CARTA. Regla base de la Carta Interna Sección 1.1.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Aseo","title":"Pasillo 1","text":"Desde la habitación 217 hasta la 234: barrer y trapear dos veces el pasillo, el área del comedor y la zona del gabinete de incendios; limpiar la ventana del pasillo hacia el coliseo.","status":"VIGENTE","source_note":"N-02. VIGENTE_POR_CARTA. Carta Sección 1.1. Validar alcance exacto de la zona.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Aseo","title":"Pasillo 2","text":"Desde la habitación 201 hasta la 216: barrer y trapear dos veces el pasillo y la sala de estar; limpiar tapas de canecas; dejar muebles organizados; pasar trapo por los sillones.","status":"VIGENTE","source_note":"N-03. VIGENTE_POR_CARTA. Carta Sección 1.1. Confirmar si sala y comedor son zonas distintas.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Aseo","title":"Limpieza de duchas","text":"Con jabón, fab y límpido: barrer, restregar y trapear pisos y paredes dos veces; lavar y secar puertas; limpiar manijas, jaboneras, duchas, partes metálicas y rejilla de la pared del pasillo.","status":"VIGENTE","source_note":"N-04. VIGENTE_POR_CARTA. Carta Sección 1.1. La Carta define productos y excepción de ducha libre.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Aseo","title":"Ducha libre durante el aseo","text":"Se debe dejar una ducha libre para que alguien pueda bañarse, salvo que se esté terminando de hacer aseo.","status":"VIGENTE","source_note":"N-05. VIGENTE_POR_CARTA. Carta Sección 1.1.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Aseo","title":"Limpieza de baños","text":"Limpiar con cloro y jabón espejos, paredes, piso, baños, orinales y puertas de aluminio; barrer y trapear el piso dos veces; cambiar las bolsas y limpiar los implementos utilizados.","status":"VIGENTE","source_note":"N-06. VIGENTE_POR_CARTA. Carta Sección 1.1. Regla operativa explícita.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Aseo","title":"Zona de lavado","text":"La zona de lavado aparece como zona de aseo, pero la Carta no proporciona instrucciones desarrolladas después de su encabezado.","status":"PENDIENTE_CONFIRMACION","source_note":"N-07. PENDIENTE_CONFIRMACION. Carta Sección 1.1. Instrucciones incompletas.","approval_note":"Pendiente de confirmación de instrucciones completas."},
    {"category":"Aseo","title":"Limpieza de cocina","text":"Limpiar debajo de los cajones y la nevera; frotar y lavar quemadores y hornillas con una esponja; limpiar la mesa del comedor y el microondas; dejar la mesa roja exterior y la cocina sin utensilios.","status":"VIGENTE","source_note":"N-08. VIGENTE_POR_CARTA. Carta Sección 1.1.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Aseo","title":"Entrega del cuarto de aseo","text":"Todos los aseos tienen que entregar el cuarto de aseo organizado. La frase sobre no dejar hueco húmedo requiere validación del PDF y del responsable.","status":"NO_VERIFICADO","source_note":"N-09. NO_VERIFICADO parcialmente. Carta Sección 1.1. Expresión \"hueco húmedo\" requiere validación visual.","approval_note":"Pendiente de validación visual del PDF original."},
    {"category":"Aseo","title":"Distribución entre residentes","text":"La Carta describe la distribución de estas tareas entre 34 residentes.","status":"PENDIENTE_CONFIRMACION","source_note":"N-10. PENDIENTE_CONFIRMACION del padrón actual. Carta Sección 1.2.","approval_note":"Pendiente de confirmación del padrón actual de residentes."},
    {"category":"Aseo","title":"Carga de nuevos residentes","text":"El nuevo residente hará 3 aseos semanales durante 52 semanas, entendidas como semanas residiendo en el piso.","status":"VIGENTE","source_note":"N-11. VIGENTE_POR_CARTA. Carta Sección 1.2. Posible diferencia posterior en actas.","approval_note":"Confirmada por análisis documental como vigente por Carta; actas presentan esquemas alternativos."},
    {"category":"Aseo","title":"Prelación de zonas A","text":"Cocina, baños y zona de lavado, siempre y cuando sea lunes.","status":"VIGENTE","source_note":"N-12. VIGENTE_POR_CARTA. Carta Sección 1.2. Relación con actas pendiente.","approval_note":"Confirmada por análisis documental como vigente por Carta; vigencia posterior de acuerdos sobre terraza/lavandería pendiente."},
    {"category":"Aseo","title":"Prelación de zonas B","text":"Duchas, pasillo 1, terraza, pasillo 2 y zona de lavado.","status":"VIGENTE","source_note":"N-13. VIGENTE_POR_CARTA. Carta Sección 1.2. Relación con actas pendiente.","approval_note":"Confirmada por análisis documental como vigente por Carta; vigencia posterior de acuerdos sobre terraza/lavandería pendiente."},
    {"category":"Aseo","title":"Orden de asignación","text":"Los aseos se pondrán en este orden: multados; nuevos ingresos; acompañantes; residentes en orden numérico hasta el último residente que haya descansado la semana anterior.","status":"VIGENTE","source_note":"N-14. VIGENTE_POR_CARTA. Carta Sección 1.2. Confirmar excepciones y descansos.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Medidas correctivas","title":"Incumplimiento de aseo","text":"Quien no cumpla con su aseo tendrá una sanción equivalente a 3 aseos adicionales y se le impondrá el mismo aseo que incumplió.","status":"VIGENTE","source_note":"N-15. VIGENTE_POR_CARTA. Carta Sección 1.3.a. Casos posteriores separados.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Medidas correctivas","title":"Entrega de aseo hasta una hora tarde","text":"Genera 1 aseo adicional y el mismo aseo para la próxima semana. Se puede solicitar permiso previo al fiscal por causa justa y razonable notificada antes del horario.","status":"VIGENTE","source_note":"N-16. VIGENTE_POR_CARTA. Carta Sección 1.3.b.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Medidas correctivas","title":"Firma sin verificación estricta","text":"Quien revise y firme un aseo sin cumplimiento estricto tendrá una sanción de 3 aseos; se entenderá como no entregado y se aplicará la sanción del incumplimiento. Deben constar revisor, hora y habitación legibles.","status":"VIGENTE","source_note":"N-17. VIGENTE_POR_CARTA. Carta Sección 1.3.c.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Aseo","title":"Máximo semanal de aseos","text":"Máximo de 8 aseos por semana.","status":"VIGENTE","source_note":"N-18. VIGENTE_POR_CARTA. Carta Sección 1.3.d. Excepción del caso 220 separada.","approval_note":"Confirmada por análisis documental como vigente por Carta; caso 220 es excepción individual."},
    {"category":"Medidas correctivas","title":"No pago de multas y omisión","text":"Ninguna multa se puede pagar. Solo se pueden omitir aseos por semanas académicas; quien abandone el piso debe informar para definir el aseo correspondiente.","status":"VIGENTE","source_note":"N-19. VIGENTE_POR_CARTA. Carta Sección 1.3.e-f. Excepciones de actas no generalizadas.","approval_note":"Confirmada por análisis documental como vigente por Carta; actas registran pagos y excepciones individuales."},
    {"category":"Aseo","title":"Descansos","text":"Cuando se llenen los cupos de asignación, descansarán las personas en orden consecuente a quien descansó la última vez.","status":"VIGENTE","source_note":"N-20. VIGENTE_POR_CARTA. Carta Sección 1.4.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Aseo","title":"Aseo por acompañante","text":"Si un residente tiene un acompañante 3 noches por semana, será responsable de un aseo adicional a los que le corresponden por semana.","status":"VIGENTE","source_note":"N-21. VIGENTE_POR_CARTA. Carta Sección 1.5. Falta cómo verificar permanencia.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Medidas correctivas","title":"Medida documentada para ruido","text":"El apartado de la Carta dice: multas por ruidos, aseo tipo ornato (3) y aseo de piso (3). El alcance y la redacción completa requieren confirmación.","status":"NO_VERIFICADO","source_note":"N-22. NO_VERIFICADO como regla completa. Carta Sección 1.6.","approval_note":"Pendiente de validación del texto completo y alcance."},
    {"category":"Responsabilidades","title":"Cargos representativos obligatorios","text":"Todos los residentes del Segundo Piso deberán ocupar un cargo representativo durante su permanencia; en casos excepcionales decide la asamblea de piso.","status":"VIGENTE","source_note":"N-23. VIGENTE_POR_CARTA. Carta Sección 2. Excepciones documentadas aparte.","approval_note":"Confirmada por análisis documental como vigente por Carta; actas muestran cargos temporales y remociones."},
    {"category":"Responsabilidades","title":"Representantes de piso","text":"Hay 3 representantes de piso encargados de coordinar actividades, quejas y sugerencias, y de ser voceros ante la Federación.","status":"VIGENTE","source_note":"N-24. VIGENTE_POR_CARTA. Carta Sección 2.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Responsabilidades","title":"Representante de aseo","text":"Gestiona materiales de aseo y reporta desperfectos o necesidades de mantenimiento. Las peticiones se entregan el domingo de 19:00 a 22:00 y la lista hasta máximo 22:30.","status":"VIGENTE","source_note":"N-25. VIGENTE_POR_CARTA. Carta Sección 2.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Responsabilidades","title":"Fiscal","text":"Verifica la transparencia y legalidad de decisiones y acciones de representantes y resuelve conflictos o inconformidades entre residentes o con la administración.","status":"VIGENTE","source_note":"N-26. VIGENTE_POR_CARTA. Carta Sección 2.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Responsabilidades","title":"Tesorero","text":"Administra recursos económicos, controla ingresos y egresos, rinde cuentas, recauda recursos y gestiona fondos para actividades o necesidades.","status":"VIGENTE","source_note":"N-27. VIGENTE_POR_CARTA. Carta Sección 2.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Responsabilidades","title":"Elección y duración de cargos","text":"Los cargos se eligen por votación entre residentes; duran 1 año calendario, con posibilidad de reelección.","status":"VIGENTE","source_note":"N-28. VIGENTE_POR_CARTA. Carta Sección 2. Reglas de reemplazo pendientes.","approval_note":"Confirmada por análisis documental como vigente por Carta; reglas de reemplazo pendientes de confirmación."},
    {"category":"Convivencia","title":"Respeto mutuo","text":"La sección de convivencia incluye \"Respeto mutuo\", pero el apartado no contiene texto normativo desarrollado.","status":"NO_VERIFICADO","source_note":"N-29. NO_VERIFICADO / incompleto. Carta Sección 3.1.","approval_note":"Texto normativo no desarrollado en la Carta."},
    {"category":"Convivencia","title":"Horarios de ruido","text":"De domingo a jueves: 10:00 a 21:00; viernes y sábado: 10:00 a 02:00. La redacción específica de domingo y festivos tiene una tensión interna pendiente.","status":"VIGENTE","source_note":"N-30. VIGENTE_POR_CARTA. Carta Sección 3.2. Inconsistencia interna pendiente (ver N-32).","approval_note":"Confirmada por análisis documental como vigente por Carta; tensión con N-32 registrada."},
    {"category":"Convivencia","title":"Fin de semana","text":"Viernes hasta 02:00 del sábado y sábado hasta 02:00 del domingo.","status":"VIGENTE","source_note":"N-31. VIGENTE_POR_CARTA. Carta Sección 3.2.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Convivencia","title":"Domingo y festivo","text":"Domingo después de las 09:00 hasta las 21:00; si es festivo, hasta las 02:00 del lunes festivo.","status":"NO_VERIFICADO","source_note":"N-32. NO_VERIFICADO por tensión con N-30. Carta Sección 3.2.","approval_note":"Pendiente de conciliación con N-30 (domingo a jueves 10:00-21:00 vs domingo después de 09:00)."},
    {"category":"Convivencia","title":"Festivo entre semana","text":"En días festivos en semana se permite desde el día anterior al festivo hasta las 02:00 del festivo.","status":"VIGENTE","source_note":"N-33. VIGENTE_POR_CARTA. Carta Sección 3.2. Aplicación exacta pendiente.","approval_note":"Confirmada por análisis documental como vigente por Carta; aplicación exacta pendiente."},
    {"category":"Convivencia","title":"Umbral de ruido no tolerable","text":"El ruido deja de considerarse tolerable cuando causa molestia intensa a residentes del piso en horas de madrugada, antes de las 02:00.","status":"VIGENTE","source_note":"N-34. VIGENTE_POR_CARTA. Carta Sección 3.2.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Convivencia","title":"Uso de espacios comunes","text":"Se debe dejar en óptimas condiciones el espacio después de usar cocina, baños, pasillos, sala de estar, comedor, terraza, zona de lavado y cuarto de aseo.","status":"VIGENTE","source_note":"N-35. VIGENTE_POR_CARTA. Carta Sección 3.3.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Convivencia","title":"Sanción general espacios comunes","text":"El incumplimiento de las normas de espacios comunes corresponde a la sanción respectiva.","status":"VIGENTE","source_note":"N-36. VIGENTE_POR_CARTA. Carta Sección 3, párrafo. Sanción concreta depende de N-15 a N-22.","approval_note":"Confirmada por análisis documental como vigente por Carta; sanción concreta remite a medidas correctivas."},
    {"category":"Quejas","title":"Debido proceso de quejas","text":"El orden indicado es: implicado; fiscalía o representante; redactar oficio; y en última instancia asamblea de piso.","status":"VIGENTE","source_note":"N-37. VIGENTE_POR_CARTA. Carta Sección 4.1.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Quejas","title":"Escalamiento de situaciones","text":"Si la situación se complica, pasa al fiscal general, Federación y asamblea general.","status":"VIGENTE","source_note":"N-38. VIGENTE_POR_CARTA. Carta Sección 4.2.","approval_note":"Confirmada por análisis documental como vigente por Carta."},
    {"category":"Seguridad","title":"Sustancias ilegales","text":"El texto visible dice que son permitidas en el piso siempre que no se afecte al prójimo ni la convivencia.","status":"NO_VERIFICADO","source_note":"N-39. NO_VERIFICADO / requiere validación institucional. Carta Sección 5.1-5.2.","approval_note":"Requiere validación visual del PDF y validación institucional antes de publicarse."},
    {"category":"Seguridad","title":"Protocolos de emergencia","text":"Se aplica el mismo protocolo que el de la casa. El documento de la casa aún debe incorporarse.","status":"PENDIENTE_CONFIRMACION","source_note":"N-40. PENDIENTE del protocolo de la casa. Carta Sección 5.3.","approval_note":"Pendiente de obtención y validación del protocolo de la casa."},
    {"category":"Seguridad","title":"Acceso a la residencia","text":"Se aplica el mismo protocolo que el de la casa. El documento de la casa aún debe incorporarse.","status":"PENDIENTE_CONFIRMACION","source_note":"N-41. PENDIENTE del protocolo de la casa. Carta Sección 5.4.","approval_note":"Pendiente de obtención y validación del protocolo de la casa."}
  ]
  $norms$::jsonb) loop
    select id into category_id from public.norm_categories where name = item->>'category';
    select n.id into existing_norm_id from public.norms n where n.title = item->>'title' limit 1;

    if existing_norm_id is null then
      insert into public.norms (category_id, title)
      values (category_id, item->>'title')
      returning id into existing_norm_id;
    end if;

    if not exists (select 1 from public.norm_versions nv where nv.norm_id = existing_norm_id and nv.version_number = 1) then
      insert into public.norm_versions (
        norm_id, version_number, text_content, status, source_document_id,
        source_note, approval_note
      ) values (
        existing_norm_id, 1, item->>'text', item->>'status', carta_id,
        item->>'source_note', item->>'approval_note'
      );
    end if;
  end loop;

  for item in select * from jsonb_array_elements($zones$
  [
    {"name":"Pasillo 1","description":"Habitaciones 217 a 234, comedor, gabinete de incendios y ventana hacia el coliseo."},
    {"name":"Pasillo 2","description":"Habitaciones 201 a 216, sala de estar, canecas, muebles y sillones."},
    {"name":"Duchas","description":"Limpieza de pisos, paredes, puertas, manijas, jaboneras, duchas, metales y rejilla."},
    {"name":"Baños","description":"Limpieza de superficies, orinales, puertas, bolsas e implementos."},
    {"name":"Cocina","description":"Limpieza bajo cajones y nevera, quemadores, hornillas, mesa y microondas."},
    {"name":"Zona de lavado","description":"Zona mencionada en la Carta sin instrucciones completas."},
    {"name":"Terraza","description":"Zona mencionada en la prelación y en actas con decisiones de alcance pendiente."},
    {"name":"Cuarto de aseo","description":"Debe entregarse organizado al terminar cada aseo."}
  ]
  $zones$::jsonb) loop
    select z.id into existing_zone_id from public.cleaning_zones z where z.name = item->>'name' limit 1;
    if existing_zone_id is null then
      insert into public.cleaning_zones (name, description, source_document_id, status)
      values (item->>'name', item->>'description', carta_id, 'borrador')
      returning id into existing_zone_id;
    end if;
  end loop;

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 20/08/2026', '2026-08-20', actas_id,
         'Cargos, caso de multa pendiente, modificación de Carta y cuotas.',
         'Registro histórico. La modificación de Carta aparece como fecha anunciada, no como texto aprobado.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 20/08/2026');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 18/02/2025', '2025-02-18', actas_id,
         'Caso Alex Viveros, nuevos ingresos, aseo de cocina y programación.',
         'Contiene una excepción individual y un plan piloto; no convierte automáticamente esas decisiones en normas generales.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 18/02/2025');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 10/10/2024', '2024-10-10', actas_id,
         'Caso 220, aseos, cambio de piso y rutas de actuación.',
         'Las condiciones documentadas corresponden al caso individual 220.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 10/10/2024');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 12/10/2023', '2023-10-12', actas_id,
         'Nueva organización de aseos, lavandería, terraza y llaves.',
         'El PDF contiene propuestas, consensos y contexto ambiguo sobre horarios; requiere revisión antes de publicar reglas.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 12/10/2023');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 28/08/2024', '2024-08-28', actas_id,
         'Terraza según Federación, comité de elecciones, caso Alex 203, elección de representantes.',
         'Decisiones sobre terraza, condonaciones individuales y cargos. No modifican normas generales.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 28/08/2024');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 19/09/2024', '2024-09-19', actas_id,
         'Terraza abierta con colaboradores, derogación cargo 220, nuevos representantes.',
         'Decisión de terraza ganada por mayoría; aplicación actual no determinada.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 19/09/2024');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 06/11/2025', '2025-11-06', actas_id,
         'Fiscal Camilo 204 por un año, plan piloto cocina, esquema nuevos ingresos rechazado.',
         'Reemplazo de fiscal aprobado; plan piloto cocina; propuesta 3/2/1 rechazada.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 06/11/2025');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 16/06/2026', '2026-06-16', actas_id,
         'Vacaciones: Antonio 233 lista de aseos; mejora implementos cocina; borrador Carta para 17/08/2026.',
         'Organización vacacional y agenda de modificación de Carta.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 16/06/2026');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 04/12/2025', '2025-12-04', actas_id,
         'Rifa 2026-1, cuotas, vacante Alejandro Mejía 218, rotación fiscalía/aseo en vacaciones.',
         'Decisiones financieras, de cargos y procedimiento vacacional.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 04/12/2025');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 19/03/2026', '2026-03-19', actas_id,
         'Remoción Yerlin, elección Julián 210 fiscal; nuevos ingresos Julián 234, Sergio 230, Juan Pablo 229.',
         'Remoción y elección de fiscal; nuevos ingresos con proyecto de integración.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 19/03/2026');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 08/11/2023', '2023-11-08', actas_id,
         'Ruido: multas fijas/variables, propuestas 6/5/4/3 aseos, ornato/aseo de piso, votaciones.',
         'Propuestas y votaciones incompletas; no hay resolución normativa completa.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 08/11/2023');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 10/03/2023', '2023-03-10', actas_id,
         'Ornato: fechas, bloques 2h con extensión, horarios 09-11/10-12, cantidades 5/7 aseos, reglas de llegada.',
         'Propuestas y votaciones para evento específico de ornato; no regla general.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 10/03/2023');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 13/02/2023', '2023-02-13', actas_id,
         'Vacaciones: asamblea final, delegado, mismas normas.',
         'Procedimiento documentado para período vacacional.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 13/02/2023');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 07/04/2023', '2023-04-07', actas_id,
         'Claustros: solo bicicletas y neveras; persistencia genera 3 multas.',
         'Decisión/nota incompleta; no texto normativo suficiente.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 07/04/2023');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 04/09/2023', '2023-09-04', actas_id,
         'Cámaras/vigilancia: cámara 6 votos, vigilante 6, ninguna 7; sin mayoría.',
         'Votación sin decisión ganadora.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 04/09/2023');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 20/09/2023', '2023-09-20', actas_id,
         'Cierre terraza por responsabilidad del Segundo Piso; solicitud llaves a representantes.',
         'Decisión informada operativa; no modifica Carta.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 20/09/2023');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 16/10/2023', '2023-10-16', actas_id,
         'Programación: listados modificados desde 17/10, descansos, no botar listas de aseo.',
         'Decisión/procedimiento operativo de programación.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 16/10/2023');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 21/08/2025', '2025-08-21', actas_id,
         'Representante de aseo: multa 3 aseos por incumplimiento; nota posterior dice 2 aseos.',
         'Contradicción interna en la misma acta; pendiente de confirmación.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 21/08/2025');

  insert into public.assembly_minutes (title, meeting_date, document_id, topics, observations, status)
  select 'Asamblea del 21/10/2025', '2025-10-21', actas_id,
         'Elección representante de aseo: Alexis 227 obtiene 10 votos vs Cristian 232.',
         'Reemplazo de cargo por votación.',
         'publicado'
  where not exists (select 1 from public.assembly_minutes where title = 'Asamblea del 21/10/2025');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Plan piloto de aseo de cocina',
         'Desde el lunes 24 de febrero, el aseo de cocina sería realizado por dos residentes durante dos semanas; el acta dice que se aprobó por unanimidad.',
         'DECISION_APROBADA', 'TEMPORAL',
         'Acta del 18/02/2025. No se convierte en regla permanente sin confirmación posterior.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 18/02/2025'
    and not exists (select 1 from public.decisions where title = 'Plan piloto de aseo de cocina');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, affected_person_note, source_note)
  select a.id, 'Excepción individual del caso 220',
         'Se aprobaron 20 aseos, $65.000, $15.000 y 4 ornatos; se escogieron dos semanas de 10 aseos, con restricciones de miércoles y cocina dominical.',
         'EXCEPCION_INDIVIDUAL', 'INDIVIDUAL', 'Residente de la habitación 220',
         'Acta del 10/10/2024. No es una modificación general del máximo de 8 aseos.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 10/10/2024'
    and not exists (select 1 from public.decisions where title = 'Excepción individual del caso 220');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, affected_person_note, source_note)
  select a.id, 'Excepción individual de Alex Viveros',
         'La propuesta de recibir $160.000 y asistencia a ornatos obtuvo 11 votos a favor y 5 en contra, con fechas de pago y ornato indicadas en el acta.',
         'EXCEPCION_INDIVIDUAL', 'INDIVIDUAL', 'Alex Viveros',
         'Acta del 18/02/2025. Está en tensión con la prohibición general de pagar multas y no se generaliza.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 18/02/2025'
    and not exists (select 1 from public.decisions where title = 'Excepción individual de Alex Viveros');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Borrador de modificación de Carta',
         'Se registra una fecha para modificación de Carta Interna el 03/09/2026; no se aporta el texto aprobado ni su alcance.',
         'PENDIENTE_CONFIRMACION', 'GENERAL',
         'Acta del 20/08/2026. No crea una versión normativa.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 20/08/2026'
    and not exists (select 1 from public.decisions where title = 'Borrador de modificación de Carta');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Nuevos cargos 20/08/2026',
         'Se anuncia aseo: Cesar 214; representante: Iván 219; fiscal: Yerlin 213; tesorería: Juan Araujo 223.',
         'INFORMACION', 'GENERAL',
         'Actas, 20/08/2026. Resultado de asamblea, no modificación de norma.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 20/08/2026'
    and not exists (select 1 from public.decisions where title = 'Nuevos cargos 20/08/2026');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Multa pendiente Breyner y Aurelio',
         'Queda pendiente reunión entre representantes y fiscalía para poner multa a Breyner y Aurelio; fecha sin definir.',
         'PENDIENTE_CONFIRMACION', 'INDIVIDUAL',
         'Actas, 20/08/2026. Pendiente, no decisión sancionatoria.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 20/08/2026'
    and not exists (select 1 from public.decisions where title = 'Multa pendiente Breyner y Aurelio');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Organización vacacional Antonio 233',
         'Antonio 233 realizará la lista de aseos en vacaciones; se menciona Julian 234.',
         'DECISION_APROBADA', 'TEMPORAL',
         'Actas, 16/06/2026. Asignación/organización para período vacacional.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 16/06/2026'
    and not exists (select 1 from public.decisions where title = 'Organización vacacional Antonio 233');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Borrador Carta para 17/08/2026',
         'Se fija borrador para modificación de Carta Interna el 17/08/2026.',
         'PENDIENTE_CONFIRMACION', 'GENERAL',
         'Actas, 16/06/2026. Agenda, no texto aprobado.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 16/06/2026'
    and not exists (select 1 from public.decisions where title = 'Borrador Carta para 17/08/2026');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Mejora implementos cocina',
         'Se plantea mejorar limpieza de cocina y adquirir mejores implementos: trapeadores, baldes y jabón.',
         'INFORMACION', 'GENERAL',
         'Actas, 16/06/2026. Recomendación operativa.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 16/06/2026'
    and not exists (select 1 from public.decisions where title = 'Mejora implementos cocina');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, affected_person_note, source_note)
  select a.id, 'Remoción Yerlin y elección Julián 210 fiscal',
         'Yerlin solicita remoción; la asamblea aprueba por unanimidad; se elige Julián de habitación 210. El tiempo de Yerlin no cuenta y debe cumplir un año en otro cargo futuro.',
         'DECISION_APROBADA', 'INDIVIDUAL', 'Yerlin 213 y Julián 210',
         'Actas, 19/03/2026. Excepción de cargo; tiempo anterior no cuenta.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 19/03/2026'
    and not exists (select 1 from public.decisions where title = 'Remoción Yerlin y elección Julián 210 fiscal');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, affected_person_note, source_note)
  select a.id, 'Nuevos ingresos Julián 234, Sergio 230, Juan Pablo 229',
         'Se presentan Julián 234, Sergio 230 y Juan Pablo 229; proyecto de integración para abril/mayo; cuotas en dos fechas.',
         'INFORMACION', 'INDIVIDUAL', 'Julián 234, Sergio 230, Juan Pablo 229',
         'Actas, 19/03/2026. Información/acuerdo operativo de nuevos ingresos.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 19/03/2026'
    and not exists (select 1 from public.decisions where title = 'Nuevos ingresos Julián 234, Sergio 230, Juan Pablo 229');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Rifa y cuotas 2026-1',
         'Se decide implementar una rifa al inicio de 2026-1; compromisos de cuota con límite 02/03/2026; cuota de $5.000 con límite 12/12/2025.',
         'DECISION_APROBADA', 'TEMPORAL',
         'Actas, 04/12/2025. Decisión financiera histórica.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 04/12/2025'
    and not exists (select 1 from public.decisions where title = 'Rifa y cuotas 2026-1');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, affected_person_note, source_note)
  select a.id, 'Alejandro Mejía 218 asume vacante',
         'Por salida de Alexandro 227, Alejandro Mejía 218 asume por decisión propia y aprobación del piso.',
         'DECISION_APROBADA', 'INDIVIDUAL', 'Alejandro Mejía 218',
         'Actas, 04/12/2025. Excepción de cargo por vacante.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 04/12/2025'
    and not exists (select 1 from public.decisions where title = 'Alejandro Mejía 218 asume vacante');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Rotación fiscalía y aseo en vacaciones',
         'Residentes durante vacaciones se hacen cargo de fiscalía y representante de aseo y rotan por acuerdo mutuo.',
         'DECISION_APROBADA', 'TEMPORAL',
         'Actas, 04/12/2025. Regla temporal para período vacacional.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 04/12/2025'
    and not exists (select 1 from public.decisions where title = 'Rotación fiscalía y aseo en vacaciones');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, affected_person_note, source_note)
  select a.id, 'Camilo Gallo 204 asume fiscalía por un año',
         'Se acuerda por unanimidad que Camilo Gallo 204 asuma fiscalía por un año al finalizar Anyelo 211.',
         'DECISION_APROBADA', 'INDIVIDUAL', 'Camilo Gallo 204',
         'Actas, 06/11/2025. Reemplazo de fiscal por un año según acta.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 06/11/2025'
    and not exists (select 1 from public.decisions where title = 'Camilo Gallo 204 asume fiscalía por un año');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, affected_person_note, source_note)
  select a.id, 'Condonación 2 aseos Aurelio 228 comité elecciones',
         'Se condonan 2 aseos a Aurelio 228 por ser representante del comité de elecciones.',
         'EXCEPCION_INDIVIDUAL', 'INDIVIDUAL', 'Aurelio 228',
         'Actas, 28/08/2024. Excepción individual aprobada.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 28/08/2024'
    and not exists (select 1 from public.decisions where title = 'Condonación 2 aseos Aurelio 228 comité elecciones');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Terraza Segundo Piso martes según Federación',
         'Informe de Federación: todos los pisos se encargan de la terraza y Segundo Piso sería el martes.',
         'INFORME', 'GENERAL',
         'Actas, 28/08/2024. Informe externo; no modificación de norma.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 28/08/2024'
    and not exists (select 1 from public.decisions where title = 'Terraza Segundo Piso martes según Federación');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, affected_person_note, source_note)
  select a.id, 'Condonación Alex 203: 75% $112.000 y 25% aseos',
         'Condonación: 75% $112.000 y 25% aseos para el caso Alex 203.',
         'EXCEPCION_INDIVIDUAL', 'INDIVIDUAL', 'Alex 203',
         'Actas, 28/08/2024. Excepción individual; en tensión con prohibición de pagar multas.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 28/08/2024'
    and not exists (select 1 from public.decisions where title = 'Condonación Alex 203: 75% $112.000 y 25% aseos');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, affected_person_note, source_note)
  select a.id, 'Elección representantes 28/08/2024: Cristian 220, Oscar 226, Camilo 204, tesorero Manuel 202',
         'Se eligen Cristian 220, Oscar 226, Camilo 204 y tesorero Manuel 202.',
         'DECISION_APROBADA', 'INDIVIDUAL', 'Cristian 220, Oscar 226, Camilo 204, Manuel 202',
         'Actas, 28/08/2024. Decisión/resultado electoral de cargos.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 28/08/2024'
    and not exists (select 1 from public.decisions where title = 'Elección representantes 28/08/2024: Cristian 220, Oscar 226, Camilo 204, tesorero Manuel 202');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Reducción aseo por salud mental',
         'Se registra reducción de aseo por asistencia a eventos de salud mental.',
         'INFORMACION', 'INDIVIDUAL',
         'Actas, 28/08/2024. Información/acuerdo no detallado; posible excepción.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 28/08/2024'
    and not exists (select 1 from public.decisions where title = 'Reducción aseo por salud mental');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Terraza abierta colaboración interesados',
         'Se presentan dos propuestas: terraza abierta con colaboración de interesados y dos aseos por semana, o cerrada con horarios de asamblea general; la primera indica "ganó por mayoría".',
         'DECISION_APROBADA', 'GENERAL',
         'Actas, 28/08/2024 (bloque 19/09/2024). Votación aprobada, aplicación actual no determinada.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 19/09/2024'
    and not exists (select 1 from public.decisions where title = 'Terraza abierta colaboración interesados');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, affected_person_note, source_note)
  select a.id, 'Derogación cargo 220; Wilmar 224 representante; Angelo vicefiscal',
         'Se deroga cargo de representante al 220; Wilmar 224 es nuevo representante; Angelo toma voluntariamente vicefiscalía.',
         'DECISION_APROBADA', 'INDIVIDUAL', 'Habitación 220, Wilmar 224, Angelo',
         'Actas, 28/08/2024 (bloque 19/09/2024). Excepción y reemplazo de cargos.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 19/09/2024'
    and not exists (select 1 from public.decisions where title = 'Derogación cargo 220; Wilmar 224 representante; Angelo vicefiscal');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Esquema nuevos ingresos 3/2/1 rechazado',
         'Se propone volver a 3 aseos primer semestre, 2 segundo y 1 tercero; 2 votos a favor y 15 en contra.',
         'DECISION_RECHAZADA', 'GENERAL',
         'Actas, 18/02/2025. Propuesta rechazada; no modifica la Carta.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 18/02/2025'
    and not exists (select 1 from public.decisions where title = 'Esquema nuevos ingresos 3/2/1 rechazado');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Nadie puede firmar su propio aseo',
         'En un punto posterior se registra "nadie puede firmar su propio aseo".',
         'DECISION_APROBADA', 'GENERAL',
         'Actas, 06/11/2025 según orden del PDF. Regla de verificación en acta que complementa Carta.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 06/11/2025'
    and not exists (select 1 from public.decisions where title = 'Nadie puede firmar su propio aseo');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Propuesta reducción lavandería y terraza 12/10/2023',
         'Se propone reducción de 4 a 2 aseos en lavandería y terraza y eliminar lavandería hasta Federación; el texto de consensos repite eliminación temporal.',
         'PROPUESTA', 'TEMPORAL',
         'Actas, 12/10/2023. Propuesta y consenso textual; alcance temporal no determinado.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 12/10/2023'
    and not exists (select 1 from public.decisions where title = 'Propuesta reducción lavandería y terraza 12/10/2023');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Lunes y jueves terraza y lavandería 12/10/2023',
         'Se registra "lunes y jueves terraza y lavandería" en el mismo acta.',
         'INFORMACION', 'TEMPORAL',
         'Actas, 12/10/2023. Registro ambiguo; contexto no permite saber si es regla aprobada o anotación de votación.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 12/10/2023'
    and not exists (select 1 from public.decisions where title = 'Lunes y jueves terraza y lavandería 12/10/2023');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Regla llaves y candados',
         'La persona que pide llaves debe devolverlas y anotarse a quién se prestaron; Angelo debe cambiar candados por llaves extraviadas.',
         'DECISION_APROBADA', 'GENERAL',
         'Actas, 12/10/2023. Consenso sobre uso de bienes.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 12/10/2023'
    and not exists (select 1 from public.decisions where title = 'Regla llaves y candados');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Propuestas ruido 08/11/2023',
         'Se discuten multa fija/variable, 3 aseos por multa, 6/5/4/3 aseos y ornato/aseo de piso; se registran votaciones.',
         'VOTACION', 'GENERAL',
         'Actas, 08/11/2023. Propuestas y votaciones; no resolución normativa completa.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 08/11/2023'
    and not exists (select 1 from public.decisions where title = 'Propuestas ruido 08/11/2023');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Programación listados desde 17/10/2023',
         'Se modifican listados desde 17 de octubre, comienzan descansos y no se pueden botar listas de aseo.',
         'DECISION_APROBADA', 'TEMPORAL',
         'Actas, 16/10/2023. Decisión/procedimiento operativo de programación.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 16/10/2023'
    and not exists (select 1 from public.decisions where title = 'Programación listados desde 17/10/2023');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Vacaciones: asamblea final, delegado, mismas normas',
         'Se dice que debe realizarse asamblea final, quedar a cargo representante/delegado y aplicarse mismas normas.',
         'DECISION_APROBADA', 'TEMPORAL',
         'Actas, 13/02/2023. Procedimiento potencial para período vacacional.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 13/02/2023'
    and not exists (select 1 from public.decisions where title = 'Vacaciones: asamblea final, delegado, mismas normas');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Claustros: solo bicicletas y neveras',
         'Solo se permiten bicicletas y neveras; hasta próximos claustros no se botan cosas, pero quien persista tendrá 3 multas.',
         'DECISION_APROBADA', 'GENERAL',
         'Actas, 07/04/2023. Decisión/nota incompleta; posible regla para claustros.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 07/04/2023'
    and not exists (select 1 from public.decisions where title = 'Claustros: solo bicicletas y neveras');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Ornato 10/03/2023: fechas, horarios, cantidades',
         'Se votan fechas, bloques de 2 horas con extensión de 1 hora, horarios 09:00-11:00 o 10:00-12:00, y cantidades 5 o 7 aseos; se registra llegada 5 minutos/10 minutos y multas.',
         'VOTACION', 'TEMPORAL',
         'Actas, 10/03/2023. Propuestas/votaciones incompletas para evento específico de ornato.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 10/03/2023'
    and not exists (select 1 from public.decisions where title = 'Ornato 10/03/2023: fechas, horarios, cantidades');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Cámaras/vigilancia sin mayoría',
         'Cámara 6 votos, vigilante 6, ninguna 7; no hay decisión ganadora.',
         'VOTACION', 'GENERAL',
         'Actas, 04/09/2023. Votación sin mayoría; no hay decisión.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 04/09/2023'
    and not exists (select 1 from public.decisions where title = 'Cámaras/vigilancia sin mayoría');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Cierre terraza 20/09/2023',
         'Se cierra la terraza porque Segundo Piso se hace responsable y se solicitan llaves a representantes.',
         'DECISION_APROBADA', 'TEMPORAL',
         'Actas, 20/09/2023. Decisión informada operativa; no modifica Carta.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 20/09/2023'
    and not exists (select 1 from public.decisions where title = 'Cierre terraza 20/09/2023');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Representante de aseo: multa 3 o 2 aseos 21/08/2025',
         'Se aprobó por consenso multar con tres aseos por incumplimiento del cargo; una nota dice dos aseos en caso de fallas.',
         'DECISION_APROBADA', 'GENERAL',
         'Actas, 21/08/2025. Contradicción interna: dos cantidades en mismo tema; pendiente de confirmación cuál quedó vigente.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 21/08/2025'
    and not exists (select 1 from public.decisions where title = 'Representante de aseo: multa 3 o 2 aseos 21/08/2025');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, affected_person_note, source_note)
  select a.id, 'Elección representante de aseo Alexis 227',
         'Se vota entre Cristian 232 y Alexis 227; Alexis obtiene 10 votos y gana.',
         'DECISION_APROBADA', 'INDIVIDUAL', 'Alexis 227',
         'Actas, 10/10/2024 (bloque 21/10/2025 en PDF). Reemplazo de cargo por votación.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 21/10/2025'
    and not exists (select 1 from public.decisions where title = 'Elección representante de aseo Alexis 227');

  insert into public.decisions (assembly_id, title, detail, decision_type, scope, source_note)
  select a.id, 'Excepción caso 220: restricciones programación',
         'Se elige 2 semanas de 10 aseos; no miércoles; baños/cocina; no cocina domingo; firmas por fiscalía general, fiscalía de piso y representantes; incumplir escala a Comité de Adjudicaciones.',
         'EXCEPCION_INDIVIDUAL', 'INDIVIDUAL',
         'Actas, 10/10/2024. Fechas 14-27/10/2024. Excepción individual detallada.'
  from public.assembly_minutes a
  where a.title = 'Asamblea del 10/10/2024'
    and not exists (select 1 from public.decisions where title = 'Excepción caso 220: restricciones programación');

end;
$$;
