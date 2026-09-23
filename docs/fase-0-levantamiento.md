# SegundoPiso - Fase 0: levantamiento y analisis documental

> **Validacion documental ampliada:** este documento conserva el resumen inicial.
> Las matrices detalladas y con precedencia para la planificacion son:
> [matriz-normativa.md](matriz-normativa.md),
> [matriz-contradicciones.md](matriz-contradicciones.md),
> [matriz-decisiones-actas.md](matriz-decisiones-actas.md),
> [levantamiento-aseos.md](levantamiento-aseos.md) y
> [matriz-medidas-correctivas.md](matriz-medidas-correctivas.md). Cuando el
> resumen y una matriz difieran en clasificacion, prevalece la matriz detallada.

## Alcance y metodo

Fuentes revisadas:

1. `Carta Interna 2do Piso RGSB.pdf`, fuente normativa base.
2. `Asambleas Piso 2.pdf`, fuente historica de actas, propuestas, decisiones,
   informes y listas de asistencia.

La extraccion de texto presenta caracteres danados en algunas palabras. Las citas
que requieren lectura exacta deben validarse visualmente contra el PDF original
antes de publicarse como contenido operativo. Una mencion en un acta no se
convierte automaticamente en norma vigente.

Estados usados:

- `VIGENTE_POR_CARTA`: regla de la Carta sin evidencia suficiente de reemplazo.
- `DECISION_DE_ACTA`: decision localizada en un acta, sin afirmar vigencia general.
- `PENDIENTE_CONFIRMACION`: contradiccion, alcance incierto o texto incompleto.
- `HISTORICA`: hecho o decision sin evidencia de vigencia actual.

## A. Normas identificadas

| Norma | Categoria | Fuente | Estado | Observaciones |
|---|---|---|---|---|
| La limpieza de zonas comunes es responsabilidad de todos | Aseo | Carta, Seccion 1 | VIGENTE_POR_CARTA | Confirmar modificaciones posteriores. |
| Pasillo 1: habitaciones 217 a 234, comedor, gabinete de incendios y ventana hacia el coliseo; barrer y trapear dos veces | Aseo | Carta, Seccion 1 | VIGENTE_POR_CARTA | Validar alcance exacto de la zona. |
| Pasillo 2: habitaciones 201 a 216, sala de estar, tapas de canecas, muebles y sillones; barrer y trapear dos veces | Aseo | Carta, Seccion 1 | VIGENTE_POR_CARTA | Confirmar si sala y comedor son zonas distintas. |
| Duchas: limpiar pisos, paredes, puertas, manijas, jaboneras, duchas, metales y rejilla; dejar una ducha libre durante el aseo | Aseo | Carta, Seccion 1 | VIGENTE_POR_CARTA | La Carta define productos y excepcion de ducha libre. |
| Banos: limpiar superficies, orinales y puertas; barrer y trapear dos veces; cambiar bolsas y limpiar implementos | Aseo | Carta, Seccion 1 | VIGENTE_POR_CARTA | Regla operativa explicita. |
| Cocina: limpiar bajo cajones y nevera, quemadores, mesa y microondas; retirar utensilios | Aseo | Carta, Seccion 1 | VIGENTE_POR_CARTA | Zona de lavado sin instrucciones completas. |
| Piso seco y cuarto de aseo organizado al terminar | Aseo | Carta, Seccion 1 | VIGENTE_POR_CARTA | Una expresion del PDF requiere validacion visual. |
| Nuevo residente: 3 aseos semanales durante 52 semanas | Aseo / ingreso | Carta, Seccion 1 | PENDIENTE_CONFIRMACION | Actas presentan esquemas alternativos. |
| Prelacion: cocina, banos y zona de lavado cuando sea lunes; luego duchas, pasillos, terraza y zona de lavado | Aseo | Carta, Seccion 1 | PENDIENTE_CONFIRMACION | Hay acuerdos posteriores sobre terraza/lavanderia. |
| Orden: multados, nuevos ingresos, acompanantes y residentes por orden numerico | Aseo | Carta, Seccion 1 | VIGENTE_POR_CARTA | Confirmar excepciones y descansos. |
| No cumplir un aseo: 3 aseos adicionales y repetir el mismo aseo | Medida correctiva | Carta, Seccion 1 | VIGENTE_POR_CARTA | Actas tienen cantidades distintas. |
| Entregar hasta una hora tarde: 1 aseo adicional y repetir el mismo aseo; permiso previo del fiscal por causa justa | Medida correctiva | Carta, Seccion 1 | VIGENTE_POR_CARTA | Falta procedimiento de evidencia. |
| Firmar sin cumplimiento estricto: 3 aseos adicionales y se considera no entregado | Medida correctiva | Carta, Seccion 1 | VIGENTE_POR_CARTA | Debe constar quien revisa, hora y habitacion. |
| Maximo de 8 aseos por semana | Aseo | Carta, Seccion 1 | PENDIENTE_CONFIRMACION | En tension con el caso 220. |
| No se pueden pagar multas; solo se omiten aseos por semanas academicas | Medida correctiva | Carta, Seccion 1 | PENDIENTE_CONFIRMACION | Actas registran pagos y excepciones. |
| Acompanante con 3 noches semanales: un aseo adicional | Acompanantes | Carta, Seccion 1 | VIGENTE_POR_CARTA | Falta como verificar permanencia. |
| Ruido: domingo a jueves 10:00-21:00; viernes y sabado 10:00-02:00 | Convivencia | Carta, Seccion 3 | PENDIENTE_CONFIRMACION | Redaccion de domingo/festivos necesita conciliacion. |
| Ruido no tolerable cuando causa molestia intensa en madrugada | Convivencia | Carta, Seccion 3 | VIGENTE_POR_CARTA | Criterio abierto, requiere prueba. |
| Dejar en optimas condiciones cocina, banos, pasillos, sala, comedor, terraza, zona de lavado y cuarto de aseo | Espacios comunes | Carta, Seccion 3 | VIGENTE_POR_CARTA | Regla general. |
| Quejas: implicado, fiscalia/representante, oficio y asamblea de piso; luego fiscal general, Federacion y asamblea general | Quejas | Carta, Seccion 4 | VIGENTE_POR_CARTA | Procedimiento base. |
| Protocolos de emergencia y acceso: mismo protocolo de la casa | Seguridad | Carta, Seccion 5 | PENDIENTE_CONFIRMACION | Falta documento de la casa. |
| Todos deben ocupar cargo representativo salvo excepcion de asamblea | Responsabilidades | Carta, Seccion 2 | PENDIENTE_CONFIRMACION | Actas muestran cargos temporales y remociones. |
| Tres representantes, representante de aseo, fiscal y tesorero; duracion anual con posible reeleccion | Responsabilidades | Carta, Seccion 2 | PENDIENTE_CONFIRMACION | Actas agregan vicefiscal y rotaciones. |

## B. Decisiones de asamblea

| Fecha | Decision o hecho | Personas afectadas | Modifica norma | Estado |
|---|---|---|---|---|
| 20/08/2026 | Nuevos cargos: aseo 214, representante 219, fiscal 213 y tesoreria 223 | Piso | No determinado | DECISION_DE_ACTA |
| 20/08/2026 | Reunion pendiente para multa a Breyner y Aurelio | 222 y persona no identificada | No | PENDIENTE_CONFIRMACION |
| 16/06/2026 | Residentes en vacaciones: Antonio 233 realiza lista de aseos; se menciona Julian 234 | Vacaciones | Posible procedimiento | PENDIENTE_CONFIRMACION |
| 19/03/2026 | Remocion de Yerlin y eleccion de Julian 210 | 213 y 210 | Cargo | DECISION_DE_ACTA |
| 19/03/2026 | Nuevos ingresos: Julian 234, Sergio 230 y Juan Pablo 229; proyecto de integracion | Nuevos ingresos | No determinado | DECISION_DE_ACTA |
| 04/12/2025 | Rifa, compromisos de cuota y cuota adicional de $5.000 | Residentes | Financiera | HISTORICA |
| 04/12/2025 | Alejandro Mejia 218 asume vacante; rotacion de fiscalia/aseo en vacaciones | 218 y residentes en vacaciones | Cargos | DECISION_DE_ACTA |
| 18/02/2025 | Aseo de cocina por dos residentes como plan piloto de dos semanas | Asignados a cocina | Temporal | PENDIENTE_CONFIRMACION |
| 18/02/2025 | Alex Viveros: se acepta pago de $160.000 mas ornato | Alex Viveros | Excepcion individual | HISTORICA |
| 21/10/2025 | Alexis 227 elegido representante de aseo | 227 | Cargo | HISTORICA |
| 10/10/2024 | Caso 220: 20 aseos, $65.000, $15.000 y 4 ornatos; dos semanas de 10 aseos | 220 | Excepcion individual | HISTORICA / PENDIENTE_CONFIRMACION |
| 10/10/2024 | Caso 220: no cocina los domingos y se respeta el miercoles | 220 | Excepcion individual | HISTORICA |
| 19/09/2024 | Terraza abierta con limpieza coordinada con interesados, dos veces por semana | Piso e interesados | Operativa | PENDIENTE_CONFIRMACION |
| 19/09/2024 | Se deroga cargo del 220; Wilmar 224 representante; Angelo vicefiscal | Personas indicadas | Cargos | HISTORICA |
| 28/08/2024 | Dos aseos condonados a Aurelio 228 por cargo de comite de elecciones | 228 | Excepcion | HISTORICA |
| 28/08/2024 | Terraza: segundo piso se hace cargo el martes, segun Federacion | Piso | Horario | PENDIENTE_CONFIRMACION |
| 28/08/2024 | Alex 203: 75% $112.000 y 25% aseos | 203 | Excepcion individual | HISTORICA / PENDIENTE_CONFIRMACION |
| 07/04/2023 | Solo bicicletas y neveras en claustros; persistencia puede generar 3 multas | Residentes | Posible regla | PENDIENTE_CONFIRMACION |
| 10/03/2023 | Ornato: fechas, bloques de 2 horas, extension y reglas de llegada | Participantes | Evento especifico | HISTORICA |
| 13/02/2023 | Aseos en vacaciones: asamblea final, delegado y mismas normas | Vacaciones | Procedimiento | PENDIENTE_CONFIRMACION |

## C. Normas modificadas

No hay evidencia suficiente para declarar una modificacion general vigente. Estos
son candidatos que deben mantenerse como propuesta, excepcion o pendiente:

| Norma original | Modificacion observada | Acta/fecha | Estado |
|---|---|---|---|
| Cantidad de aseos de nuevos residentes | Se discuten esquemas 3 semanales y 3/2/1 por semestre | Carta; 18/02/2025; 12/10/2023 | PENDIENTE_CONFIRMACION |
| Aseo de cocina | Dos residentes durante plan piloto | 18/02/2025 | PENDIENTE_CONFIRMACION |
| Medidas por incumplimiento | Propuestas de 3, 4, 5 o 6 aseos; ornato y pagos | 08/11/2023; 10/03/2023; 18/02/2025 | PENDIENTE_CONFIRMACION |
| Aseo de lavanderia y terraza | Eliminacion temporal, lunes/jueves y martes en actas distintas | 12/10/2023; 28/08/2024 | PENDIENTE_CONFIRMACION |
| Horario de aseos/ornatos | 1 hora o 1:30 con media hora de extension; 09:00-11:00 o 10:00-12:00 | 08/11/2023; 10/03/2023 | PENDIENTE_CONFIRMACION |
| Ruido | Ratificacion de limites 21:00 y 02:00 con redacciones variables | Carta; 08/11/2023 | PENDIENTE_CONFIRMACION |
| Cargos | Remociones, reemplazos, prueba de un mes y rotacion vacacional | 2024-2026 | HISTORICA / PENDIENTE_CONFIRMACION |

## D. Sistema de aseos

### Zonas, tareas e instrucciones

- Pasillo 1: habitaciones 217-234, comedor, gabinete de incendios y ventana al
  coliseo.
- Pasillo 2: habitaciones 201-216, sala, tapas de canecas, muebles y sillones.
- Duchas: pisos, paredes, puertas, manijas, jaboneras, duchas, metales y rejilla;
  conservar una ducha libre salvo el cierre del aseo.
- Banos: superficies, orinales, puertas de aluminio, bolsas y elementos usados.
- Cocina: bajo cajones y nevera, quemadores, hornillas, mesa y microondas; retirar
  utensilios de mesa roja y cocina.
- Zona de lavado/lavanderia, terraza y cuarto de aseo: aparecen como zonas, pero
  la Carta no contiene instrucciones completas para todas.

### Frecuencia, responsables y verificacion

La Carta establece 3 aseos semanales durante 52 semanas para un nuevo residente,
orden de asignacion por multados/nuevos/acompanantes/orden numerico y descansos
segun el ultimo descanso. Un acompanante de 3 noches agrega un aseo.

Las actas agregan listas, descansos, rotacion en vacaciones, plan piloto de cocina,
terraza/lavanderia, revisores y excepciones individuales. Una acta indica que nadie
debe firmar su propio aseo. La Carta exige nombre, hora y habitacion legibles del
revisor. Todo aseo debe entregar organizado el cuarto de aseo.

## E. Medidas correctivas

Respaldadas directamente por la Carta: 3 aseos adicionales por no cumplir y repetir
el aseo; 1 adicional por entrega hasta una hora tarde y repeticion; permiso previo
del fiscal por causa justa; 3 adicionales por verificar y firmar incorrectamente;
maximo de 8 aseos semanales; no pagar multas; y debido proceso de queja y
escalamiento.

Respaldadas por actas pero sin vigencia general confirmada: ornato y aseo de piso
por ruido; 20 aseos y pagos del caso 220; 75% dinero/25% aseos para Alex 203;
condonaciones por cargos; interes del 10% y aseo por mora; y notificacion a
Federacion al cuarto formato de incumplimiento.

Cada medida debe registrar tipo, fuente, alcance, inicio, fin, aprobacion, estado y
evidencia. Una medida historica no debe presentarse como vigente.

## F. Responsabilidades

La Carta identifica tres representantes de piso, representante de aseo, fiscal y
tesorero. Sus tareas son coordinar actividades y quejas, representar ante
Federacion, gestionar implementos y mantenimiento, verificar transparencia y
resolver conflictos, y gestionar ingresos, egresos, recaudo y rendicion.

Las actas mencionan vicefiscal, adjudicador, fiscal general, Federacion, comite de
elecciones y delegados vacacionales. El sistema debe separar cargos del Segundo
Piso, de la casa/Federacion y temporales. Las personas y habitaciones de las actas
son historicas hasta que se confirme la lista actual.

## G. Horarios

- Ruido: domingo-jueves 10:00-21:00; viernes-sabado 10:00-02:00, segun Carta.
- Carta: viernes hasta 02:00 del sabado y sabado hasta 02:00 del domingo; hay
  redaccion adicional para domingos y festivos que requiere aclaracion.
- Peticiones al representante de aseo: domingo 19:00-22:00; lista hasta 22:30.
- Aseo/ornato en actas: 09:00-11:00 o 10:00-12:00; 1 hora o 1:30 con extension.
- Terraza/lavanderia: lunes y jueves en un acta; martes para terraza en otra.
- Claustro mencionado: 15/11 a las 21:00.

## H. Documentos

| Documento | Funcion | Tratamiento |
|---|---|---|
| Carta Interna 2do Piso RGSB | Reglas de limpieza, convivencia, cargos, quejas y seguridad | Documento normativo versionado. |
| Asambleas Piso 2 | Reuniones, decisiones, propuestas, votaciones y asistencia | Actas historicas inmutables. |
| Acta firmada de responsables de residentes especiales | Evidencia mencionada en acta 28/08/2024 | Falta localizar original. |
| Protocolo de la casa | Referencia de emergencia y acceso | Falta obtener. |
| Actas de Federacion/asamblea general | Fuentes externas citadas | Falta incorporar copia verificable. |
| Formatos de incumplimiento | Evidencia mencionada | Falta localizar y versionar. |

## I. Contradicciones

1. 3 aseos semanales para nuevos residentes frente a esquemas 3/2/1 y otras
   cantidades de actas.
2. Maximo de 8 aseos semanales frente a 10 por semana en el caso 220.
3. Prohibicion de pagar multas frente a pagos y combinaciones de dinero/aseos.
4. Horarios de ruido con domingo-jueves 21:00, viernes-sabado 02:00 y redacciones
   distintas para festivos.
5. Terraza/lavanderia con eliminacion temporal, lunes/jueves y martes en actas
   distintas.
6. La Carta menciona 34 residentes, pero las listas no permiten confirmar ocupacion,
   residentes especiales ni acompanantes actuales.
7. Cargos anuales en la Carta frente a pruebas, reemplazos y rotaciones en actas.
8. El apartado de sustancias ilegales requiere validacion visual y juridica antes de
   publicarse: el texto extraido parece permitirlas bajo una condicion.
9. La zona de lavado carece de instrucciones completas en la Carta.
10. Hay encabezados y fechas ambiguas en algunas actas.

## J. Informacion faltante

- Version aprobada y vigente de la Carta, incluyendo cualquier modificacion de
  septiembre de 2026.
- Actas originales legibles y firmadas, especialmente las que modificarian normas.
- Protocolo de la casa para emergencia y acceso.
- Actas de Federacion y asamblea general citadas.
- Lista actual de habitaciones, personas, residentes especiales, acompanantes y
  responsables, con autorizacion para tratar datos.
- Horario vigente de entrega/revision de aseos y excepciones.
- Catalogo vigente de zonas, tareas, frecuencias y productos.
- Procedimiento de quejas, evidencias, descargos, apelacion y cierre.
- Medidas correctivas vigentes y tratamiento de medidas economicas.
- Regla vigente de cuotas y tesoreria por periodo.
- Politica de retencion y visibilidad de incumplimientos.
- Administrador inicial y autoridad que lo designa.

## Requisitos preliminares

### Funcionales

1. Consultar normas por categoria, estado, fecha y fuente.
2. Mostrar origen, actas, historial y nivel de confirmacion de cada norma.
3. Conservar actas, asistencia, decisiones, propuestas y acuerdos sin sobrescribir.
4. Registrar decisiones como propuesta, acuerdo, modificacion, excepcion o pendiente.
5. Administrar zonas, tareas, instrucciones, horarios, asignaciones, revisiones y
   excepciones de aseo.
6. Registrar incumplimientos, evidencia, debido proceso, medidas y seguimiento.
7. Gestionar cargos, periodos, reemplazos y responsabilidades.
8. Publicar avisos y documentos con visibilidad y vigencia.
9. Buscar y filtrar por texto, fecha, estado, habitacion, categoria y fuente.
10. Auditar creacion, modificacion y desactivacion de informacion sensible.
11. Restringir operaciones mediante autenticacion, roles y RLS.

### No funcionales

- Mobile first en celular, tablet y computador.
- PostgreSQL/Supabase con RLS; el frontend no es la unica barrera.
- Auditoria con usuario, fecha, motivo, fuente, valor anterior y nuevo.
- Estados explicitos para vigente, historico, modificado y pendiente.
- Accesibilidad, teclado, contraste y errores claros.
- TypeScript estricto, validacion, loading, error y estados vacios.
- Separacion entre UI, servicios, dominio y persistencia.
- No inventar datos reales; datos DEMO siempre marcados.
- Costo inicial objetivo cero, sujeto a limites gratuitos.

## Cierre de Fase 0

Los documentos permiten definir el dominio y un MVP, pero no declarar todos los
horarios, sanciones, cuotas o modificaciones como vigentes. La Fase 1 debe aprobar
el modelo de estados, el flujo de confirmacion y las decisiones pendientes antes
de cargar informacion operativa.

## Validacion documental final

### Confirmado directamente

- La Carta contiene reglas explícitas de limpieza para pasillos, duchas, baños y
  cocina, además de distribución, descansos, acompañantes y medidas por aseos.
- La Carta define cargos y responsabilidades de representantes, representante de
  aseo, fiscal y tesorero.
- La Carta define una secuencia de quejas y escalamiento.
- La Carta contiene horarios de ruido, aunque tiene una tensión interna sobre el
  domingo que queda registrada como `NO_VERIFICADO`.
- Las actas contienen hechos, propuestas, votaciones, decisiones, informes y
  excepciones individuales; no todos son normas.

### Pendiente

- Carta modificada anunciada para septiembre de 2026 y su aprobación.
- Vigencia actual de horarios de aseo, terraza y lavandería.
- Resultado y alcance posterior de los planes piloto.
- Padrón actual y responsables actuales.
- Protocolos externos de la casa y de Federación.
- Medidas correctivas posteriores que pretendan tener alcance general.
- Texto seguro del apartado de sustancias ilegales y su validación institucional.

### Regla de trazabilidad obligatoria

La aplicación futura debe conservar la cadena `Fuente -> Decisión -> Modificación
-> Norma vigente`. Una decisión solo podrá crear una modificación normativa si el
documento demuestra aprobación, alcance general, norma afectada y vigencia. En
cualquier otro caso se almacenará como propuesta, información, excepción,
histórico o `PENDIENTE_CONFIRMACION`.
