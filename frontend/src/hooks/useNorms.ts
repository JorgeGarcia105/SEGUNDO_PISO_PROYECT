import { useEffect, useState } from 'react'
import { getNormsWithRelations, getNormById, getNormCategories, getNormVersions, getNormChanges, getNormChangesWithRelations } from '@services/norms'
import type { Tables } from '@/types/database'

type Norm = Tables['norms']
type NormVersion = Tables['norm_versions']
type NormCategory = Tables['norm_categories']
type NormChange = Tables['norm_changes']
type Decision = Tables['decisions']
type AssemblyMinute = Tables['assembly_minutes']

type NormWithRelations = Norm & {
  norm_categories: Array<{ id: string; name: string; description: string | null }> | null
  norm_versions: Array<{ id: string; version_number: number; text_content: string; status: string; valid_from: string | null; valid_until: string | null; source_document_id: string | null; source_note: string | null; approval_note: string | null; created_at: string }>
}

type NormChangeWithRelations = NormChange & {
  decision: (Decision & { assembly_minutes: AssemblyMinute | null }) | null
  previous_version: NormVersion | null
  new_version: NormVersion | null
  confirmed_by_profile: { id: string; display_name: string | null } | null
}

export function useNorms() {
  const [norms, setNorms] = useState<NormWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getNormsWithRelations()
      setNorms(data as NormWithRelations[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar normas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { norms, loading, error, refetch: fetch }
}

export function useNorm(id: string | null) {
  const [norm, setNorm] = useState<NormWithRelations | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getNormById(id)
      setNorm(data as NormWithRelations | null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar norma')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  return { norm, loading, error, refetch: fetch }
}

export function useNormCategories() {
  const [categories, setCategories] = useState<NormCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getNormCategories()
      setCategories(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { categories, loading, error, refetch: fetch }
}

export function useNormVersions(normId: string | null) {
  const [versions, setVersions] = useState<NormVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!normId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getNormVersions(normId)
      setVersions(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar versiones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [normId])

  return { versions, loading, error, refetch: fetch }
}

export function useNormChanges(normId?: string) {
  const [changes, setChanges] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getNormChanges(normId)
      setChanges(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar cambios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [normId])

  return { changes, loading, error, refetch: fetch }
}

export function useNormChangesWithRelations(normId?: string) {
  const [changes, setChanges] = useState<NormChangeWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!normId) {
      setChanges([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await getNormChangesWithRelations(normId)
      setChanges(data as NormChangeWithRelations[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar cambios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [normId])

  return { changes, loading, error, refetch: fetch }
}