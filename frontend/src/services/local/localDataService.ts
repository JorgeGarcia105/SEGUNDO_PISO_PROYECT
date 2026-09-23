import { LocalStore } from '@lib/localStore'
import {
  seedDocuments,
  seedCategories,
  seedNorms,
  seedNormVersions,
  seedCleaningZones,
  seedCleaningTasks,
  seedAssemblyMinutes,
  seedDecisions,
  seedProfiles,
  seedProfileRoles,
  seedCleaningAssignments,
  seedCleaningReviews,
  seedAnnouncements,
  type Document,
  type NormCategory,
  type Norm,
  type NormVersion,
  type AssemblyMinute,
  type Decision,
  type CleaningZone,
  type CleaningTask,
  type CleaningAssignment,
  type CleaningReview,
  type Announcement,
  type Profile,
  type ProfileRole,
} from '@/data/seedData'
import type { Violation, CorrectiveMeasure, CaseEvent, CaseEvidence, AuditEvent } from '@/types/database'

// Inicialización de Stores locales
export const documentStore = new LocalStore<Document>({ key: 'documents', getId: (d) => d.id })
export const normCategoryStore = new LocalStore<NormCategory>({ key: 'norm_categories', getId: (c) => c.id })
export const normStore = new LocalStore<Norm>({ key: 'norms', getId: (n) => n.id })
export const normVersionStore = new LocalStore<NormVersion>({ key: 'norm_versions', getId: (v) => v.id })
export const assemblyStore = new LocalStore<AssemblyMinute>({ key: 'assembly_minutes', getId: (a) => a.id })
export const decisionStore = new LocalStore<Decision>({ key: 'decisions', getId: (d) => d.id })
export const cleaningZoneStore = new LocalStore<CleaningZone>({ key: 'cleaning_zones', getId: (z) => z.id })
export const cleaningTaskStore = new LocalStore<CleaningTask>({ key: 'cleaning_tasks', getId: (t) => t.id })
export const cleaningAssignmentStore = new LocalStore<CleaningAssignment>({ key: 'cleanings_assignments', getId: (a) => a.id })
export const cleaningReviewStore = new LocalStore<CleaningReview>({ key: 'cleaning_reviews', getId: (r) => r.id })
export const announcementStore = new LocalStore<Announcement>({ key: 'announcements', getId: (a) => a.id })
export const profileStore = new LocalStore<Profile>({ key: 'profiles', getId: (p) => p.id })
export const profileRoleStore = new LocalStore<ProfileRole & { id: string }>({
  key: 'profile_roles',
  getId: (r) => r.id || `${r.profile_id}_${r.role}`,
})
export const violationStore = new LocalStore<Violation>({ key: 'violations', getId: (v) => v.id })
export const correctiveMeasureStore = new LocalStore<CorrectiveMeasure>({ key: 'corrective_measures', getId: (m) => m.id })
export const caseEventStore = new LocalStore<CaseEvent>({ key: 'case_events', getId: (e) => e.id })
export const caseEvidenceStore = new LocalStore<CaseEvidence>({ key: 'case_evidence', getId: (e) => e.id })
export const auditEventStore = new LocalStore<AuditEvent>({ key: 'audit_events', getId: (e) => e.id })

// Auto-semilla inicial si localStorage está vacío
export function initializeLocalStores(forceReset = false): void {
  if (forceReset || documentStore.getAll().length === 0) {
    documentStore.seed(seedDocuments)
    normCategoryStore.seed(seedCategories)
    normStore.seed(seedNorms)
    normVersionStore.seed(seedNormVersions)
    cleaningZoneStore.seed(seedCleaningZones)
    cleaningTaskStore.seed(seedCleaningTasks)
    assemblyStore.seed(seedAssemblyMinutes)
    decisionStore.seed(seedDecisions)
    profileStore.seed(seedProfiles)
    profileRoleStore.seed(seedProfileRoles.map((pr) => ({ ...pr, id: `${pr.profile_id}_${pr.role}` })))
    cleaningAssignmentStore.seed(seedCleaningAssignments)
    cleaningReviewStore.seed(seedCleaningReviews)
    announcementStore.seed(seedAnnouncements)
  }
}

// Ejecutar inicialización inmediatamente
initializeLocalStores(false)

// --- Métodos de Normas ---
export async function localGetNorms(): Promise<Norm[]> {
  return normStore.getAll()
}

export async function localGetNormsWithRelations() {
  const norms = normStore.getAll()
  const categories = normCategoryStore.getAll()
  const versions = normVersionStore.getAll()

  return norms.map((n) => {
    const cat = categories.find((c) => c.id === n.category_id)
    const vers = versions
      .filter((v) => v.norm_id === n.id)
      .sort((a, b) => b.version_number - a.version_number)
    return {
      ...n,
      norm_categories: cat ? [{ id: cat.id, name: cat.name, description: cat.description }] : null,
      norm_versions: vers.map((v) => ({
        id: v.id,
        version_number: v.version_number,
        text_content: v.text_content,
        status: v.status,
        valid_from: v.valid_from,
        valid_until: v.valid_until,
        source_document_id: v.source_document_id,
        source_note: v.source_note,
        approval_note: v.approval_note,
        created_at: v.created_at,
      })),
    }
  })
}

export async function localGetNormById(id: string) {
  const norms = await localGetNormsWithRelations()
  return norms.find((n) => n.id === id) ?? null
}

export async function localGetNormCategories(): Promise<NormCategory[]> {
  return normCategoryStore.getAll()
}

export async function localGetNormVersions(normId: string): Promise<NormVersion[]> {
  return normVersionStore.query((v) => v.norm_id === normId)
}

export async function localGetNormChanges(_normId?: string) {
  return []
}

export async function localGetNormChangesWithRelations(_normId?: string) {
  return []
}

// --- Métodos de Aseos ---
export async function localGetCleaningZones(): Promise<CleaningZone[]> {
  return cleaningZoneStore.getAll()
}

export async function localGetCleaningZoneById(id: string): Promise<CleaningZone | null> {
  return cleaningZoneStore.getById(id) ?? null
}

export async function localGetCleaningTasks(zoneId?: string) {
  const tasks = zoneId
    ? cleaningTaskStore.query((t) => t.zone_id === zoneId)
    : cleaningTaskStore.getAll()
  const zones = cleaningZoneStore.getAll()

  return tasks.map((t) => ({
    ...t,
    cleaning_zones: zones.find((z) => z.id === t.zone_id) ?? null,
  }))
}

export async function localGetCleaningAssignments(filters?: {
  profileId?: string
  taskId?: string
  scheduledFor?: string
  status?: string
}) {
  let list = cleaningAssignmentStore.getAll()
  if (filters?.profileId) list = list.filter((a) => a.profile_id === filters.profileId)
  if (filters?.taskId) list = list.filter((a) => a.task_id === filters.taskId)
  if (filters?.scheduledFor) list = list.filter((a) => a.scheduled_for === filters.scheduledFor)
  if (filters?.status) list = list.filter((a) => a.status === filters.status)

  const tasks = cleaningTaskStore.getAll()
  const zones = cleaningZoneStore.getAll()
  const profiles = profileStore.getAll()

  return list.map((a) => {
    const task = tasks.find((t) => t.id === a.task_id)
    const zone = task ? zones.find((z) => z.id === task.zone_id) : null
    const profile = a.profile_id ? profiles.find((p) => p.id === a.profile_id) : null

    return {
      ...a,
      task: task ? { ...task, zone } : null,
      cleaning_tasks: task
        ? {
            id: task.id,
            title: task.title,
            instructions: task.instructions,
            frequency_note: task.frequency_note,
            cleaning_zones: zone ? { id: zone.id, name: zone.name } : null,
          }
        : null,
      profile: profile ? { id: profile.id, display_name: profile.display_name, room_label: profile.room_label } : null,
      profiles: profile ? { id: profile.id, display_name: profile.display_name, room_label: profile.room_label } : null,
    }
  })
}

export async function localGetCleaningAssignmentById(id: string) {
  const all = await localGetCleaningAssignments()
  return all.find((a) => a.id === id) ?? null
}

export async function localGetCleaningReviews(assignmentId?: string) {
  let list = cleaningReviewStore.getAll()
  if (assignmentId) list = list.filter((r) => r.assignment_id === assignmentId)
  const profiles = profileStore.getAll()

  return list.map((r) => {
    const reviewer = r.reviewer_id ? profiles.find((p) => p.id === r.reviewer_id) : null
    return {
      ...r,
      profiles: reviewer ? { id: reviewer.id, display_name: reviewer.display_name, room_label: reviewer.room_label } : null,
    }
  })
}

// --- Métodos de Documentos ---
export async function localGetDocuments(): Promise<Document[]> {
  return documentStore.getAll()
}

export async function localGetPublishedDocuments(): Promise<Document[]> {
  return documentStore.query((d) => d.status === 'publicado')
}

export async function localGetDocumentById(id: string): Promise<Document | null> {
  return documentStore.getById(id) ?? null
}

// --- Métodos de Actas y Decisiones ---
export async function localGetAssemblyMinutes(): Promise<AssemblyMinute[]> {
  return assemblyStore.getAll().sort((a, b) => (b.meeting_date ?? '').localeCompare(a.meeting_date ?? ''))
}

export async function localGetPublishedAssemblyMinutes(): Promise<AssemblyMinute[]> {
  return assemblyStore.query((a) => a.status === 'publicado').sort((a, b) => (b.meeting_date ?? '').localeCompare(a.meeting_date ?? ''))
}

export async function localGetAssemblyMinuteById(id: string) {
  const m = assemblyStore.getById(id)
  if (!m) return null
  const decisions = decisionStore.query((d) => d.assembly_id === id)
  const doc = m.document_id ? documentStore.getById(m.document_id) : null
  return {
    ...m,
    decisions,
    documents: doc ? { id: doc.id, title: doc.title, document_date: doc.document_date } : null,
  }
}

export async function localGetDecisions(filters?: {
  assemblyId?: string
  decisionType?: string
  scope?: string
  affectedNormId?: string
}) {
  let list = decisionStore.getAll()
  if (filters?.assemblyId) list = list.filter((d) => d.assembly_id === filters.assemblyId)
  if (filters?.decisionType) list = list.filter((d) => d.decision_type === filters.decisionType)
  if (filters?.scope) list = list.filter((d) => d.scope === filters.scope)
  if (filters?.affectedNormId) list = list.filter((d) => d.affected_norm_id === filters.affectedNormId)

  const assemblies = assemblyStore.getAll()
  const norms = normStore.getAll()

  return list.map((d) => ({
    ...d,
    assembly_minutes: assemblies.find((a) => a.id === d.assembly_id) ? {
      id: d.assembly_id!,
      title: assemblies.find((a) => a.id === d.assembly_id)!.title,
      meeting_date: assemblies.find((a) => a.id === d.assembly_id)!.meeting_date,
    } : null,
    norms: d.affected_norm_id ? {
      id: d.affected_norm_id,
      title: norms.find((n) => n.id === d.affected_norm_id)?.title || 'Norma',
    } : null,
  }))
}

export async function localGetPublishedDecisions() {
  return localGetDecisions()
}

export async function localGetDecisionById(id: string) {
  const all = await localGetDecisions()
  return all.find((d) => d.id === id) ?? null
}

// --- Métodos de Avisos ---
export async function localGetAnnouncements(): Promise<Announcement[]> {
  return announcementStore.getAll().sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
}

export async function localGetActiveAnnouncements(): Promise<Announcement[]> {
  return announcementStore.query((a) => a.status === 'publicado')
}

export async function localGetAnnouncementById(id: string): Promise<Announcement | null> {
  return announcementStore.getById(id) ?? null
}

// --- Métodos de Perfiles ---
export async function localGetProfiles(): Promise<Profile[]> {
  return profileStore.getAll()
}

export async function localGetProfile(id: string): Promise<Profile | null> {
  return profileStore.getById(id) ?? null
}

export async function localGetProfileWithRoles(id: string) {
  const profile = profileStore.getById(id)
  if (!profile) return null
  const roles = profileRoleStore.query((r) => r.profile_id === id)
  return {
    ...profile,
    profile_roles: roles.map((r) => ({ role: r.role })),
  }
}

// --- Métodos de Incumplimientos y Medidas Correctivas ---
export async function localGetViolations(filters?: {
  affectedProfileId?: string
  reportedBy?: string
  status?: string
  sourceNormId?: string
}): Promise<Violation[]> {
  let list = violationStore.getAll()
  if (filters?.affectedProfileId) list = list.filter((v) => v.affected_profile_id === filters.affectedProfileId)
  if (filters?.reportedBy) list = list.filter((v) => v.reported_by === filters.reportedBy)
  if (filters?.status) list = list.filter((v) => v.status === filters.status)
  if (filters?.sourceNormId) list = list.filter((v) => v.source_norm_id === filters.sourceNormId)
  return list.sort((a, b) => (b.reported_at ?? '').localeCompare(a.reported_at ?? ''))
}

export async function localGetViolationById(id: string): Promise<Violation | null> {
  return violationStore.getById(id) ?? null
}

export async function localGetCorrectiveMeasures(filters?: {
  violationId?: string
  status?: string
  assignedTo?: string
}): Promise<CorrectiveMeasure[]> {
  let list = correctiveMeasureStore.getAll()
  if (filters?.violationId) list = list.filter((m) => m.violation_id === filters.violationId)
  if (filters?.status) list = list.filter((m) => m.status === filters.status)
  if (filters?.assignedTo) list = list.filter((m) => m.assigned_to === filters.assignedTo)
  return list.sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
}

export async function localGetCorrectiveMeasureById(id: string): Promise<CorrectiveMeasure | null> {
  return correctiveMeasureStore.getById(id) ?? null
}

export async function localGetCaseEvents(violationId?: string): Promise<CaseEvent[]> {
  let list = caseEventStore.getAll()
  if (violationId) list = list.filter((e) => e.violation_id === violationId)
  return list.sort((a, b) => (a.event_date ?? '').localeCompare(b.event_date ?? ''))
}

export async function localGetCaseEvidence(violationId?: string): Promise<CaseEvidence[]> {
  let list = caseEvidenceStore.getAll()
  if (violationId) list = list.filter((e) => e.violation_id === violationId)
  return list.sort((a, b) => (b.uploaded_at ?? '').localeCompare(a.uploaded_at ?? ''))
}

export async function localGetAuditEvents(): Promise<AuditEvent[]> {
  return auditEventStore.getAll().sort((a, b) => (b.changed_at ?? '').localeCompare(a.changed_at ?? ''))
}
