import { useEffect, useState } from 'react'
import { getDocuments, getPublishedDocuments, getDocumentById, getDocumentsByType, searchDocuments } from '@services/documents'
import type { Tables } from '@/types/database'

type Document = Tables['documents']

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getDocuments()
      setDocuments(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar documentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { documents, loading, error, refetch: fetch }
}

export function usePublishedDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getPublishedDocuments()
      setDocuments(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar documentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { documents, loading, error, refetch: fetch }
}

export function useDocument(id: string | null) {
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getDocumentById(id)
      setDocument(data as Document | null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar documento')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  return { document, loading, error, refetch: fetch }
}

export function useDocumentsByType(type: Document['document_type'] | null) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!type) return
    setLoading(true)
    setError(null)
    try {
      const data = await getDocumentsByType(type)
      setDocuments(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar documentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [type])

  return { documents, loading, error, refetch: fetch }
}

export function useSearchDocuments(query: string) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!query.trim()) { setDocuments([]); return }
    setLoading(true)
    setError(null)
    try {
      const data = await searchDocuments(query)
      setDocuments(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error en búsqueda')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetch, 300)
    return () => clearTimeout(timer)
  }, [query])

  return { documents, loading, error, refetch: fetch }
}