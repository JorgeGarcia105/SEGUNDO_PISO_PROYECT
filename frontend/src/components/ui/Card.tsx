import { cn } from '@utils/cn'

export interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, className, variant = 'default', padding = 'md' }: CardProps) {
  const variants = {
    default: 'bg-white dark:bg-neutral-900 shadow-sm',
    outlined: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700',
    elevated: 'bg-white dark:bg-neutral-900 shadow-md',
  }
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div className={cn('rounded-lg', variants[variant], paddings[padding], className)}>
      {children}
    </div>
  )
}

export interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
  return <h3 className={cn('text-lg font-semibold text-neutral-900 dark:text-neutral-100', className)}>{children}</h3>
}

export interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return <p className={cn('mt-1 text-sm text-neutral-500 dark:text-neutral-400', className)}>{children}</p>
}

export interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn(className)}>{children}</div>
}

export interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={cn('mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700', className)}>{children}</div>
}