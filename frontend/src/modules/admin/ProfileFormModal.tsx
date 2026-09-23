import { useState, useEffect } from 'react'
import { Button, Input, Modal } from '@components/ui'
import type { FormEvent } from 'react'

interface ProfileFormData {
  display_name: string
  room_label: string | null
  is_active: boolean
}

interface ProfileFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProfileFormData) => Promise<void>
  initialData: ProfileFormData & { id: string } | null
  loading: boolean
}

export function ProfileFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}: ProfileFormModalProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    display_name: '',
    room_label: null,
    is_active: true,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        display_name: initialData.display_name || '',
        room_label: initialData.room_label || null,
        is_active: initialData.is_active ?? true,
      })
    } else {
      setFormData({
        display_name: '',
        room_label: null,
        is_active: true,
      })
    }
  }, [initialData])

  const handleChange = (field: keyof ProfileFormData, value: string | boolean | null) => {
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
      title={initialData ? 'Editar persona' : 'Nueva persona'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Nombre completo *"
            value={formData.display_name}
            onChange={(e) => handleChange('display_name', e.target.value)}
            placeholder="Juan Pérez"
            required
            error={!formData.display_name ? 'El nombre es obligatorio' : undefined}
          />
        </div>

        <div>
          <Input
            label="Habitación"
            value={formData.room_label || ''}
            onChange={(e) => handleChange('room_label', e.target.value || null)}
            placeholder="Ej: Habitación 204"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Activo</span>
          </label>
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