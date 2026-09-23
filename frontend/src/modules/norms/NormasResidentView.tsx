import { useMemo } from 'react'
import { Card, Button } from '@components/ui'
import { useNorms, useNormCategories } from '@hooks/useNorms'

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  VIGENTE: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  MODIFICADA: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  DEROGADA: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
  HISTORICA: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  PENDIENTE_CONFIRMACION: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  NO_VERIFICADO: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
}

const statusLabels: Record<string, string> = {
  VIGENTE: 'Vigente',
  MODIFICADA: 'Modificada',
  DEROGADA: 'Derogada',
  HISTORICA: 'Histórica',
  PENDIENTE_CONFIRMACION: 'Pendiente confirmación',
  NO_VERIFICADO: 'No verificado',
}

function getStatusColor(status: string) {
  return statusColors[status] || statusColors.NO_VERIFICADO
}

function getStatusLabel(status: string) {
  return statusLabels[status] || status
}

export function NormasResidentView() {
  const { norms, loading, error } = useNorms()
  const { categories } = useNormCategories()

  const normsByCategory = useMemo(() => {
    const grouped: Record<string, typeof norms> = {}
    norms.forEach((norm) => {
      const catId = norm.category_id || 'sin-categoria'
      if (!grouped[catId]) grouped[catId] = []
      grouped[catId].push(norm)
    })
    return grouped
  }, [norms])

  const categoryOrder = categories.map((c) => c.id)

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <p className="text-red-700">Error al cargar normas: {error}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Normas del Segundo Piso</h1>
        <p className="text-sm text-gray-500">{norms.length} normas registradas</p>
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">
            Todas las normas tienen como fuente principal la <strong>Carta Interna 2do Piso RGSB</strong> 
            y las <strong>Actas de Asamblea del Segundo Piso</strong>.
          </p>
          <Button variant="outline" size="sm" onClick={() => window.open('/documentos', '_blank')}>
            Ver documentos fuente (PDF)
          </Button>
        </div>
      </Card>

      {categoryOrder.map((catId) => {
        const catNorms = normsByCategory[catId]
        if (!catNorms || catNorms.length === 0) return null
        const category = categories.find((c) => c.id === catId)
        return (
          <section key={catId} className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">{category?.name || 'Sin categoría'}</h2>
              {category?.description && <p className="text-sm text-gray-500">{category.description}</p>}
            </div>
            <div className="space-y-2">
              {catNorms.map((norm) => {
                const currentVersion = norm.norm_versions?.[0]
                const status = currentVersion?.status || 'NO_VERIFICADO'
                const color = getStatusColor(status)
                return (
                  <Card key={norm.id} className={`border-l-4 ${color.border} hover:shadow-md transition-shadow`}>
                    <div className="p-4">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-medium text-gray-900">{norm.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color.bg} ${color.text} ${color.border}`}>
                          {getStatusLabel(status)}
                        </span>
                        {currentVersion?.valid_from && (
                          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            Desde {currentVersion.valid_from}
                            {currentVersion.valid_until && ` - ${currentVersion.valid_until}`}
                          </span>
                        )}
                      </div>
                      <div className="prose prose-sm max-w-none text-gray-700">
                        <p className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-3 rounded">{currentVersion?.text_content || 'Sin contenido'}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}