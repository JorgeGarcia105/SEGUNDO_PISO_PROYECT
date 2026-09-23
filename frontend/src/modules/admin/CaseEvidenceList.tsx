import { useState, useMemo, useCallback, lazy } from 'react'
import { Table, Card, Input, Button, Badge, Dropdown, type DropdownItem } from '@components/ui'
import { useCaseEvidence } from '@hooks/useViolations'
import { useAuth } from '@hooks/useAuth'
import { formatDateTime } from '@utils/date'
import { createCaseEvidence, deleteCaseEvidence } from '@services/violations'
import { toast } from '@components/ui/Toast'

export function CaseEvidenceList({ violationId }: { violationId?: string }) {
  const { profile } = useAuth()
  const { evidence, loading, error, refetch } = useCaseEvidence(violationId)
  const [searchQuery, setSearchQuery] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editingEvidence, setEditingEvidence] = useState<{
    id: string
    violation_id: string
    title: string
    description: string | null
    storage_path: string | null
    checksum: string | null
    evidence_type: string | null
  } | null>(null)
  const [formLoaded, setFormLoaded] = useState(false)

  const isAdmin = profile?.profile_roles?.some((r) => r.role === 'administrador' || r.role === 'superadministrador')

  const filteredEvidence = useMemo(() => {
    return evidence.filter((e) => {
      const matchesSearch =
        !searchQuery ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSearch
    })
  }, [evidence, searchQuery])

  const hasActiveFilters = !!searchQuery

  const handleCreateEvidence = useCallback(async (data: {
    violation_id: string
    title: string
    description: string | null
    storage_path: string | null
    checksum: string | null
    evidence_type: string | null
  }) => {
    try {
      await createCaseEvidence({
        ...data,
        uploaded_by: profile?.id ?? null,
        uploaded_at: new Date().toISOString(),
      })
      toast.success('Evidencia creada correctamente')
      setFormOpen(false)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al crear evidencia')
    }
  }, [profile?.id, refetch])

  const handleDeleteEvidence = useCallback(async (id: string) => {
    if (!confirm('¿Eliminar esta evidencia?')) return
    try {
      await deleteCaseEvidence(id)
      toast.success('Evidencia eliminada')
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al eliminar evidencia')
    }
  }, [refetch])

  const handleOpenForm = useCallback((data?: {
    id: string
    violation_id: string
    title: string
    description: string | null
    storage_path: string | null
    checksum: string | null
    evidence_type: string | null
  }) => {
    if (!formLoaded) setFormLoaded(true)
    if (data) setEditingEvidence(data)
    else setEditingEvidence({
      id: '',
      violation_id: violationId || '',
      title: '',
      description: null,
      storage_path: null,
      checksum: null,
      evidence_type: null,
    })
    setFormOpen(true)
  }, [formLoaded, violationId])

  const columns = useMemo(
    () => [
      {
        key: 'title',
        header: 'Evidencia',
        render: (e: any) => (
          <div>
            <p className="font-medium text-gray-900">{e.title}</p>
            {e.description && <p className="text-sm text-gray-500 line-clamp-1 mt-1">{e.description}</p>}
          </div>
        ),
      },
      {
        key: 'type',
        header: 'Tipo',
        render: (e: any) => e.evidence_type ? <Badge variant="outline" className="text-xs">{e.evidence_type}</Badge> : <span className="text-gray-400 text-xs">-</span>,
      },
      {
        key: 'uploaded_at',
        header: 'Subida',
        render: (e: any) => formatDateTime(e.uploaded_at),
      },
      {
        key: 'uploaded_by',
        header: 'Subido por',
        render: (e: any) => e.uploaded_by_profile?.display_name || <span className="text-gray-400">Desconocido</span>,
      },
      {
        key: 'storage',
        header: 'Archivo',
        render: (e: any) => e.storage_path ? (
          <Badge variant="outline" className="text-xs">Disponible</Badge>
        ) : (
          <span className="text-gray-400 text-xs">Sin archivo</span>
        ),
      },
      {
        key: 'actions',
        header: 'Acciones',
        render: (e: any) => {
          const items: DropdownItem[] = [
            { label: 'Ver archivo', onClick: () => { /* open file */ }, icon: <FileIcon /> },
            { label: 'Descargar', onClick: () => { /* download */ }, icon: <DownloadIcon /> },
          ]
          if (isAdmin) {
            items.push({ divider: true })
            items.push({
              label: 'Eliminar',
              onClick: () => handleDeleteEvidence(e.id),
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
    [isAdmin, handleDeleteEvidence, violationId]
  )

  return (
    <>
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Evidencias del Caso</h2>
            <p className="text-sm text-gray-500">{filteredEvidence.length} de {evidence.length} evidencias</p>
          </div>
          {isAdmin && violationId && (
            <Button onClick={() => handleOpenForm()}>Nueva evidencia</Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-100 mb-4">
          <div className="flex-1 min-w-[250px]">
            <Input
              label="Buscar"
              placeholder="Título, descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
          {hasActiveFilters && (
            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="h-10">
                Limpiar
              </Button>
            </div>
          )}
        </div>

        <Table
          data={filteredEvidence}
          columns={columns}
          keyExtractor={(e) => e.id}
          loading={loading}
          emptyMessage={violationId ? "No se encontraron evidencias para este incumplimiento" : "Seleccione un incumplimiento para ver sus evidencias"}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
            {error}
            <Button variant="outline" size="sm" className="ml-2" onClick={refetch}>Reintentar</Button>
          </div>
        )}
      </Card>

      {formLoaded && violationId && (
        <CaseEvidenceFormModal
          isOpen={formOpen}
          onClose={() => { setFormOpen(false); setEditingEvidence(null) }}
          onSubmit={handleCreateEvidence}
          initialData={editingEvidence}
          loading={loading}
        />
      )}
    </>
  )
}

function FileIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
}

function DownloadIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
}

function TrashIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
}

function MoreIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
}

const CaseEvidenceFormModal = lazy(() => import('./CaseEvidenceFormModal').then((m) => ({ default: m.CaseEvidenceFormModal })))