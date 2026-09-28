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
    default: 'bg-neutral-100 text-neutral-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    danger: 'bg-danger-100 text-danger-800',
    info: 'bg-info-100 text-info-800',
    outline: 'border border-neutral-300 bg-transparent text-neutral-800',
  }
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  }

  return (
    <span className={cn('inline-flex items-center font-medium rounded-full', variants[variant], sizes[size], className)}>
      {dot && <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', variant === 'success' && 'bg-success-500', variant === 'warning' && 'bg-warning-500', variant === 'danger' && 'bg-danger-500', variant === 'info' && 'bg-info-500', variant === 'default' && 'bg-neutral-500')} />}
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