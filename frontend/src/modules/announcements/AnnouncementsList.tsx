import { useState, useMemo } from 'react'
import { Card, Badge, Button, Dropdown, Input, Select } from '@components/ui'
import { useAnnouncements, useActiveAnnouncements } from '@hooks/useAnnouncements'
import { formatDate, formatDateTime } from '@utils/date'

export function AnnouncementsList({ publicOnly = false }: { publicOnly?: boolean }) {
  const activeAnnouncementsState = useActiveAnnouncements()
  const allAnnouncementsState = useAnnouncements()
  const { announcements, loading, error, refetch } = publicOnly ? activeAnnouncementsState : allAnnouncementsState
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [showImportantOnly, setShowImportantOnly] = useState(false)

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      const matchesSearch =
        !searchQuery ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.body.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = !selectedStatus || a.status === selectedStatus
      const matchesImportant = !showImportantOnly || a.is_important

      return matchesSearch && matchesStatus && matchesImportant
    })
  }, [announcements, searchQuery, selectedStatus, showImportantOnly])

  const hasActiveFilters = !!searchQuery || !!selectedStatus || showImportantOnly

  const statusOptions = useMemo(
    () => [
      { value: '', label: 'Todos los estados' },
      { value: 'borrador', label: 'Borrador' },
      { value: 'publicado', label: 'Publicado' },
      { value: 'archivado', label: 'Archivado' },
    ],
    []
  )

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Avisos</h2>
          <p className="text-sm text-gray-500">{filteredAnnouncements.length} de {announcements.length} avisos</p>
        </div>
        {!publicOnly && (
          <Button onClick={() => {}}>Nuevo aviso</Button>
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
            placeholder="Título, contenido..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showImportantOnly}
              onChange={(e) => setShowImportantOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Solo importantes</span>
          </label>
        </div>
        {hasActiveFilters && (
          <div className="flex items-end">
            <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSelectedStatus(null); setShowImportantOnly(false) }} className="h-10">
              Limpiar
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron avisos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnnouncements.map((a) => (
            <div key={a.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{a.title}</h3>
                    {a.is_important && <Badge variant="danger" size="sm">Importante</Badge>}
                    <Badge variant={
                      a.status === 'publicado' ? 'success' :
                      a.status === 'borrador' ? 'warning' : 'default'
                    }>{a.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{a.body}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                    {a.starts_at && <span>Inicio: {formatDate(a.starts_at)}</span>}
                    {a.expires_at && <span>Expira: {formatDate(a.expires_at)}</span>}
                    <span>Creado: {formatDateTime(a.created_at)}</span>
                  </div>
                </div>
                {!publicOnly && (
                  <Dropdown
                    items={[
                      { label: 'Ver detalle', onClick: () => {}, icon: <EyeIcon /> },
                      { divider: true },
                      { label: 'Editar', onClick: () => {}, icon: <EditIcon /> },
                      { label: 'Duplicar', onClick: () => {}, icon: <CopyIcon /> },
                      { label: 'Eliminar', onClick: () => {}, danger: true, icon: <TrashIcon /> },
                    ]}
                    trigger={<Button variant="ghost" size="sm" className="ml-4"><MoreIcon /></Button>}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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

function EditIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
}

function CopyIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v2m-8-2h2m8-2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7a2 2 0 012-2h2" /></svg>
}

function TrashIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
}

function MoreIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
}