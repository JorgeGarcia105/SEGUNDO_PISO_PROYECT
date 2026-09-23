import { useEffect, useState } from 'react'
import { getCleaningZonesWithRelations, getCleaningZoneById, getCleaningTasks, getCleaningTaskById, getCleaningAssignments, getCleaningAssignmentById, getCleaningReviews } from '@services/cleaning'
import type { Tables } from '@/types/database'

type CleaningZone = Tables['cleaning_zones']
type CleaningTask = Tables['cleaning_tasks']
type CleaningAssignment = Tables['cleaning_assignments']
type CleaningReview = Tables['cleaning_reviews']
type Profile = Tables['profiles']

interface CleaningZoneWithRelations extends CleaningZone {
  source_document?: { id: string; title: string; document_type: string; document_date: string | null } | null
  cleaning_tasks?: (CleaningTask & {
    cleaning_assignments?: (CleaningAssignment & { profile?: Pick<Profile, 'id' | 'display_name' | 'room_label'> })[]
  })[]
}

interface CleaningTaskWithRelations extends CleaningTask {
  zone?: Pick<CleaningZone, 'id' | 'name'>
  source_document?: { id: string; title: string; document_type: string; document_date: string | null } | null
  cleaning_assignments?: (CleaningAssignment & {
    profile?: Pick<Profile, 'id' | 'display_name' | 'room_label'>
    cleaning_reviews?: (CleaningReview & { reviewer?: Pick<Profile, 'id' | 'display_name'> })[]
  })[]
}

interface CleaningAssignmentWithRelations extends CleaningAssignment {
  task?: CleaningTask & { zone?: Pick<CleaningZone, 'id' | 'name'> }
  profile?: Pick<Profile, 'id' | 'display_name' | 'room_label'>
  source_document?: { id: string; title: string } | null
  cleaning_reviews?: (CleaningReview & { reviewer?: Pick<Profile, 'id' | 'display_name'> })[]
}

interface CleaningReviewWithRelations extends CleaningReview {
  assignment?: { id: string; task_id: string; scheduled_for: string | null }
  reviewer?: Pick<Profile, 'id' | 'display_name'>
}

export function useCleaningZones() {
  const [zones, setZones] = useState<CleaningZoneWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getCleaningZonesWithRelations()
      setZones(data as CleaningZoneWithRelations[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar zonas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { zones, loading, error, refetch: fetch }
}

export function useCleaningZone(id: string | null) {
  const [zone, setZone] = useState<CleaningZoneWithRelations | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getCleaningZoneById(id)
      setZone(data as CleaningZoneWithRelations | null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar zona')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  return { zone, loading, error, refetch: fetch }
}

export function useCleaningTasks(zoneId?: string) {
  const [tasks, setTasks] = useState<CleaningTaskWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getCleaningTasks(zoneId)
      setTasks(data as CleaningTaskWithRelations[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar tareas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [zoneId])

  return { tasks, loading, error, refetch: fetch }
}

export function useCleaningTask(id: string | null) {
  const [task, setTask] = useState<CleaningTaskWithRelations | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getCleaningTaskById(id)
      setTask(data as CleaningTaskWithRelations | null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar tarea')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  return { task, loading, error, refetch: fetch }
}

export function useCleaningAssignments(filters?: { profileId?: string; taskId?: string; scheduledFor?: string; status?: string }) {
  const [assignments, setAssignments] = useState<CleaningAssignmentWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getCleaningAssignments(filters)
      setAssignments(data as CleaningAssignmentWithRelations[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar asignaciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [filters?.profileId, filters?.taskId, filters?.scheduledFor, filters?.status])

  return { assignments, loading, error, refetch: fetch }
}

export function useCleaningAssignment(id: string | null) {
  const [assignment, setAssignment] = useState<CleaningAssignmentWithRelations | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getCleaningAssignmentById(id)
      setAssignment(data as CleaningAssignmentWithRelations | null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar asignación')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  return { assignment, loading, error, refetch: fetch }
}

export function useCleaningReviews(assignmentId?: string) {
  const [reviews, setReviews] = useState<CleaningReviewWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getCleaningReviews(assignmentId)
      setReviews(data as CleaningReviewWithRelations[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar revisiones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [assignmentId])

  return { reviews, loading, error, refetch: fetch }
}