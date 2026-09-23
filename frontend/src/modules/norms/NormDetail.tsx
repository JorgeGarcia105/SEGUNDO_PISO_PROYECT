import { useState } from 'react'
import { Card, Badge, Button, Tabs, TabList, Tab, TabPanel, Dropdown, type DropdownItem, DiffView } from '@components/ui'
import { NormStatusBadge, SourceBadge } from './NormFilters'
import { formatDate, formatDateTime } from '@utils/date'
import { cn } from '@utils/cn'

interface NormDetailProps {
  norm: any
  onClose: () => void
  onEdit?: () => void
  onNewVersion?: () => void
}

function VersionHistoryItem({ version, currentVersionId, onSelect, onCompare }: {
  version: any
  currentVersionId: string | null
  onSelect: (v: any) => void
  onCompare: (v: any) => void
}) {
  const isCurrent = version.id === currentVersionId

  const items: DropdownItem[] = [
    { label: 'Ver esta versión', onClick: () => onSelect(version), icon: <EyeIcon /> },
    { label: 'Comparar con actual', onClick: () => onCompare(version), icon: <CompareIcon />, disabled: isCurrent },
    { divider: true },
    { label: 'Ver fuente', onClick: () => {}, icon: <FileIcon /> },
  ]

  return (
    <div className={cn(
      'border rounded-lg p-4 transition-colors',
      isCurrent ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 hover:bg-gray-50'
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={cn('font-mono text-sm px-2 py-1 rounded', isCurrent ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>
              v{version.version_number}
            </span>
            <NormStatusBadge status={version.status} />
            {version.source_document_id && (
              <SourceBadge sourceType={version.source_document_id} sourceNote={version.source_note} />
            )}
            {isCurrent && <Badge variant="success" size="sm">Actual</Badge>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-500 mb-3">
            <div><span className="font-medium">Creada:</span> {formatDateTime(version.created_at)}</div>
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

        <Dropdown
          items={items}
          trigger={<Button variant="ghost" size="sm" className="ml-4"><MoreIcon /></Button>}
        />
      </div>
    </div>
  )
}

function EyeIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
}

function CompareIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
}

function FileIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
}

function MoreIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
}

export function NormDetail({ norm, onClose, onEdit, onNewVersion }: NormDetailProps) {
  const currentVersion = norm.norm_versions?.[0]
  const allVersions = norm.norm_versions || []
  const category = norm.norm_categories?.[0]
  const [selectedVersion, setSelectedVersion] = useState<any>(currentVersion)
  const [compareVersion, setCompareVersion] = useState<any | null>(null)

  const sortedVersions = [...allVersions].sort((a, b) => b.version_number - a.version_number)

  function handleVersionSelect(version: any) {
    setSelectedVersion(version)
    setCompareVersion(null)
  }

  function handleCompare(version: any) {
    setCompareVersion(version)
  }

  function clearCompare() {
    setCompareVersion(null)
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Norma</span>
            {category && <Badge variant="outline" className="text-xs">{category.name}</Badge>}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{norm.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {currentVersion && <NormStatusBadge status={currentVersion.status} />}
            {currentVersion?.source_document_id && (
              <SourceBadge sourceType={currentVersion.source_document_id} sourceNote={currentVersion.source_note} />
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
          {onEdit && <Button variant="outline" onClick={onEdit}>Editar norma</Button>}
          {onNewVersion && <Button onClick={onNewVersion}>Nueva versión</Button>}
        </div>
      </div>

      {compareVersion && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-blue-800">Comparando versiones</h3>
            <Button variant="ghost" size="sm" onClick={clearCompare}>Cerrar comparación</Button>
          </div>
          <DiffView
            oldText={compareVersion.text_content || ''}
            newText={selectedVersion?.text_content || ''}
            oldLabel={`v${compareVersion.version_number}`}
            newLabel={selectedVersion?.id === currentVersion?.id ? `v${selectedVersion?.version_number} (actual)` : `v${selectedVersion?.version_number}`}
            mode="side-by-side"
            showLineNumbers
            collapseUnchanged
            contextLines={3}
          />
        </div>
      )}

      <Tabs defaultValue="contenido">
        <TabList className="mb-4">
          <Tab value="contenido">Contenido</Tab>
          <Tab value="historial">Historial de versiones ({sortedVersions.length})</Tab>
          <Tab value="metadatos">Metadatos</Tab>
          <Tab value="cambios">Cambios oficiales</Tab>
        </TabList>

        <TabPanel value="contenido">
          {selectedVersion && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  {selectedVersion.id === currentVersion?.id ? 'Versión actual' : 'Versión histórica'}
                  <span className="ml-2 font-mono text-sm text-gray-500">v{selectedVersion.version_number}</span>
                </h3>
                {selectedVersion.id !== currentVersion?.id && (
                  <Button variant="outline" size="sm" onClick={() => setSelectedVersion(currentVersion)}>
                    Volver a actual
                  </Button>
                )}
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded font-mono text-sm">{selectedVersion.text_content}</p>
              </div>

              {selectedVersion.source_note && (
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  <span className="font-medium text-gray-500">Nota de fuente: </span>
                  <span className="text-gray-700">{selectedVersion.source_note}</span>
                </div>
              )}
              {selectedVersion.approval_note && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <span className="font-medium text-green-800">Nota de aprobación: </span>
                  <span className="text-green-700">{selectedVersion.approval_note}</span>
                </div>
              )}
            </div>
          )}
        </TabPanel>

        <TabPanel value="historial">
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {sortedVersions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay versiones registradas</p>
            ) : (
              sortedVersions.map((version) => (
                <VersionHistoryItem
                  key={version.id}
                  version={version}
                  currentVersionId={currentVersion?.id || null}
                  onSelect={handleVersionSelect}
                  onCompare={handleCompare}
                />
              ))
            )}
          </div>
        </TabPanel>

        <TabPanel value="metadatos">
          {currentVersion && (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><dt className="text-gray-500">Versión actual</dt><dd className="font-medium">v{currentVersion.version_number}</dd></div>
              <div><dt className="text-gray-500">Estado</dt><dd className="font-medium"><NormStatusBadge status={currentVersion.status} /></dd></div>
              <div><dt className="text-gray-500">Válida desde</dt><dd className="font-medium">{currentVersion.valid_from ? formatDate(currentVersion.valid_from) : 'Sin fecha'}</dd></div>
              <div><dt className="text-gray-500">Válida hasta</dt><dd className="font-medium">{currentVersion.valid_until ? formatDate(currentVersion.valid_until) : 'Indefinida'}</dd></div>
              <div><dt className="text-gray-500">Creada</dt><dd className="font-medium">{formatDateTime(currentVersion.created_at)}</dd></div>
              <div className="sm:col-span-2"><dt className="text-gray-500">Total de versiones</dt><dd className="font-medium">{sortedVersions.length}</dd></div>
              <div className="sm:col-span-2"><dt className="text-gray-500">Categoría</dt><dd className="font-medium">{category?.name || 'Sin categoría'}</dd></div>
              <div className="sm:col-span-2"><dt className="text-gray-500">Norma ID</dt><dd className="font-medium font-mono text-xs">{norm.id}</dd></div>
            </dl>
          )}
        </TabPanel>

        <TabPanel value="cambios">
          <p className="text-gray-500 text-sm text-center py-8">Integración con norm_changes pendiente</p>
        </TabPanel>
      </Tabs>
    </Card>
  )
}