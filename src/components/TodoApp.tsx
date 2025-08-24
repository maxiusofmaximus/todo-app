'use client'

import React, { useState, useCallback, useMemo, memo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle, Button, Modal } from '@/components/ui'
import { TodoList } from '@/components/TodoList'
import { SubjectSelector } from '@/components/SubjectSelector'
import { LazyAddTodoForm, LazyClassNotesSection } from '@/components/LazyComponents'
import PerformanceStats from '@/components/PerformanceStats'
import ThemeToggle from '@/components/ThemeToggle'
import { Plus, BookOpen, CheckSquare, User, LogOut } from 'lucide-react'

function TodoAppComponent() {
  const { state } = useApp()
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<'todos' | 'notes'>('todos')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleSignOut = useCallback(async () => {
    await signOut()
  }, [signOut])

  const handleTabChange = useCallback((tab: 'todos' | 'notes') => {
    setActiveTab(tab)
  }, [])

  const handleToggleAddForm = useCallback(() => {
    setShowAddForm(prev => !prev)
  }, [])

  const filteredTodos = useMemo(() => {
    return state.selectedSubject
      ? state.todos.filter(todo => todo.subjectId === state.selectedSubject)
      : state.todos
  }, [state.selectedSubject, state.todos])

  const selectedSubjectName = useMemo(() => {
    return state.selectedSubject
      ? state.subjects.find(s => s.id === state.selectedSubject)?.name
      : 'Todas las materias'
  }, [state.selectedSubject, state.subjects])

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="relative mb-8">
          {/* User Info and Theme Toggle */}
          <div className="absolute top-0 right-0 flex items-center space-x-3">
            <ThemeToggle />
            <Card variant="secondary" size="sm">
              <CardContent size="sm">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm">{user?.email}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    className="text-gray-500 hover:text-red-500"
                    title="Cerrar sesión"
                  >
                    <LogOut size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              📚 Learning BOT
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tu asistente académico con IA - Organiza tus tareas y convierte tus notas en conocimiento
            </p>
          </div>
        </div>

        {/* Subject Selector */}
        <div className="mb-6">
          <SubjectSelector />
        </div>

        {/* Tab Navigation */}
        <Card variant="secondary" size="sm" className="mb-6">
          <CardContent size="sm">
            <div className="flex space-x-1">
              <Button
                variant={activeTab === 'todos' ? 'default' : 'ghost'}
                onClick={() => handleTabChange('todos')}
                leftIcon={<CheckSquare size={20} />}
                className="flex-1"
              >
                Tareas
              </Button>
              <Button
                variant={activeTab === 'notes' ? 'default' : 'ghost'}
                onClick={() => handleTabChange('notes')}
                leftIcon={<BookOpen size={20} />}
                className="flex-1"
              >
                Notas de Clase
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'todos' ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <CheckSquare className="text-blue-500" size={24} />
                      <span>Tareas - {selectedSubjectName}</span>
                    </CardTitle>
                    <Button
                      onClick={handleToggleAddForm}
                      leftIcon={<Plus size={16} />}
                    >
                      Nueva Tarea
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <TodoList todos={filteredTodos} />
                </CardContent>
              </Card>
            ) : (
              <LazyClassNotesSection />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Estadísticas de Rendimiento */}
            <PerformanceStats />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleTabChange('todos')}
                    leftIcon={<CheckSquare size={16} />}
                  >
                    Ver todas las tareas
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleTabChange('notes')}
                    leftIcon={<BookOpen size={16} />}
                  >
                    Revisar notas
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleToggleAddForm}
                    leftIcon={<Plus size={16} />}
                  >
                    Nueva Tarea
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Todo Modal */}
        {showAddForm && (
          <Modal isOpen={true} onClose={handleToggleAddForm} title="Nueva Tarea">
            <LazyAddTodoForm onClose={handleToggleAddForm} />
          </Modal>
        )}
      </div>
    </div>
  )
}

export const TodoApp = memo(TodoAppComponent)