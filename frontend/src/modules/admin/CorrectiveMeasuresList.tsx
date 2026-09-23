import { useState, useMemo, useCallback, lazy } from 'react'
import { Table, Card, Input, Select, Button, Badge, Dropdown, type DropdownItem } from '@components/ui'
import { useCorrectiveMeasures } from '@hooks/useViolations'
import { useAuth } from '@hooks/useAuth'
import { formatDate } from '@utils/date'
import { createCorrectiveMeasure, updateCorrectiveMeasure, deleteCorrectiveMeasure } from '@services/violations'
import { useNavigate } from 'react-router-dom'
import { toast } from '@components/ui/Toast'
import type { MeasureStatus, MeasureType } from '@/types/database'

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'EN_EJECUCION', label: 'En ejecución' },
  { value: 'COMPLETADA', label: 'Completada' },
  { value: 'INCUMPLIDA', label: 'Incumplida' },
  { value: 'CANCELADA', label: 'Cancelada' },
]

const typeOptions = [
  { value: '', label: 'Todos los tipos' },
  { value: 'ASEO_ADICIONAL', label: 'Aseo adicional' },
  { value: 'MULTA_ECONOMICA', label: 'Multa económica' },
  { value: 'RESTRICCION_USO', label: 'Restricción de uso' },
  { value: 'AMONESTACION', label: 'Amonestación' },
  { value: 'OTRA', label: 'Otra' },
]

export function CorrectiveMeasuresList({ violationId }: { violationId?: string }) {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { measures, loading, error, refetch } = useCorrectiveMeasures({ violationId })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingMeasure, setEditingMeasure] = useState<{
    id: string
    violation_id: string
    measure_type: MeasureType
    detail: string
    quantity: number | null
    unit: string | null
    status: MeasureStatus
    assigned_to: string | null
    assigned_by: string | null
    due_at: string | null
    source_document_id: string | null
  } | null>(null)
  const [formLoaded, setFormLoaded] = useState(false)

  const isAdmin = profile?.profile_roles?.some((r) => r.role === 'administrador' || r.role === 'superadministrador')

  const filteredMeasures = useMemo(() => {
    return measures.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.violation?.title?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = !selectedStatus || m.status === selectedStatus
      const matchesType = !selectedType || m.measure_type === selectedType

      return matchesSearch && matchesStatus && matchesType
    })
  }, [measures, searchQuery, selectedStatus, selectedType])

  const hasActiveFilters = !!searchQuery || !!selectedStatus || !!selectedType

  const handleCreateMeasure = useCallback(async (data: {
    violation_id: string
    measure_type: MeasureType
    detail: string
    quantity: number | null
    unit: string | null
    status: MeasureStatus
    assigned_to: string | null
    assigned_by: string | null
    due_at: string | null
    source_document_id: string | null
  }) => {
    try {
      await createCorrectiveMeasure({
        ...data,
        created_by: profile?.id ?? null,
        assigned_at: data.assigned_to ? new Date().toISOString() : null,
        completed_at: null,
        completion_note: null,
      })
      toast.success('Medida correctiva creada correctamente')
      setFormOpen(false)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al crear medida correctiva')
    }
  }, [profile?.id, refetch])

  const handleUpdateMeasure = useCallback(async (data: {
    violation_id: string
    measure_type: MeasureType
    detail: string
    quantity: number | null
    unit: string | null
    status: MeasureStatus
    assigned_to: string | null
    assigned_by: string | null
    due_at: string | null
    source_document_id: string | null
  }) => {
    if (!editingMeasure) return
    try {
      await updateCorrectiveMeasure(editingMeasure.id, data)
      toast.success('Medida correctiva actualizada correctamente')
      setFormOpen(false)
      setEditingMeasure(null)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al actualizar medida correctiva')
    }
  }, [editingMeasure, refetch])

  const handleDeleteMeasure = useCallback(async (id: string) => {
    if (!confirm('¿Eliminar esta medida correctiva?')) return
    try {
      await deleteCorrectiveMeasure(id)
      toast.success('Medida correctiva eliminada')
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al eliminar medida correctiva')
    }
  }, [refetch])

  const handleOpenForm = useCallback((data?: {
    id: string
    violation_id: string
    measure_type: MeasureType
    detail: string
    quantity: number | null
    unit: string | null
    status: MeasureStatus
    assigned_to: string | null
    assigned_by: string | null
    due_at: string | null
    source_document_id: string | null
  }) => {
    if (!formLoaded) setFormLoaded(true)
    if (data) setEditingMeasure(data)
    else setEditingMeasure({
      id: '',
      violation_id: violationId || '',
      measure_type: 'ASEO_ADICIONAL' as MeasureType,
      detail: '',
      quantity: null,
      unit: null,
      status: 'PENDIENTE' as MeasureStatus,
      assigned_to: null,
      assigned_by: null,
      due_at: null,
      source_document_id: null,
    })
    setFormOpen(true)
  }, [formLoaded, violationId])

  const columns = useMemo(
    () => [
      {
        key: 'violation',
        header: 'Incumplimiento',
        render: (m: any) => m.violation ? (
          <div>
            <p className="font-medium text-gray-900">{m.violation.title}</p>
            <p className="text-xs text-gray-500">{m.violation.affected_profile?.display_name || 'Sin residente'}</p>
          </div>
        ) : (
          <span className="text-gray-400">Sin incumplimiento</span>
        ),
      },
      {
        key: 'type',
        header: 'Tipo',
        render: (m: any) => {
          const labels: Record<string, string> = {
            ASEO_ADICIONAL: 'Aseo adicional',
            MULTA_ECONOMICA: 'Multa económica',
            RESTRICCION_USO: 'Restricción de uso',
            AMONESTACION: 'Amonestación',
            OTRA: 'Otra',
          }
          return <Badge variant="outline" className="text-xs">{labels[m.measure_type] || m.measure_type}</Badge>
        },
      },
      {
        key: 'detail',
        header: 'Detalle',
        render: (m: any) => (
          <div>
            <p className="font-medium text-gray-900 line-clamp-1">{m.detail}</p>
            {m.quantity && <p className="text-sm text-gray-500">Cantidad: {m.quantity} {m.unit || ''}</p>}
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Estado',
        render: (m: any) => {
          const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
            PENDIENTE: 'info',
            EN_EJECUCION: 'warning',
            COMPLETADA: 'success',
            INCUMPLIDA: 'danger',
            CANCELADA: 'default',
          }
          return <Badge variant={variants[m.status] || 'default'}>{m.status.replace(/_/g, ' ')}</Badge>
        },
      },
      {
        key: 'assigned',
        header: 'Asignado a',
        render: (m: any) => m.assigned_to_profile ? (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-xs">
              {m.assigned_to_profile.display_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <span className="text-sm">{m.assigned_to_profile.display_name || 'Sin nombre'}</span>
          </div>
        ) : (
          <span className="text-gray-400">Sin asignar</span>
        ),
      },
      {
        key: 'due',
        header: 'Vence',
        render: (m: any) => m.due_at ? formatDate(m.due_at) : <span className="text-gray-400">-</span>,
      },
      {
        key: 'completed',
        header: 'Completada',
        render: (m: any) => m.completed_at ? formatDate(m.completed_at) : <span className="text-gray-400">-</span>,
      },
      {
        key: 'actions',
        header: 'Acciones',
        render: (m: any) => {
          const items: DropdownItem[] = [
            { label: 'Ver detalle', onClick: () => {}, icon: <EyeIcon /> },
            { label: 'Ver incumplimiento', onClick: () => navigate(`/admin/incumplimientos/${m.violation_id}`), icon: <FileIcon /> },
          ]
          if (isAdmin) {
            items.push({ divider: true })
            items.push({
              label: 'Editar',
              onClick: () => handleOpenForm({
                id: m.id,
                violation_id: m.violation_id,
                measure_type: m.measure_type,
                detail: m.detail,
                quantity: m.quantity,
                unit: m.unit,
                status: m.status,
                assigned_to: m.assigned_to,
                assigned_by: m.assigned_by,
                due_at: m.due_at,
                source_document_id: m.source_document_id,
              }),
              icon: <EditIcon />,
            })
            items.push({
              label: 'Marcar completada',
              onClick: async () => {
                await updateCorrectiveMeasure(m.id, { status: 'COMPLETADA', completed_at: new Date().toISOString() })
                toast.success('Medida marcada como completada')
                refetch()
              },
              icon: <CheckIcon />,
            })
            items.push({ divider: true })
            items.push({
              label: 'Eliminar',
              onClick: () => handleDeleteMeasure(m.id),
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
    [isAdmin, handleDeleteMeasure, handleOpenForm, navigate, refetch, violationId]
  )

  return (
    <>
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Medidas Correctivas</h2>
            <p className="text-sm text-gray-500">{filteredMeasures.length} de {measures.length} medidas</p>
          </div>
          {isAdmin && (
            <Button onClick={() => handleOpenForm()}>Nueva medida</Button>
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
              label="Tipo"
              options={typeOptions}
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value || null)}
              placeholder="Todos los tipos"
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <Input
              label="Buscar"
              placeholder="Detalle, incumplimiento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
          {hasActiveFilters && (
            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSelectedStatus(null); setSelectedType(null) }} className="h-10">
                Limpiar
              </Button>
            </div>
          )}
        </div>

        <Table
          data={filteredMeasures}
          columns={columns}
          keyExtractor={(m) => m.id}
          loading={loading}
          emptyMessage="No se encontraron medidas correctivas"
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
            {error}
            <Button variant="outline" size="sm" className="ml-2" onClick={refetch}>Reintentar</Button>
          </div>
        )}
      </Card>

      {formLoaded && (
        <CorrectiveMeasureFormModal
          isOpen={formOpen}
          onClose={() => { setFormOpen(false); setEditingMeasure(null) }}
          onSubmit={editingMeasure ? handleUpdateMeasure : handleCreateMeasure}
          initialData={editingMeasure}
          loading={loading}
        />
      )}
    </>
  )
}

function EyeIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
}

function FileIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
}

function CheckIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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

const CorrectiveMeasureFormModal = lazy(() => import('./CorrectiveMeasureFormModal').then((m) => ({ default: m.CorrectiveMeasureFormModal })))