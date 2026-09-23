import { useMemo } from 'react'
import { Select, Input, Badge, Button } from '@components/ui'

interface NormFiltersProps {
  categories: Array<{ id: string; name: string }>
  selectedCategory: string | null
  selectedStatus: string | null
  searchQuery: string
  dateFrom: string
  dateTo: string
  onCategoryChange: (value: string) => void
  onStatusChange: (value: string) => void
  onSearchChange: (value: string) => void
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onClear: () => void
  hasActiveFilters: boolean
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'VIGENTE', label: 'Vigente' },
  { value: 'MODIFICADA', label: 'Modificada' },
  { value: 'DEROGADA', label: 'Derogada' },
  { value: 'HISTORICA', label: 'Histórica' },
  { value: 'PENDIENTE_CONFIRMACION', label: 'Pendiente confirmación' },
  { value: 'NO_VERIFICADO', label: 'No verificado' },
]

export function NormFilters({
  categories,
  selectedCategory,
  selectedStatus,
  searchQuery,
  dateFrom,
  dateTo,
  onCategoryChange,
  onStatusChange,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
  onClear,
  hasActiveFilters,
}: NormFiltersProps) {
  const categoryOptions = useMemo(
    () => [{ value: '', label: 'Todas las categorías' }, ...categories.map((c) => ({ value: c.id, label: c.name }))],
    [categories]
  )

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-100">
      <div className="flex-1 min-w-[200px]">
        <Select
          label="Categoría"
          options={categoryOptions}
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || '')}
          placeholder="Todas las categorías"
        />
      </div>

      <div className="flex-1 min-w-[200px]">
        <Select
          label="Estado"
          options={STATUS_OPTIONS}
          value={selectedStatus || ''}
          onChange={(e) => onStatusChange(e.target.value || '')}
          placeholder="Todos los estados"
        />
      </div>

      <div className="flex-1 min-w-[250px]">
        <Input
          label="Buscar"
          placeholder="Título, contenido, fuente..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="flex-1 min-w-[180px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="flex-1 min-w-[180px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {hasActiveFilters && (
        <div className="flex items-end">
          <Button variant="ghost" size="sm" onClick={onClear} className="h-10">
            Limpiar todo
          </Button>
        </div>
      )}
    </div>
  )
}

export function NormStatusBadge({ status }: { status: string }) {
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    VIGENTE: 'success',
    MODIFICADA: 'warning',
    DEROGADA: 'danger',
    HISTORICA: 'info',
    PENDIENTE_CONFIRMACION: 'warning',
    NO_VERIFICADO: 'default',
  }
  return <Badge variant={variants[status] || 'default'}>{status.replace(/_/g, ' ')}</Badge>
}

export function SourceBadge({ sourceType, sourceNote }: { sourceType: string; sourceNote?: string | null }) {
  const labels: Record<string, string> = {
    carta_interna: 'Carta Interna',
    acta: 'Acta',
    documento_externo: 'Doc. Externo',
    confirmacion_institucional: 'Confirmación Inst.',
  }
  return (
    <Badge variant="outline" className="text-xs">
      {labels[sourceType] || sourceType}
      {sourceNote && <span className="ml-1 text-gray-500">: {sourceNote}</span>}
    </Badge>
  )
}