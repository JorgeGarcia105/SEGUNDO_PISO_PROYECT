import { supabase } from '@lib/supabase'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'
import {
  localGetAnnouncements,
  localGetActiveAnnouncements,
  localGetAnnouncementById,
} from './local/localDataService'

type Announcement = Tables['announcements']
type AnnouncementInsert = TablesInsert['announcements']
type AnnouncementUpdate = TablesUpdate['announcements']

export async function getAnnouncements(): Promise<Announcement[]> {
  if (!supabase) return localGetAnnouncements()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getActiveAnnouncements(): Promise<Announcement[]> {
  if (!supabase) return localGetActiveAnnouncements()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('status', 'publicado')
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`expires_at.is.null,expires_at.gte.${now}`)
    .order('is_important', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getAnnouncementById(id: string) {
  if (!supabase) return localGetAnnouncementById(id) as any
  const { data, error } = await supabase
    .from('announcements')
    .select(`
      *,
      created_by_profile:profiles!announcements_created_by_fkey (id, display_name)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createAnnouncement(announcement: AnnouncementInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('announcements').insert(announcement).select().single()
  if (error) throw error
  return data
}

export async function updateAnnouncement(id: string, announcement: AnnouncementUpdate) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('announcements').update(announcement).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteAnnouncement(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) throw error
}