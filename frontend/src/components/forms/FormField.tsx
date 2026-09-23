import { type ReactNode } from 'react'
import { cn } from '@utils/cn'

export interface FormFieldProps {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormField({ label, error, helperText, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className={cn('block text-sm font-medium text-gray-700 mb-1', required && 'after:content-["*"] after:text-red-500 after:ml-0.5')}>
          {label}
        </label>
      )}
      <div>{children}</div>
      {error && <p className="mt-1 text-sm text-red-600" role="alert">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  )
}

export interface FormSectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export interface FormActionsProps {
  children: ReactNode
  className?: string
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn('flex items-center justify-end gap-3 pt-4 border-t border-gray-100', className)}>
      {children}
    </div>
  )
}