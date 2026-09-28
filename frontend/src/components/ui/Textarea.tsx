import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@utils/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, disabled, readOnly, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-neutral-900 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            'flex w-full rounded-md border px-3 py-2 text-sm placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100',
            'border-neutral-300 bg-white text-neutral-900',
            error && 'border-danger-500 focus:ring-danger-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        {error && <p id={`${textareaId}-error`} className="mt-1 text-sm text-danger-600" role="alert">{error}</p>}
        {helperText && !error && <p id={`${textareaId}-helper`} className="mt-1 text-sm text-neutral-600">{helperText}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'