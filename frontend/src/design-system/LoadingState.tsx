

export interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton' | 'inline'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  rows?: number
  showText?: boolean
}

export function LoadingState({ variant = 'spinner', size = 'md', text = 'Cargando...', rows = 3, showText = true }: LoadingStateProps) {
  const sizes = {
    sm: { spinner: 'w-4 h-4', text: 'text-xs', container: 'py-4' },
    md: { spinner: 'w-8 h-8', text: 'text-sm', container: 'py-8' },
    lg: { spinner: 'w-12 h-12', text: 'text-base', container: 'py-12' },
  }

  const s = sizes[size]

  if (variant === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center ${s.container} gap-3`}>
        <svg className={`animate-spin text-primary-600 ${s.spinner}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        {showText && <p className={`text-neutral-500 dark:text-neutral-400 ${s.text}`}>{text}</p>}
      </div>
    )
  }

  if (variant === 'skeleton') {
    return (
      <div className={`space-y-3 ${s.container}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-4 bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded" style={{ width: i === rows - 1 ? '60%' : '100%' }} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <svg className={`animate-spin text-primary-600 ${s.spinner}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {showText && <span className={`text-neutral-500 dark:text-neutral-400 ${s.text}`}>{text}</span>}
    </div>
  )
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'text' | 'circular' | 'rectangular' }) {
  return (
    <div
      className={`animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded ${props.variant === 'circular' ? 'rounded-full' : ''} ${className || ''}`}
      {...props}
    />
  )
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" variant="text" style={{ width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 ${className || ''}`}>
      <SkeletonText lines={4} />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 4, className }: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={`overflow-x-auto ${className || ''}`}>
      <table className="w-full" role="table">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                <Skeleton className="h-4 w-20" variant="text" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-neutral-50 dark:bg-neutral-800/50' : ''}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton className="h-4 w-full" variant="text" style={{ width: colIndex === columns - 1 ? '60%' : '100%' }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}