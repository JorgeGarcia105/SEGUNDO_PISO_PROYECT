import { supabase } from '@lib/supabase'
import type { Tables } from '@/types/database'
import { localGetAuditEvents } from './local/localDataService'

type AuditEvent = Tables['audit_events']

export async function getAuditEvents(): Promise<AuditEvent[]> {
  if (!supabase) return localGetAuditEvents() as any
  const { data, error } = await supabase
    .from('audit_events')
    .select('*')
    .order('changed_at', { ascending: false })
    .limit(500)
  if (error) throw error
  return data ?? []
}