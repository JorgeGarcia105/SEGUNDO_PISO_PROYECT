import type { Tables, Enums } from '@/types/database'

export type TableName = keyof Tables

export type MockRow<T extends TableName = TableName> = Tables[T] & {
  id: string
  created_at: string
  updated_at?: string
  [key: string]: unknown
}

export type MockTables = {
  [K in TableName]: MockRow<K>[]
}

export type AppRole = Enums['app_role']
export type PublicationStatus = Enums['publication_status']
export type SourceType = Enums['source_type']
export type NormStatus = Enums['norm_status']
export type DecisionType = Enums['decision_type']
export type ScopeType = Enums['scope_type']
export type CleaningAssignmentStatus = Enums['cleaning_assignment_status']

export interface SelectQueryOptions {
  columns?: string
  filter?: Record<string, unknown>
  orderBy?: { column: string; ascending?: boolean }
  limit?: number
  single?: boolean
}

export interface InsertOptions<T> {
  returning?: boolean
  data: T | T[]
}

export interface UpdateOptions<T> {
  filter: Record<string, unknown>
  data: T
  returning?: boolean
}

export interface DeleteOptions {
  filter: Record<string, unknown>
}