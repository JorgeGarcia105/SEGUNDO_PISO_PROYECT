import { useState, useMemo } from 'react'
import { Table, Card, Input, Select, Button, Badge, Dropdown, type DropdownItem } from '@components/ui'
import { useDocuments, usePublishedDocuments } from '@hooks/useDocuments'
import { formatDate } from '@utils/date'

export function DocumentsList({ publicOnly = false }: { publicOnly?: boolean }) {
  const publishedDocumentsState = usePublishedDocuments()
  const allDocumentsState = useDocuments()
  const { documents, loading, error, refetch } = publicOnly ? publishedDocumentsState : allDocumentsState
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        !searchQuery ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = !selectedType || doc.document_type === selectedType

      return matchesSearch && matchesType
    })
  }, [documents, searchQuery, selectedType])

  const hasActiveFilters = !!searchQuery || !!selectedType

  const typeOptions = useMemo(
    () => [
      { value: '', label: 'Todos los tipos' },
      { value: 'carta_interna', label: 'Carta Interna' },
      { value: 'acta', label: 'Acta' },
      { value: 'documento_externo', label: 'Documento Externo' },
      { value: 'confirmacion_institucional', label: 'Confirmación Institucional' },
    ],
    []
  )

  const columns = useMemo(
    () => [
      {
        key: 'title',
        header: 'Documento',
        render: (doc: any) => (
          <div>
            <p className="font-medium text-gray-900">{doc.title}</p>
            {doc.description && <p className="text-sm text-gray-500 line-clamp-1 mt-1">{doc.description}</p>}
          </div>
        ),
      },
      {
        key: 'type',
        header: 'Tipo',
        render: (doc: any) => {
          const labels: Record<string, string> = {
            carta_interna: 'Carta Interna',
            acta: 'Acta',
            documento_externo: 'Doc. Externo',
            confirmacion_institucional: 'Confirmación Inst.',
          }
          return <Badge variant="outline" className="text-xs">{labels[doc.document_type] || doc.document_type}</Badge>
        },
      },
      {
        key: 'status',
        header: 'Estado',
        render: (doc: any) => {
          const variants: Record<string, 'success' | 'warning' | 'default'> = {
            publicado: 'success',
            borrador: 'warning',
            archivado: 'default',
          }
          return <Badge variant={variants[doc.status] || 'default'}>{doc.status}</Badge>
        },
      },
      {
        key: 'date',
        header: 'Fecha',
        render: (doc: any) => doc.document_date ? formatDate(doc.document_date) : <span className="text-gray-400">Sin fecha</span>,
      },
      {
        key: 'immutable',
        header: 'Inmutable',
        render: (doc: any) => doc.is_immutable ? (
          <Badge variant="info" className="text-xs">Sí</Badge>
        ) : (
          <Badge variant="default" className="text-xs">No</Badge>
        ),
      },
      {
        key: 'actions',
        header: 'Acciones',
        render: (_doc: any) => {
          const items: DropdownItem[] = [
            { label: 'Ver detalle', onClick: () => {}, icon: <EyeIcon /> },
            { label: 'Ver PDF', onClick: () => {}, icon: <FileIcon /> },
          ]
          if (!publicOnly) {
            items.push({ divider: true })
            items.push({ label: 'Editar', onClick: () => {}, icon: <EditIcon /> })
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
          <h2 className="text-lg font-semibold text-gray-900">Documentos</h2>
          <p className="text-sm text-gray-500">{filteredDocuments.length} de {documents.length} documentos</p>
        </div>
        {!publicOnly && (
          <Button onClick={() => {}}>Nuevo documento</Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-100 mb-4">
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Tipo"
            options={typeOptions}
            value={selectedType || ''}
            onChange={(e) => setSelectedType(e.target.value || null)}
            placeholder="Todos los tipos"
          />
        </div>
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
            <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSelectedType(null) }} className="h-10">
              Limpiar
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Table
          data={filteredDocuments}
          columns={columns}
          keyExtractor={(d) => d.id}
          loading={loading}
          emptyMessage="No se encontraron documentos"
          onRowClick={(_doc) => {}}
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