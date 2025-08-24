'use client'

import React, { lazy, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Loader } from 'lucide-react'

// Lazy loading para componentes pesados
const ClassNotesSection = lazy(() => import('./ClassNotesSection').then(module => ({ default: module.ClassNotesSection })))
const AddTodoForm = lazy(() => import('./AddTodoForm').then(module => ({ default: module.AddTodoForm })))

// Componente de loading reutilizable
function ComponentLoader({ message = 'Cargando...' }: { message?: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-3">
          <Loader className="animate-spin h-5 w-5 text-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">{message}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Wrapper para ClassNotesSection con lazy loading
export function LazyClassNotesSection(props: any) {
  return (
    <Suspense fallback={<ComponentLoader message="Cargando notas de clase..." />}>
      <ClassNotesSection {...props} />
    </Suspense>
  )
}

// Wrapper para AddTodoForm con lazy loading
export function LazyAddTodoForm(props: any) {
  return (
    <Suspense fallback={<ComponentLoader message="Cargando formulario..." />}>
      <AddTodoForm {...props} />
    </Suspense>
  )
}

// Hook para lazy loading condicional
export function useLazyComponent<T>(condition: boolean, importFn: () => Promise<{ default: T }>) {
  const [Component, setComponent] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (condition && !Component && !loading) {
      setLoading(true)
      setError(null)
      
      importFn()
        .then(module => {
          setComponent(module.default)
        })
        .catch(err => {
          setError(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [condition, Component, loading, importFn])

  return { Component, loading, error }
}

// Componente para lazy loading de imágenes
export function LazyImage({ 
  src, 
  alt, 
  className, 
  fallback,
  ...props 
}: {
  src: string
  alt: string
  className?: string
  fallback?: React.ReactNode
  [key: string]: any
}) {
  const [loaded, setLoaded] = React.useState(false)
  const [error, setError] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const image = new Image()
          image.onload = () => setLoaded(true)
          image.onerror = () => setError(true)
          image.src = src
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(img)
    return () => observer.disconnect()
  }, [src])

  if (error) {
    return fallback || (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Error al cargar imagen</span>
      </div>
    )
  }

  return (
    <div ref={imgRef} className={className}>
      {loaded ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" {...props} />
      ) : (
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center h-full">
          <Loader className="animate-spin h-6 w-6 text-gray-400" />
        </div>
      )}
    </div>
  )
}

export default {
  LazyClassNotesSection,
  LazyAddTodoForm,
  LazyImage,
  ComponentLoader,
  useLazyComponent
}