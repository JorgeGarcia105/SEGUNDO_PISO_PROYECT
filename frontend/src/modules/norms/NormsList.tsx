import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react'
import { Table, Card, Button, Dropdown, type DropdownItem, toast } from '@components/ui'
import { NormFilters, NormStatusBadge, SourceBadge } from './NormFilters'
import { NormDetail } from './NormDetail'
import { useNorms, useNormCategories } from '@hooks/useNorms'
import { useAuth } from '@hooks/useAuth'
import { formatDate } from '@utils/date'
import { createNorm, updateNorm, deleteNorm, createNormCategory, updateNormCategory, createNormVersion, updateNormVersion } from '@services/norms'
import { type InitialVersionData } from './types'
import { ModuleLoader } from '@components/ui'

const NormFormModal = lazy(() => import('./NormFormModal').then((m) => ({ default: m.NormFormModal })))
const NormVersionFormModal = lazy(() => import('./NormVersionFormModal').then((m) => ({ default: m.NormVersionFormModal })))
const NormCategoryFormModal = lazy(() => import('./NormCategoryFormModal').then((m) => ({ default: m.NormCategoryFormModal })))

export function NormsList() {
  const { profile } = useAuth()
  const { norms, loading, error, refetch } = useNorms()
  const { categories, loading: categoriesLoading } = useNormCategories()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [normFormOpen, setNormFormOpen] = useState(false)
  const [editingNorm, setEditingNorm] = useState<{ id: string; category_id: string | null; title: string } | null>(null)

  const [versionFormOpen, setVersionFormOpen] = useState(false)
  const [versionNormId, setVersionNormId] = useState<string | null>(null)
  const [editingVersion, setEditingVersion] = useState<InitialVersionData | null>(null)

  const [categoryFormOpen, setCategoryFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; description: string | null } | null>(null)

  const [normFormLoaded, setNormFormLoaded] = useState(false)
  const [versionFormLoaded, setVersionFormLoaded] = useState(false)
  const [categoryFormLoaded, setCategoryFormLoaded] = useState(false)

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [detailOpen, setDetailOpen] = useState<{ norm: any; onEdit: () => void; onNewVersion: () => void } | null>(null)

  const isAdmin = profile?.profile_roles?.some((r) => r.role === 'administrador' || r.role === 'superadministrador')

  const filteredNorms = useMemo(() => {
    return norms.filter((norm) => {
      const matchesSearch =
        !searchQuery ||
        norm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        norm.norm_versions?.some((v) => v.text_content.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = !selectedCategory || norm.category_id === selectedCategory
      const matchesStatus = !selectedStatus || norm.norm_versions?.[0]?.status === selectedStatus

      const matchesDateFrom = !dateFrom || norm.norm_versions?.[0]?.created_at?.split('T')[0] >= dateFrom
      const matchesDateTo = !dateTo || norm.norm_versions?.[0]?.created_at?.split('T')[0] <= dateTo

      return matchesSearch && matchesCategory && matchesStatus && matchesDateFrom && matchesDateTo
    })
  }, [norms, searchQuery, selectedCategory, selectedStatus, dateFrom, dateTo])

  const hasActiveFilters = !!searchQuery || !!selectedCategory || !!selectedStatus || !!dateFrom || !!dateTo

  const handleCreateNorm = useCallback(async (data: { category_id?: string | null; title: string }) => {
    try {
      await createNorm({ category_id: data.category_id || null, title: data.title, created_by: profile?.id ?? null })
      toast.success('Norma creada correctamente')
      setNormFormOpen(false)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al crear norma')
    }
  }, [profile?.id, refetch])

  const handleUpdateNorm = useCallback(async (data: { category_id?: string | null; title: string }) => {
    if (!editingNorm) return
    try {
      await updateNorm(editingNorm.id, { category_id: data.category_id || null, title: data.title })
      toast.success('Norma actualizada correctamente')
      setNormFormOpen(false)
      setEditingNorm(null)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al actualizar norma')
    }
  }, [editingNorm, refetch])

  const handleDeleteNorm = useCallback(async (normId: string) => {
    if (!confirm('¿Eliminar esta norma y todas sus versiones?')) return
    try {
      await deleteNorm(normId)
      toast.success('Norma eliminada')
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al eliminar norma')
    }
  }, [refetch])

  const handleCreateVersion = useCallback(async (data: {
    norm_id: string
    version_number: number
    text_content: string
    status?: string
    valid_from?: string | null
    valid_until?: string | null
    source_document_id?: string | null
    source_note?: string | null
    approval_note?: string | null
  }) => {
    try {
      await createNormVersion({
        norm_id: data.norm_id,
        version_number: data.version_number,
        text_content: data.text_content,
        status: (data.status as any) || 'PENDIENTE_CONFIRMACION',
        valid_from: data.valid_from || null,
        valid_until: data.valid_until || null,
        source_document_id: data.source_document_id || null,
        source_note: data.source_note || null,
        approval_note: data.approval_note || null,
        created_by: profile?.id ?? null,
      })
      toast.success('Versión creada correctamente')
      setVersionFormOpen(false)
      setVersionNormId(null)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al crear versión')
    }
  }, [profile?.id, refetch])

  const handleUpdateVersion = useCallback(async (data: {
    norm_id: string
    version_number: number
    text_content: string
    status?: string
    valid_from?: string | null
    valid_until?: string | null
    source_document_id?: string | null
    source_note?: string | null
    approval_note?: string | null
  }) => {
    if (!editingVersion) return
    try {
      await updateNormVersion(editingVersion.id, {
        version_number: data.version_number,
        text_content: data.text_content,
        status: (data.status as any) || 'PENDIENTE_CONFIRMACION',
        valid_from: data.valid_from || null,
        valid_until: data.valid_until || null,
        source_document_id: data.source_document_id || null,
        source_note: data.source_note || null,
        approval_note: data.approval_note || null,
      })
      toast.success('Versión actualizada correctamente')
      setVersionFormOpen(false)
      setEditingVersion(null)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al actualizar versión')
    }
  }, [editingVersion, refetch])

  const handleCreateCategory = useCallback(async (data: { name: string; description?: string | null }) => {
    try {
      await createNormCategory({ name: data.name, description: data.description || null, created_by: profile?.id ?? null })
      toast.success('Categoría creada correctamente')
      setCategoryFormOpen(false)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al crear categoría')
    }
  }, [profile?.id, refetch])

  const handleUpdateCategory = useCallback(async (data: { name: string; description?: string | null }) => {
    if (!editingCategory) return
    try {
      await updateNormCategory(editingCategory.id, { name: data.name, description: data.description || null })
      toast.success('Categoría actualizada correctamente')
      setCategoryFormOpen(false)
      setEditingCategory(null)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al actualizar categoría')
    }
  }, [editingCategory, refetch])

  const handleOpenNormForm = useCallback((data?: { id: string; category_id: string | null; title: string }) => {
    if (!normFormLoaded) setNormFormLoaded(true)
    if (data) setEditingNorm(data)
    else setEditingNorm(null)
    setNormFormOpen(true)
  }, [normFormLoaded])

  const handleOpenVersionForm = useCallback((normId: string, data?: InitialVersionData) => {
    if (!versionFormLoaded) setVersionFormLoaded(true)
    setVersionNormId(normId)
    if (data) setEditingVersion(data)
    else setEditingVersion(null)
    setVersionFormOpen(true)
  }, [versionFormLoaded])

  const handleOpenCategoryForm = useCallback((data?: { id: string; name: string; description: string | null }) => {
    if (!categoryFormLoaded) setCategoryFormLoaded(true)
    if (data) setEditingCategory(data)
    else setEditingCategory(null)
    setCategoryFormOpen(true)
  }, [categoryFormLoaded])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return
      }

      if (e.key === '/' || (e.key === 'f' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement
        searchInput?.focus()
      }

      if (e.key === 'Escape') {
        setDetailOpen(null)
        setNormFormOpen(false)
        setVersionFormOpen(false)
        setCategoryFormOpen(false)
        setExpandedRows(new Set())
      }

      if (e.key === 'n' && (e.metaKey || e.ctrlKey) && isAdmin) {
        e.preventDefault()
        handleOpenNormForm()
      }

      if (e.key === 'r') {
        refetch()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAdmin, handleOpenNormForm, refetch])

  const toggleExpand = useCallback((key: string, expanded: boolean) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (expanded) next.add(key)
      else next.delete(key)
      return next
    })
  }, [])

  const handleOpenDetail = useCallback((norm: any) => {
    setDetailOpen({
      norm,
      onEdit: () => {
        setDetailOpen(null)
        handleOpenNormForm({ id: norm.id, category_id: norm.category_id, title: norm.title })
      },
      onNewVersion: () => {
        setDetailOpen(null)
        handleOpenVersionForm(norm.id)
      },
    })
  }, [handleOpenNormForm, handleOpenVersionForm])

  const renderVersionHistory = useCallback((norm: any) => {
    const versions = [...(norm.norm_versions || [])].sort((a, b) => b.version_number - a.version_number)
    const currentVersion = versions[0]

    if (versions.length === 0) {
      return <p className="text-gray-500 text-sm py-4 text-center">Sin versiones registradas</p>
    }

    return (
      <div className="space-y-3">
        {versions.map((version) => {
          const isCurrent = version.id === currentVersion?.id
          return (
            <div
              key={version.id}
              className={`border rounded-lg p-4 transition-colors ${
                isCurrent ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={`font-mono text-sm px-2 py-1 rounded ${
                      isCurrent ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      v{version.version_number}
                    </span>
                    <NormStatusBadge status={version.status} />
                    {version.source_document_id && (
                      <SourceBadge sourceType={version.source_document_id} sourceNote={version.source_note} />
                    )}
                    {isCurrent && <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded font-medium">Actual</span>}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-500 mb-3">
                    <div><span className="font-medium">Creada:</span> {version.created_at ? formatDate(version.created_at.split('T')[0]) : '—'}</div>
                    <div><span className="font-medium">Válida desde:</span> {version.valid_from ? formatDate(version.valid_from) : '—'}</div>
                    <div><span className="font-medium">Válida hasta:</span> {version.valid_until ? formatDate(version.valid_until) : 'Indefinida'}</div>
                    <div><span className="font-medium">ID:</span> {version.id.slice(0, 8)}...</div>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-3 font-mono bg-gray-50 p-3 rounded">{version.text_content}</p>

                  {(version.source_note || version.approval_note) && (
                    <div className="mt-3 space-y-2">
                      {version.source_note && (
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                          <span className="font-medium">Fuente: </span>{version.source_note}
                        </div>
                      )}
                      {version.approval_note && (
                        <div className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">
                          <span className="font-medium">Aprobación: </span>{version.approval_note}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }, [])

  const columns = useMemo(
    () => [
      {
        key: 'title',
        header: 'Norma',
        render: (norm: any) => (
          <div>
            <p className="font-medium text-gray-900">{norm.title}</p>
            <p className="text-sm text-gray-500 line-clamp-1 mt-1">{norm.norm_versions?.[0]?.text_content || 'Sin contenido'}</p>
          </div>
        ),
      },
      {
        key: 'category',
        header: 'Categoría',
        render: (norm: any) => norm.norm_categories?.[0]?.name || 'Sin categoría',
      },
      {
        key: 'version',
        header: 'Versión actual',
        render: (norm: any) => {
          const v = norm.norm_versions?.[0]
          if (!v) return <span className="text-gray-400">Sin versiones</span>
          return (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">v{v.version_number}</span>
              <NormStatusBadge status={v.status} />
            </div>
          )
        },
      },
      {
        key: 'source',
        header: 'Fuente',
        render: (norm: any) => {
          const v = norm.norm_versions?.[0]
          if (!v?.source_document_id) return <span className="text-gray-400">Sin fuente</span>
          return <SourceBadge sourceType={v.source_document_id} sourceNote={v.source_note} />
        },
      },
      {
        key: 'validity',
        header: 'Vigencia',
        render: (norm: any) => {
          const v = norm.norm_versions?.[0]
          if (!v) return <span className="text-gray-400">-</span>
          const parts = []
          if (v.valid_from) parts.push(`Desde: ${formatDate(v.valid_from)}`)
          if (v.valid_until) parts.push(`Hasta: ${formatDate(v.valid_until)}`)
          return <span className="text-sm text-gray-500">{parts.join(' | ') || 'Indefinida'}</span>
        },
      },
      {
        key: 'versions_count',
        header: 'Versiones',
        render: (norm: any) => (
          <span className="text-sm text-gray-500">{norm.norm_versions?.length || 0}</span>
        ),
      },
      {
        key: 'actions',
        header: 'Acciones',
        render: (norm: any) => {
          const items: DropdownItem[] = [
            { label: 'Ver detalle', onClick: () => handleOpenDetail(norm), icon: <EyeIcon /> },
            { label: 'Ver historial', onClick: () => {}, icon: <HistoryIcon /> },
            { label: 'Ver fuente', onClick: () => {}, icon: <FileIcon /> },
          ]
          if (isAdmin) {
            items.push({ divider: true })
            items.push({
              label: 'Editar norma',
              onClick: () => handleOpenNormForm({ id: norm.id, category_id: norm.category_id, title: norm.title }),
              icon: <EditIcon />,
            })
            items.push({
              label: 'Nueva versión',
              onClick: () => handleOpenVersionForm(norm.id),
              icon: <PlusIcon />,
            })
            items.push({ divider: true })
            items.push({
              label: 'Eliminar',
              onClick: () => handleDeleteNorm(norm.id),
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
    [isAdmin, handleDeleteNorm, handleOpenNormForm, handleOpenVersionForm, handleOpenDetail]
  )

  return (
    <>
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Normas</h2>
            <p className="text-sm text-gray-500">{filteredNorms.length} de {norms.length} normas</p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <>
                <Button onClick={() => handleOpenNormForm()}>Nueva norma</Button>
                <Button variant="outline" onClick={() => handleOpenCategoryForm()}>Nueva categoría</Button>
              </>
            )}
          </div>
        </div>

        <NormFilters
          categories={categories}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          searchQuery={searchQuery}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
          onSearchChange={setSearchQuery}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onClear={() => { setSearchQuery(''); setSelectedCategory(null); setSelectedStatus(null); setDateFrom(''); setDateTo('') }}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="mt-4">
          <Table
            data={filteredNorms}
            columns={columns}
            keyExtractor={(n) => n.id}
            loading={loading}
            emptyMessage="No se encontraron normas con los filtros actuales"
            expandable
            renderExpand={renderVersionHistory}
            expandedKeys={expandedRows}
            onExpandChange={toggleExpand}
          />
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
            {error}
            <Button variant="outline" size="sm" className="ml-2" onClick={refetch}>
              Reintentar
            </Button>
          </div>
        )}
      </Card>

      {detailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDetailOpen(null)}>
          <div className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-xl shadow-xl" onClick={(e) => e.stopPropagation()}>
            <NormDetail
              norm={detailOpen.norm}
              onClose={() => setDetailOpen(null)}
              onEdit={detailOpen.onEdit}
              onNewVersion={detailOpen.onNewVersion}
            />
          </div>
        </div>
      )}

      {normFormLoaded && (
        <Suspense fallback={<ModuleLoader />}>
          <NormFormModal
            isOpen={normFormOpen}
            onClose={() => { setNormFormOpen(false); setEditingNorm(null) }}
            onSubmit={editingNorm ? handleUpdateNorm : handleCreateNorm}
            initialData={editingNorm}
            loading={loading}
          />
        </Suspense>
      )}

      {versionFormLoaded && (
        <Suspense fallback={<ModuleLoader />}>
          <NormVersionFormModal
            isOpen={versionFormOpen}
            onClose={() => { setVersionFormOpen(false); setVersionNormId(null); setEditingVersion(null) }}
            onSubmit={editingVersion ? handleUpdateVersion : handleCreateVersion}
            initialData={editingVersion}
            normId={versionNormId}
            loading={loading}
          />
        </Suspense>
      )}

      {categoryFormLoaded && (
        <Suspense fallback={<ModuleLoader />}>
          <NormCategoryFormModal
            isOpen={categoryFormOpen}
            onClose={() => { setCategoryFormOpen(false); setEditingCategory(null) }}
            onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
            initialData={editingCategory}
            loading={categoriesLoading}
          />
        </Suspense>
      )}
    </>
  )
}

function EyeIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
}

function HistoryIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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

function TrashIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
}