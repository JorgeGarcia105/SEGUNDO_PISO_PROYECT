import { useState, useEffect } from 'react'
import { Button, Input, Textarea, Select, Modal } from '@components/ui'
import { useAllProfiles } from '@hooks/useProfiles'
import { useViolations } from '@hooks/useViolations'
import { useDocuments } from '@hooks/useDocuments'
import type { FormEvent } from 'react'
import type { MeasureType, MeasureStatus } from '@/types/database'

interface CorrectiveMeasureFormData {
  violation_id: string
  measure_type: MeasureType
  detail: string
  quantity: number | null
  unit: string | null
  status: MeasureStatus
  assigned_to: string | null
  assigned_by: string | null
  due_at: string | null
  source_document_id: string | null
}

interface CorrectiveMeasureFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CorrectiveMeasureFormData) => Promise<void>
  initialData: CorrectiveMeasureFormData | null
  loading: boolean
}

export function CorrectiveMeasureFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}: CorrectiveMeasureFormModalProps) {
  const { profiles } = useAllProfiles()
  const { violations } = useViolations()
  const { documents } = useDocuments()

  const [formData, setFormData] = useState<CorrectiveMeasureFormData>({
    violation_id: '',
    measure_type: 'ASEO_ADICIONAL' as MeasureType,
    detail: '',
    quantity: null,
    unit: null,
    status: 'PENDIENTE' as MeasureStatus,
    assigned_to: null,
    assigned_by: null,
    due_at: null,
    source_document_id: null,
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        violation_id: '',
        measure_type: 'ASEO_ADICIONAL' as MeasureType,
        detail: '',
        quantity: null,
        unit: null,
        status: 'PENDIENTE' as MeasureStatus,
        assigned_to: null,
        assigned_by: null,
        due_at: null,
        source_document_id: null,
      })
    }
  }, [initialData])

  const handleChange = (field: keyof CorrectiveMeasureFormData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const violationOptions = violations.map((v) => ({ value: v.id, label: `${v.title} (${v.affected_profile?.display_name || 'Sin residente'})` }))
  const profileOptions = profiles.map((p) => ({ value: p.id, label: `${p.display_name || 'Sin nombre'} (${p.room_label || 'Sin habitación'})` }))
  const documentOptions = documents.map((d) => ({ value: d.id, label: d.title }))

  const typeOptions = [
    { value: 'ASEO_ADICIONAL', label: 'Aseo adicional' },
    { value: 'MULTA_ECONOMICA', label: 'Multa económica' },
    { value: 'RESTRICCION_USO', label: 'Restricción de uso' },
    { value: 'AMONESTACION', label: 'Amonestación' },
    { value: 'OTRA', label: 'Otra' },
  ]

  const statusOptions = [
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'EN_EJECUCION', label: 'En ejecución' },
    { value: 'COMPLETADA', label: 'Completada' },
    { value: 'INCUMPLIDA', label: 'Incumplida' },
    { value: 'CANCELADA', label: 'Cancelada' },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar medida correctiva' : 'Nueva medida correctiva'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Select
            label="Incumplimiento *"
            options={[{ value: '', label: 'Seleccionar incumplimiento' }, ...violationOptions]}
            value={formData.violation_id}
            onChange={(e) => handleChange('violation_id', e.target.value)}
            required
          />
        </div>

        <div>
          <Select
            label="Tipo de medida *"
            options={typeOptions}
            value={formData.measure_type}
            onChange={(e) => handleChange('measure_type', e.target.value)}
            required
          />
        </div>

        <div>
          <Textarea
            label="Detalle *"
            value={formData.detail}
            onChange={(e) => handleChange('detail', e.target.value)}
            placeholder="Descripción detallada de la medida"
            required
            rows={3}
            error={!formData.detail ? 'El detalle es obligatorio' : undefined}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Cantidad"
              type="number"
              value={formData.quantity ?? ''}
              onChange={(e) => handleChange('quantity', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Ej: 3"
              min="0"
            />
          </div>
          <div>
            <Input
              label="Unidad"
              value={formData.unit || ''}
              onChange={(e) => handleChange('unit', e.target.value || null)}
              placeholder="Ej: aseos, días, semanas"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Select
              label="Estado *"
              options={statusOptions}
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              label="Fecha límite"
              type="date"
              value={formData.due_at ? formData.due_at.split('T')[0] : ''}
              onChange={(e) => handleChange('due_at', e.target.value ? `${e.target.value}T23:59:59Z` : null)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Select
              label="Asignado a"
              options={[{ value: '', label: 'Sin asignar' }, ...profileOptions]}
              value={formData.assigned_to || ''}
              onChange={(e) => handleChange('assigned_to', e.target.value || null)}
              placeholder="Seleccionar responsable"
            />
          </div>
          <div>
            <Select
              label="Asignado por"
              options={[{ value: '', label: 'Sin asignar' }, ...profileOptions]}
              value={formData.assigned_by || ''}
              onChange={(e) => handleChange('assigned_by', e.target.value || null)}
              placeholder="Seleccionar quien asigna"
            />
          </div>
        </div>

        <div>
          <Select
            label="Documento fuente"
            options={[{ value: '', label: 'Sin documento' }, ...documentOptions]}
            value={formData.source_document_id || ''}
            onChange={(e) => handleChange('source_document_id', e.target.value || null)}
            placeholder="Seleccionar documento de respaldo"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}