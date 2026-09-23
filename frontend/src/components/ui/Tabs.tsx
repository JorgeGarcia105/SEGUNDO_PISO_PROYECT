import { createContext, useContext, useState, type ReactNode } from 'react'
import { cn } from '@utils/cn'

export interface TabsProps {
  children: ReactNode
  defaultValue: string
  className?: string
  onChange?: (value: string) => void
}

export function Tabs({ children, defaultValue, className, onChange }: TabsProps) {
  const [value, setValue] = useState(defaultValue)

  const contextValue = { value, onChange: (v: string) => { setValue(v); onChange?.(v) } }

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsContext = createContext<{ value: string; onChange: (v: string) => void } | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tabs components must be used within Tabs')
  return context
}

export interface TabListProps {
  children: ReactNode
  className?: string
}

export function TabList({ children, className }: TabListProps) {
  return <div className={cn('flex gap-1 border-b border-gray-200 mb-4', className)}>{children}</div>
}

export interface TabProps {
  value: string
  children: ReactNode
  disabled?: boolean
  className?: string
}

export function Tab({ value, children, disabled, className }: TabProps) {
  const { value: currentValue, onChange } = useTabsContext()
  const isActive = currentValue === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => !disabled && onChange(value)}
      className={cn(
        'px-4 py-2 text-sm font-medium rounded-t-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
        isActive
          ? 'bg-white border-b-2 border-blue-600 text-blue-600'
          : 'text-gray-500 hover:text-gray-700',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  )
}

export interface TabPanelProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { value: currentValue } = useTabsContext()
  if (currentValue !== value) return null
  return <div className={cn(className)} role="tabpanel">{children}</div>
}