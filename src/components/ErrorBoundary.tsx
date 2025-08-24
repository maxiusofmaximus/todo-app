'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react'
import { AppError } from '@/types'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log error to external service (if configured)
    this.logErrorToService(error, errorInfo)
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // Here you could send the error to an external logging service
    // like Sentry, LogRocket, etc.
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    // For now, just log to console
    console.error('Error logged:', errorData)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-red-500 mb-4">
                <AlertTriangle size={48} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                ¡Oops! Algo salió mal
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Ha ocurrido un error inesperado en la aplicación.
              </p>
            </div>
            
            <Card variant="error">
              <CardHeader>
                <CardTitle>Detalles del error</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card variant="error" size="sm">
                    <CardContent size="sm">
                      <p className="text-sm font-mono">
                        {this.state.error?.message || 'Error desconocido'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-medium hover:text-gray-900 dark:hover:text-gray-100">
                        Stack trace (desarrollo)
                      </summary>
                      <Card variant="secondary" size="sm" className="mt-2">
                        <CardContent size="sm">
                          <pre className="text-xs overflow-auto max-h-40">
                            {this.state.error.stack}
                          </pre>
                        </CardContent>
                      </Card>
                    </details>
                  )}
                  
                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={this.handleRetry}
                      className="flex-1"
                      leftIcon={<RefreshCw size={16} />}
                    >
                      Intentar de nuevo
                    </Button>
                    <Button
                      onClick={this.handleReload}
                      variant="secondary"
                      className="flex-1"
                      leftIcon={<RotateCcw size={16} />}
                    >
                      Recargar página
                    </Button>
                  </div>
                  
                  <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Si el problema persiste, por favor contacta al soporte técnico.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

// Hook para usar ErrorBoundary con contexto de errores
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorFallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={errorFallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// HOC para componentes que necesitan manejo de errores
export function withErrorHandling<P extends object>(
  Component: React.ComponentType<P>
) {
  return withErrorBoundary(Component)
}