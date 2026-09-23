import { type ReactNode } from 'react'
import { cn } from '@utils/cn'

interface NavItem {
  key: string
  label: string
  short: string
  icon?: ReactNode
  badge?: string
  onClick: () => void
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  items: NavItem[]
  activeKey: string
  brand?: {
    mark: ReactNode
    name: string
    caption: string
  }
  footer?: ReactNode
  className?: string
}

export function Sidebar({
  isOpen,
  onClose,
  items,
  activeKey,
  brand,
  footer,
  className,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
        aria-label="Navegación principal"
      >
        <div className="flex h-full flex-col">
          {brand && (
            <div className="flex h-16 items-center gap-3 px-6 border-b border-gray-100">
              <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold', 'text-lg')}>
                {brand.mark}
              </span>
              <div>
                <p className="font-semibold text-gray-900">{brand.name}</p>
                <p className="text-xs text-gray-500">{brand.caption}</p>
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Módulos">
            {items.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                className={cn(
                  'w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  activeKey === item.key
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <span className={cn('flex h-7 w-7 items-center justify-center rounded-md text-xs font-mono', activeKey === item.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500')}>
                  {item.short}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', activeKey === item.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500')}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {footer && (
            <div className="border-t border-gray-100 p-4">
              {footer}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}