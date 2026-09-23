import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
          <p className="font-medium">Error al cargar el módulo</p>
          <p className="text-sm mt-1">Algo salió mal. Por favor, recarga la página.</p>
          <details className="mt-2 text-xs text-red-600">
            <summary>Detalles técnicos</summary>
            <pre className="mt-1 overflow-auto max-h-40">{this.state.error?.stack}</pre>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}