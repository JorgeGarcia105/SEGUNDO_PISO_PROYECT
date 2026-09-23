import { supabase } from '@lib/supabase'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'
import {
  localGetNorms,
  localGetNormsWithRelations,
  localGetNormById,
  localGetNormCategories,
  localGetNormVersions,
  localGetNormChanges,
} from './local/localDataService'

type Norm = Tables['norms']
type NormVersion = Tables['norm_versions']
type NormCategory = Tables['norm_categories']
type NormInsert = TablesInsert['norms']
type NormVersionInsert = TablesInsert['norm_versions']
type NormCategoryInsert = TablesInsert['norm_categories']
type NormUpdate = TablesUpdate['norms']
type NormVersionUpdate = TablesUpdate['norm_versions']
type NormCategoryUpdate = TablesUpdate['norm_categories']

export async function getNorms(): Promise<Norm[]> {
  if (!supabase) return localGetNorms()
  const { data, error } = await supabase
    .from('norms')
    .select('*')
    .order('title')
  if (error) throw error
  return data ?? []
}

export async function getNormsWithRelations() {
  if (!supabase) return localGetNormsWithRelations()
  const { data, error } = await supabase
    .from('norms')
    .select(`
      id,
      title,
      category_id,
      norm_categories!norms_category_id_fkey (id, name, description),
      norm_versions (id, version_number, text_content, status, valid_from, valid_until, source_document_id, source_note, approval_note, created_at)
    `)
    .order('title')
  if (error) throw error
  return data ?? []
}

export async function getNormById(id: string) {
  if (!supabase) return localGetNormById(id)
  const { data, error } = await supabase
    .from('norms')
    .select(`
      *,
      norm_categories!norms_category_id_fkey (id, name, description),
      norm_versions (id, version_number, text_content, status, valid_from, valid_until, source_document_id, source_note, approval_note, created_at)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createNorm(norm: NormInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('norms').insert(norm).select().single()
  if (error) throw error
  return data
}

export async function updateNorm(id: string, norm: NormUpdate) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('norms').update(norm).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteNorm(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('norms').delete().eq('id', id)
  if (error) throw error
}

export async function getNormVersions(normId: string): Promise<NormVersion[]> {
  if (!supabase) return localGetNormVersions(normId)
  const { data, error } = await supabase
    .from('norm_versions')
    .select('*')
    .eq('norm_id', normId)
    .order('version_number', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getNormVersionById(id: string) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('norm_versions')
    .select(`
      *,
      source_document:documents!norm_versions_source_document_id_fkey (id, title, document_type, document_date)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createNormVersion(version: NormVersionInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('norm_versions').insert(version).select().single()
  if (error) throw error
  return data
}

export async function updateNormVersion(id: string, version: NormVersionUpdate) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('norm_versions').update(version).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteNormVersion(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('norm_versions').delete().eq('id', id)
  if (error) throw error
}

export async function getNormCategories(): Promise<NormCategory[]> {
  if (!supabase) return localGetNormCategories()
  const { data, error } = await supabase
    .from('norm_categories')
    .select('*')
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function createNormCategory(category: NormCategoryInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('norm_categories').insert(category).select().single()
  if (error) throw error
  return data
}

export async function updateNormCategory(id: string, category: NormCategoryUpdate) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('norm_categories').update(category).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteNormCategory(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('norm_categories').delete().eq('id', id)
  if (error) throw error
}

export async function getNormChanges(normId?: string) {
  if (!supabase) return localGetNormChanges(normId)
  let query = supabase
    .from('norm_changes')
    .select(`
      *,
      decision:decisions!norm_changes_decision_id_fkey (id, title, decision_type, scope),
      previous_version:norm_versions!norm_changes_previous_version_id_fkey (id, version_number, text_content, status),
      new_version:norm_versions!norm_changes_new_version_id_fkey (id, version_number, text_content, status),
      confirmed_by_profile:profiles!norm_changes_confirmed_by_fkey (id, display_name)
    `)
    .order('created_at', { ascending: false })
  if (normId) query = query.eq('norm_id', normId)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getNormChangesWithRelations(normId?: string) {
  if (!supabase) return localGetNormChanges(normId)
  let query = supabase
    .from('norm_changes')
    .select(`
      *,
      decision:decisions!norm_changes_decision_id_fkey (
        id,
        title,
        decision_type,
        scope,
        assembly_minutes:assembly_minutes!decisions_assembly_id_fkey (id, title, meeting_date)
      ),
      previous_version:norm_versions!norm_changes_previous_version_id_fkey (id, version_number, text_content, status, valid_from, valid_until, source_document_id, source_note, approval_note, created_at),
      new_version:norm_versions!norm_changes_new_version_id_fkey (id, version_number, text_content, status, valid_from, valid_until, source_document_id, source_note, approval_note, created_at),
      confirmed_by_profile:profiles!norm_changes_confirmed_by_fkey (id, display_name)
    `)
    .order('created_at', { ascending: false })
  if (normId) query = query.eq('norm_id', normId)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createNormChange(change: { decision_id: string; norm_id: string; previous_version_id?: string; new_version_id?: string; confirmation_note: string; confirmed_by?: string; confirmed_at?: string }) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('norm_changes').insert(change).select().single()
  if (error) throw error
  return data
}