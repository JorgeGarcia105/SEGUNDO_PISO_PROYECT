import { useState, useMemo } from 'react'
import { Table, Card, Input, Button, Badge, Dropdown, type DropdownItem } from '@components/ui'
import { useCleaningZones } from '@hooks/useCleaning'

export function CleaningZonesList() {
  const { zones, loading, error, refetch } = useCleaningZones()

  const [searchQuery, setSearchQuery] = useState('')

  const filteredZones = useMemo(() => {
    return zones.filter((zone) =>
      !searchQuery ||
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [zones, searchQuery])

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Zona',
        render: (zone: any) => (
          <div>
            <p className="font-medium text-gray-900">{zone.name}</p>
            {zone.description && <p className="text-sm text-gray-500 line-clamp-1 mt-1">{zone.description}</p>}
          </div>
        ),
      },
      {
        key: 'tasks',
        header: 'Tareas',
        render: (zone: any) => (
          <span className="text-sm text-gray-500">{zone.cleaning_tasks?.length || 0} tareas</span>
        ),
      },
      {
        key: 'status',
        header: 'Estado',
        render: (zone: any) => {
          const variants: Record<string, 'success' | 'warning' | 'default'> = {
            publicado: 'success',
            borrador: 'warning',
            archivado: 'default',
          }
          return <Badge variant={variants[zone.status] || 'default'}>{zone.status}</Badge>
        },
      },
      {
        key: 'source',
        header: 'Fuente',
        render: (zone: any) => zone.source_document_id ? (
          <Badge variant="outline" className="text-xs">Doc: {zone.source_document_id.slice(0, 8)}...</Badge>
        ) : (
          <span className="text-gray-400 text-sm">Sin fuente</span>
        ),
      },
      {
        key: 'actions',
        header: 'Acciones',
        render: (_zone: any) => {
          const items: DropdownItem[] = [
            { label: 'Ver tareas', onClick: () => {}, icon: <ListIcon /> },
            { label: 'Ver detalle', onClick: () => {}, icon: <EyeIcon /> },
            { divider: true },
            { label: 'Editar', onClick: () => {}, icon: <EditIcon /> },
            { label: 'Nueva tarea', onClick: () => {}, icon: <PlusIcon /> },
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
          <h2 className="text-lg font-semibold text-gray-900">Zonas de aseo</h2>
          <p className="text-sm text-gray-500">{filteredZones.length} de {zones.length} zonas</p>
        </div>
        <Button onClick={() => {}}>Nueva zona</Button>
      </div>

      <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-100 mb-4">
        <div className="flex-1 max-w-md">
          <Input
            label="Buscar"
            placeholder="Nombre, descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Table
        data={filteredZones}
        columns={columns}
        keyExtractor={(z) => z.id}
        loading={loading}
        emptyMessage="No se encontraron zonas"
        onRowClick={(_zone) => {}}
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

function ListIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
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