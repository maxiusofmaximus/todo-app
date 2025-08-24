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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="relative mb-8">
          {/* User Info */}
          <div className="absolute top-0 right-0 flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
              <User size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-red-500 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
          
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📚 Learning BOT
            </h1>
            <p className="text-gray-600">
              Tu asistente académico con IA - Organiza tus tareas y convierte tus notas en conocimiento
            </p>
          </div>
        </div>

        {/* Subject Selector */}
        <div className="mb-6">
          <SubjectSelector />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('todos')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'todos'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CheckSquare size={20} />
            <span>Tareas</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'notes'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
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