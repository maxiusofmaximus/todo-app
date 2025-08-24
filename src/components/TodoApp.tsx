'use client'

import React, { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TodoList } from '@/components/TodoList'
import { SubjectSelector } from '@/components/SubjectSelector'
import { AddTodoForm } from '@/components/AddTodoForm'
import { ClassNotesSection } from '@/components/ClassNotesSection'
import ThemeToggle from '@/components/ThemeToggle'
import { Plus, BookOpen, CheckSquare, User, LogOut } from 'lucide-react'

export function TodoApp() {
  const { state } = useApp()
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<'todos' | 'notes'>('todos')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  const filteredTodos = state.selectedSubject
    ? state.todos.filter(todo => todo.subjectId === state.selectedSubject)
    : state.todos

  const selectedSubjectName = state.selectedSubject
    ? state.subjects.find(s => s.id === state.selectedSubject)?.name
    : 'Todas las materias'

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="relative mb-8">
          {/* User Info and Theme Toggle */}
          <div className="absolute top-0 right-0 flex items-center space-x-3">
            <ThemeToggle />
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <User size={16} style={{ color: 'var(--text-secondary)' }} />
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
          
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              📚 Learning BOT
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Tu asistente académico con IA - Organiza tus tareas y convierte tus notas en conocimiento
            </p>
          </div>
        </div>

        {/* Subject Selector */}
        <div className="mb-6">
          <SubjectSelector />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 rounded-lg p-1 shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <button
            onClick={() => setActiveTab('todos')}
            className="flex items-center space-x-2 px-4 py-2 rounded-md transition-colors"
            style={{
              backgroundColor: activeTab === 'todos' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'todos' ? 'white' : 'var(--text-secondary)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'todos') {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'todos') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <CheckSquare size={20} />
            <span>Tareas</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className="flex items-center space-x-2 px-4 py-2 rounded-md transition-colors"
            style={{
              backgroundColor: activeTab === 'notes' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'notes' ? 'white' : 'var(--text-secondary)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'notes') {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'notes') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <BookOpen size={20} />
            <span>Notas de Clase</span>
          </button>
        </div>

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
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Nueva Tarea</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <TodoList todos={filteredTodos} />
                </CardContent>
              </Card>
            ) : (
              <ClassNotesSection />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total de tareas</span>
                    <span className="font-semibold">{filteredTodos.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completadas</span>
                    <span className="font-semibold text-green-600">
                      {filteredTodos.filter(t => t.completed).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pendientes</span>
                    <span className="font-semibold text-orange-600">
                      {filteredTodos.filter(t => !t.completed).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Materias</span>
                    <span className="font-semibold">{state.subjects.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                    onClick={() => setActiveTab('todos')}
                  >
                    <CheckSquare size={16} className="mr-2" />
                    Ver todas las tareas
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab('notes')}
                  >
                    <BookOpen size={16} className="mr-2" />
                    Revisar notas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Todo Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <AddTodoForm onClose={() => setShowAddForm(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}