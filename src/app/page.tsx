'use client'

import { AppProvider } from '@/contexts/AppContext'
import { AuthProvider, useAuth } from '../../hooks/useAuth'
import { TodoApp } from '@/components/TodoApp'
import { AuthComponent } from '@/components/AuthComponent'
import ThemeToggle from '@/components/ThemeToggle'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Learning BOT</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Tu asistente académico con IA</p>
            </div>
            <AuthComponent />
          </div>
        </div>
      </div>
    )
  }

  return <TodoApp />
}

export default function Home() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  )
}
