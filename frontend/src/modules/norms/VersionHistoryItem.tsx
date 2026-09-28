import React from 'react'
import { NormStatusBadge, SourceBadge } from './NormFilters'

interface VersionHistoryItemProps {
  version: any
  currentVersionId: string | null
}

function VersionHistoryItem({ version }: VersionHistoryItemProps) {
  return (
    <div className="border rounded-lg p-4 transition-colors bg-white border-neutral-200 hover:bg-neutral-50">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-mono text-sm px-2 py-1 rounded bg-neutral-100 text-neutral-600">
              v{version.version_number}
            </span>
            <NormStatusBadge status={version.status} />
            {version.source_document_id && (
              <SourceBadge sourceType={version.source_document_id} sourceNote={version.source_note} />
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-neutral-500 mb-3">
            <div><span className="font-medium">Creada:</span> {version.created_at ? version.created_at.split('T')[0] : '—'}</div>
            <div><span className="font-medium">Válida desde:</span> {version.valid_from || '—'}</div>
            <div><span className="font-medium">Válida hasta:</span> {version.valid_until || 'Indefinida'}</div>
            <div><span className="font-medium">ID:</span> {version.id.slice(0, 8)}...</div>
          </div>

          <p className="text-sm text-neutral-700 line-clamp-3 font-mono bg-neutral-100 p-3 rounded">{version.text_content}</p>

          {version.source_note && (
            <div className="text-xs text-neutral-500 bg-neutral-100 p-2 rounded mt-3">
              <span className="font-medium">Fuente: </span>{version.source_note}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default React.memo(VersionHistoryItem)