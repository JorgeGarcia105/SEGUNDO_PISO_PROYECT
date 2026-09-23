import { useState, useMemo, useCallback, lazy } from 'react'
import { Table, Card, Input, Select, Button, Badge, Dropdown, type DropdownItem } from '@components/ui'
import { useViolations } from '@hooks/useViolations'
import { useAuth } from '@hooks/useAuth'
import { formatDate } from '@utils/date'
import { createViolation, updateViolation, deleteViolation } from '@services/violations'
import { useNavigate } from 'react-router-dom'
import { toast } from '@components/ui/Toast'
import type { ScopeType } from '@/types/database'

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'ABIERTO', label: 'Abierto' },
  { value: 'EN_INVESTIGACION', label: 'En investigación' },
  { value: 'DESCARGOS_PRESENTADOS', label: 'Descargos presentados' },
  { value: 'RESUELTO', label: 'Resuelto' },
  { value: 'ARCHIVADO', label: 'Archivado' },
]

const scopeOptions = [
  { value: '', label: 'Todos los alcances' },
  { value: 'GENERAL', label: 'General' },
  { value: 'TEMPORAL', label: 'Temporal' },
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'EXTERNO', label: 'Externo' },
  { value: 'NO_DETERMINADO', label: 'No determinado' },
]

export function ViolationsList() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { violations, loading, error, refetch } = useViolations()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedScope, setSelectedScope] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingViolation, setEditingViolation] = useState<{
    id: string
    title: string
    detail: string
    violation_date: string
    affected_profile_id: string | null
    source_norm_id: string | null
    source_decision_id: string | null
    scope: ScopeType
  } | null>(null)
  const [formLoaded, setFormLoaded] = useState(false)

  const isAdmin = profile?.profile_roles?.some((r) => r.role === 'administrador' || r.role === 'superadministrador')

  const filteredViolations = useMemo(() => {
    return violations.filter((v) => {
      const matchesSearch =
        !searchQuery ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.affected_profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = !selectedStatus || v.status === selectedStatus
      const matchesScope = !selectedScope || v.scope === selectedScope

      return matchesSearch && matchesStatus && matchesScope
    })
  }, [violations, searchQuery, selectedStatus, selectedScope])

  const hasActiveFilters = !!searchQuery || !!selectedStatus || !!selectedScope

  const handleCreateViolation = useCallback(async (data: {
    title: string
    detail: string
    violation_date: string
    affected_profile_id: string | null
    source_norm_id: string | null
    source_decision_id: string | null
    scope: ScopeType
  }) => {
    try {
      await createViolation({
        ...data,
        reported_by: profile?.id ?? null,
        created_by: profile?.id ?? null,
        status: 'ABIERTO',
        reported_at: new Date().toISOString(),
        source_document_id: null,
        evidence_note: null,
        resolution_note: null,
        resolved_by: null,
        resolved_at: null,
      })
      toast.success('Incumplimiento creado correctamente')
      setFormOpen(false)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al crear incumplimiento')
    }
  }, [profile?.id, refetch])

  const handleUpdateViolation = useCallback(async (data: {
    title: string
    detail: string
    violation_date: string
    affected_profile_id: string | null
    source_norm_id: string | null
    source_decision_id: string | null
    scope: ScopeType
  }) => {
    if (!editingViolation) return
    try {
      await updateViolation(editingViolation.id, data)
      toast.success('Incumplimiento actualizado correctamente')
      setFormOpen(false)
      setEditingViolation(null)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al actualizar incumplimiento')
    }
  }, [editingViolation, refetch])

  const handleDeleteViolation = useCallback(async (id: string) => {
    if (!confirm('¿Eliminar este incumplimiento y todos sus datos asociados?')) return
    try {
      await deleteViolation(id)
      toast.success('Incumplimiento eliminado')
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al eliminar incumplimiento')
    }
  }, [refetch])

  const handleOpenForm = useCallback((data?: {
    id: string
    title: string
    detail: string
    violation_date: string
    affected_profile_id: string | null
    source_norm_id: string | null
    source_decision_id: string | null
    scope: ScopeType
  }) => {
    if (!formLoaded) setFormLoaded(true)
    if (data) setEditingViolation(data)
    else setEditingViolation(null)
    setFormOpen(true)
  }, [formLoaded])

  const columns = useMemo(
    () => [
      {
        key: 'title',
        header: 'Incumplimiento',
        render: (v: any) => (
          <div>
            <p className="font-medium text-gray-900">{v.title}</p>
            <p className="text-sm text-gray-500 line-clamp-1 mt-1">{v.detail}</p>
          </div>
        ),
      },
      {
        key: 'date',
        header: 'Fecha',
        render: (v: any) => v.violation_date ? formatDate(v.violation_date) : <span className="text-gray-400">Sin fecha</span>,
      },
      {
        key: 'affected',
        header: 'Residente',
        render: (v: any) => v.affected_profile ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-sm">
              {v.affected_profile.display_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-medium text-gray-900">{v.affected_profile.display_name || 'Sin nombre'}</p>
              {v.affected_profile.room_label && <p className="text-xs text-gray-500">{v.affected_profile.room_label}</p>}
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Sin asignar</span>
        ),
      },
      {
        key: 'status',
        header: 'Estado',
        render: (v: any) => {
          const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
            ABIERTO: 'info',
            EN_INVESTIGACION: 'warning',
            DESCARGOS_PRESENTADOS: 'warning',
            RESUELTO: 'success',
            ARCHIVADO: 'default',
          }
          return <Badge variant={variants[v.status] || 'default'}>{v.status.replace(/_/g, ' ')}</Badge>
        },
      },
      {
        key: 'scope',
        header: 'Alcance',
        render: (v: any) => <Badge variant="outline" className="text-xs">{v.scope.replace(/_/g, ' ')}</Badge>,
      },
      {
        key: 'source',
        header: 'Fuente',
        render: (v: any) => {
          if (v.source_norm) return <Badge variant="outline" className="text-xs">Norma: {v.source_norm.title}</Badge>
          if (v.source_decision) return <Badge variant="outline" className="text-xs">Decisión: {v.source_decision.title}</Badge>
          if (v.source_document) return <Badge variant="outline" className="text-xs">Doc: {v.source_document.title}</Badge>
          return <span className="text-gray-400 text-sm">Sin fuente vinculada</span>
        },
      },
      {
        key: 'measures',
        header: 'Medidas',
        render: (v: any) => (
          <span className="text-sm text-gray-500">{v.corrective_measures?.length || 0} medida{v.corrective_measures?.length !== 1 ? 's' : ''}</span>
        ),
      },
      {
        key: 'actions',
        header: 'Acciones',
        render: (v: any) => {
          const items: DropdownItem[] = [
            { label: 'Ver detalle', onClick: () => navigate(`/admin/incumplimientos/${v.id}`), icon: <EyeIcon /> },
            { label: 'Ver medidas', onClick: () => navigate(`/admin/incumplimientos/${v.id}/medidas`), icon: <ListIcon /> },
            { label: 'Ver eventos', onClick: () => navigate(`/admin/incumplimientos/${v.id}/eventos`), icon: <CalendarIcon /> },
            { label: 'Ver evidencias', onClick: () => navigate(`/admin/incumplimientos/${v.id}/evidencias`), icon: <FileIcon /> },
          ]
          if (isAdmin) {
            items.push({ divider: true })
            items.push({
              label: 'Editar',
              onClick: () => handleOpenForm({
                id: v.id,
                title: v.title,
                detail: v.detail,
                violation_date: v.violation_date,
                affected_profile_id: v.affected_profile_id,
                source_norm_id: v.source_norm_id,
                source_decision_id: v.source_decision_id,
                scope: v.scope,
              }),
              icon: <EditIcon />,
            })
            items.push({ divider: true })
            items.push({
              label: 'Eliminar',
              onClick: () => handleDeleteViolation(v.id),
              danger: true,
              icon: <TrashIcon />,
            })
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
    [isAdmin, handleDeleteViolation, handleOpenForm, navigate]
  )

  return (
    <>
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Incumplimientos</h2>
            <p className="text-sm text-gray-500">{filteredViolations.length} de {violations.length} incumplimientos</p>
          </div>
          {isAdmin && (
            <Button onClick={() => handleOpenForm()}>Nuevo incumplimiento</Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-100 mb-4">
          <div className="flex-1 min-w-[200px]">
            <Select
              label="Estado"
              options={statusOptions}
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              placeholder="Todos los estados"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Select
              label="Alcance"
              options={scopeOptions}
              value={selectedScope || ''}
              onChange={(e) => setSelectedScope(e.target.value || null)}
              placeholder="Todos los alcances"
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <Input
              label="Buscar"
              placeholder="Título, detalle, residente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
          {hasActiveFilters && (
            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSelectedStatus(null); setSelectedScope(null) }} className="h-10">
                Limpiar
              </Button>
            </div>
          )}
        </div>

        <Table
          data={filteredViolations}
          columns={columns}
          keyExtractor={(v) => v.id}
          loading={loading}
          emptyMessage="No se encontraron incumplimientos"
          onRowClick={(v) => navigate(`/admin/incumplimientos/${v.id}`)}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
            {error}
            <Button variant="outline" size="sm" className="ml-2" onClick={refetch}>Reintentar</Button>
          </div>
        )}
      </Card>

      {formLoaded && (
        <ViolationFormModal
          isOpen={formOpen}
          onClose={() => { setFormOpen(false); setEditingViolation(null) }}
          onSubmit={editingViolation ? handleUpdateViolation : handleCreateViolation}
          initialData={editingViolation}
          loading={loading}
        />
      )}
    </>
  )
}

function EyeIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
}

function ListIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
}

function CalendarIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
}

function FileIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
}

function EditIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
}

function TrashIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
}

function MoreIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
}

const ViolationFormModal = lazy(() => import('./ViolationFormModal').then((m) => ({ default: m.ViolationFormModal })))