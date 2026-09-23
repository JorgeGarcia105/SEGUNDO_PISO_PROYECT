import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input, Textarea, FormField } from '@components/ui'
import { normCategorySchema, type NormCategoryForm } from '@utils/validation'

interface NormCategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: NormCategoryForm) => Promise<void>
  initialData?: { id: string; name: string; description: string | null } | null
  loading?: boolean
}

export function NormCategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}: NormCategoryFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NormCategoryForm>({
    resolver: zodResolver(normCategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          description: initialData.description || '',
        })
      } else {
        reset({ name: '', description: '' })
      }
    }
  }, [isOpen, initialData, reset])

  async function onFormSubmit(data: NormCategoryForm) {
    await onSubmit(data)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar categoría' : 'Nueva categoría'}
      size="md"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField label="Nombre" error={errors.name?.message} required>
          <Input
            {...register('name')}
            placeholder="Nombre de la categoría"
            maxLength={100}
          />
        </FormField>

        <FormField label="Descripción" error={errors.description?.message}>
          <Textarea
            {...register('description')}
            placeholder="Descripción opcional"
            rows={3}
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? 'Guardar cambios' : 'Crear categoría'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}