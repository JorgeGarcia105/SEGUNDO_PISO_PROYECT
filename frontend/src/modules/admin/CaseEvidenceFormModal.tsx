import { useState, useEffect } from 'react'
import { Button, Input, Textarea, Modal } from '@components/ui'
import type { FormEvent } from 'react'

interface CaseEvidenceFormData {
  violation_id: string
  title: string
  description: string | null
  storage_path: string | null
  checksum: string | null
  evidence_type: string | null
}

interface CaseEvidenceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CaseEvidenceFormData) => Promise<void>
  initialData: CaseEvidenceFormData | null
  loading: boolean
}

export function CaseEvidenceFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}: CaseEvidenceFormModalProps) {
  const [formData, setFormData] = useState<CaseEvidenceFormData>({
    violation_id: '',
    title: '',
    description: null,
    storage_path: null,
    checksum: null,
    evidence_type: null,
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        violation_id: '',
        title: '',
        description: null,
        storage_path: null,
        checksum: null,
        evidence_type: null,
      })
    }
  }, [initialData])

  const handleChange = (field: keyof CaseEvidenceFormData, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar evidencia' : 'Nueva evidencia'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Título *"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Título de la evidencia"
            required
            error={!formData.title ? 'El título es obligatorio' : undefined}
          />
        </div>

        <div>
          <Textarea
            label="Descripción"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value || null)}
            placeholder="Descripción de la evidencia"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Tipo de evidencia"
              value={formData.evidence_type || ''}
              onChange={(e) => handleChange('evidence_type', e.target.value || null)}
              placeholder="Ej: foto, documento, video"
            />
          </div>
          <div>
            <Input
              label="Checksum (SHA256)"
              value={formData.checksum || ''}
              onChange={(e) => handleChange('checksum', e.target.value || null)}
              placeholder="Hash de verificación"
            />
          </div>
        </div>

        <div>
          <Input
            label="Ruta de almacenamiento (Supabase Storage)"
            value={formData.storage_path || ''}
            onChange={(e) => handleChange('storage_path', e.target.value || null)}
            placeholder="Ej: case-evidence/uuid-filename.jpg"
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