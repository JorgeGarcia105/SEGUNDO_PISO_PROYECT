import { useState, useMemo } from 'react'
import { Table, Card, Input, Select, Button, Badge } from '@components/ui'
import { useAuditEvents } from '@hooks/useAudit'
import { formatDateTime } from '@utils/date'

const actionColors: Record<string, { bg: string; text: string; border: string }> = {
  INSERT: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  UPDATE: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  DELETE: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
}

function getActionColor(action: string) {
  return actionColors[action] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
}

export function AuditoriaAdminList() {
  const { events, loading, error, refetch } = useAuditEvents()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        !searchQuery ||
        e.table_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.record_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.changed_by?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTable = !selectedTable || e.table_name === selectedTable
      const matchesAction = !selectedAction || e.action === selectedAction

      return matchesSearch && matchesTable && matchesAction
    })
  }, [events, searchQuery, selectedTable, selectedAction])

  const hasActiveFilters = !!searchQuery || !!selectedTable || !!selectedAction

  const tables = useMemo(() => [...new Set(events.map((e) => e.table_name))].sort(), [events])

  const tableOptions = [{ value: '', label: 'Todas las tablas' }, ...tables.map((t) => ({ value: t, label: t }))]

  const actionOptions = [
    { value: '', label: 'Todas las acciones' },
    { value: 'INSERT', label: 'Inserción' },
    { value: 'UPDATE', label: 'Actualización' },
    { value: 'DELETE', label: 'Eliminación' },
  ]

  const columns = useMemo(
    () => [
      {
        key: 'timestamp',
        header: 'Fecha y Hora',
        render: (e: any) => formatDateTime(e.changed_at),
      },
      {
        key: 'table',
        header: 'Tabla',
        render: (e: any) => <code className="text-sm bg-gray-50 px-2 py-1 rounded">{e.table_name}</code>,
      },
      {
        key: 'record',
        header: 'Registro',
        render: (e: any) => e.record_id ? (
          <code className="text-xs text-gray-500">{e.record_id.slice(0, 8)}...</code>
        ) : (
          <span className="text-gray-400">-</span>
        ),
      },
      {
        key: 'action',
        header: 'Acción',
        render: (e: any) => {
          const color = getActionColor(e.action)
          const labels: Record<string, string> = {
            INSERT: 'Crear',
            UPDATE: 'Actualizar',
            DELETE: 'Eliminar',
          }
          return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color.bg} ${color.text} ${color.border}`}>
              {labels[e.action] || e.action}
            </span>
          )
        },
      },
      {
        key: 'user',
        header: 'Usuario',
        render: (e: any) => e.changed_by ? (
          <code className="text-xs text-gray-500">{e.changed_by.slice(0, 8)}...</code>
        ) : (
          <span className="text-gray-400">Sistema</span>
        ),
      },
      {
        key: 'changes',
        header: 'Cambios',
        render: (e: any) => {
          if (!e.old_data && !e.new_data) return <span className="text-gray-400">-</span>
          if (e.action === 'INSERT') return <Badge variant="success" className="text-xs">Nuevo</Badge>
          if (e.action === 'DELETE') return <Badge variant="danger" className="text-xs">Eliminado</Badge>
          return <Badge variant="warning" className="text-xs">Modificado</Badge>
        },
      },
    ],
    []
  )

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Auditoría</h2>
          <p className="text-sm text-gray-500">{filteredEvents.length} de {events.length} eventos</p>
        </div>
        <Button variant="outline" onClick={refetch}>Actualizar</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-100 mb-4">
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Tabla"
            options={tableOptions}
            value={selectedTable || ''}
            onChange={(e) => setSelectedTable(e.target.value || null)}
            placeholder="Todas las tablas"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Acción"
            options={actionOptions}
            value={selectedAction || ''}
            onChange={(e) => setSelectedAction(e.target.value || null)}
            placeholder="Todas las acciones"
          />
        </div>
        <div className="flex-1 min-w-[250px]">
          <Input
            label="Buscar"
            placeholder="Tabla, ID, usuario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        {hasActiveFilters && (
          <div className="flex items-end">
            <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSelectedTable(null); setSelectedAction(null) }} className="h-10">
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
        emptyMessage="No se encontraron eventos de auditoría"
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