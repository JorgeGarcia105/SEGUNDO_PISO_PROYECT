import { useState, useEffect } from 'react'
import { Button, Input, Textarea, Select, Modal } from '@components/ui'
import { useAllProfiles } from '@hooks/useProfiles'
import { useNorms } from '@hooks/useNorms'
import { useDecisions } from '@hooks/useDecisions'
import type { FormEvent } from 'react'
import type { ScopeType } from '@/types/database'

interface ViolationFormData {
  title: string
  detail: string
  violation_date: string
  affected_profile_id: string | null
  source_norm_id: string | null
  source_decision_id: string | null
  scope: ScopeType
}

interface ViolationFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ViolationFormData) => Promise<void>
  initialData: ViolationFormData | null
  loading: boolean
}

export function ViolationFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}: ViolationFormModalProps) {
  const { profiles } = useAllProfiles()
  const { norms } = useNorms()
  const { decisions } = useDecisions()

  const [formData, setFormData] = useState<ViolationFormData>({
    title: '',
    detail: '',
    violation_date: new Date().toISOString().split('T')[0],
    affected_profile_id: null,
    source_norm_id: null,
    source_decision_id: null,
    scope: 'INDIVIDUAL',
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        title: '',
        detail: '',
        violation_date: new Date().toISOString().split('T')[0],
        affected_profile_id: null,
        source_norm_id: null,
        source_decision_id: null,
        scope: 'INDIVIDUAL',
      })
    }
  }, [initialData])

  const handleChange = (field: keyof ViolationFormData, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const profileOptions = profiles.map((p) => ({ value: p.id, label: `${p.display_name || 'Sin nombre'} (${p.room_label || 'Sin habitación'})` }))
  const normOptions = norms.map((n) => ({ value: n.id, label: n.title }))
  const decisionOptions = decisions.map((d) => ({ value: d.id, label: `${d.title} (${d.decision_type})` }))

  const scopeOptions = [
    { value: 'GENERAL', label: 'General' },
    { value: 'TEMPORAL', label: 'Temporal' },
    { value: 'INDIVIDUAL', label: 'Individual' },
    { value: 'EXTERNO', label: 'Externo' },
    { value: 'NO_DETERMINADO', label: 'No determinado' },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar incumplimiento' : 'Nuevo incumplimiento'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Título *"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Título del incumplimiento"
            required
            error={!formData.title ? 'El título es obligatorio' : undefined}
          />
        </div>

        <div>
          <Textarea
            label="Detalle *"
            value={formData.detail}
            onChange={(e) => handleChange('detail', e.target.value)}
            placeholder="Descripción detallada del incumplimiento"
            required
            rows={4}
            error={!formData.detail ? 'El detalle es obligatorio' : undefined}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Fecha del incumplimiento *"
              type="date"
              value={formData.violation_date}
              onChange={(e) => handleChange('violation_date', e.target.value)}
              required
            />
          </div>
          <div>
            <Select
              label="Alcance *"
              options={scopeOptions}
              value={formData.scope}
              onChange={(e) => handleChange('scope', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Select
              label="Residente afectado"
              options={[{ value: '', label: 'Sin asignar' }, ...profileOptions]}
              value={formData.affected_profile_id || ''}
              onChange={(e) => handleChange('affected_profile_id', e.target.value || null)}
              placeholder="Seleccionar residente"
            />
          </div>
          <div>
            <Select
              label="Norma relacionada"
              options={[{ value: '', label: 'Sin norma' }, ...normOptions]}
              value={formData.source_norm_id || ''}
              onChange={(e) => handleChange('source_norm_id', e.target.value || null)}
              placeholder="Seleccionar norma"
            />
          </div>
        </div>

        <div>
          <Select
            label="Decisión relacionada"
            options={[{ value: '', label: 'Sin decisión' }, ...decisionOptions]}
            value={formData.source_decision_id || ''}
            onChange={(e) => handleChange('source_decision_id', e.target.value || null)}
            placeholder="Seleccionar decisión"
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