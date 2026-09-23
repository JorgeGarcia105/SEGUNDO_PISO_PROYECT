import { supabase } from '@lib/supabase'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'
import {
  localGetViolations,
  localGetViolationById,
  localGetCorrectiveMeasures,
  localGetCorrectiveMeasureById,
  localGetCaseEvents,
  localGetCaseEvidence,
} from './local/localDataService'

type Violation = Tables['violations']
type ViolationInsert = TablesInsert['violations']
type ViolationUpdate = TablesUpdate['violations']
type CorrectiveMeasure = Tables['corrective_measures']
type CorrectiveMeasureInsert = TablesInsert['corrective_measures']
type CorrectiveMeasureUpdate = TablesUpdate['corrective_measures']
type CaseEvent = Tables['case_events']
type CaseEventInsert = TablesInsert['case_events']
type CaseEvidence = Tables['case_evidence']
type CaseEvidenceInsert = TablesInsert['case_evidence']

export async function getViolations(filters?: {
  affectedProfileId?: string
  reportedBy?: string
  status?: string
  sourceNormId?: string
}): Promise<Violation[]> {
  if (!supabase) return localGetViolations(filters) as any
  let query = supabase
    .from('violations')
    .select(`
      *,
      affected_profile:profiles!violations_affected_profile_id_fkey (id, display_name, room_label),
      reported_by_profile:profiles!violations_reported_by_fkey (id, display_name, room_label),
      resolved_by_profile:profiles!violations_resolved_by_fkey (id, display_name),
      source_norm:norms!violations_source_norm_id_fkey (id, title),
      source_decision:decisions!violations_source_decision_id_fkey (id, title),
      source_document:documents!violations_source_document_id_fkey (id, title)
    `)
    .order('reported_at', { ascending: false })
  if (filters?.affectedProfileId) query = query.eq('affected_profile_id', filters.affectedProfileId)
  if (filters?.reportedBy) query = query.eq('reported_by', filters.reportedBy)
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.sourceNormId) query = query.eq('source_norm_id', filters.sourceNormId)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getViolationById(id: string) {
  if (!supabase) return localGetViolationById(id) as any
  const { data, error } = await supabase
    .from('violations')
    .select(`
      *,
      affected_profile:profiles!violations_affected_profile_id_fkey (id, display_name, room_label),
      reported_by_profile:profiles!violations_reported_by_fkey (id, display_name, room_label),
      resolved_by_profile:profiles!violations_resolved_by_fkey (id, display_name),
      source_norm:norms!violations_source_norm_id_fkey (id, title),
      source_decision:decisions!violations_source_decision_id_fkey (id, title, decision_type),
      source_document:documents!violations_source_document_id_fkey (id, title, document_type),
      corrective_measures (*),
      case_events (*),
      case_evidence (*)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createViolation(violation: ViolationInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('violations').insert(violation).select().single()
  if (error) throw error
  return data
}

export async function updateViolation(id: string, violation: ViolationUpdate) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('violations').update(violation).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteViolation(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('violations').delete().eq('id', id)
  if (error) throw error
}

export async function getCorrectiveMeasures(filters?: {
  violationId?: string
  status?: string
  assignedTo?: string
}): Promise<CorrectiveMeasure[]> {
  if (!supabase) return localGetCorrectiveMeasures(filters) as any
  let query = supabase
    .from('corrective_measures')
    .select(`
      *,
      violation:violations!corrective_measures_violation_id_fkey (id, title, affected_profile_id),
      assigned_to_profile:profiles!corrective_measures_assigned_to_fkey (id, display_name, room_label),
      assigned_by_profile:profiles!corrective_measures_assigned_by_fkey (id, display_name),
      source_document:documents!corrective_measures_source_document_id_fkey (id, title)
    `)
    .order('created_at', { ascending: false })
  if (filters?.violationId) query = query.eq('violation_id', filters.violationId)
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.assignedTo) query = query.eq('assigned_to', filters.assignedTo)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getCorrectiveMeasureById(id: string) {
  if (!supabase) return localGetCorrectiveMeasureById(id) as any
  const { data, error } = await supabase
    .from('corrective_measures')
    .select(`
      *,
      violation:violations!corrective_measures_violation_id_fkey (id, title, affected_profile_id),
      assigned_to_profile:profiles!corrective_measures_assigned_to_fkey (id, display_name, room_label),
      assigned_by_profile:profiles!corrective_measures_assigned_by_fkey (id, display_name),
      source_document:documents!corrective_measures_source_document_id_fkey (id, title)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createCorrectiveMeasure(measure: CorrectiveMeasureInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('corrective_measures').insert(measure).select().single()
  if (error) throw error
  return data
}

export async function updateCorrectiveMeasure(id: string, measure: CorrectiveMeasureUpdate) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('corrective_measures').update(measure).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCorrectiveMeasure(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('corrective_measures').delete().eq('id', id)
  if (error) throw error
}

export async function getCaseEvents(violationId?: string): Promise<CaseEvent[]> {
  if (!supabase) return localGetCaseEvents(violationId) as any
  let query = supabase
    .from('case_events')
    .select(`
      *,
      created_by_profile:profiles!case_events_created_by_fkey (id, display_name)
    `)
    .order('event_date', { ascending: true })
  if (violationId) query = query.eq('violation_id', violationId)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createCaseEvent(event: CaseEventInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('case_events').insert(event).select().single()
  if (error) throw error
  return data
}

export async function getCaseEvidence(violationId?: string): Promise<CaseEvidence[]> {
  if (!supabase) return localGetCaseEvidence(violationId) as any
  let query = supabase
    .from('case_evidence')
    .select(`
      *,
      uploaded_by_profile:profiles!case_evidence_uploaded_by_fkey (id, display_name)
    `)
    .order('uploaded_at', { ascending: false })
  if (violationId) query = query.eq('violation_id', violationId)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createCaseEvidence(evidence: CaseEvidenceInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('case_evidence').insert(evidence).select().single()
  if (error) throw error
  return data
}

export async function deleteCaseEvidence(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('case_evidence').delete().eq('id', id)
  if (error) throw error
}