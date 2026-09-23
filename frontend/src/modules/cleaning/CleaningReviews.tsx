import { useMemo } from 'react'
import { Table, Card, Badge, Dropdown, Button, type DropdownItem } from '@components/ui'
import { useCleaningReviews } from '@hooks/useCleaning'
import { formatDate } from '@utils/date'

export function CleaningReviewsList({ assignmentId }: { assignmentId?: string }) {
  const { reviews, loading, error, refetch } = useCleaningReviews(assignmentId)

  const columns = useMemo(
    () => [
      {
        key: 'assignment',
        header: 'Asignación',
        render: (r: any) => (
          <div>
            <p className="font-medium text-gray-900">{r.assignment?.task?.title || 'Sin tarea'}</p>
            <p className="text-sm text-gray-500">{r.assignment?.task?.zone?.name || 'Sin zona'}</p>
          </div>
        ),
      },
      {
        key: 'reviewer',
        header: 'Revisor',
        render: (r: any) => r.reviewer ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium text-sm">
              {r.reviewer.display_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <p className="font-medium text-gray-900">{r.reviewer.display_name || 'Sin nombre'}</p>
          </div>
        ) : (
          <span className="text-gray-400">Sin revisor</span>
        ),
      },
      {
        key: 'reviewed_at',
        header: 'Fecha revisión',
        render: (r: any) => r.reviewed_at ? formatDate(r.reviewed_at) : <span className="text-gray-400">Sin fecha</span>,
      },
      {
        key: 'result',
        header: 'Resultado',
        render: (r: any) => r.result_note ? (
          <p className="text-sm text-gray-700 line-clamp-2">{r.result_note}</p>
        ) : (
          <span className="text-gray-400">Sin notas</span>
        ),
      },
      {
        key: 'evidence',
        header: 'Evidencia',
        render: (r: any) => r.evidence_path ? (
          <Badge variant="success" className="text-xs">Disponible</Badge>
        ) : (
          <span className="text-gray-400 text-sm">Sin evidencia</span>
        ),
      },
      {
        key: 'actions',
        header: 'Acciones',
        render: (_r: any) => {
          const items: DropdownItem[] = [
            { label: 'Ver detalle', onClick: () => {}, icon: <EyeIcon /> },
            { label: 'Ver evidencia', onClick: () => {}, icon: <FileIcon /> },
            { divider: true },
            { label: 'Editar', onClick: () => {}, icon: <EditIcon /> },
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
          <h2 className="text-lg font-semibold text-gray-900">Revisiones de aseo</h2>
          <p className="text-sm text-gray-500">{reviews.length} revisiones</p>
        </div>
      </div>

      <Table
        data={reviews}
        columns={columns}
        keyExtractor={(r) => r.id}
        loading={loading}
        emptyMessage="No hay revisiones registradas"
        onRowClick={(_r) => {}}
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

function FileIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
}

function EditIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
}

function MoreIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
}