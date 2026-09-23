import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { Sidebar } from '@components/layout/Sidebar'

type AdminNavItem = {
  key: string
  label: string
  short: string
  path: string
}

const adminNavigation: AdminNavItem[] = [
  { key: 'incumplimientos', label: 'Incumplimientos', short: 'IN', path: '/admin/incumplimientos' },
  { key: 'medidas', label: 'Medidas Correctivas', short: 'MC', path: '/admin/medidas' },
  { key: 'normas', label: 'Normas', short: 'NO', path: '/admin/normas' },
  { key: 'aseos', label: 'Aseos', short: 'AS', path: '/admin/aseos' },
  { key: 'actas', label: 'Actas', short: 'AC', path: '/admin/actas' },
  { key: 'avisos', label: 'Avisos', short: 'AV', path: '/admin/avisos' },
  { key: 'documentos', label: 'Documentos', short: 'DO', path: '/admin/documentos' },
  { key: 'personas', label: 'Personas y Cargos', short: 'PC', path: '/admin/personas' },
  { key: 'auditoria', label: 'Auditoría', short: 'AU', path: '/admin/auditoria' },
]

export function AdminLayout() {
  const { profile, isLocalMode } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isAdmin = profile?.profile_roles?.some((r) => r.role === 'administrador' || r.role === 'superadministrador')

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso restringido</h1>
          <p className="text-gray-600">Esta sección requiere permisos de administrador.</p>
        </div>
      </div>
    )
  }

  const currentPath = location.pathname

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        items={adminNavigation.map((item) => ({
          key: item.key,
          label: item.label,
          short: item.short,
          onClick: () => {},
          active: currentPath.startsWith(item.path),
        }))}
        activeKey={adminNavigation.find((item) => currentPath.startsWith(item.path))?.key || 'incumplimientos'}
        brand={{
          mark: <span className="text-lg font-bold">02</span>,
          name: 'Admin SegundoPiso',
          caption: 'Panel de administración',
        }}
        footer={
          <div className="space-y-2 text-xs text-gray-500">
            <p>{isLocalMode ? 'Modo Local (Offline)' : 'Supabase conectado'}</p>
            <p>Base documental: Carta Interna y Actas del Segundo Piso.</p>
          </div>
        }
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex-1 lg:flex-none">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {adminNavigation.find((item) => currentPath.startsWith(item.path))?.label || 'Administración'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-gray-500">
                {isLocalMode ? '🏠 Local' : '☁️ Nube'}
              </span>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}