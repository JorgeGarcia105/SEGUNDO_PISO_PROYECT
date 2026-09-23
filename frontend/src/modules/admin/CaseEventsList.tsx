import { useState, useMemo, useCallback, lazy } from 'react'
import { Table, Card, Input, Select, Button, Badge, Dropdown, type DropdownItem } from '@components/ui'
import { useCaseEvents } from '@hooks/useViolations'
import { useAuth } from '@hooks/useAuth'
import { formatDateTime } from '@utils/date'
import { createCaseEvent } from '@services/violations'

import { toast } from '@components/ui/Toast'
import type { CaseEventType } from '@/types/database'

const typeOptions = [
  { value: '', label: 'Todos los tipos' },
  { value: 'CREACION', label: 'Creación' },
  { value: 'INVESTIGACION', label: 'Investigación' },
  { value: 'DESCARGOS', label: 'Descargos' },
  { value: 'AUDIENCIA', label: 'Audiencia' },
  { value: 'RESOLUCION', label: 'Resolución' },
  { value: 'APELACION', label: 'Apelación' },
  { value: 'EJECUCION_MEDIDA', label: 'Ejecución medida' },
  { value: 'CIERRE', label: 'Cierre' },
  { value: 'NOTA', label: 'Nota' },
]

export function CaseEventsList({ violationId }: { violationId?: string }) {
  const { profile } = useAuth()
  const { events, loading, error, refetch } = useCaseEvents(violationId)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<{
    id: string
    violation_id: string
    event_type: CaseEventType
    description: string
    event_date: string
  } | null>(null)
  const [formLoaded, setFormLoaded] = useState(false)

  const isAdmin = profile?.profile_roles?.some((r) => r.role === 'administrador' || r.role === 'superadministrador')

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        !searchQuery ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = !selectedType || e.event_type === selectedType

      return matchesSearch && matchesType
    })
  }, [events, searchQuery, selectedType])

  const hasActiveFilters = !!searchQuery || !!selectedType

  const handleCreateEvent = useCallback(async (data: {
    violation_id: string
    event_type: CaseEventType
    description: string
    event_date: string
  }) => {
    try {
      await createCaseEvent({
        ...data,
        created_by: profile?.id ?? null,
      })
      toast.success('Evento creado correctamente')
      setFormOpen(false)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al crear evento')
    }
  }, [profile?.id, refetch])

  const handleOpenForm = useCallback((data?: {
    id: string
    violation_id: string
    event_type: CaseEventType
    description: string
    event_date: string
  }) => {
    if (!formLoaded) setFormLoaded(true)
    if (data) setEditingEvent(data)
    else setEditingEvent({
      id: '',
      violation_id: violationId || '',
      event_type: 'NOTA',
      description: '',
      event_date: new Date().toISOString(),
    })
    setFormOpen(true)
  }, [formLoaded, violationId])

  const columns = useMemo(
    () => [
      {
        key: 'date',
        header: 'Fecha',
        render: (e: any) => formatDateTime(e.event_date),
      },
      {
        key: 'type',
        header: 'Tipo',
        render: (e: any) => {
          const labels: Record<string, string> = {
            CREACION: 'Creación',
            INVESTIGACION: 'Investigación',
            DESCARGOS: 'Descargos',
            AUDIENCIA: 'Audiencia',
            RESOLUCION: 'Resolución',
            APELACION: 'Apelación',
            EJECUCION_MEDIDA: 'Ejecución medida',
            CIERRE: 'Cierre',
            NOTA: 'Nota',
          }
          return <Badge variant="outline" className="text-xs">{labels[e.event_type] || e.event_type}</Badge>
        },
      },
      {
        key: 'description',
        header: 'Descripción',
        render: (e: any) => <p className="text-gray-900 line-clamp-2">{e.description}</p>,
      },
      {
        key: 'created_by',
        header: 'Creado por',
        render: (e: any) => e.created_by_profile?.display_name || <span className="text-gray-400">Desconocido</span>,
      },
      {
        key: 'actions',
        header: 'Acciones',
        render: () => {
          const items: DropdownItem[] = [
            { label: 'Ver detalle', onClick: () => {}, icon: <EyeIcon /> },
          ]
          if (isAdmin) {
            items.push({ divider: true })
            items.push({
              label: 'Eliminar',
              onClick: () => { /* delete not implemented */ },
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
    [isAdmin, violationId]
  )

  return (
    <>
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Eventos del Caso</h2>
            <p className="text-sm text-gray-500">{filteredEvents.length} de {events.length} eventos</p>
          </div>
          {isAdmin && violationId && (
            <Button onClick={() => handleOpenForm()}>Nuevo evento</Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-100 mb-4">
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
              placeholder="Descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
          {hasActiveFilters && (
            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSelectedType(null) }} className="h-10">
                Limpiar
              </Button>
            </div>
          )}
        </div>

        <Table
          data={filteredEvents}
          columns={columns}
          keyExtractor={(e) => e.id}
          loading={loading}
          emptyMessage={violationId ? "No se encontraron eventos para este incumplimiento" : "Seleccione un incumplimiento para ver sus eventos"}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
            {error}
            <Button variant="outline" size="sm" className="ml-2" onClick={refetch}>Reintentar</Button>
          </div>
        )}
      </Card>

      {formLoaded && violationId && (
        <CaseEventFormModal
          isOpen={formOpen}
          onClose={() => { setFormOpen(false); setEditingEvent(null) }}
          onSubmit={handleCreateEvent}
          initialData={editingEvent}
          loading={loading}
        />
      )}
    </>
  )
}

function EyeIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
}

function TrashIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
}

function MoreIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
}

const CaseEventFormModal = lazy(() => import('./CaseEventFormModal').then((m) => ({ default: m.CaseEventFormModal })))