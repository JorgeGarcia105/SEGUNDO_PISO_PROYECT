import { useState, useMemo } from 'react'
import { Table, Card, Input, Select, Button, Badge, Dropdown, type DropdownItem } from '@components/ui'
import { useCleaningTasks } from '@hooks/useCleaning'

export function CleaningTasksList({ zoneId }: { zoneId?: string }) {
  const { tasks, loading, error, refetch } = useCleaningTasks(zoneId)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !searchQuery ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.instructions?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = !selectedStatus || task.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [tasks, searchQuery, selectedStatus])

  const hasActiveFilters = !!searchQuery || !!selectedStatus

  const statusOptions = useMemo(
    () => [
      { value: '', label: 'Todos los estados' },
      { value: 'borrador', label: 'Borrador' },
      { value: 'publicado', label: 'Publicado' },
      { value: 'archivado', label: 'Archivado' },
    ],
    []
  )

  const columns = useMemo(
    () => [
      {
        key: 'title',
        header: 'Tarea',
        render: (task: any) => (
          <div>
            <p className="font-medium text-gray-900">{task.title}</p>
            {task.instructions && <p className="text-sm text-gray-500 line-clamp-1 mt-1">{task.instructions}</p>}
            {task.frequency_note && <p className="text-xs text-gray-400 mt-1">Frecuencia: {task.frequency_note}</p>}
          </div>
        ),
      },
      {
        key: 'zone',
        header: 'Zona',
        render: (task: any) => task.zone?.name || 'Sin zona',
      },
      {
        key: 'status',
        header: 'Estado',
        render: (task: any) => {
          const variants: Record<string, 'success' | 'warning' | 'default'> = {
            publicado: 'success',
            borrador: 'warning',
            archivado: 'default',
          }
          return <Badge variant={variants[task.status] || 'default'}>{task.status}</Badge>
        },
      },
      {
        key: 'source',
        header: 'Fuente',
        render: (task: any) => task.source_document_id ? (
          <Badge variant="outline" className="text-xs">Doc: {task.source_document_id.slice(0, 8)}...</Badge>
        ) : (
          <span className="text-gray-400 text-sm">Sin fuente</span>
        ),
      },
      {
        key: 'actions',
        header: 'Acciones',
        render: (_task: any) => {
          const items: DropdownItem[] = [
            { label: 'Ver asignaciones', onClick: () => {}, icon: <CalendarIcon /> },
            { label: 'Ver detalle', onClick: () => {}, icon: <EyeIcon /> },
            { divider: true },
            { label: 'Editar', onClick: () => {}, icon: <EditIcon /> },
            { label: 'Nueva asignación', onClick: () => {}, icon: <PlusIcon /> },
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
          <h2 className="text-lg font-semibold text-gray-900">Tareas de aseo</h2>
          <p className="text-sm text-gray-500">{filteredTasks.length} de {tasks.length} tareas</p>
        </div>
        <Button onClick={() => {}}>Nueva tarea</Button>
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
            placeholder="Título, instrucciones..."
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
        data={filteredTasks}
        columns={columns}
        keyExtractor={(t) => t.id}
        loading={loading}
        emptyMessage="No se encontraron tareas"
        onRowClick={(_task) => {}}
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

function CalendarIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
}

function EyeIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
}

function EditIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
}

function PlusIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
}

function MoreIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
}