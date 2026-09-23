import { supabase } from '@lib/supabase'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'
import {
  localGetDecisions,
  localGetPublishedDecisions,
  localGetDecisionById,
  localGetAssemblyMinutes,
  localGetPublishedAssemblyMinutes,
  localGetAssemblyMinuteById,
} from './local/localDataService'

type Decision = Tables['decisions']
type DecisionInsert = TablesInsert['decisions']
type DecisionUpdate = TablesUpdate['decisions']
type AssemblyMinute = Tables['assembly_minutes']
type AssemblyMinuteInsert = TablesInsert['assembly_minutes']
type AssemblyMinuteUpdate = TablesUpdate['assembly_minutes']

export async function getDecisions(filters?: { assemblyId?: string; decisionType?: string; scope?: string; affectedNormId?: string }): Promise<Decision[]> {
  if (!supabase) return localGetDecisions(filters) as any
  let query = supabase
    .from('decisions')
    .select(`
      *,
      assembly:assembly_minutes!decisions_assembly_id_fkey (id, title, meeting_date),
      affected_norm:norms!decisions_affected_norm_id_fkey (id, title),
      norm_changes (
        *,
        previous_version:norm_versions!norm_changes_previous_version_id_fkey (id, version_number, text_content, status),
        new_version:norm_versions!norm_changes_new_version_id_fkey (id, version_number, text_content, status)
      )
    `)
    .order('created_at', { ascending: false })
  if (filters?.assemblyId) query = query.eq('assembly_id', filters.assemblyId)
  if (filters?.decisionType) query = query.eq('decision_type', filters.decisionType)
  if (filters?.scope) query = query.eq('scope', filters.scope)
  if (filters?.affectedNormId) query = query.eq('affected_norm_id', filters.affectedNormId)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getPublishedDecisions() {
  if (!supabase) return localGetPublishedDecisions() as any
  const { data, error } = await supabase
    .from('decisions')
    .select(`
      *,
      assembly:assembly_minutes!decisions_assembly_id_fkey (id, title, meeting_date),
      affected_norm:norms!decisions_affected_norm_id_fkey (id, title)
    `)
    .in('decision_type', ['DECISION_APROBADA', 'INFORMACION', 'INFORME'])
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getDecisionById(id: string) {
  if (!supabase) return localGetDecisionById(id) as any
  const { data, error } = await supabase
    .from('decisions')
    .select(`
      *,
      assembly:assembly_minutes!decisions_assembly_id_fkey (id, title, meeting_date, document_id),
      affected_norm:norms!decisions_affected_norm_id_fkey (id, title),
      norm_changes (
        *,
        previous_version:norm_versions!norm_changes_previous_version_id_fkey (id, version_number, text_content, status),
        new_version:norm_versions!norm_changes_new_version_id_fkey (id, version_number, text_content, status)
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createDecision(decision: DecisionInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('decisions').insert(decision).select().single()
  if (error) throw error
  return data
}

export async function updateDecision(id: string, decision: DecisionUpdate) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('decisions').update(decision).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteDecision(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('decisions').delete().eq('id', id)
  if (error) throw error
}

export async function getAssemblyMinutes(): Promise<AssemblyMinute[]> {
  if (!supabase) return localGetAssemblyMinutes() as any
  const { data, error } = await supabase
    .from('assembly_minutes')
    .select(`
      *,
      document:documents!assembly_minutes_document_id_fkey (id, title, document_type, document_date),
      decisions (id, title, decision_type, scope, decision_type)
    `)
    .order('meeting_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getPublishedAssemblyMinutes() {
  if (!supabase) return localGetPublishedAssemblyMinutes() as any
  const { data, error } = await supabase
    .from('assembly_minutes')
    .select(`
      *,
      document:documents!assembly_minutes_document_id_fkey (id, title, document_type, document_date),
      decisions (id, title, decision_type, scope)
    `)
    .eq('status', 'publicado')
    .order('meeting_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getAssemblyMinuteById(id: string) {
  if (!supabase) return localGetAssemblyMinuteById(id) as any
  const { data, error } = await supabase
    .from('assembly_minutes')
    .select(`
      *,
      document:documents!assembly_minutes_document_id_fkey (id, title, document_type, document_date, storage_path),
      decisions (
        *,
        affected_norm:norms!decisions_affected_norm_id_fkey (id, title)
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createAssemblyMinute(minute: AssemblyMinuteInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('assembly_minutes').insert(minute).select().single()
  if (error) throw error
  return data
}

export async function updateAssemblyMinute(id: string, minute: AssemblyMinuteUpdate) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('assembly_minutes').update(minute).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteAssemblyMinute(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('assembly_minutes').delete().eq('id', id)
  if (error) throw error
}