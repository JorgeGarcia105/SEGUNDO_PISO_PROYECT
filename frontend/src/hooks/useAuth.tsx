import { useEffect, useState, createContext, useContext, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@lib/supabase'
import { getProfileWithRoles } from '@services/profiles'

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: { id: string; display_name: string | null; room_label: string | null; is_active: boolean; profile_roles: Array<{ role: string }> } | null
  loading: boolean
  error: string | null
  isLocalMode: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
  switchMockRole: (role: 'usuario' | 'administrador' | 'superadministrador') => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const localMockProfiles: Record<string, AuthContextType['profile']> = {
  administrador: {
    id: 'usr-carlos-admin',
    display_name: 'Carlos Rodríguez (Admin)',
    room_label: 'Habitación 218',
    is_active: true,
    profile_roles: [{ role: 'administrador' }],
  },
  usuario: {
    id: 'usr-juan-perez',
    display_name: 'Juan Pérez (Residente)',
    room_label: 'Habitación 204',
    is_active: true,
    profile_roles: [{ role: 'usuario' }],
  },
  superadministrador: {
    id: 'usr-super-admin',
    display_name: 'Dra. Silva (Superadmin)',
    room_label: 'Administración',
    is_active: true,
    profile_roles: [{ role: 'superadministrador' }, { role: 'administrador' }],
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AuthContextType['profile']>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState<string | null>(null)
  const isLocalMode = !isSupabaseConfigured

  async function fetchProfile(userId: string) {
    try {
      const profileData = await getProfileWithRoles(userId)
      setProfile(profileData)
    } catch {
      setProfile(null)
    }
  }

  function switchMockRole(role: 'usuario' | 'administrador' | 'superadministrador') {
    const selected = localMockProfiles[role]
    if (!selected) return
    setProfile(selected)
    const mockUser = {
      id: selected.id,
      email: `${role}@segundopiso.local`,
      user_metadata: { name: selected.display_name },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User
    setUser(mockUser)
    setSession({
      access_token: 'local-mock-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'local-mock-refresh',
      user: mockUser,
    })
  }

  useEffect(() => {
    if (!supabase) {
      // Inicializar sesión mock local por defecto como administrador para testing
      switchMockRole('administrador')
      setLoading(false)
      return
    }

    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session)
        setUser(data.session?.user ?? null)
        if (data.session?.user) {
          fetchProfile(data.session.user.id)
        }
        setLoading(false)
      }
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event: string, nextSession: Session | null) => {
      if (!mounted) return
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      if (nextSession?.user) {
        await fetchProfile(nextSession.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    if (!supabase) {
      if (email.includes('admin')) {
        switchMockRole('administrador')
      } else if (email.includes('super')) {
        switchMockRole('superadministrador')
      } else {
        switchMockRole('usuario')
      }
      return { error: null }
    }
    setError(null)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      const msg = 'No fue posible iniciar sesión. Verifica tus datos o la confirmación del correo.'
      setError(msg)
      return { error: msg }
    }
    return { error: null }
  }

  async function signOut() {
    if (!supabase) {
      setSession(null)
      setUser(null)
      setProfile(null)
      return
    }
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setProfile(null)
  }

  async function refresh() {
    if (!supabase) return
    const { data } = await supabase.auth.getSession()
    setSession(data.session)
    setUser(data.session?.user ?? null)
    if (data.session?.user) {
      await fetchProfile(data.session.user.id)
    }
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, error, isLocalMode, signIn, signOut, refresh, switchMockRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}