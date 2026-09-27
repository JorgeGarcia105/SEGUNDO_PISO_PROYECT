import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Input, FormField, toast } from '@components/ui'
import { useAuth } from '@hooks/useAuth'
import { updateProfile, changePassword } from '@services/profiles'

export function ProfilePage() {
  const navigate = useNavigate()
  const { profile, user, refresh, signOut } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [roomLabel, setRoomLabel] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '')
      setRoomLabel(profile.room_label || '')
    }
  }, [profile])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return

    setIsSaving(true)
    try {
      await updateProfile(profile.id, {
        display_name: displayName || null,
        room_label: roomLabel || null,
      })
      toast.success('Perfil actualizado')
      await refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  function validatePasswords() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Todos los campos son obligatorios')
      return false
    }
    if (newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres')
      return false
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return false
    }
    setPasswordError('')
    return true
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!validatePasswords()) return

    setIsChangingPassword(true)
    try {
      await changePassword(currentPassword, newPassword)
      toast.success('Contraseña cambiada correctamente')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Error al cambiar contraseña')
    } finally {
      setIsChangingPassword(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi cuenta</h1>
          <p className="text-gray-500 mt-1">Gestiona tu perfil y seguridad</p>
        </div>
      </header>

      <Card>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
            {profile?.display_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-medium text-gray-900">{profile?.display_name || user?.email || 'Usuario'}</p>
            <p className="text-sm text-gray-500">{profile?.room_label || 'Sin habitación asignada'}</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mt-1">
              {profile?.profile_roles?.[0]?.role || 'usuario'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Datos personales</h2>

          <FormField label="Nombre completo" required>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre completo"
              maxLength={100}
              disabled={isSaving}
            />
          </FormField>

          <FormField label="Habitación / Ubicación">
            <Input
              value={roomLabel}
              onChange={(e) => setRoomLabel(e.target.value)}
              placeholder="Ej: Habitación 204"
              maxLength={50}
              disabled={isSaving}
            />
          </FormField>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" loading={isSaving}>
              Guardar cambios
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">Seguridad</h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <FormField label="Contraseña actual" required>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isChangingPassword}
            />
          </FormField>

          <FormField label="Nueva contraseña" required>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              disabled={isChangingPassword}
            />
          </FormField>

          <FormField label="Confirmar nueva contraseña" required>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isChangingPassword}
            />
          </FormField>

          {passwordError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
              {passwordError}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" loading={isChangingPassword} variant="outline">
              Cambiar contraseña
            </Button>
          </div>
        </form>
      </Card>

      <Card className="border-red-200 bg-red-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-red-800">Zona de peligro</h3>
            <p className="text-sm text-red-600 mt-1">Una vez eliminada, no se puede recuperar tu cuenta.</p>
          </div>
          <Button variant="ghost" onClick={handleSignOut} className="text-red-600 hover:bg-red-50">
            Cerrar sesión
          </Button>
        </div>
      </Card>
    </div>
  )
}