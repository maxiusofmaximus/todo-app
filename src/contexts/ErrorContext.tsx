'use client'

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react'
import { AppError } from '@/types'

interface ErrorState {
  errors: AppError[]
  isLoading: boolean
}

type ErrorAction =
  | { type: 'ADD_ERROR'; payload: AppError }
  | { type: 'REMOVE_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_LOADING'; payload: boolean }

const initialState: ErrorState = {
  errors: [],
  isLoading: false
}

function errorReducer(state: ErrorState, action: ErrorAction): ErrorState {
  switch (action.type) {
    case 'ADD_ERROR':
      return {
        ...state,
        errors: [...state.errors, action.payload]
      }
    case 'REMOVE_ERROR':
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload)
      }
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: []
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    default:
      return state
  }
}

interface ErrorContextType {
  state: ErrorState
  addError: (error: Omit<AppError, 'id' | 'timestamp'>) => void
  removeError: (id: string) => void
  clearErrors: () => void
  setLoading: (loading: boolean) => void
  // Helpers para tipos específicos de errores
  addValidationError: (message: string, field?: string) => void
  addNetworkError: (message: string, details?: any) => void
  addGenericError: (message: string, details?: any) => void
}

const ErrorContext = createContext<ErrorContextType | null>(null)

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(errorReducer, initialState)

  const addError = useCallback((error: Omit<AppError, 'id' | 'timestamp'>) => {
    const newError: AppError = {
      ...error,
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }
    dispatch({ type: 'ADD_ERROR', payload: newError })

    // Auto-remove error after 5 seconds for non-critical errors
    if (error.severity !== 'critical') {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_ERROR', payload: newError.id })
      }, 5000)
    }
  }, [])

  const removeError = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ERROR', payload: id })
  }, [])

  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])

  // Helper functions for specific error types
  const addValidationError = useCallback((message: string, field?: string) => {
    addError({
      type: 'validation',
      message,
      severity: 'warning',
      details: field ? { field } : undefined
    })
  }, [addError])

  const addNetworkError = useCallback((message: string, details?: any) => {
    addError({
      type: 'network',
      message,
      severity: 'error',
      details
    })
  }, [addError])

  const addGenericError = useCallback((message: string, details?: any) => {
    addError({
      type: 'generic',
      message,
      severity: 'error',
      details
    })
  }, [addError])

  return (
    <ErrorContext.Provider value={{
      state,
      addError,
      removeError,
      clearErrors,
      setLoading,
      addValidationError,
      addNetworkError,
      addGenericError
    }}>
      {children}
    </ErrorContext.Provider>
  )
}

export function useError() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}

// Hook para manejo de errores async
export function useAsyncError() {
  const { addError, setLoading } = useError()

  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    errorMessage = 'Ha ocurrido un error inesperado'
  ): Promise<T | null> => {
    try {
      setLoading(true)
      const result = await asyncFn()
      return result
    } catch (error) {
      console.error('Async error:', error)
      
      if (error instanceof Error) {
        addError({
          type: 'generic',
          message: error.message || errorMessage,
          severity: 'error',
          details: { originalError: error }
        })
      } else {
        addError({
          type: 'generic',
          message: errorMessage,
          severity: 'error',
          details: { originalError: error }
        })
      }
      return null
    } finally {
      setLoading(false)
    }
  }, [addError, setLoading])

  return { executeAsync }
}