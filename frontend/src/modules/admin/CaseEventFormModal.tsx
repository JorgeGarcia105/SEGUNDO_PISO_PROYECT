import { useState, useEffect } from 'react'
import { Button, Textarea, Select, Modal, Input } from '@components/ui'
import type { FormEvent } from 'react'
import type { CaseEventType } from '@/types/database'

interface CaseEventFormData {
  violation_id: string
  event_type: CaseEventType
  description: string
  event_date: string
}

interface CaseEventFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CaseEventFormData) => Promise<void>
  initialData: CaseEventFormData | null
  loading: boolean
}

export function CaseEventFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}: CaseEventFormModalProps) {
  const [formData, setFormData] = useState<CaseEventFormData>({
    violation_id: '',
    event_type: 'NOTA',
    description: '',
    event_date: new Date().toISOString(),
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        violation_id: '',
        event_type: 'NOTA',
        description: '',
        event_date: new Date().toISOString(),
      })
    }
  }, [initialData])

  const handleChange = (field: keyof CaseEventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const typeOptions = [
    { value: 'CREACION', label: 'Creación' },
    { value: 'INVESTIGACION', label: 'Investigación' },
    { value: 'DESCARGOS', label: 'Descargos' },
    { value: 'AUDIENCIA', label: 'Audiencia' },
    { value: 'RESOLUCION', label: 'Resolución' },
    { value: 'APELACION', label: 'Apelación' },
    { value: 'EJECUCION_MEDIDA', label: 'Ejecución medida' },
    { value: 'CIERRE', label: 'Cierre' },
    { value: 'NOTA', label: 'Nota' },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar evento' : 'Nuevo evento'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Select
            label="Tipo de evento *"
            options={typeOptions}
            value={formData.event_type}
            onChange={(e) => handleChange('event_type', e.target.value)}
            required
          />
        </div>

        <div>
          <Textarea
            label="Descripción *"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Descripción del evento"
            required
            rows={4}
            error={!formData.description ? 'La descripción es obligatoria' : undefined}
          />
        </div>

        <div>
          <Input
            label="Fecha y hora *"
            type="datetime-local"
            value={formData.event_date ? formData.event_date.slice(0, 16) : ''}
            onChange={(e) => handleChange('event_date', e.target.value ? `${e.target.value}:00.000Z` : '')}
            required
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