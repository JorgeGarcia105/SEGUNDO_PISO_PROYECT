import { type ReactNode } from 'react'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }
  size?: 'sm' | 'md' | 'lg'
}

export function EmptyState({ title, description, icon, action, size = 'md' }: EmptyStateProps) {
  const sizes = {
    sm: { container: 'py-8', icon: 'w-10 h-10', title: 'text-lg', desc: 'text-sm', gap: 'gap-2' },
    md: { container: 'py-16', icon: 'w-16 h-16', title: 'text-xl', desc: 'text-base', gap: 'gap-4' },
    lg: { container: 'py-24', icon: 'w-20 h-20', title: 'text-2xl', desc: 'text-lg', gap: 'gap-6' },
  }

  const s = sizes[size]

  return (
    <div className={`flex flex-col items-center justify-center text-center ${s.container} ${s.gap}`}>
      {icon && (
        <div className={`flex-shrink-0 text-neutral-400 ${s.icon} mx-auto`}>
          {icon}
        </div>
      )}
      <div className="max-w-sm">
        <h3 className={`font-semibold text-neutral-900 dark:text-neutral-100 ${s.title}`}>{title}</h3>
        {description && (
          <p className={`mt-2 text-neutral-500 dark:text-neutral-400 ${s.desc}`}>{description}</p>
        )}
        {action && (
          <div className="mt-6">
            <button
              type="button"
              onClick={action.onClick}
              className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                action.variant === 'secondary'
                  ? 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700'
                  : 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500'
              }`}
            >
              {action.label}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function EmptyStateIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}