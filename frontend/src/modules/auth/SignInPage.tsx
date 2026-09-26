import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, Button, Input, FormField, toast } from '@components/ui'
import { useAuth } from '@hooks/useAuth'

export function SignInPage() {
  const navigate = useNavigate()
  const { signIn, error: authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await signIn(email, password)
      if (!error) {
        toast.success('Bienvenido')
        navigate('/')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">SegundoPiso</h1>
          <p className="text-gray-500 mt-1">Acceso para administradores</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
              {authError}
            </div>
          )}

          <FormField label="Correo electrónico" error={''} required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@segundopiso.local"
              autoComplete="email"
              disabled={isLoading}
            />
          </FormField>

          <FormField label="Contraseña" error={''} required>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
            />
          </FormField>

          <Button type="submit" className="w-full" loading={isLoading}>
            Iniciar sesión
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            ¿No tienes cuenta? El acceso es solo por invitación.
          </p>
          <Link to="/" className="text-sm text-primary hover:underline mt-2 block">
            Volver al inicio
          </Link>
        </div>
      </Card>
    </div>
  )
}