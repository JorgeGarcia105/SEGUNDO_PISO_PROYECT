import type { Tables } from '@/types/database'

export type Document = Tables['documents']
export type NormCategory = Tables['norm_categories']
export type Norm = Tables['norms']
export type NormVersion = Tables['norm_versions']
export type AssemblyMinute = Tables['assembly_minutes']
export type Decision = Tables['decisions']
export type CleaningZone = Tables['cleaning_zones']
export type CleaningTask = Tables['cleaning_tasks']
export type CleaningAssignment = Tables['cleaning_assignments']
export type CleaningReview = Tables['cleaning_reviews']
export type Announcement = Tables['announcements']
export type Profile = Tables['profiles']
export type ProfileRole = Tables['profile_roles']

export const seedDocuments: Document[] = [
  {
    id: 'doc-carta-interna',
    title: 'Carta Interna 2do Piso RGSB.pdf',
    document_type: 'carta_interna',
    storage_path: '/documents/Carta Interna 2do Piso RGSB.pdf',
    checksum: 'sha256-carta-interna-rgsb',
    document_date: '2023-01-15',
    description: 'Fuente normativa base del Segundo Piso. Requiere confirmación de vigencia institucional.',
    status: 'publicado',
    is_immutable: true,
    drive_url: null,
    external_id: null,
    created_by: null,
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-01-15T08:00:00Z',
  },
  {
    id: 'doc-asambleas',
    title: 'Asambleas Piso 2.pdf',
    document_type: 'acta',
    storage_path: '/documents/Asambleas Piso 2.pdf',
    checksum: 'sha256-asambleas-piso-2',
    document_date: '2026-08-20',
    description: 'Compilación histórica de actas, propuestas, votaciones, decisiones e informes del Segundo Piso.',
    status: 'publicado',
    is_immutable: true,
    drive_url: null,
    external_id: null,
    created_by: null,
    created_at: '2026-08-20T10:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
  },
]

export const seedCategories: NormCategory[] = [
  { id: 'cat-aseo', name: 'Aseo', description: 'Limpieza, asignaciones e instrucciones de zonas comunes.', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'cat-medidas', name: 'Medidas correctivas', description: 'Medidas documentadas; no implica que todas estén vigentes.', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'cat-responsabilidades', name: 'Responsabilidades', description: 'Cargos y funciones del Segundo Piso.', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'cat-convivencia', name: 'Convivencia', description: 'Respeto, ruido y uso de espacios comunes.', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'cat-quejas', name: 'Quejas', description: 'Debido proceso y escalamiento.', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'cat-seguridad', name: 'Seguridad', description: 'Emergencias, acceso y contenido pendiente de validación.', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
]

export interface SeedNormItem {
  id: string
  categoryId: string
  title: string
  text: string
  status: 'VIGENTE' | 'MODIFICADA' | 'DEROGADA' | 'HISTORICA' | 'PENDIENTE_CONFIRMACION' | 'NO_VERIFICADO'
  sourceNote: string
  approvalNote: string
}

export const rawNormData: SeedNormItem[] = [
  { id: 'norm-01', categoryId: 'cat-aseo', title: 'Responsabilidad común de aseo', text: 'La limpieza de las zonas comunes es responsabilidad de todos los residentes.', status: 'VIGENTE', sourceNote: 'N-01. VIGENTE_POR_CARTA. Regla base de la Carta Interna Sección 1.1.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-02', categoryId: 'cat-aseo', title: 'Pasillo 1', text: 'Desde la habitación 217 hasta la 234: barrer y trapear dos veces el pasillo, el área del comedor y la zona del gabinete de incendios; limpiar la ventana del pasillo hacia el coliseo.', status: 'VIGENTE', sourceNote: 'N-02. VIGENTE_POR_CARTA. Carta Sección 1.1. Validar alcance exacto de la zona.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-03', categoryId: 'cat-aseo', title: 'Pasillo 2', text: 'Desde la habitación 201 hasta la 216: barrer y trapear dos veces el pasillo y la sala de estar; limpiar tapas de canecas; dejar muebles organizados; pasar trapo por los sillones.', status: 'VIGENTE', sourceNote: 'N-03. VIGENTE_POR_CARTA. Carta Sección 1.1. Confirmar si sala y comedor son zonas distintas.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-04', categoryId: 'cat-aseo', title: 'Limpieza de duchas', text: 'Con jabón, fab y límpido: barrer, restregar y trapear pisos y paredes dos veces; lavar y secar puertas; limpiar manijas, jaboneras, duchas, partes metálicas y rejilla de la pared del pasillo.', status: 'VIGENTE', sourceNote: 'N-04. VIGENTE_POR_CARTA. Carta Sección 1.1. La Carta define productos y excepción de ducha libre.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-05', categoryId: 'cat-aseo', title: 'Ducha libre durante el aseo', text: 'Se debe dejar una ducha libre para que alguien pueda bañarse, salvo que se esté terminando de hacer aseo.', status: 'VIGENTE', sourceNote: 'N-05. VIGENTE_POR_CARTA. Carta Sección 1.1.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-06', categoryId: 'cat-aseo', title: 'Limpieza de baños', text: 'Limpiar con cloro y jabón espejos, paredes, piso, baños, orinales y puertas de aluminio; barrer y trapear el piso dos veces; cambiar las bolsas y limpiar los implementos utilizados.', status: 'VIGENTE', sourceNote: 'N-06. VIGENTE_POR_CARTA. Carta Sección 1.1. Regla operativa explícita.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-07', categoryId: 'cat-aseo', title: 'Zona de lavado', text: 'La zona de lavado aparece como zona de aseo, pero la Carta no proporciona instrucciones desarrolladas después de su encabezado.', status: 'PENDIENTE_CONFIRMACION', sourceNote: 'N-07. PENDIENTE_CONFIRMACION. Carta Sección 1.1. Instrucciones incompletas.', approvalNote: 'Pendiente de confirmación de instrucciones completas.' },
  { id: 'norm-08', categoryId: 'cat-aseo', title: 'Limpieza de cocina', text: 'Limpiar debajo de los cajones y la nevera; frotar y lavar quemadores y hornillas con una esponja; limpiar la mesa del comedor y el microondas; dejar la mesa roja exterior y la cocina sin utensilios.', status: 'VIGENTE', sourceNote: 'N-08. VIGENTE_POR_CARTA. Carta Sección 1.1.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-09', categoryId: 'cat-aseo', title: 'Entrega del cuarto de aseo', text: 'Todos los aseos tienen que entregar el cuarto de aseo organizado. La frase sobre no dejar hueco húmedo requiere validación del PDF y del responsable.', status: 'NO_VERIFICADO', sourceNote: 'N-09. NO_VERIFICADO parcialmente. Carta Sección 1.1. Expresión "hueco húmedo" requiere validación visual.', approvalNote: 'Pendiente de validación visual del PDF original.' },
  { id: 'norm-10', categoryId: 'cat-aseo', title: 'Distribución entre residentes', text: 'La Carta describe la distribución de estas tareas entre 34 residentes.', status: 'PENDIENTE_CONFIRMACION', sourceNote: 'N-10. PENDIENTE_CONFIRMACION del padrón actual. Carta Sección 1.2.', approvalNote: 'Pendiente de confirmación del padrón actual de residentes.' },
  { id: 'norm-11', categoryId: 'cat-aseo', title: 'Carga de nuevos residentes', text: 'El nuevo residente hará 3 aseos semanales durante 52 semanas, entendidas como semanas residiendo en el piso.', status: 'VIGENTE', sourceNote: 'N-11. VIGENTE_POR_CARTA. Carta Sección 1.2. Posible diferencia posterior en actas.', approvalNote: 'Confirmada por análisis documental como vigente por Carta; actas presentan esquemas alternativos.' },
  { id: 'norm-12', categoryId: 'cat-aseo', title: 'Prelación de zonas A', text: 'Cocina, baños y zona de lavado, siempre y cuando sea lunes.', status: 'VIGENTE', sourceNote: 'N-12. VIGENTE_POR_CARTA. Carta Sección 1.2. Relación con actas pendiente.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-13', categoryId: 'cat-aseo', title: 'Prelación de zonas B', text: 'Duchas, pasillo 1, terraza, pasillo 2 y zona de lavado.', status: 'VIGENTE', sourceNote: 'N-13. VIGENTE_POR_CARTA. Carta Sección 1.2. Relación con actas pendiente.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-14', categoryId: 'cat-aseo', title: 'Orden de asignación', text: 'Los aseos se pondrán en este orden: multados; nuevos ingresos; acompañantes; residentes en orden numérico hasta el último residente que haya descansado la semana anterior.', status: 'VIGENTE', sourceNote: 'N-14. VIGENTE_POR_CARTA. Carta Sección 1.2. Confirmar excepciones y descansos.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-15', categoryId: 'cat-medidas', title: 'Incumplimiento de aseo', text: 'Quien no cumpla con su aseo tendrá una sanción equivalente a 3 aseos adicionales y se le impondrá el mismo aseo que incumplió.', status: 'VIGENTE', sourceNote: 'N-15. VIGENTE_POR_CARTA. Carta Sección 1.3.a.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-16', categoryId: 'cat-medidas', title: 'Entrega de aseo hasta una hora tarde', text: 'Genera 1 aseo adicional y el mismo aseo para la próxima semana. Se puede solicitar permiso previo al fiscal por causa justa y razonable notificada antes del horario.', status: 'VIGENTE', sourceNote: 'N-16. VIGENTE_POR_CARTA. Carta Sección 1.3.b.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-17', categoryId: 'cat-medidas', title: 'Firma sin verificación estricta', text: 'Quien revise y firme un aseo sin cumplimiento estricto tendrá una sanción de 3 aseos; se entenderá como no entregado y se aplicará la sanción del incumplimiento.', status: 'VIGENTE', sourceNote: 'N-17. VIGENTE_POR_CARTA. Carta Sección 1.3.c.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-18', categoryId: 'cat-aseo', title: 'Máximo semanal de aseos', text: 'Máximo de 8 aseos por semana.', status: 'VIGENTE', sourceNote: 'N-18. VIGENTE_POR_CARTA. Carta Sección 1.3.d.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-19', categoryId: 'cat-medidas', title: 'No pago de multas y omisión', text: 'Ninguna multa se puede pagar. Solo se pueden omitir aseos por semanas académicas; quien abandone el piso debe informar para definir el aseo correspondiente.', status: 'VIGENTE', sourceNote: 'N-19. VIGENTE_POR_CARTA. Carta Sección 1.3.e-f.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-20', categoryId: 'cat-aseo', title: 'Descansos', text: 'Cuando se llenen los cupos de asignación, descansarán las personas en orden consecuente a quien descansó la última vez.', status: 'VIGENTE', sourceNote: 'N-20. VIGENTE_POR_CARTA. Carta Sección 1.4.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-21', categoryId: 'cat-aseo', title: 'Aseo por acompañante', text: 'Si un residente tiene un acompañante 3 noches por semana, será responsable de un aseo adicional a los que le corresponden por semana.', status: 'VIGENTE', sourceNote: 'N-21. VIGENTE_POR_CARTA. Carta Sección 1.5.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-22', categoryId: 'cat-medidas', title: 'Medida documentada para ruido', text: 'El apartado de la Carta dice: multas por ruidos, aseo tipo ornato (3) y aseo de piso (3). El alcance y la redacción completa requieren confirmación.', status: 'NO_VERIFICADO', sourceNote: 'N-22. NO_VERIFICADO como regla completa. Carta Sección 1.6.', approvalNote: 'Pendiente de validación del texto completo y alcance.' },
  { id: 'norm-23', categoryId: 'cat-responsabilidades', title: 'Cargos representativos obligatorios', text: 'Todos los residentes del Segundo Piso deberán ocupar un cargo representativo durante su permanencia; en casos excepcionales decide la asamblea de piso.', status: 'VIGENTE', sourceNote: 'N-23. VIGENTE_POR_CARTA. Carta Sección 2.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-24', categoryId: 'cat-responsabilidades', title: 'Representantes de piso', text: 'Hay 3 representantes de piso encargados de coordinar actividades, quejas y sugerencias, y de ser voceros ante la Federación.', status: 'VIGENTE', sourceNote: 'N-24. VIGENTE_POR_CARTA. Carta Sección 2.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-25', categoryId: 'cat-responsabilidades', title: 'Representante de aseo', text: 'Gestiona materiales de aseo y reporta desperfectos o necesidades de mantenimiento. Las peticiones se entregan el domingo de 19:00 a 22:00 y la lista hasta máximo 22:30.', status: 'VIGENTE', sourceNote: 'N-25. VIGENTE_POR_CARTA. Carta Sección 2.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-26', categoryId: 'cat-responsabilidades', title: 'Fiscal', text: 'Verifica la transparencia y legalidad de decisiones y acciones de representantes y resuelve conflictos o inconformidades entre residentes o con la administración.', status: 'VIGENTE', sourceNote: 'N-26. VIGENTE_POR_CARTA. Carta Sección 2.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-27', categoryId: 'cat-responsabilidades', title: 'Tesorero', text: 'Administra recursos económicos, controla ingresos y egresos, rinde cuentas, recauda recursos y gestiona fondos para actividades o necesidades.', status: 'VIGENTE', sourceNote: 'N-27. VIGENTE_POR_CARTA. Carta Sección 2.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-28', categoryId: 'cat-responsabilidades', title: 'Elección y duración de cargos', text: 'Los cargos se eligen por votación entre residentes; duran 1 año calendario, con posibilidad de reelección.', status: 'VIGENTE', sourceNote: 'N-28. VIGENTE_POR_CARTA. Carta Sección 2.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-29', categoryId: 'cat-convivencia', title: 'Respeto mutuo', text: 'La sección de convivencia incluye "Respeto mutuo", pero el apartado no contiene texto normativo desarrollado.', status: 'NO_VERIFICADO', sourceNote: 'N-29. NO_VERIFICADO / incompleto. Carta Sección 3.1.', approvalNote: 'Texto normativo no desarrollado en la Carta.' },
  { id: 'norm-30', categoryId: 'cat-convivencia', title: 'Horarios de ruido', text: 'De domingo a jueves: 10:00 a 21:00; viernes y sábado: 10:00 a 02:00.', status: 'VIGENTE', sourceNote: 'N-30. VIGENTE_POR_CARTA. Carta Sección 3.2.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-31', categoryId: 'cat-convivencia', title: 'Fin de semana', text: 'Viernes hasta 02:00 del sábado y sábado hasta 02:00 del domingo.', status: 'VIGENTE', sourceNote: 'N-31. VIGENTE_POR_CARTA. Carta Sección 3.2.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-32', categoryId: 'cat-convivencia', title: 'Domingo y festivo', text: 'Domingo después de las 09:00 hasta las 21:00; si es festivo, hasta las 02:00 del lunes festivo.', status: 'NO_VERIFICADO', sourceNote: 'N-32. NO_VERIFICADO por tensión con N-30. Carta Sección 3.2.', approvalNote: 'Pendiente de conciliación con N-30.' },
  { id: 'norm-33', categoryId: 'cat-convivencia', title: 'Festivo entre semana', text: 'En días festivos en semana se permite desde el día anterior al festivo hasta las 02:00 del festivo.', status: 'VIGENTE', sourceNote: 'N-33. VIGENTE_POR_CARTA. Carta Sección 3.2.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-34', categoryId: 'cat-convivencia', title: 'Umbral de ruido no tolerable', text: 'El ruido deja de considerarse tolerable cuando causa molestia intensa a residentes del piso en horas de madrugada, antes de las 02:00.', status: 'VIGENTE', sourceNote: 'N-34. VIGENTE_POR_CARTA. Carta Sección 3.2.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-35', categoryId: 'cat-convivencia', title: 'Uso de espacios comunes', text: 'Se debe dejar en óptimas condiciones el espacio después de usar cocina, baños, pasillos, sala de estar, comedor, terraza, zona de lavado y cuarto de aseo.', status: 'VIGENTE', sourceNote: 'N-35. VIGENTE_POR_CARTA. Carta Sección 3.3.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-36', categoryId: 'cat-convivencia', title: 'Sanción general espacios comunes', text: 'El incumplimiento de las normas de espacios comunes corresponde a la sanción respectiva.', status: 'VIGENTE', sourceNote: 'N-36. VIGENTE_POR_CARTA. Carta Sección 3, párrafo.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-37', categoryId: 'cat-quejas', title: 'Debido proceso de quejas', text: 'El orden indicado es: implicado; fiscalía o representante; redactar oficio; y en última instancia asamblea de piso.', status: 'VIGENTE', sourceNote: 'N-37. VIGENTE_POR_CARTA. Carta Sección 4.1.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-38', categoryId: 'cat-quejas', title: 'Escalamiento de situaciones', text: 'Si la situación se complica, pasa al fiscal general, Federación y asamblea general.', status: 'VIGENTE', sourceNote: 'N-38. VIGENTE_POR_CARTA. Carta Sección 4.2.', approvalNote: 'Confirmada por análisis documental como vigente por Carta.' },
  { id: 'norm-39', categoryId: 'cat-seguridad', title: 'Sustancias ilegales', text: 'El texto visible dice que son permitidas en el piso siempre que no se afecte al prójimo ni la convivencia.', status: 'NO_VERIFICADO', sourceNote: 'N-39. NO_VERIFICADO / requiere validación institucional. Carta Sección 5.1-5.2.', approvalNote: 'Requiere validación institucional antes de publicarse.' },
  { id: 'norm-40', categoryId: 'cat-seguridad', title: 'Protocolos de emergencia', text: 'Se aplica el mismo protocolo que el de la casa. El documento de la casa aún debe incorporarse.', status: 'PENDIENTE_CONFIRMACION', sourceNote: 'N-40. PENDIENTE del protocolo de la casa. Carta Sección 5.3.', approvalNote: 'Pendiente de obtención y validación del protocolo de la casa.' },
  { id: 'norm-41', categoryId: 'cat-seguridad', title: 'Acceso a la residencia', text: 'Se aplica el mismo protocolo que el de la casa. El documento de la casa aún debe incorporarse.', status: 'PENDIENTE_CONFIRMACION', sourceNote: 'N-41. PENDIENTE del protocolo de la casa. Carta Sección 5.4.', approvalNote: 'Pendiente de obtención y validación del protocolo de la casa.' },
]

export const seedNorms: Norm[] = rawNormData.map((n) => ({
  id: n.id,
  category_id: n.categoryId,
  title: n.title,
  article_number: null,
  chapter: null,
  is_provisional: false,
  drive_url: null,
  created_by: null,
  created_at: '2023-01-15T08:00:00Z',
  updated_at: '2023-01-15T08:00:00Z',
}))

export const seedNormVersions: NormVersion[] = rawNormData.map((n) => ({
  id: `ver-${n.id}`,
  norm_id: n.id,
  version_number: 1,
  version_label: null,
  text_content: n.text,
  status: n.status,
  valid_from: '2023-01-15',
  valid_until: null,
  source_document_id: 'doc-carta-interna',
  source_note: n.sourceNote,
  approval_note: n.approvalNote,
  ratification_date: null,
  ratified_by: null,
  created_by: null,
  created_at: '2023-01-15T08:00:00Z',
}))

export const seedCleaningZones: CleaningZone[] = [
  { id: 'zone-pasillo-1', name: 'Pasillo 1', description: 'Habitaciones 217 a 234, comedor, gabinete de incendios y ventana hacia el coliseo.', source_document_id: 'doc-carta-interna', status: 'publicado', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'zone-pasillo-2', name: 'Pasillo 2', description: 'Habitaciones 201 a 216, sala de estar, canecas, muebles y sillones.', source_document_id: 'doc-carta-interna', status: 'publicado', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'zone-duchas', name: 'Duchas', description: 'Limpieza de pisos, paredes, puertas, manijas, jaboneras, duchas, metales y rejilla.', source_document_id: 'doc-carta-interna', status: 'publicado', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'zone-banos', name: 'Baños', description: 'Limpieza de superficies, orinales, puertas, bolsas e implementos.', source_document_id: 'doc-carta-interna', status: 'publicado', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'zone-cocina', name: 'Cocina', description: 'Limpieza bajo cajones y nevera, quemadores, hornillas, mesa y microondas.', source_document_id: 'doc-carta-interna', status: 'publicado', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'zone-lavado', name: 'Zona de lavado', description: 'Zona de aseo de lavaderos y lavandería comunitaria.', source_document_id: 'doc-carta-interna', status: 'publicado', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'zone-terraza', name: 'Terraza', description: 'Zona exterior compartida para secado y descanso.', source_document_id: 'doc-carta-interna', status: 'publicado', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'zone-cuarto-aseo', name: 'Cuarto de aseo', description: 'Debe entregarse organizado al terminar cada turno.', source_document_id: 'doc-carta-interna', status: 'publicado', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
]

export const seedCleaningTasks: CleaningTask[] = [
  { id: 'task-pasillo-1', zone_id: 'zone-pasillo-1', title: 'Aseo Pasillo 1 y Comedor', instructions: 'Barrer y trapear 2 veces pasillo 217-234, limpiar área de comedor, gabinete de incendios y ventana al coliseo.', frequency_note: 'Semanal (prelación B)', products: null, verification_criteria: null, order_index: 1, source_document_id: 'doc-carta-interna', status: 'publicado', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'task-pasillo-2', zone_id: 'zone-pasillo-2', title: 'Aseo Pasillo 2 y Sala', instructions: 'Barrer y trapear 2 veces pasillo 201-216 y sala de estar, limpiar canecas y pasar trapo a sillones.', frequency_note: 'Semanal (prelación B)', products: null, verification_criteria: null, order_index: 2, source_document_id: 'doc-carta-interna', status: 'publicado', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'task-duchas', zone_id: 'zone-duchas', title: 'Limpieza profunda de Duchas', instructions: 'Lavar con jabón, fab y límpido. Restregar pisos y paredes, secar puertas y dejar una ducha libre.', frequency_note: 'Lunes a domingo rotativo', products: 'jabón, fab, límpido', verification_criteria: 'Pisos y paredes restregados, puertas secas, una ducha libre', order_index: 3, source_document_id: 'doc-carta-interna', status: 'publicado', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'task-banos', zone_id: 'zone-banos', title: 'Desinfección de Baños', instructions: 'Limpiar con cloro espejos, inodoros y orinales. Barrer y trapear 2 veces y reponer bolsas.', frequency_note: 'Diario (prelación A lunes)', products: 'cloro, jabón', verification_criteria: 'Espejos, inodoros, orinales limpios; piso barrido y trapeado 2 veces; bolsas repuestas', order_index: 4, source_document_id: 'doc-carta-interna', status: 'publicado', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
  { id: 'task-cocina', zone_id: 'zone-cocina', title: 'Mantenimiento e higiene de Cocina', instructions: 'Limpiar quemadores, hornillas, microondas, bajo la nevera y mesa roja. No dejar utensilios ajenos.', frequency_note: 'Diario (prelación A lunes)', products: 'esponja, jabón, desengrasante', verification_criteria: 'Quemadores, hornillas, microondas, bajo nevera, mesa roja limpios; sin utensilios ajenos', order_index: 5, source_document_id: 'doc-carta-interna', status: 'publicado', created_by: null, created_at: '2023-01-15T08:00:00Z', updated_at: '2023-01-15T08:00:00Z' },
]

export const seedAssemblyMinutes: AssemblyMinute[] = [
  { id: 'acta-2026-08-20', title: 'Asamblea del 20/08/2026', meeting_date: '2026-08-20', document_id: 'doc-asambleas', participants_note: '30 residentes presentes', topics: 'Cargos, caso de multa pendiente, modificación de Carta y cuotas.', observations: 'Registro histórico. Modificación de Carta anunciada como agenda.', status: 'publicado', created_by: null, created_at: '2026-08-20T18:00:00Z', updated_at: '2026-08-20T18:00:00Z' },
  { id: 'acta-2026-06-16', title: 'Asamblea del 16/06/2026', meeting_date: '2026-06-16', document_id: 'doc-asambleas', participants_note: '28 residentes presentes', topics: 'Vacaciones: lista de aseos Antonio 233, implementos de cocina, borrador Carta.', observations: 'Organización de turno vacacional.', status: 'publicado', created_by: null, created_at: '2026-06-16T18:00:00Z', updated_at: '2026-06-16T18:00:00Z' },
  { id: 'acta-2026-03-19', title: 'Asamblea del 19/03/2026', meeting_date: '2026-03-19', document_id: 'doc-asambleas', participants_note: '32 residentes presentes', topics: 'Remoción Yerlin, elección Julián 210 fiscal, nuevos ingresos.', observations: 'Elección de fiscal de piso.', status: 'publicado', created_by: null, created_at: '2026-03-19T18:00:00Z', updated_at: '2026-03-19T18:00:00Z' },
  { id: 'acta-2025-12-04', title: 'Asamblea del 04/12/2025', meeting_date: '2025-12-04', document_id: 'doc-asambleas', participants_note: '29 residentes presentes', topics: 'Rifa 2026-1, cuotas, vacante Alejandro Mejía 218, rotación en vacaciones.', observations: 'Aprobación de rifa y cuotas de mantenimiento.', status: 'publicado', created_by: null, created_at: '2025-12-04T18:00:00Z', updated_at: '2025-12-04T18:00:00Z' },
  { id: 'acta-2025-11-06', title: 'Asamblea del 06/11/2025', meeting_date: '2025-11-06', document_id: 'doc-asambleas', participants_note: '31 residentes presentes', topics: 'Fiscal Camilo 204, plan piloto cocina, propuesta nuevos ingresos rechazada.', observations: 'Camilo Gallo asume fiscalía.', status: 'publicado', created_by: null, created_at: '2025-11-06T18:00:00Z', updated_at: '2025-11-06T18:00:00Z' },
  { id: 'acta-2025-02-18', title: 'Asamblea del 18/02/2025', meeting_date: '2025-02-18', document_id: 'doc-asambleas', participants_note: '33 residentes presentes', topics: 'Caso Alex Viveros, nuevos ingresos, aseo de cocina piloto.', observations: 'Excepción individual y plan piloto acordados.', status: 'publicado', created_by: null, created_at: '2025-02-18T18:00:00Z', updated_at: '2025-02-18T18:00:00Z' },
  { id: 'acta-2024-10-10', title: 'Asamblea del 10/10/2024', meeting_date: '2024-10-10', document_id: 'doc-asambleas', participants_note: '30 residentes presentes', topics: 'Caso 220, asignación de aseos y condiciones.', observations: 'Condiciones de excepción individual.', status: 'publicado', created_by: null, created_at: '2024-10-10T18:00:00Z', updated_at: '2024-10-10T18:00:00Z' },
]

export const seedDecisions: Decision[] = [
  {
    id: 'dec-01',
    assembly_id: 'acta-2025-02-18',
    title: 'Plan piloto de aseo de cocina',
    detail: 'Desde el lunes 24 de febrero, el aseo de cocina sería realizado por dos residentes durante dos semanas; aprobado por unanimidad.',
    decision_type: 'DECISION_APROBADA',
    scope: 'TEMPORAL',
    affected_person_note: null,
    affected_norm_id: 'norm-08',
    approved_at: '2025-02-18',
    valid_from: '2025-02-24',
    valid_until: '2025-03-10',
    source_note: 'Acta del 18/02/2025. Piloto temporal.',
    created_by: null,
    created_at: '2025-02-18T18:00:00Z',
    updated_at: '2025-02-18T18:00:00Z',
  },
  {
    id: 'dec-02',
    assembly_id: 'acta-2024-10-10',
    title: 'Excepción individual del caso 220',
    detail: 'Se aprobaron 20 aseos, $65.000, $15.000 y 4 ornatos en dos semanas de 10 aseos, con restricciones de miércoles y cocina dominical.',
    decision_type: 'EXCEPCION_INDIVIDUAL',
    scope: 'INDIVIDUAL',
    affected_person_note: 'Residente habitación 220',
    affected_norm_id: 'norm-18',
    approved_at: '2024-10-10',
    valid_from: '2024-10-14',
    valid_until: '2024-10-27',
    source_note: 'Acta del 10/10/2024. Excepción individual, no regla general.',
    created_by: null,
    created_at: '2024-10-10T18:00:00Z',
    updated_at: '2024-10-10T18:00:00Z',
  },
  {
    id: 'dec-03',
    assembly_id: 'acta-2025-11-06',
    title: 'Nadie puede firmar su propio aseo',
    detail: 'Queda estrictamente registrado que ningún residente puede verificar ni firmar su propio aseo.',
    decision_type: 'DECISION_APROBADA',
    scope: 'GENERAL',
    affected_person_note: null,
    affected_norm_id: 'norm-17',
    approved_at: '2025-11-06',
    valid_from: '2025-11-06',
    valid_until: null,
    source_note: 'Actas del 06/11/2025. Regla de verificación que complementa Carta.',
    created_by: null,
    created_at: '2025-11-06T18:00:00Z',
    updated_at: '2025-11-06T18:00:00Z',
  },
  {
    id: 'dec-04',
    assembly_id: 'acta-2026-03-19',
    title: 'Elección de Julián 210 como Fiscal',
    detail: 'Se elige a Julián de la habitación 210 como nuevo fiscal de piso tras la remoción solicitada por Yerlin 213.',
    decision_type: 'DECISION_APROBADA',
    scope: 'INDIVIDUAL',
    affected_person_note: 'Julián 210 y Yerlin 213',
    affected_norm_id: 'norm-26',
    approved_at: '2026-03-19',
    valid_from: '2026-03-19',
    valid_until: '2027-03-19',
    source_note: 'Actas del 19/03/2026.',
    created_by: null,
    created_at: '2026-03-19T18:00:00Z',
    updated_at: '2026-03-19T18:00:00Z',
  },
  {
    id: 'dec-05',
    assembly_id: 'acta-2025-02-18',
    title: 'Esquema de nuevos ingresos 3/2/1 rechazado',
    detail: 'Propuesta de 3 aseos el primer semestre, 2 el segundo y 1 el tercero; rechazada por 15 votos en contra vs 2 a favor.',
    decision_type: 'DECISION_RECHAZADA',
    scope: 'GENERAL',
    affected_person_note: null,
    affected_norm_id: 'norm-11',
    approved_at: '2025-02-18',
    valid_from: null,
    valid_until: null,
    source_note: 'Actas del 18/02/2025. No modifica la Carta.',
    created_by: null,
    created_at: '2025-02-18T18:00:00Z',
    updated_at: '2025-02-18T18:00:00Z',
  },
]

export const seedProfiles: Profile[] = [
  { id: 'usr-juan-perez', display_name: 'Juan Pérez', room_label: 'Habitación 204', is_active: true, created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
  { id: 'usr-maria-gomez', display_name: 'María Gómez', room_label: 'Habitación 212', is_active: true, created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
  { id: 'usr-carlos-admin', display_name: 'Carlos Rodríguez (Admin)', room_label: 'Habitación 218', is_active: true, created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
  { id: 'usr-super-admin', display_name: 'Dra. Silva (Superadmin)', room_label: 'Administración', is_active: true, created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
]

export const seedProfileRoles: ProfileRole[] = [
  { profile_id: 'usr-juan-perez', role: 'usuario', created_at: '2024-01-10T00:00:00Z' },
  { profile_id: 'usr-maria-gomez', role: 'usuario', created_at: '2024-01-10T00:00:00Z' },
  { profile_id: 'usr-carlos-admin', role: 'administrador', created_at: '2024-01-10T00:00:00Z' },
  { profile_id: 'usr-super-admin', role: 'superadministrador', created_at: '2024-01-10T00:00:00Z' },
]

const todayStr = new Date().toISOString().split('T')[0]

export const seedCleaningAssignments: CleaningAssignment[] = [
  {
    id: 'asg-01',
    task_id: 'task-cocina',
    profile_id: 'usr-juan-perez',
    assignment_note: 'Turno matutino de cocina - verificación con fiscal.',
    scheduled_for: todayStr,
    due_at: `${todayStr}T21:00:00Z`,
    status: 'PROGRAMADO',
    source_document_id: 'doc-carta-interna',
    created_by: 'usr-carlos-admin',
    created_at: `${todayStr}T08:00:00Z`,
    updated_at: `${todayStr}T08:00:00Z`,
  },
  {
    id: 'asg-02',
    task_id: 'task-banos',
    profile_id: 'usr-maria-gomez',
    assignment_note: 'Desinfección de baños y orinales.',
    scheduled_for: todayStr,
    due_at: `${todayStr}T21:00:00Z`,
    status: 'ENTREGADO',
    source_document_id: 'doc-carta-interna',
    created_by: 'usr-carlos-admin',
    created_at: `${todayStr}T08:00:00Z`,
    updated_at: `${todayStr}T14:00:00Z`,
  },
  {
    id: 'asg-03',
    task_id: 'task-pasillo-1',
    profile_id: 'usr-carlos-admin',
    assignment_note: 'Barrer y trapear pasillo 1.',
    scheduled_for: todayStr,
    due_at: `${todayStr}T22:00:00Z`,
    status: 'VERIFICADO',
    source_document_id: 'doc-carta-interna',
    created_by: 'usr-carlos-admin',
    created_at: `${todayStr}T08:00:00Z`,
    updated_at: `${todayStr}T18:00:00Z`,
  },
]

export const seedCleaningReviews: CleaningReview[] = [
  {
    id: 'rev-01',
    assignment_id: 'asg-03',
    reviewer_id: 'usr-juan-perez',
    reviewed_at: `${todayStr}T18:30:00Z`,
    result_note: 'Pasillo entregado impecable, canecas vacías y ventanas limpias.',
    evidence_path: '/evidence/rev-01.jpg',
    created_by: 'usr-juan-perez',
    created_at: `${todayStr}T18:30:00Z`,
  },
]

export const seedAnnouncements: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Bienvenido al sistema local de SegundoPiso',
    body: 'Este entorno opera de manera 100% local con la información documental de la Carta Interna y las Actas de Asamblea.',
    is_important: true,
    starts_at: `${todayStr}T00:00:00Z`,
    expires_at: '2026-12-31T23:59:59Z',
    status: 'publicado',
    created_by: 'usr-super-admin',
    created_at: `${todayStr}T08:00:00Z`,
    updated_at: `${todayStr}T08:00:00Z`,
  },
  {
    id: 'ann-02',
    title: 'Jornada de aseo y revisión de suministros',
    body: 'Recuerda que las peticiones de insumos de aseo se entregan los domingos de 19:00 a 22:00 con el representante.',
    is_important: false,
    starts_at: `${todayStr}T00:00:00Z`,
    expires_at: '2026-12-31T23:59:59Z',
    status: 'publicado',
    created_by: 'usr-carlos-admin',
    created_at: `${todayStr}T08:00:00Z`,
    updated_at: `${todayStr}T08:00:00Z`,
  },
]
