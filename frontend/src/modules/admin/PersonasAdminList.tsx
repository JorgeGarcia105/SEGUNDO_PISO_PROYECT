import { useState, useMemo, useCallback, lazy } from 'react'
import { Table, Card, Input, Select, Button, Badge, Dropdown, type DropdownItem } from '@components/ui'
import { useAllProfiles } from '@hooks/useProfiles'
import { useAuth } from '@hooks/useAuth'
import { formatDate } from '@utils/date'
import { createProfile, updateProfile, deleteProfile, addProfileRole } from '@services/profiles'
import { toast } from '@components/ui/Toast'

const roleOptions = [
  { value: 'usuario', label: 'Residente' },
  { value: 'administrador', label: 'Administrador' },
  { value: 'superadministrador', label: 'Superadmin' },
]

export function PersonasAdminList() {
  const { profile: currentProfile } = useAuth()
  const { profiles, loading, error, refetch } = useAllProfiles()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<{
    id: string
    display_name: string
    room_label: string | null
    is_active: boolean
  } | null>(null)
  const [formLoaded, setFormLoaded] = useState(false)

  const [roleFormOpen, setRoleFormOpen] = useState(false)
  const [roleProfileId, setRoleProfileId] = useState<string | null>(null)
  const [roleToAdd, setRoleToAdd] = useState<'usuario' | 'administrador' | 'superadministrador'>('usuario')

  const isSuperAdmin = currentProfile?.profile_roles?.some((r) => r.role === 'superadministrador')

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.room_label?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = !selectedRole || p.profile_roles?.some((r) => r.role === selectedRole)

      return matchesSearch && matchesRole
    })
  }, [profiles, searchQuery, selectedRole])

  const hasActiveFilters = !!searchQuery || !!selectedRole

  const handleCreateProfile = useCallback(async (data: {
    display_name: string
    room_label: string | null
    is_active: boolean
  }) => {
    try {
      await createProfile({
        ...data,
        is_active: data.is_active ?? true,
      })
      toast.success('Persona creada correctamente')
      setFormOpen(false)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al crear persona')
    }
  }, [refetch])

  const handleUpdateProfile = useCallback(async (data: {
    display_name: string
    room_label: string | null
    is_active: boolean
  }) => {
    if (!editingProfile) return
    try {
      await updateProfile(editingProfile.id, data)
      toast.success('Persona actualizada correctamente')
      setFormOpen(false)
      setEditingProfile(null)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al actualizar persona')
    }
  }, [editingProfile, refetch])

  const handleDeleteProfile = useCallback(async (id: string) => {
    if (!confirm('¿Eliminar esta persona?')) return
    try {
      await deleteProfile(id)
      toast.success('Persona eliminada')
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al eliminar persona')
    }
  }, [refetch])

  const handleOpenForm = useCallback((data?: {
    id: string
    display_name: string
    room_label: string | null
    is_active: boolean
  }) => {
    if (!formLoaded) setFormLoaded(true)
    if (data) setEditingProfile(data)
    else setEditingProfile(null)
    setFormOpen(true)
  }, [formLoaded])

  const handleAddRole = useCallback(async () => {
    if (!roleProfileId) return
    try {
      await addProfileRole({ profile_id: roleProfileId, role: roleToAdd })
      toast.success('Rol añadido correctamente')
      setRoleFormOpen(false)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al añadir rol')
    }
  }, [roleProfileId, roleToAdd, refetch])

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Persona',
        render: (p: any) => (
          <div>
            <p className="font-medium text-gray-900">{p.display_name || 'Sin nombre'}</p>
            {p.room_label && <p className="text-sm text-gray-500">{p.room_label}</p>}
          </div>
        ),
      },
      {
        key: 'roles',
        header: 'Roles',
        render: (p: any) => (
          <div className="flex flex-wrap gap-1">
            {p.profile_roles?.map((r: any) => (
              <Badge key={r.role} variant="outline" className="text-xs">
                {r.role === 'superadministrador' ? 'Superadmin' : r.role === 'administrador' ? 'Admin' : 'Residente'}
              </Badge>
            )) || []}
          </div>
        ),
      },
      {
        key: 'active',
        header: 'Activo',
        render: (p: any) => p.is_active ? (
          <Badge variant="success" className="text-xs">Sí</Badge>
        ) : (
          <Badge variant="default" className="text-xs">No</Badge>
        ),
      },
      {
        key: 'created',
        header: 'Creado',
        render: (p: any) => p.created_at ? formatDate(p.created_at) : <span className="text-gray-400">-</span>,
      },
      {
        key: 'actions',
        header: 'Acciones',
        render: (p: any) => {
          const items: DropdownItem[] = [
            { label: 'Editar', onClick: () => handleOpenForm({ id: p.id, display_name: p.display_name, room_label: p.room_label, is_active: p.is_active }), icon: <EditIcon /> },
          ]
          if (isSuperAdmin) {
            items.push({ label: 'Gestionar roles', onClick: () => { setRoleProfileId(p.id); setRoleFormOpen(true) }, icon: <UserIcon /> })
          }
          if (isSuperAdmin && p.id !== currentProfile?.id) {
            items.push({ divider: true })
            items.push({ label: 'Eliminar', onClick: () => handleDeleteProfile(p.id), danger: true, icon: <TrashIcon /> })
          }
          return (
            <Dropdown
              items={items}
              trigger={<Button variant="ghost" size="sm"><MoreIcon /></Button>}
            />
          )
        },
      },
    ],
    [isSuperAdmin, handleDeleteProfile, handleOpenForm, currentProfile?.id]
  )

  return (
    <>
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Personas y Cargos</h2>
            <p className="text-sm text-gray-500">{filteredProfiles.length} de {profiles.length} personas</p>
          </div>
          <Button onClick={() => handleOpenForm()}>Nueva persona</Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-100 mb-4">
          <div className="flex-1 min-w-[200px]">
            <Select
              label="Rol"
              options={[{ value: '', label: 'Todos los roles' }, ...roleOptions]}
              value={selectedRole || ''}
              onChange={(e) => setSelectedRole(e.target.value || null)}
              placeholder="Todos los roles"
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <Input
              label="Buscar"
              placeholder="Nombre, habitación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
          {hasActiveFilters && (
            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSelectedRole(null) }} className="h-10">
                Limpiar
              </Button>
            </div>
          )}
        </div>

        <Table
          data={filteredProfiles}
          columns={columns}
          keyExtractor={(p) => p.id}
          loading={loading}
          emptyMessage="No se encontraron personas"
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
            {error}
            <Button variant="outline" size="sm" className="ml-2" onClick={refetch}>Reintentar</Button>
          </div>
        )}
      </Card>

      {formLoaded && (
        <ProfileFormModal
          isOpen={formOpen}
          onClose={() => { setFormOpen(false); setEditingProfile(null) }}
          onSubmit={editingProfile ? handleUpdateProfile : handleCreateProfile}
          initialData={editingProfile}
          loading={loading}
        />
      )}

      {roleFormOpen && (
        <RoleFormModal
          isOpen={roleFormOpen}
          onClose={() => { setRoleFormOpen(false); setRoleProfileId(null) }}
          onSubmit={handleAddRole}
          roleToAdd={roleToAdd}
          setRoleToAdd={setRoleToAdd}
          roles={roleOptions}
        />
      )}
    </>
  )
}

function EditIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
}

function UserIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
}

function TrashIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
}

function MoreIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
}

const ProfileFormModal = lazy(() => import('./ProfileFormModal').then((m) => ({ default: m.ProfileFormModal })))
const RoleFormModal = lazy(() => import('./RoleFormModal').then((m) => ({ default: m.RoleFormModal })))