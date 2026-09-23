import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Button, Input, Select, Textarea, FormField } from '@components/ui'
import { normVersionSchema, type NormVersionForm } from '@utils/validation'
import { useDocuments } from '@hooks/useDocuments'
import { useNorms } from '@hooks/useNorms'
import { type InitialVersionData } from './types'

type FormNormVersion = NormVersionForm & { status: NormVersionForm['status'] }

export interface NormVersionFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FormNormVersion) => Promise<void>
  initialData?: InitialVersionData | null
  normId?: string | null
  loading?: boolean
}

export function NormVersionFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  normId,
  loading,
}: NormVersionFormModalProps) {
  const { documents } = useDocuments()
  const { norms } = useNorms()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormNormVersion>({
    resolver: zodResolver(normVersionSchema),
    defaultValues: {
      norm_id: normId || '',
      version_number: 1,
      text_content: '',
      status: 'PENDIENTE_CONFIRMACION',
      valid_from: undefined,
      valid_until: undefined,
      source_document_id: undefined,
      source_note: '',
      approval_note: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          norm_id: initialData.norm_id,
          version_number: initialData.version_number,
          text_content: initialData.text_content,
          status: initialData.status,
          valid_from: initialData.valid_from ?? undefined,
          valid_until: initialData.valid_until ?? undefined,
          source_document_id: initialData.source_document_id ?? undefined,
          source_note: initialData.source_note || '',
          approval_note: initialData.approval_note || '',
        })
      } else {
        const nextVersion = norms
          .find((n) => n.id === normId)
          ?.norm_versions?.length
        reset({
          norm_id: normId || '',
          version_number: (nextVersion || 0) + 1,
          text_content: '',
          status: 'PENDIENTE_CONFIRMACION',
          valid_from: undefined,
          valid_until: undefined,
          source_document_id: undefined,
          source_note: '',
          approval_note: '',
        })
      }
    }
  }, [isOpen, initialData, normId, norms, reset])

  async function onFormSubmit(data: FormNormVersion) {
    await onSubmit(data)
  }

  const sourceDocuments = documents.filter((d) => d.status === 'publicado')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar versión' : 'Nueva versión de norma'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField label="Norma" error={errors.norm_id?.message} required>
          <Select
            {...register('norm_id')}
            options={norms.map((n) => ({ value: n.id, label: n.title }))}
            placeholder="Seleccionar norma"
            disabled={!!normId}
          />
        </FormField>

        <FormField label="Número de versión" error={errors.version_number?.message} required>
          <Input
            {...register('version_number', { valueAsNumber: true })}
            type="number"
            min="1"
            placeholder="1"
          />
        </FormField>

        <FormField label="Estado" error={errors.status?.message} required>
          <Select
            {...register('status')}
            options={[
              { value: 'VIGENTE', label: 'Vigente' },
              { value: 'MODIFICADA', label: 'Modificada' },
              { value: 'DEROGADA', label: 'Derogada' },
              { value: 'HISTORICA', label: 'Histórica' },
              { value: 'PENDIENTE_CONFIRMACION', label: 'Pendiente confirmación' },
              { value: 'NO_VERIFICADO', label: 'No verificado' },
            ]}
            placeholder="Seleccionar estado"
          />
        </FormField>

        <FormField label="Contenido" error={errors.text_content?.message} required>
          <Textarea
            {...register('text_content')}
            placeholder="Texto completo de la norma"
            rows={6}
            className="font-mono text-sm"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Válida desde" error={errors.valid_from?.message}>
            <Input
              {...register('valid_from')}
              type="date"
              placeholder="YYYY-MM-DD"
            />
          </FormField>

          <FormField label="Válida hasta" error={errors.valid_until?.message}>
            <Input
              {...register('valid_until')}
              type="date"
              placeholder="YYYY-MM-DD"
            />
          </FormField>
        </div>

        <FormField label="Documento fuente" error={errors.source_document_id?.message}>
          <Select
            {...register('source_document_id')}
            options={[
              { value: '', label: 'Sin documento fuente' },
              ...sourceDocuments.map((d) => ({ value: d.id, label: d.title })),
            ]}
            placeholder="Seleccionar documento"
          />
        </FormField>

        <FormField label="Nota de fuente" error={errors.source_note?.message}>
          <Textarea
            {...register('source_note')}
            placeholder="Referencia específica en el documento (sección, página, etc.)"
            rows={2}
          />
        </FormField>

        <FormField label="Nota de aprobación" error={errors.approval_note?.message}>
          <Textarea
            {...register('approval_note')}
            placeholder="Justificación de la aprobación o cambio de estado"
            rows={2}
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? 'Guardar cambios' : 'Crear versión'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}