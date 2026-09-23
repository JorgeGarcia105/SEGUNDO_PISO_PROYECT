import { z } from 'zod'

export const emailSchema = z.string().email('Correo inválido').min(1, 'Requerido')

export const passwordSchema = z.string().min(8, 'Mínimo 8 caracteres')

export const requiredString = (fieldName = 'Campo') => z.string().min(1, `${fieldName} es requerido`)

export const optionalString = () => z.string().optional().nullable()

export const uuidSchema = z.string().uuid('ID inválido')

export const positiveIntSchema = (fieldName = 'Valor') => z.coerce.number().int().positive(`${fieldName} debe ser un número positivo`)

export const nonNegativeIntSchema = (fieldName = 'Valor') => z.coerce.number().int().min(0, `${fieldName} debe ser >= 0`)

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD')

export const timestampSchema = z.string().datetime('Fecha inválida')

export const normStatusSchema = z.enum(['VIGENTE', 'MODIFICADA', 'DEROGADA', 'HISTORICA', 'PENDIENTE_CONFIRMACION', 'NO_VERIFICADO'])

export const decisionTypeSchema = z.enum(['PROPUESTA', 'VOTACION', 'DECISION_APROBADA', 'DECISION_RECHAZADA', 'EXCEPCION_INDIVIDUAL', 'INFORMACION', 'INFORME', 'PENDIENTE_CONFIRMACION'])

export const scopeTypeSchema = z.enum(['GENERAL', 'TEMPORAL', 'INDIVIDUAL', 'EXTERNO', 'NO_DETERMINADO'])

export const cleaningAssignmentStatusSchema = z.enum(['PROGRAMADO', 'ENTREGADO', 'VERIFICADO', 'INCUMPLIDO', 'CANCELADO', 'PENDIENTE_CONFIRMACION'])

export const publicationStatusSchema = z.enum(['borrador', 'publicado', 'archivado'])

export const sourceTypeSchema = z.enum(['carta_interna', 'acta', 'documento_externo', 'confirmacion_institucional'])

export const appRoleSchema = z.enum(['usuario', 'administrador', 'superadministrador'])

export const profileSchema = z.object({
  id: uuidSchema,
  display_name: optionalString(),
  room_label: optionalString(),
  is_active: z.boolean().default(true),
})

export const profileRoleSchema = z.object({
  profile_id: uuidSchema,
  role: appRoleSchema,
})

export const documentSchema = z.object({
  title: requiredString('Título'),
  document_type: sourceTypeSchema,
  storage_path: optionalString(),
  checksum: optionalString(),
  document_date: dateSchema.optional().nullable(),
  description: optionalString(),
  status: publicationStatusSchema.default('borrador'),
  is_immutable: z.boolean().default(true),
})

export const normCategorySchema = z.object({
  name: requiredString('Nombre'),
  description: optionalString(),
})

export const normSchema = z.object({
  category_id: uuidSchema.optional().nullable(),
  title: requiredString('Título'),
})

export const normVersionSchema = z.object({
  norm_id: uuidSchema,
  version_number: positiveIntSchema('Número de versión'),
  text_content: requiredString('Contenido'),
  status: normStatusSchema,
  valid_from: dateSchema.optional().nullable(),
  valid_until: dateSchema.optional().nullable(),
  source_document_id: uuidSchema.optional().nullable(),
  source_note: optionalString(),
  approval_note: optionalString(),
})

export const assemblyMinuteSchema = z.object({
  title: requiredString('Título'),
  meeting_date: dateSchema.optional().nullable(),
  document_id: uuidSchema.optional().nullable(),
  participants_note: optionalString(),
  topics: optionalString(),
  observations: optionalString(),
  status: publicationStatusSchema,
})

export const decisionSchema = z.object({
  assembly_id: uuidSchema.optional().nullable(),
  title: requiredString('Título'),
  detail: requiredString('Detalle'),
  decision_type: decisionTypeSchema,
  scope: scopeTypeSchema.default('NO_DETERMINADO'),
  affected_person_note: optionalString(),
  affected_norm_id: uuidSchema.optional().nullable(),
  approved_at: dateSchema.optional().nullable(),
  valid_from: dateSchema.optional().nullable(),
  valid_until: dateSchema.optional().nullable(),
  source_note: optionalString(),
})

export const normChangeSchema = z.object({
  decision_id: uuidSchema,
  norm_id: uuidSchema,
  previous_version_id: uuidSchema.optional().nullable(),
  new_version_id: uuidSchema.optional().nullable(),
  confirmation_note: requiredString('Nota de confirmación'),
  confirmed_by: uuidSchema.optional().nullable(),
  confirmed_at: timestampSchema.optional().nullable(),
})

export const cleaningZoneSchema = z.object({
  name: requiredString('Nombre'),
  description: optionalString(),
  source_document_id: uuidSchema.optional().nullable(),
  status: publicationStatusSchema.default('borrador'),
})

export const cleaningTaskSchema = z.object({
  zone_id: uuidSchema,
  title: requiredString('Título'),
  instructions: optionalString(),
  frequency_note: optionalString(),
  source_document_id: uuidSchema.optional().nullable(),
  status: publicationStatusSchema.default('borrador'),
})

export const cleaningAssignmentSchema = z.object({
  task_id: uuidSchema,
  profile_id: uuidSchema.optional().nullable(),
  assignment_note: optionalString(),
  scheduled_for: dateSchema.optional().nullable(),
  due_at: timestampSchema.optional().nullable(),
  status: cleaningAssignmentStatusSchema.default('PENDIENTE_CONFIRMACION'),
  source_document_id: uuidSchema.optional().nullable(),
})

export const cleaningReviewSchema = z.object({
  assignment_id: uuidSchema,
  reviewer_id: uuidSchema.optional().nullable(),
  reviewed_at: timestampSchema.optional().nullable(),
  result_note: optionalString(),
  evidence_path: optionalString(),
})

export const announcementSchema = z.object({
  title: requiredString('Título'),
  body: requiredString('Cuerpo'),
  is_important: z.boolean().default(false),
  starts_at: timestampSchema.optional().nullable(),
  expires_at: timestampSchema.optional().nullable(),
  status: publicationStatusSchema.default('borrador'),
})

export type ProfileForm = z.infer<typeof profileSchema>
export type ProfileRoleForm = z.infer<typeof profileRoleSchema>
export type DocumentForm = z.infer<typeof documentSchema>
export type NormCategoryForm = z.infer<typeof normCategorySchema>
export type NormForm = z.infer<typeof normSchema>
export type NormVersionForm = z.infer<typeof normVersionSchema>
export type AssemblyMinuteForm = z.infer<typeof assemblyMinuteSchema>
export type DecisionForm = z.infer<typeof decisionSchema>
export type NormChangeForm = z.infer<typeof normChangeSchema>
export type CleaningZoneForm = z.infer<typeof cleaningZoneSchema>
export type CleaningTaskForm = z.infer<typeof cleaningTaskSchema>
export type CleaningAssignmentForm = z.infer<typeof cleaningAssignmentSchema>
export type CleaningReviewForm = z.infer<typeof cleaningReviewSchema>
export type AnnouncementForm = z.infer<typeof announcementSchema>