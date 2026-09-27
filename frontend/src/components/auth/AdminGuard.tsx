import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { ModuleLoader } from '@components/ui'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, profile, loading, isLocalMode } = useAuth()
  const location = useLocation()

  const isAdmin = profile?.profile_roles?.some(
    (r) => r.role === 'administrador' || r.role === 'superadministrador'
  )

  // En modo local, el mock profile ya tiene los roles correctos
  const hasAccess = isLocalMode ? isAdmin : (user && isAdmin)

  if (loading) {
    return <ModuleLoader />
  }

  if (!user && !isLocalMode) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  if (!hasAccess) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}