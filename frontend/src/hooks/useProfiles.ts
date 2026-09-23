import { useEffect, useState } from 'react'
import { getProfileWithRoles, getAllProfiles, getProfileRoles, hasRole, isAdmin } from '@services/profiles'
import type { Tables } from '@/types/database'

type Profile = Tables['profiles']
type ProfileRole = Tables['profile_roles']

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<(Profile & { profile_roles: Array<{ role: string }> }) | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getProfileWithRoles(userId)
      setProfile(data as (Profile & { profile_roles: Array<{ role: string }> }) | null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar perfil')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [userId])

  return { profile, loading, error, refetch: fetch }
}

export function useAllProfiles() {
  const [profiles, setProfiles] = useState<(Profile & { profile_roles: Array<{ role: string }> })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllProfiles()
      setProfiles(data as (Profile & { profile_roles: Array<{ role: string }> })[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar perfiles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { profiles, loading, error, refetch: fetch }
}

export function useProfileRoles(profileId: string | null) {
  const [roles, setRoles] = useState<ProfileRole[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    if (!profileId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getProfileRoles(profileId)
      setRoles(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar roles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [profileId])

  return { roles, loading, error, refetch: fetch }
}

export function useHasRole(role: ProfileRole['role']) {
  const [has, setHas] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const result = await hasRole(role)
      setHas(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al verificar rol')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [role])

  return { has, loading, error, refetch: fetch }
}

export function useIsAdmin() {
  const [admin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const result = await isAdmin()
      setAdmin(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al verificar admin')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { admin, loading, error, refetch: fetch }
}