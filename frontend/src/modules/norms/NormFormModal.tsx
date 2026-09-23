import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input, Select, FormField } from '@components/ui'
import { normSchema, type NormForm } from '@utils/validation'
import { useNormCategories } from '@hooks/useNorms'

interface NormFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: NormForm) => Promise<void>
  initialData?: { id: string; category_id: string | null; title: string } | null
  loading?: boolean
}

export function NormFormModal({ isOpen, onClose, onSubmit, initialData, loading }: NormFormModalProps) {
  const { categories } = useNormCategories()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NormForm>({
    resolver: zodResolver(normSchema),
    defaultValues: {
      category_id: undefined,
      title: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          category_id: initialData.category_id ?? undefined,
          title: initialData.title,
        })
      } else {
        reset({ category_id: undefined, title: '' })
      }
    }
  }, [isOpen, initialData, reset])

  async function onFormSubmit(data: NormForm) {
    await onSubmit(data)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar norma' : 'Nueva norma'}
      size="md"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          label="Categoría"
          error={errors.category_id?.message}
          required={false}
        >
          <Select
            {...register('category_id')}
            options={[
              { value: '', label: 'Sin categoría' },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
            placeholder="Seleccionar categoría"
          />
        </FormField>

        <FormField label="Título" error={errors.title?.message} required>
          <Input
            {...register('title')}
            placeholder="Título de la norma"
            maxLength={255}
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? 'Guardar cambios' : 'Crear norma'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}