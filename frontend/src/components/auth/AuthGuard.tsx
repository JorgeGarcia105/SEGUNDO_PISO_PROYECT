import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { ModuleLoader } from '@components/ui'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <ModuleLoader />
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  return <>{children}</>
}