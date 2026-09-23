import { Card, Badge, Button, Tabs, TabList, Tab, TabPanel } from '@components/ui'
import { formatDate, formatDateTime } from '@utils/date'

interface DocumentDetailProps {
  document: any
  onClose: () => void
  onEdit?: () => void
}

export function DocumentDetail({ document, onClose, onEdit }: DocumentDetailProps) {
  const typeLabels: Record<string, string> = {
    carta_interna: 'Carta Interna',
    acta: 'Acta',
    documento_externo: 'Documento Externo',
    confirmacion_institucional: 'Confirmación Institucional',
  }

  const statusVariants: Record<string, 'success' | 'warning' | 'default'> = {
    publicado: 'success',
    borrador: 'warning',
    archivado: 'default',
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {typeLabels[document.document_type] || document.document_type}
            </Badge>
            <Badge variant={statusVariants[document.status] || 'default'}>
              {document.status}
            </Badge>
            {document.is_immutable && <Badge variant="info" className="text-xs">Inmutable</Badge>}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
          {onEdit && <Button variant="outline" onClick={onEdit}>Editar</Button>}
        </div>
      </div>

      {document.description && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">{document.description}</p>
        </div>
      )}

      <Tabs defaultValue="metadatos">
        <TabList className="mb-4">
          <Tab value="metadatos">Metadatos</Tab>
          <Tab value="archivo">Archivo</Tab>
        </TabList>

        <TabPanel value="metadatos">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><dt className="text-gray-500">Tipo</dt><dd className="font-medium">{typeLabels[document.document_type] || document.document_type}</dd></div>
            <div><dt className="text-gray-500">Estado</dt><dd className="font-medium"><Badge variant={statusVariants[document.status] || 'default'}>{document.status}</Badge></dd></div>
            <div><dt className="text-gray-500">Fecha del documento</dt><dd className="font-medium">{document.document_date ? formatDate(document.document_date) : 'Sin fecha'}</dd></div>
            <div><dt className="text-gray-500">Inmutable</dt><dd className="font-medium">{document.is_immutable ? 'Sí' : 'No'}</dd></div>
            <div><dt className="text-gray-500">Checksum</dt><dd className="font-medium font-mono text-xs">{document.checksum || 'No calculado'}</dd></div>
            <div><dt className="text-gray-500">Creado por</dt><dd className="font-medium">{document.created_by_profile?.display_name || 'Desconocido'}</dd></div>
            <div><dt className="text-gray-500">Creado</dt><dd className="font-medium">{formatDateTime(document.created_at)}</dd></div>
            <div><dt className="text-gray-500">Actualizado</dt><dd className="font-medium">{formatDateTime(document.updated_at)}</dd></div>
          </dl>
        </TabPanel>

        <TabPanel value="archivo">
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            {document.storage_path ? (
              <div className="space-y-3">
                <p className="text-gray-600">Archivo disponible en: <code className="text-sm bg-gray-100 px-2 py-1 rounded">{document.storage_path}</code></p>
                <Button variant="outline" onClick={() => {}}>Descargar / Ver</Button>
              </div>
            ) : (
              <p className="text-gray-500">No hay archivo asociado</p>
            )}
          </div>
        </TabPanel>
      </Tabs>
    </Card>
  )
}