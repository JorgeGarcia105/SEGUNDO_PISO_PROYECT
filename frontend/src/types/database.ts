export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AppRole = 'usuario' | 'administrador' | 'superadministrador'
export type PublicationStatus = 'borrador' | 'publicado' | 'archivado'
export type SourceType = 'carta_interna' | 'acta' | 'documento_externo' | 'confirmacion_institucional'
export type NormStatus = 'VIGENTE' | 'MODIFICADA' | 'DEROGADA' | 'HISTORICA' | 'PENDIENTE_CONFIRMACION' | 'NO_VERIFICADO'
export type DecisionType = 'PROPUESTA' | 'VOTACION' | 'DECISION_APROBADA' | 'DECISION_RECHAZADA' | 'EXCEPCION_INDIVIDUAL' | 'INFORMACION' | 'INFORME' | 'PENDIENTE_CONFIRMACION'
export type ScopeType = 'GENERAL' | 'TEMPORAL' | 'INDIVIDUAL' | 'EXTERNO' | 'NO_DETERMINADO'
export type CleaningAssignmentStatus = 'PROGRAMADO' | 'ENTREGADO' | 'VERIFICADO' | 'INCUMPLIDO' | 'CANCELADO' | 'PENDIENTE_CONFIRMACION'
export type ViolationStatus = 'ABIERTO' | 'EN_INVESTIGACION' | 'DESCARGOS_PRESENTADOS' | 'RESUELTO' | 'ARCHIVADO'
export type MeasureType = 'ASEO_ADICIONAL' | 'MULTA_ECONOMICA' | 'RESTRICCION_USO' | 'AMONESTACION' | 'OTRA'
export type MeasureStatus = 'PENDIENTE' | 'EN_EJECUCION' | 'COMPLETADA' | 'INCUMPLIDA' | 'CANCELADA'
export type CaseEventType = 'CREACION' | 'INVESTIGACION' | 'DESCARGOS' | 'AUDIENCIA' | 'RESOLUCION' | 'APELACION' | 'EJECUCION_MEDIDA' | 'CIERRE' | 'NOTA'

export interface Profile {
  id: string
  display_name: string | null
  room_label: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProfileRole {
  profile_id: string
  role: AppRole
  created_at: string
}

export interface Document {
  id: string
  title: string
  document_type: SourceType
  storage_path: string | null
  checksum: string | null
  document_date: string | null
  description: string | null
  status: PublicationStatus
  is_immutable: boolean
  drive_url: string | null
  external_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface NormCategory {
  id: string
  name: string
  description: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Norm {
  id: string
  category_id: string | null
  title: string
  article_number: string | null
  chapter: string | null
  is_provisional: boolean
  drive_url: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface NormVersion {
  id: string
  norm_id: string
  version_number: number
  version_label: string | null
  text_content: string
  status: NormStatus
  valid_from: string | null
  valid_until: string | null
  source_document_id: string | null
  source_note: string | null
  approval_note: string | null
  ratification_date: string | null
  ratified_by: string | null
  created_by: string | null
  created_at: string
}

export interface AssemblyMinute {
  id: string
  title: string
  meeting_date: string | null
  document_id: string | null
  participants_note: string | null
  topics: string | null
  observations: string | null
  status: PublicationStatus
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Decision {
  id: string
  assembly_id: string | null
  title: string
  detail: string
  decision_type: DecisionType
  scope: ScopeType
  affected_person_note: string | null
  affected_norm_id: string | null
  approved_at: string | null
  valid_from: string | null
  valid_until: string | null
  source_note: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface NormChange {
  id: string
  decision_id: string
  norm_id: string
  previous_version_id: string | null
  new_version_id: string | null
  confirmation_note: string
  confirmed_by: string | null
  confirmed_at: string | null
  created_at: string
}

export interface CleaningZone {
  id: string
  name: string
  description: string | null
  source_document_id: string | null
  status: PublicationStatus
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface CleaningTask {
  id: string
  zone_id: string
  title: string
  instructions: string | null
  frequency_note: string | null
  products: string | null
  verification_criteria: string | null
  order_index: number | null
  source_document_id: string | null
  status: PublicationStatus
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface CleaningAssignment {
  id: string
  task_id: string
  profile_id: string | null
  assignment_note: string | null
  scheduled_for: string | null
  due_at: string | null
  status: CleaningAssignmentStatus
  source_document_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface CleaningReview {
  id: string
  assignment_id: string
  reviewer_id: string | null
  reviewed_at: string | null
  result_note: string | null
  evidence_path: string | null
  created_by: string | null
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  is_important: boolean
  starts_at: string | null
  expires_at: string | null
  status: PublicationStatus
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Violation {
  id: string
  title: string
  detail: string
  violation_date: string
  reported_by: string | null
  reported_at: string
  affected_profile_id: string | null
  source_norm_id: string | null
  source_decision_id: string | null
  source_document_id: string | null
  status: ViolationStatus
  scope: ScopeType
  evidence_note: string | null
  resolution_note: string | null
  resolved_by: string | null
  resolved_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface CorrectiveMeasure {
  id: string
  violation_id: string
  measure_type: MeasureType
  detail: string
  quantity: number | null
  unit: string | null
  status: MeasureStatus
  assigned_to: string | null
  assigned_by: string | null
  assigned_at: string | null
  due_at: string | null
  completed_at: string | null
  completion_note: string | null
  source_document_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface CaseEvent {
  id: string
  violation_id: string
  event_type: CaseEventType
  description: string
  event_date: string
  created_by: string | null
  created_at: string
}

export interface CaseEvidence {
  id: string
  violation_id: string
  title: string
  description: string | null
  storage_path: string | null
  checksum: string | null
  evidence_type: string | null
  uploaded_by: string | null
  uploaded_at: string
  created_at: string
}

export interface AuditEvent {
  id: string
  table_name: string
  record_id: string | null
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  old_data: Json | null
  new_data: Json | null
  changed_by: string | null
  changed_at: string
}

export interface NormAnnotation {
  id: string
  norm_id: string
  version_id: string | null
  annotation_type: 'concordancia' | 'referencia_cruzada' | 'nota_interna' | 'observacion' | 'vacío_detectado'
  title: string
  content: string
  source_document_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface FormatControl {
  id: string
  format_number: number
  title: string
  description: string | null
  article_reference: string | null
  template_content: string | null
  drive_url: string | null
  status: PublicationStatus
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Tables {
  profiles: Profile
  profile_roles: ProfileRole
  documents: Document
  norm_categories: NormCategory
  norms: Norm
  norm_versions: NormVersion
  norm_annotations: NormAnnotation
  formats_control: FormatControl
  assembly_minutes: AssemblyMinute
  decisions: Decision
  norm_changes: NormChange
  cleaning_zones: CleaningZone
  cleaning_tasks: CleaningTask
  cleaning_assignments: CleaningAssignment
  cleaning_reviews: CleaningReview
  announcements: Announcement
  violations: Violation
  corrective_measures: CorrectiveMeasure
  case_events: CaseEvent
  case_evidence: CaseEvidence
  audit_events: AuditEvent
}

export interface TablesInsert {
  profiles: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
  profile_roles: Omit<ProfileRole, 'created_at'>
  documents: Omit<Document, 'id' | 'created_at' | 'updated_at'>
  norm_categories: Omit<NormCategory, 'id' | 'created_at' | 'updated_at'>
  norms: Omit<Norm, 'id' | 'created_at' | 'updated_at'>
  norm_versions: Omit<NormVersion, 'id' | 'created_at'>
  norm_annotations: Omit<NormAnnotation, 'id' | 'created_at' | 'updated_at'>
  formats_control: Omit<FormatControl, 'id' | 'created_at' | 'updated_at'>
  assembly_minutes: Omit<AssemblyMinute, 'id' | 'created_at' | 'updated_at'>
  decisions: Omit<Decision, 'id' | 'created_at' | 'updated_at'>
  norm_changes: Omit<NormChange, 'id' | 'created_at'>
  cleaning_zones: Omit<CleaningZone, 'id' | 'created_at' | 'updated_at'>
  cleaning_tasks: Omit<CleaningTask, 'id' | 'created_at' | 'updated_at'>
  cleaning_assignments: Omit<CleaningAssignment, 'id' | 'created_at' | 'updated_at'>
  cleaning_reviews: Omit<CleaningReview, 'id' | 'created_at'>
  announcements: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>
  violations: Omit<Violation, 'id' | 'created_at' | 'updated_at'>
  corrective_measures: Omit<CorrectiveMeasure, 'id' | 'created_at' | 'updated_at'>
  case_events: Omit<CaseEvent, 'id' | 'created_at'>
  case_evidence: Omit<CaseEvidence, 'id' | 'created_at'>
  audit_events: Omit<AuditEvent, 'id' | 'changed_at'>
}

export interface TablesUpdate {
  profiles: Partial<Omit<Profile, 'id' | 'created_at'>>
  profile_roles: Partial<Omit<ProfileRole, 'created_at'>>
  documents: Partial<Omit<Document, 'id' | 'created_at'>>
  norm_categories: Partial<Omit<NormCategory, 'id' | 'created_at'>>
  norms: Partial<Omit<Norm, 'id' | 'created_at'>>
  norm_versions: Partial<Omit<NormVersion, 'id' | 'created_at'>>
  norm_annotations: Partial<Omit<NormAnnotation, 'id' | 'created_at'>>
  formats_control: Partial<Omit<FormatControl, 'id' | 'created_at'>>
  assembly_minutes: Partial<Omit<AssemblyMinute, 'id' | 'created_at'>>
  decisions: Partial<Omit<Decision, 'id' | 'created_at'>>
  norm_changes: Partial<Omit<NormChange, 'id' | 'created_at'>>
  cleaning_zones: Partial<Omit<CleaningZone, 'id' | 'created_at'>>
  cleaning_tasks: Partial<Omit<CleaningTask, 'id' | 'created_at'>>
  cleaning_assignments: Partial<Omit<CleaningAssignment, 'id' | 'created_at'>>
  cleaning_reviews: Partial<Omit<CleaningReview, 'id' | 'created_at'>>
  announcements: Partial<Omit<Announcement, 'id' | 'created_at'>>
  violations: Partial<Omit<Violation, 'id' | 'created_at'>>
  corrective_measures: Partial<Omit<CorrectiveMeasure, 'id' | 'created_at'>>
  case_events: Partial<Omit<CaseEvent, 'id' | 'created_at'>>
  case_evidence: Partial<Omit<CaseEvidence, 'id' | 'created_at'>>
  audit_events: Partial<Omit<AuditEvent, 'id' | 'changed_at'>>
}

export type AnnotationType = 'concordancia' | 'referencia_cruzada' | 'nota_interna' | 'observacion' | 'vacío_detectado'

export interface Enums {
  app_role: AppRole
  publication_status: PublicationStatus
  source_type: SourceType
  norm_status: NormStatus
  decision_type: DecisionType
  scope_type: ScopeType
  cleaning_assignment_status: CleaningAssignmentStatus
  violation_status: ViolationStatus
  measure_type: MeasureType
  measure_status: MeasureStatus
  case_event_type: CaseEventType
  annotation_type: AnnotationType
}

export type CompositeTypes = {
  _never: never
}