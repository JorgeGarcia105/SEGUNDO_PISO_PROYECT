import { Card } from '@components/ui'
import { useCleaningZones } from '@hooks/useCleaning'

export function AseosResidentView() {
  const { zones, loading, error } = useCleaningZones()

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
        <p className="text-red-700">Error al cargar aseos: {error}</p>
      </Card>
    )
  }

  const publishedZones = zones.filter((z) => z.status === 'publicado')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Zonas y Tareas de Aseo</h1>
        <p className="text-sm text-gray-500">{publishedZones.length} zonas publicadas</p>
      </div>

      {publishedZones.map((zone) => {
        const publishedTasks = (zone.cleaning_tasks || []).filter((t: any) => t.status === 'publicado')
        return (
          <section key={zone.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">{zone.name}</h2>
              {zone.description && <p className="text-sm text-gray-500">{zone.description}</p>}
            </div>

            {publishedTasks.length === 0 ? (
              <Card className="border-yellow-200 bg-yellow-50">
                <p className="text-yellow-800 py-2">No hay tareas publicadas para esta zona</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {publishedTasks.map((task: any) => (
                  <Card key={task.id} className="border-l-4 border-blue-400">
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-medium text-gray-900">{task.title}</h3>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              Tarea
                            </span>
                            {task.frequency_note && (
                              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                {task.frequency_note}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {task.instructions && (
                        <div className="prose prose-sm max-w-none text-gray-700 mb-3">
                          <p className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-3 rounded">{task.instructions}</p>
                        </div>
                      )}

                      {task.source_document_id && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Fuente:</span> Documento {task.source_document_id.slice(0, 8)}...
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}