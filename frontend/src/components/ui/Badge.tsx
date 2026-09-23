import { cn } from '@utils/cn'

export interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
  size?: 'sm' | 'md'
  dot?: boolean
}

export function Badge({ children, className, variant = 'default', size = 'md', dot }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    outline: 'border border-gray-300 bg-transparent text-gray-700',
  }
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  }

  return (
    <span className={cn('inline-flex items-center font-medium rounded-full', variants[variant], sizes[size], className)}>
      {dot && <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', variant === 'success' && 'bg-green-500', variant === 'warning' && 'bg-yellow-500', variant === 'danger' && 'bg-red-500', variant === 'info' && 'bg-blue-500', variant === 'default' && 'bg-gray-500')} />}
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, BadgeProps['variant']> = {
    VIGENTE: 'success',
    MODIFICADA: 'warning',
    DEROGADA: 'danger',
    HISTORICA: 'info',
    PENDIENTE_CONFIRMACION: 'warning',
    NO_VERIFICADO: 'default',
    PROGRAMADO: 'info',
    ENTREGADO: 'success',
    VERIFICADO: 'success',
    INCUMPLIDO: 'danger',
    CANCELADO: 'default',
    publicado: 'success',
    borrador: 'warning',
    archivado: 'default',
  }
  return <Badge variant={variants[status] || 'default'}>{status.replace(/_/g, ' ')}</Badge>
}