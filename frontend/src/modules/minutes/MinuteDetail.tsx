import { Card, Badge, Button, Tabs, TabList, Tab, TabPanel } from '@components/ui'
import { formatDate, formatDateTime } from '@utils/date'

interface MinuteDetailProps {
  minute: any
  onClose: () => void
  onEdit?: () => void
  onNewDecision?: () => void
}

const statusVariants: Record<string, 'success' | 'warning' | 'default'> = {
  publicado: 'success',
  borrador: 'warning',
  archivado: 'default',
}

const decisionTypeLabels: Record<string, string> = {
  PROPUESTA: 'Propuesta',
  VOTACION: 'Votación',
  DECISION_APROBADA: 'Decisión aprobada',
  DECISION_RECHAZADA: 'Decisión rechazada',
  EXCEPCION_INDIVIDUAL: 'Excepción individual',
  INFORMACION: 'Información',
  INFORME: 'Informe',
  PENDIENTE_CONFIRMACION: 'Pendiente confirmación',
}

const scopeLabels: Record<string, string> = {
  GENERAL: 'General',
  TEMPORAL: 'Temporal',
  INDIVIDUAL: 'Individual',
  EXTERNO: 'Externo',
  NO_DETERMINADO: 'No determinado',
}

export function MinuteDetail({ minute, onClose, onEdit, onNewDecision }: MinuteDetailProps) {
  return (
    <Card className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={statusVariants[minute.status] || 'default'}>{minute.status}</Badge>
            {minute.document_id && <Badge variant="outline" className="text-xs">Documento vinculado</Badge>}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{minute.title}</h1>
          <div className="mt-2 text-sm text-gray-500">
            {minute.meeting_date && <span>Fecha: {formatDate(minute.meeting_date)}</span>}
            {minute.participants_note && <span className="ml-4">Participantes: {minute.participants_note}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
          {onEdit && <Button variant="outline" onClick={onEdit}>Editar</Button>}
          {onNewDecision && <Button onClick={onNewDecision}>Nueva decisión</Button>}
        </div>
      </div>

      {minute.observations && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-500">Observaciones</p>
          <p className="text-gray-700 mt-1">{minute.observations}</p>
        </div>
      )}

      <Tabs defaultValue="decisiones">
        <TabList className="mb-4">
          <Tab value="decisiones">Decisiones ({minute.decisions?.length || 0})</Tab>
          <Tab value="metadatos">Metadatos</Tab>
        </TabList>

        <TabPanel value="decisiones">
          {minute.decisions && minute.decisions.length > 0 ? (
            <div className="space-y-4">
              {minute.decisions.map((d: any) => (
                <div key={d.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{d.title}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {decisionTypeLabels[d.decision_type] || d.decision_type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {scopeLabels[d.scope] || d.scope}
                        </Badge>
                        {d.affected_norm_id && (
                          <Badge variant="info" className="text-xs">Afecta norma: {d.affected_norm_id.slice(0, 8)}...</Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {}}>Ver detalle</Button>
                  </div>
                  <p className="text-sm text-gray-600">{d.detail}</p>
                  {d.source_note && (
                    <p className="mt-2 text-xs text-gray-500">Fuente: {d.source_note}</p>
                  )}
                  {d.approved_at && (
                    <p className="mt-1 text-xs text-gray-500">Aprobada: {formatDate(d.approved_at)}</p>
                  )}
                  {d.valid_from && (
                    <p className="mt-1 text-xs text-gray-500">Válida desde: {formatDate(d.valid_from)}</p>
                  )}
                  {d.valid_until && (
                    <p className="mt-1 text-xs text-gray-500">Válida hasta: {formatDate(d.valid_until)}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay decisiones registradas en esta acta</p>
          )}
        </TabPanel>

        <TabPanel value="metadatos">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><dt className="text-gray-500">Estado</dt><dd className="font-medium"><Badge variant={statusVariants[minute.status] || 'default'}>{minute.status}</Badge></dd></div>
            <div><dt className="text-gray-500">Fecha reunión</dt><dd className="font-medium">{minute.meeting_date ? formatDate(minute.meeting_date) : 'Sin fecha'}</dd></div>
            <div><dt className="text-gray-500">Documento vinculado</dt><dd className="font-medium">{minute.document?.title || 'Sin documento'}</dd></div>
            <div><dt className="text-gray-500">Participantes</dt><dd className="font-medium">{minute.participants_note || 'No registrados'}</dd></div>
            <div><dt className="text-gray-500">Temas</dt><dd className="font-medium">{minute.topics || 'No registrados'}</dd></div>
            <div className="sm:col-span-2"><dt className="text-gray-500">Observaciones</dt><dd className="font-medium">{minute.observations || 'Sin observaciones'}</dd></div>
            <div><dt className="text-gray-500">Creado</dt><dd className="font-medium">{formatDateTime(minute.created_at)}</dd></div>
            <div><dt className="text-gray-500">Actualizado</dt><dd className="font-medium">{formatDateTime(minute.updated_at)}</dd></div>
          </dl>
        </TabPanel>
      </Tabs>
    </Card>
  )
}