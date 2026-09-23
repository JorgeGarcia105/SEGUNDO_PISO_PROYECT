import { useEffect, useState } from 'react'
import { getAuditEvents } from '@services/audit'
import type { Tables } from '@/types/database'

type AuditEvent = Tables['audit_events']

export function useAuditEvents() {
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getAuditEvents()
      setEvents(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar auditoría')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { events, loading, error, refetch: fetch }
}