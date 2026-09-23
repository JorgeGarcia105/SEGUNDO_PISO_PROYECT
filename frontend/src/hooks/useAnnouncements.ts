import { useEffect, useState } from 'react'
import { getAnnouncements, getActiveAnnouncements, getAnnouncementById } from '@services/announcements'
import type { Tables } from '@/types/database'

type Announcement = Tables['announcements']

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getAnnouncements()
      setAnnouncements(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar avisos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { announcements, loading, error, refetch: fetch }
}

export function useActiveAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getActiveAnnouncements()
      setAnnouncements(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar avisos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { announcements, loading, error, refetch: fetch }
}

export function useAnnouncement(id: string | null) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getAnnouncementById(id)
      setAnnouncement(data as Announcement | null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar aviso')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  return { announcement, loading, error, refetch: fetch }
}