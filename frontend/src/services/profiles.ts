import { supabase } from '@lib/supabase'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'
import {
  localGetProfile,
  localGetProfileWithRoles,
  localGetProfiles,
} from './local/localDataService'

type Profile = Tables['profiles']
type ProfileRole = Tables['profile_roles']
type ProfileInsert = TablesInsert['profiles']
type ProfileUpdate = TablesUpdate['profiles']
type ProfileRoleInsert = TablesInsert['profile_roles']

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return localGetProfile(userId)
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getProfileWithRoles(userId: string) {
  if (!supabase) return localGetProfileWithRoles(userId) as any
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      profile_roles (role)
    `)
    .eq('id', userId)
    .single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getAllProfiles() {
  if (!supabase) return (await localGetProfiles()).map((p) => ({ ...p, profile_roles: [{ role: 'usuario' }] })) as any
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      profile_roles (role)
    `)
    .order('display_name')
  if (error) throw error
  return data ?? []
}

export async function createProfile(profile: ProfileInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('profiles').insert(profile).select().single()
  if (error) throw error
  return data
}

export async function updateProfile(id: string, profile: ProfileUpdate) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('profiles').update(profile).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProfile(id: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('profiles').delete().eq('id', id)
  if (error) throw error
}

export async function getProfileRoles(profileId: string): Promise<ProfileRole[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('profile_roles')
    .select('*')
    .eq('profile_id', profileId)
  if (error) throw error
  return data ?? []
}

export async function addProfileRole(role: ProfileRoleInsert) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase.from('profile_roles').insert(role).select().single()
  if (error) throw error
  return data
}

export async function removeProfileRole(profileId: string, role: ProfileRole['role']) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('profile_roles').delete().eq('profile_id', profileId).eq('role', role)
  if (error) throw error
}

export async function hasRole(role: ProfileRole['role']): Promise<boolean> {
  if (!supabase) return false
  const { data, error } = await supabase
    .rpc('current_user_has_role', { required_role: role })
  if (error) throw error
  return data ?? false
}

export async function isAdmin(): Promise<boolean> {
  if (!supabase) return false
  const { data, error } = await supabase.rpc('is_admin')
  if (error) throw error
  return data ?? false
}

export async function getCurrentUserRoles() {
  if (!supabase) return []
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  return getProfileRoles(user.id)
}

export async function changePassword(currentPassword: string, newPassword: string) {
  if (!supabase) throw new Error('Supabase no configurado')

  // Primero verificamos la contraseña actual intentando hacer login
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('Usuario no autenticado')

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  })
  if (signInError) throw new Error('La contraseña actual es incorrecta')

  // Si la contraseña actual es correcta, actualizamos a la nueva
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })
  if (updateError) throw new Error(updateError.message)
}