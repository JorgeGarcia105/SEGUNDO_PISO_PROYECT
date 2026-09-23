import { cloneElement } from 'react'
import type { ReactNode, ReactElement } from 'react'
import { cn } from '@utils/cn'

export interface AvatarProps {
  src?: string | null
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
}

const ringSizes = {
  xs: 'ring-1',
  sm: 'ring-2',
  md: 'ring-2',
  lg: 'ring-2',
  xl: 'ring-2',
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getColor = (name: string) => {
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500',
    'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500',
    'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-pink-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={cn('rounded-full object-cover', sizes[size], ringSizes[size], 'ring-white', className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium text-white',
        sizes[size],
        ringSizes[size],
        'ring-white',
        getColor(name || ''),
        className
      )}
      aria-label={name}
    >
      {name ? getInitials(name) : '?'}
    </div>
  )
}

export interface AvatarGroupProps {
  children: ReactNode
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function AvatarGroup({ children, max = 5, size = 'md', className }: AvatarGroupProps) {
  const kids = Array.from(children as ReactNode[])
  const visible = kids.slice(0, max)
  const remaining = kids.length - max

  const groupSizes = {
    xs: '-ml-1',
    sm: '-ml-2',
    md: '-ml-2',
    lg: '-ml-3',
    xl: '-ml-4',
  }

  return (
    <div className={cn('flex', className)} aria-label={`${kids.length} usuarios`}>
      {visible.map((child, index) => {
        const el = child as ReactElement<{ className?: string }>
        return el.type === Avatar ? (
          cloneElement(child as ReactElement<AvatarProps>, {
            key: el.key ?? index,
            className: cn(el.props?.className, index > 0 && groupSizes[size]),
          })
        ) : (
          <span key={index} className={cn(index > 0 && groupSizes[size])}>{child}</span>
        )
      })}
      {remaining > 0 && (
        <div
          className={cn(
            'inline-flex items-center justify-center rounded-full font-medium text-white bg-gray-500',
            groupSizes[size],
            ringSizes[size],
            'ring-white ml-1'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}