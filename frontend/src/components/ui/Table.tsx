import { cn } from '@utils/cn'
import { ChevronDownIcon } from './Icons'
import * as React from 'react'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T, index: number) => React.ReactNode
  className?: string
  width?: string
}

export interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (row: T) => string
  className?: string
  emptyMessage?: string
  striped?: boolean
  hoverable?: boolean
  loading?: boolean
  onRowClick?: (row: T) => void
  expandable?: boolean
  renderExpand?: (row: T) => React.ReactNode
  expandedKeys?: Set<string>
  onExpandChange?: (key: string, expanded: boolean) => void
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  className,
  emptyMessage = 'No hay datos',
  striped = true,
  hoverable = true,
  loading = false,
  onRowClick,
  expandable = false,
  renderExpand,
  expandedKeys = new Set(),
  onExpandChange,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead>
            <tr>
              {expandable && <th className={cn('px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', 'w-10')} />}
              {columns.map((col) => (
                <th key={col.key} className={cn('px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', col.className)} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className={cn(hoverable && 'hover:bg-gray-50', striped && i % 2 === 0 && 'bg-gray-50')}>
                {expandable && <td className="px-4 py-3" />}
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3 text-sm text-gray-900', col.className)}>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full" role="table">
        <thead>
          <tr>
            {expandable && <th className={cn('px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', 'w-10')} />}
            {columns.map((col) => (
              <th key={col.key} className={cn('px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', col.className)} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => {
            const key = keyExtractor(row)
            const isExpanded = expandedKeys.has(key)
            return (
              <React.Fragment key={key}>
                <tr
                  className={cn(
                    hoverable && 'hover:bg-gray-50',
                    striped && rowIndex % 2 === 0 && 'bg-gray-50',
                    onRowClick && 'cursor-pointer',
                    expandable && 'cursor-pointer'
                  )}
                  onClick={(e) => {
                    if (expandable && renderExpand && !e.currentTarget.querySelector('button, select, input, a')) {
                      onExpandChange?.(key, !isExpanded)
                    } else {
                      onRowClick?.(row)
                    }
                  }}
                >
                  {expandable && renderExpand && (
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          onExpandChange?.(key, !isExpanded)
                        }}
                        aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
                        aria-expanded={isExpanded}
                      >
                        <ChevronDownIcon rotated={isExpanded} />
                      </button>
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-3 text-sm text-gray-900', col.className)}>
                      {col.render ? col.render(row, rowIndex) : String((row as any)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
                {expandable && renderExpand && isExpanded && (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-0 py-0">
                      <div className="bg-gray-50 border-t border-gray-100 px-4 py-4 animate-in fade-in slide-in-from-top-2 duration-150">
                        {renderExpand(row)}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}