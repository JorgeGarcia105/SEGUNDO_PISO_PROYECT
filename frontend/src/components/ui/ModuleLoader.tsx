export function ModuleLoader() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="flex flex-col items-center gap-4 text-gray-500">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm font-medium">Cargando módulo...</p>
      </div>
    </div>
  )
}