import { useState, useRef, useEffect, type ReactNode } from 'react'
import { cn } from '@utils/cn'

export interface DropdownItem {
  label?: string
  onClick?: () => void
  icon?: ReactNode
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

export interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, items, align = 'right', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn('relative inline-block', className)} ref={dropdownRef}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'fixed z-50 mt-1 min-w-[180px] bg-white rounded-md shadow-lg border border-gray-100 py-1',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          role="menu"
        >
          {items.map((item, index) => (
            item.divider ? (
              <div key={`divider-${index}`} className="border-t border-gray-100 my-1" role="separator" />
            ) : (
              <button
                key={index}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.()
                  setOpen(false)
                }}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm flex items-center gap-2',
                  item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  )
}

export interface DropdownMenuProps {
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
  children: (props: { open: boolean; setOpen: (open: boolean) => void; triggerRef: React.RefObject<HTMLButtonElement | null> }) => ReactNode
}

export function DropdownMenu({ items, align = 'right', className, children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn('relative inline-block', className)}>
      {children({ open, setOpen, triggerRef })}
      {open && (
        <div
          ref={menuRef}
          className={cn(
            'fixed z-50 mt-1 min-w-[180px] bg-white rounded-md shadow-lg border border-gray-100 py-1',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          role="menu"
        >
          {items.map((item, index) => (
            item.divider ? (
              <div key={`divider-${index}`} className="border-t border-gray-100 my-1" role="separator" />
            ) : (
              <button
                key={index}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.()
                  setOpen(false)
                }}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm flex items-center gap-2',
                  item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  )
}