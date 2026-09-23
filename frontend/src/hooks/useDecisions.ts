import { useEffect, useState } from 'react'
import { getDecisions, getPublishedDecisions, getDecisionById, getAssemblyMinutes, getPublishedAssemblyMinutes, getAssemblyMinuteById } from '@services/decisions'
import type { Tables } from '@/types/database'

type Decision = Tables['decisions']
type AssemblyMinute = Tables['assembly_minutes']

export function useDecisions(filters?: { assemblyId?: string; decisionType?: string; scope?: string; affectedNormId?: string }) {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getDecisions(filters)
      setDecisions(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar decisiones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [filters?.assemblyId, filters?.decisionType, filters?.scope, filters?.affectedNormId])

  return { decisions, loading, error, refetch: fetch }
}

export function usePublishedDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getPublishedDecisions()
      setDecisions(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar decisiones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { decisions, loading, error, refetch: fetch }
}

export function useDecision(id: string | null) {
  const [decision, setDecision] = useState<Decision | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getDecisionById(id)
      setDecision(data as Decision | null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar decisión')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  return { decision, loading, error, refetch: fetch }
}

export function useAssemblyMinutes() {
  const [minutes, setMinutes] = useState<AssemblyMinute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getAssemblyMinutes()
      setMinutes(data as AssemblyMinute[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar actas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { minutes, loading, error, refetch: fetch }
}

export function usePublishedAssemblyMinutes() {
  const [minutes, setMinutes] = useState<AssemblyMinute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getPublishedAssemblyMinutes()
      setMinutes(data as AssemblyMinute[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar actas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { minutes, loading, error, refetch: fetch }
}

export function useAssemblyMinute(id: string | null) {
  const [minute, setMinute] = useState<AssemblyMinute | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getAssemblyMinuteById(id)
      setMinute(data as AssemblyMinute | null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar acta')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  return { minute, loading, error, refetch: fetch }
}