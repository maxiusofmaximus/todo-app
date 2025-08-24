'use client'

import React, { memo, useCallback, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Todo } from '@/types'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { formatDate, entityUtils } from '@/lib/utils'
import { Check, Clock, AlertCircle, Trash2 } from 'lucide-react'

interface TodoListProps {
  todos: Todo[]
}

function TodoListComponent({ todos }: TodoListProps) {
  const { dispatch } = useApp()

  // Memoizar estadísticas para evitar recálculos
  const todoStats = useMemo(() => {
    return entityUtils.getTodoStats(todos)
  }, [todos])

  // Memoizar todos ordenados por prioridad y fecha
  const sortedTodos = useMemo(() => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return [...todos].sort((a, b) => {
      // Primero por completado (incompletos primero)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      // Luego por prioridad
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      // Finalmente por fecha de vencimiento
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      return a.dueDate ? -1 : b.dueDate ? 1 : 0
    })
  }, [todos])

  const handleToggleComplete = useCallback((todoId: string, completed: boolean) => {
    dispatch({
      type: 'UPDATE_TODO',
      payload: {
        id: todoId,
        updates: { completed }
      }
    })
  }, [dispatch])

  const handleDeleteTodo = useCallback((todoId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      dispatch({
        type: 'DELETE_TODO',
        payload: todoId
      })
    }
  }, [dispatch])

  const getPriorityIcon = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="text-red-500" size={16} />
      case 'medium':
        return <Clock className="text-yellow-500" size={16} />
      case 'low':
        return <Clock className="text-green-500" size={16} />
    }
  }

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500'
      case 'medium':
        return 'border-l-yellow-500'
      case 'low':
        return 'border-l-green-500'
    }
  }

  const getSubjectInfo = (subjectId?: string) => {
    if (!subjectId) return null
    return state.subjects.find(s => s.id === subjectId)
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay tareas
        </h3>
        <p className="text-gray-500">
          ¡Perfecto! No tienes tareas pendientes en este momento.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Estadísticas rápidas */}
      {todoStats.total > 0 && (
        <Card variant="secondary" size="sm">
          <CardContent size="sm">
            <div className="flex justify-between items-center text-sm">
              <span>Total: {todoStats.total}</span>
              <span>Completadas: {todoStats.completed}</span>
              <span>Pendientes: {todoStats.pending}</span>
              {todoStats.overdue > 0 && (
                <span className="text-red-500 font-medium">Vencidas: {todoStats.overdue}</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Lista de tareas ordenadas */}
      <div className="space-y-3">
        {sortedTodos.map((todo) => {
        const subject = getSubjectInfo(todo.subjectId)
        
        return (
          <Card
            key={todo.id}
            className={`border-l-4 ${getPriorityColor(todo.priority)} ${
              todo.completed ? 'opacity-60 bg-gray-50' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleComplete(todo.id, !todo.completed)}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {todo.completed && <Check size={12} />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3
                      className={`font-medium ${
                        todo.completed
                          ? 'line-through text-gray-500'
                          : 'text-gray-900'
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {getPriorityIcon(todo.priority)}
                  </div>

                  {todo.description && (
                    <p
                      className={`text-sm mb-2 ${
                        todo.completed ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {todo.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {subject && (
                      <div className="flex items-center space-x-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span>{subject.name}</span>
                      </div>
                    )}
                    
                    <span>Creado: {formatDate(new Date(todo.createdAt))}</span>
                    
                    {todo.dueDate && (
                      <span className="text-orange-600">
                        Vence: {formatDate(new Date(todo.dueDate))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        )}
      </div>
    </div>
  )
}

export const TodoList = memo(TodoListComponent)