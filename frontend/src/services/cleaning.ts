import { supabase } from '@lib/supabase'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'
import {
  localGetCleaningZones,
  localGetCleaningZoneById,
  localGetCleaningTasks,
  localGetCleaningAssignments,
  localGetCleaningAssignmentById,
  localGetCleaningReviews,
} from './local/localDataService'

type CleaningZone = Tables['cleaning_zones']
type CleaningTask = Tables['cleaning_tasks']
type CleaningAssignment = Tables['cleaning_assignments']
type CleaningReview = Tables['cleaning_reviews']
type CleaningZoneInsert = TablesInsert['cleaning_zones']
type CleaningTaskInsert = TablesInsert['cleaning_tasks']
type CleaningAssignmentInsert = TablesInsert['cleaning_assignments']
type CleaningReviewInsert = TablesInsert['cleaning_reviews']
type CleaningZoneUpdate = TablesUpdate['cleaning_zones']
type CleaningTaskUpdate = TablesUpdate['cleaning_tasks']
type CleaningAssignmentUpdate = TablesUpdate['cleaning_assignments']
type CleaningReviewUpdate = TablesUpdate['cleaning_reviews']

export async function getCleaningZones(): Promise<CleaningZone[]> {
  if (!supabase) return localGetCleaningZones()
  const { data, error } = await supabase
    .from('cleaning_zones')
    .select('*')
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getCleaningZonesWithRelations() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('cleaning_zones')
    .select(`
      *,
      source_document:documents!cleaning_zones_source_document_id_fkey (id, title, document_type, document_date),
      cleaning_tasks (*)
    `)
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getCleaningZoneById(id: string) {
  if (!supabase) return localGetCleaningZoneById(id) as any
  const { data, error } = await supabase
    .from('cleaning_zones')
    .select(`
      *,
      source_document:documents!cleaning_zones_source_document_id_fkey (id, title, document_type, document_date),
      cleaning_tasks (
        *,
        cleaning_assignments (
          *,
          profile:profiles!cleaning_assignments_profile_id_fkey (id, display_name, room_label)
        )
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createCleaningZone(zone: CleaningZoneInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('cleaning_zones').insert(zone).select().single()
  if (error) throw error
  return data
}

export async function updateCleaningZone(id: string, zone: CleaningZoneUpdate) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('cleaning_zones').update(zone).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCleaningZone(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('cleaning_zones').delete().eq('id', id)
  if (error) throw error
}

export async function getCleaningTasks(zoneId?: string): Promise<CleaningTask[]> {
  if (!supabase) return localGetCleaningTasks(zoneId) as any
  let query = supabase.from('cleaning_tasks').select('*').order('title')
  if (zoneId) query = query.eq('zone_id', zoneId)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getCleaningTaskById(id: string) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('cleaning_tasks')
    .select(`
      *,
      zone:cleaning_zones!cleaning_tasks_zone_id_fkey (id, name),
      source_document:documents!cleaning_tasks_source_document_id_fkey (id, title, document_type, document_date),
      cleaning_assignments (
        *,
        profile:profiles!cleaning_assignments_profile_id_fkey (id, display_name, room_label),
        cleaning_reviews (
          *,
          reviewer:profiles!cleaning_reviews_reviewer_id_fkey (id, display_name)
        )
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createCleaningTask(task: CleaningTaskInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('cleaning_tasks').insert(task).select().single()
  if (error) throw error
  return data
}

export async function updateCleaningTask(id: string, task: CleaningTaskUpdate) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('cleaning_tasks').update(task).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCleaningTask(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('cleaning_tasks').delete().eq('id', id)
  if (error) throw error
}

export async function getCleaningAssignments(filters?: { profileId?: string; taskId?: string; scheduledFor?: string; status?: string }): Promise<CleaningAssignment[]> {
  if (!supabase) return localGetCleaningAssignments(filters) as any
  let query = supabase
    .from('cleaning_assignments')
    .select(`
      *,
      task:cleaning_tasks!cleaning_assignments_task_id_fkey (id, title, zone_id, zone:cleaning_zones!cleaning_tasks_zone_id_fkey (id, name)),
      profile:profiles!cleaning_assignments_profile_id_fkey (id, display_name, room_label),
      source_document:documents!cleaning_assignments_source_document_id_fkey (id, title)
    `)
    .order('scheduled_for', { ascending: true })
  if (filters?.profileId) query = query.eq('profile_id', filters.profileId)
  if (filters?.taskId) query = query.eq('task_id', filters.taskId)
  if (filters?.scheduledFor) query = query.eq('scheduled_for', filters.scheduledFor)
  if (filters?.status) query = query.eq('status', filters.status)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getCleaningAssignmentById(id: string) {
  if (!supabase) return localGetCleaningAssignmentById(id) as any
  const { data, error } = await supabase
    .from('cleaning_assignments')
    .select(`
      *,
      task:cleaning_tasks!cleaning_assignments_task_id_fkey (id, title, instructions, zone_id, zone:cleaning_zones!cleaning_tasks_zone_id_fkey (id, name)),
      profile:profiles!cleaning_assignments_profile_id_fkey (id, display_name, room_label),
      source_document:documents!cleaning_assignments_source_document_id_fkey (id, title),
      cleaning_reviews (
        *,
        reviewer:profiles!cleaning_reviews_reviewer_id_fkey (id, display_name)
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createCleaningAssignment(assignment: CleaningAssignmentInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('cleaning_assignments').insert(assignment).select().single()
  if (error) throw error
  return data
}

export async function updateCleaningAssignment(id: string, assignment: CleaningAssignmentUpdate) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('cleaning_assignments').update(assignment).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCleaningAssignment(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('cleaning_assignments').delete().eq('id', id)
  if (error) throw error
}

export async function getCleaningReviews(assignmentId?: string): Promise<CleaningReview[]> {
  if (!supabase) return localGetCleaningReviews(assignmentId) as any
  let query = supabase
    .from('cleaning_reviews')
    .select(`
      *,
      assignment:cleaning_assignments!cleaning_reviews_assignment_id_fkey (id, task_id, scheduled_for),
      reviewer:profiles!cleaning_reviews_reviewer_id_fkey (id, display_name)
    `)
    .order('reviewed_at', { ascending: false })
  if (assignmentId) query = query.eq('assignment_id', assignmentId)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createCleaningReview(review: CleaningReviewInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('cleaning_reviews').insert(review).select().single()
  if (error) throw error
  return data
}

export async function updateCleaningReview(id: string, review: CleaningReviewUpdate) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('cleaning_reviews').update(review).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCleaningReview(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('cleaning_reviews').delete().eq('id', id)
  if (error) throw error
}