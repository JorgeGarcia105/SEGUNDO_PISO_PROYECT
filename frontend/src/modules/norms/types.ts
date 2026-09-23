import { z } from 'zod'
import { normStatusSchema } from '@utils/validation'

export type InitialVersionData = {
  id: string
  norm_id: string
  version_number: number
  text_content: string
  status: z.infer<typeof normStatusSchema>
  valid_from: string | null
  valid_until: string | null
  source_document_id: string | null
  source_note: string | null
  approval_note: string | null
}