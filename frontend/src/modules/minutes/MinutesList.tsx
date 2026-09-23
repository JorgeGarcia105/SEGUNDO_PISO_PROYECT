import { useState, useMemo } from 'react'
import { Table, Card, Input, Select, Button, Badge, Dropdown, type DropdownItem } from '@components/ui'
import { useAssemblyMinutes, usePublishedAssemblyMinutes } from '@hooks/useDecisions'
import { formatDate } from '@utils/date'

export function MinutesList({ publicOnly = false }: { publicOnly?: boolean }) {
  const publishedMinutesState = usePublishedAssemblyMinutes()
  const allMinutesState = useAssemblyMinutes()
  const { minutes, loading, error, refetch } = publicOnly ? publishedMinutesState : allMinutesState
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredMinutes = useMemo(() => {
    return minutes.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.topics?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = !selectedStatus || m.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [minutes, searchQuery, selectedStatus])

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
        header: 'Acta',
        render: (m: any) => (
          <div>
            <p className="font-medium text-gray-900">{m.title}</p>
            {m.topics && <p className="text-sm text-gray-500 line-clamp-1 mt-1">{m.topics}</p>}
          </div>
        ),
      },
      {
        key: 'date',
        header: 'Fecha',
        render: (m: any) => m.meeting_date ? formatDate(m.meeting_date) : <span className="text-gray-400">Sin fecha</span>,
      },
      {
        key: 'decisions',
        header: 'Decisiones',
        render: (m: any) => (
          <span className="text-sm text-gray-500">{m.decisions?.length || 0} decisiones</span>
        ),
      },
      {
        key: 'status',
        header: 'Estado',
        render: (m: any) => {
          const variants: Record<string, 'success' | 'warning' | 'default'> = {
            publicado: 'success',
            borrador: 'warning',
            archivado: 'default',
          }
          return <Badge variant={variants[m.status] || 'default'}>{m.status}</Badge>
        },
      },
      {
        key: 'source',
        header: 'Fuente',
        render: (m: any) => m.document_id ? (
          <Badge variant="outline" className="text-xs">Doc: {m.document_id.slice(0, 8)}...</Badge>
        ) : (
          <span className="text-gray-400 text-sm">Sin documento</span>
        ),
      },
      {
        key: 'actions',
        header: 'Acciones',
        render: (_m: any) => {
          const items: DropdownItem[] = [
            { label: 'Ver detalle', onClick: () => {}, icon: <EyeIcon /> },
            { label: 'Ver decisiones', onClick: () => {}, icon: <ListIcon /> },
            { label: 'Ver documento', onClick: () => {}, icon: <FileIcon /> },
          ]
          if (!publicOnly) {
            items.push({ divider: true })
            items.push({ label: 'Editar', onClick: () => {}, icon: <EditIcon /> })
            items.push({ label: 'Nueva decisión', onClick: () => {}, icon: <PlusIcon /> })
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
    [publicOnly]
  )

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Actas de asamblea</h2>
          <p className="text-sm text-gray-500">{filteredMinutes.length} de {minutes.length} actas</p>
        </div>
        {!publicOnly && (
          <Button onClick={() => {}}>Nueva acta</Button>
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
        <div className="flex-1 min-w-[250px]">
          <Input
            label="Buscar"
            placeholder="Título, temas..."
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
        data={filteredMinutes}
        columns={columns}
        keyExtractor={(m) => m.id}
        loading={loading}
        emptyMessage="No se encontraron actas"
        onRowClick={(_m) => {}}
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

function ListIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
}

function FileIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
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