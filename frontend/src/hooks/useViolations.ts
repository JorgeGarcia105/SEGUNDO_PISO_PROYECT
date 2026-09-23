import { useEffect, useState } from 'react'
import {
  getViolations,
  getViolationById,
  getCorrectiveMeasures,
  getCorrectiveMeasureById,
  getCaseEvents,
  getCaseEvidence,
} from '@services/violations'
import type { Tables } from '@/types/database'

type Violation = Tables['violations']
type CorrectiveMeasure = Tables['corrective_measures']
type CaseEvent = Tables['case_events']
type CaseEvidence = Tables['case_evidence']
type Profile = Tables['profiles']
type Norm = Tables['norms']
type Decision = Tables['decisions']
type Document = Tables['documents']

interface ViolationWithRelations extends Violation {
  affected_profile?: Pick<Profile, 'id' | 'display_name' | 'room_label'> | null
  reported_by_profile?: Pick<Profile, 'id' | 'display_name' | 'room_label'> | null
  resolved_by_profile?: Pick<Profile, 'id' | 'display_name'> | null
  source_norm?: Pick<Norm, 'id' | 'title'> | null
  source_decision?: Pick<Decision, 'id' | 'title' | 'decision_type'> | null
  source_document?: Pick<Document, 'id' | 'title' | 'document_type'> | null
  corrective_measures?: (CorrectiveMeasure & {
    assigned_to_profile?: Pick<Profile, 'id' | 'display_name' | 'room_label'> | null
    assigned_by_profile?: Pick<Profile, 'id' | 'display_name'> | null
    source_document?: Pick<Document, 'id' | 'title'> | null
  })[]
  case_events?: (CaseEvent & {
    created_by_profile?: Pick<Profile, 'id' | 'display_name'> | null
  })[]
  case_evidence?: (CaseEvidence & {
    uploaded_by_profile?: Pick<Profile, 'id' | 'display_name'> | null
  })[]
}

interface CorrectiveMeasureWithRelations extends CorrectiveMeasure {
  violation?: Pick<Violation, 'id' | 'title' | 'affected_profile_id'>
  assigned_to_profile?: Pick<Profile, 'id' | 'display_name' | 'room_label'> | null
  assigned_by_profile?: Pick<Profile, 'id' | 'display_name'> | null
  source_document?: Pick<Document, 'id' | 'title'> | null
}

export function useViolations(filters?: {
  affectedProfileId?: string
  reportedBy?: string
  status?: string
  sourceNormId?: string
}) {
  const [violations, setViolations] = useState<ViolationWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getViolations(filters)
      setViolations(data as ViolationWithRelations[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar incumplimientos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [filters?.affectedProfileId, filters?.reportedBy, filters?.status, filters?.sourceNormId])

  return { violations, loading, error, refetch: fetch }
}

export function useViolation(id: string | null) {
  const [violation, setViolation] = useState<ViolationWithRelations | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getViolationById(id)
      setViolation(data as ViolationWithRelations | null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar incumplimiento')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  return { violation, loading, error, refetch: fetch }
}

export function useCorrectiveMeasures(filters?: {
  violationId?: string
  status?: string
  assignedTo?: string
}) {
  const [measures, setMeasures] = useState<CorrectiveMeasureWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getCorrectiveMeasures(filters)
      setMeasures(data as CorrectiveMeasureWithRelations[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar medidas correctivas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [filters?.violationId, filters?.status, filters?.assignedTo])

  return { measures, loading, error, refetch: fetch }
}

export function useCorrectiveMeasure(id: string | null) {
  const [measure, setMeasure] = useState<CorrectiveMeasureWithRelations | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getCorrectiveMeasureById(id)
      setMeasure(data as CorrectiveMeasureWithRelations | null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar medida correctiva')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  return { measure, loading, error, refetch: fetch }
}

export function useCaseEvents(violationId?: string) {
  const [events, setEvents] = useState<CaseEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getCaseEvents(violationId)
      setEvents(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar eventos del caso')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [violationId])

  return { events, loading, error, refetch: fetch }
}

export function useCaseEvidence(violationId?: string) {
  const [evidence, setEvidence] = useState<CaseEvidence[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getCaseEvidence(violationId)
      setEvidence(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar evidencias')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [violationId])

  return { evidence, loading, error, refetch: fetch }
}