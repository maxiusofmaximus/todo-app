'use client'

import React from 'react'
import { useError } from '@/contexts/ErrorContext'
import { Card, CardHeader, CardTitle, CardContent, Button, IconButton } from '@/components/ui'
import { AppError } from '@/types'

interface ErrorDisplayProps {
  className?: string
}

function ErrorIcon({ severity }: { severity: AppError['severity'] }) {
  const iconClass = "w-5 h-5 flex-shrink-0"
  
  switch (severity) {
    case 'critical':
      return (
        <svg className={`${iconClass} text-red-600`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    case 'error':
      return (
        <svg className={`${iconClass} text-red-500`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    case 'warning':
      return (
        <svg className={`${iconClass} text-yellow-500`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    case 'info':
      return (
        <svg className={`${iconClass} text-blue-500`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    default:
      return null
  }
}

function ErrorItem({ error }: { error: AppError }) {
  const { removeError } = useError()
  
  const getErrorStyles = (severity: AppError['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  return (
    <div className={`p-4 rounded-lg border ${getErrorStyles(error.severity)} mb-3 last:mb-0`}>
      <div className="flex items-start">
        <ErrorIcon severity={error.severity} />
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">
            {error.message}
          </p>
          {error.details && (
            <div className="mt-2 text-xs opacity-75">
              <details>
                <summary className="cursor-pointer hover:opacity-100">
                  Ver detalles
                </summary>
                <pre className="mt-2 p-2 bg-black bg-opacity-10 rounded text-xs overflow-auto">
                  {JSON.stringify(error.details, null, 2)}
                </pre>
              </details>
            </div>
          )}
          <div className="mt-2 text-xs opacity-60">
            {error.timestamp.toLocaleTimeString()}
          </div>
        </div>
        <IconButton
          variant="ghost"
          size="sm"
          onClick={() => removeError(error.id)}
          aria-label="Cerrar error"
          icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>
    </div>
  )
}

export default function ErrorDisplay({ className = '' }: ErrorDisplayProps) {
  const { state, clearErrors } = useError()
  
  if (state.errors.length === 0) {
    return null
  }

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full ${className}`}>
      <Card variant="default" shadow="lg">
        <CardHeader size="sm" border="bottom">
          <div className="flex items-center justify-between">
            <CardTitle size="sm">
              {state.errors.length === 1 ? 'Error' : `${state.errors.length} Errores`}
            </CardTitle>
            {state.errors.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearErrors}
              >
                Limpiar todos
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent size="sm">
          <div className="max-h-96 overflow-y-auto space-y-2">
            {state.errors.map(error => (
              <ErrorItem key={error.id} error={error} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para mostrar loading global
export function LoadingOverlay() {
  const { state } = useError()
  
  if (!state.isLoading) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="text-gray-700">Cargando...</span>
      </div>
    </div>
  )
}