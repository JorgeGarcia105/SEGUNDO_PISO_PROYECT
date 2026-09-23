import { supabase } from '@lib/supabase'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'
import {
  localGetDocuments,
  localGetPublishedDocuments,
  localGetDocumentById,
} from './local/localDataService'

type Document = Tables['documents']
type DocumentInsert = TablesInsert['documents']
type DocumentUpdate = TablesUpdate['documents']

export async function getDocuments(): Promise<Document[]> {
  if (!supabase) return localGetDocuments()
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('document_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getPublishedDocuments() {
  if (!supabase) return localGetPublishedDocuments() as any
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('status', 'publicado')
    .order('document_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getDocumentById(id: string) {
  if (!supabase) return localGetDocumentById(id) as any
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      created_by_profile:profiles!documents_created_by_fkey (id, display_name)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getDocumentsByType(type: Document['document_type']) {
  if (!supabase) return (await localGetDocuments()).filter((d) => d.document_type === type) as any
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('document_type', type)
    .order('document_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createDocument(document: DocumentInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('documents').insert(document).select().single()
  if (error) throw error
  return data
}

export async function updateDocument(id: string, document: DocumentUpdate) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('documents').update(document).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteDocument(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('documents').delete().eq('id', id)
  if (error) throw error
}

export async function searchDocuments(query: string) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('document_date', { ascending: false })
  if (error) throw error
  return data ?? []
}