import { type SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@utils/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, disabled, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-neutral-900 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full rounded-md border px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100',
            'border-neutral-300 bg-white text-neutral-900',
            error && 'border-danger-500 focus:ring-danger-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p id={`${selectId}-error`} className="mt-1 text-sm text-danger-600" role="alert">{error}</p>}
        {helperText && !error && <p id={`${selectId}-helper`} className="mt-1 text-sm text-neutral-600">{helperText}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'