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
  initialData?: { id: string; category_id: string | null; title: string; article_number: string | null; chapter: string | null; is_provisional: boolean; drive_url: string | null } | null
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
    resolver: zodResolver(normSchema) as any,
    defaultValues: {
      category_id: undefined,
      title: '',
      article_number: '',
      chapter: '',
      is_provisional: false,
      drive_url: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          category_id: initialData.category_id ?? undefined,
          title: initialData.title,
          article_number: initialData.article_number || '',
          chapter: initialData.chapter || '',
          is_provisional: initialData.is_provisional || false,
          drive_url: initialData.drive_url || '',
        })
      } else {
        reset({ category_id: undefined, title: '', article_number: '', chapter: '', is_provisional: false, drive_url: '' })
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

        <FormField label="Número de artículo" error={errors.article_number?.message}>
          <Input
            {...register('article_number')}
            placeholder="Ej: 1.1, 2.3, etc."
            maxLength={50}
          />
        </FormField>

        <FormField label="Capítulo" error={errors.chapter?.message}>
          <Input
            {...register('chapter')}
            placeholder="Ej: Capítulo I, Sección 2, etc."
            maxLength={100}
          />
        </FormField>

        <FormField label="Drive URL" error={errors.drive_url?.message}>
          <Input
            {...register('drive_url')}
            placeholder="https://drive.google.com/..."
            type="url"
            maxLength={500}
          />
        </FormField>

        <FormField label="Provisional" error={errors.is_provisional?.message}>
          <div className="flex items-center gap-2">
            <input
              {...register('is_provisional', { valueAsBoolean: true } as any)}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">Esta norma es provisional (pendiente de confirmación)</span>
          </div>
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