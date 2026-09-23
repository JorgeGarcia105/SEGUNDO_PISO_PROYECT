import { useState, useMemo } from 'react'
import { Table, Card, Input, Select, Button, Badge, Dropdown, type DropdownItem } from '@components/ui'
import { useCleaningAssignments } from '@hooks/useCleaning'
import { formatDate } from '@utils/date'

export function CleaningAssignmentsList({ profileId }: { profileId?: string }) {
  const { assignments, loading, error, refetch } = useCleaningAssignments({ profileId })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchesSearch =
        !searchQuery ||
        a.task?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.task?.zone?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = !selectedStatus || a.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [assignments, searchQuery, selectedStatus])

  const hasActiveFilters = !!searchQuery || !!selectedStatus

  const statusOptions = useMemo(
    () => [
      { value: '', label: 'Todos los estados' },
      { value: 'PROGRAMADO', label: 'Programado' },
      { value: 'ENTREGADO', label: 'Entregado' },
      { value: 'VERIFICADO', label: 'Verificado' },
      { value: 'INCUMPLIDO', label: 'Incumplido' },
      { value: 'CANCELADO', label: 'Cancelado' },
      { value: 'PENDIENTE_CONFIRMACION', label: 'Pendiente confirmación' },
    ],
    []
  )

  const columns = useMemo(
    () => [
      {
        key: 'task',
        header: 'Tarea',
        render: (a: any) => (
          <div>
            <p className="font-medium text-gray-900">{a.task?.title || 'Sin tarea'}</p>
            <p className="text-sm text-gray-500">{a.task?.zone?.name || 'Sin zona'}</p>
          </div>
        ),
      },
      {
        key: 'profile',
        header: 'Responsable',
        render: (a: any) => a.profile ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-sm">
              {a.profile.display_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-medium text-gray-900">{a.profile.display_name || 'Sin nombre'}</p>
              {a.profile.room_label && <p className="text-xs text-gray-500">{a.profile.room_label}</p>}
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Sin asignar</span>
        ),
      },
      {
        key: 'scheduled',
        header: 'Programado',
        render: (a: any) => a.scheduled_for ? formatDate(a.scheduled_for) : <span className="text-gray-400">Sin fecha</span>,
      },
      {
        key: 'due',
        header: 'Vence',
        render: (a: any) => a.due_at ? formatDate(a.due_at) : <span className="text-gray-400">-</span>,
      },
      {
        key: 'status',
        header: 'Estado',
        render: (a: any) => {
          const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
            PROGRAMADO: 'info',
            ENTREGADO: 'success',
            VERIFICADO: 'success',
            INCUMPLIDO: 'danger',
            CANCELADO: 'default',
            PENDIENTE_CONFIRMACION: 'warning',
          }
          return <Badge variant={variants[a.status] || 'default'}>{a.status.replace(/_/g, ' ')}</Badge>
        },
      },
      {
        key: 'actions',
        header: 'Acciones',
        render: (_a: any) => {
          const items: DropdownItem[] = [
            { label: 'Ver detalle', onClick: () => {}, icon: <EyeIcon /> },
            { label: 'Ver revisiones', onClick: () => {}, icon: <CheckIcon /> },
            { divider: true },
            { label: 'Editar', onClick: () => {}, icon: <EditIcon /> },
            { label: 'Marcar entregado', onClick: () => {}, icon: <CheckIcon /> },
            { label: 'Cancelar', onClick: () => {}, danger: true, icon: <XIcon /> },
          ]
          return (
            <Dropdown
              items={items}
              trigger={<Button variant="ghost" size="sm"><MoreIcon /></Button>}
            />
          )
        },
      },
    ],
    []
  )

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Asignaciones de aseo</h2>
          <p className="text-sm text-gray-500">{filteredAssignments.length} de {assignments.length} asignaciones</p>
        </div>
        <Button onClick={() => {}}>Nueva asignación</Button>
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
        <div className="flex-1 min-w-[250px]">
          <Input
            label="Buscar"
            placeholder="Tarea, zona, responsable..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        {hasActiveFilters && (
          <div className="flex items-end">
            <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSelectedStatus(null) }} className="h-10">
              Limpiar
            </Button>
          </div>
        )}
      </div>

      <Table
        data={filteredAssignments}
        columns={columns}
        keyExtractor={(a) => a.id}
        loading={loading}
        emptyMessage="No se encontraron asignaciones"
        onRowClick={(_a) => {}}
      />

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
          {error}
          <Button variant="outline" size="sm" className="ml-2" onClick={refetch}>Reintentar</Button>
        </div>
      )}
    </Card>
  )
}

function EyeIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
}

function CheckIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
}

function EditIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
}

function XIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
}

function MoreIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
}