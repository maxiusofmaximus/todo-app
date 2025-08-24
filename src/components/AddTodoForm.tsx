'use client'

import React, { useState, useCallback, memo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { X } from 'lucide-react'
import { useDebounce, useMemoizedCallback } from '@/hooks/usePerformance'

interface AddTodoFormProps {
  onClose: () => void
}

export const AddTodoForm = memo(function AddTodoForm({ onClose }: AddTodoFormProps) {
  const { state, dispatch } = useApp()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    subjectId: state.selectedSubject || '',
    dueDate: ''
  })

  // Debounce para validación en tiempo real
  const debouncedTitle = useDebounce(formData.title, 300)
  const debouncedDescription = useDebounce(formData.description, 500)

  // Validación memoizada
  const isFormValid = useMemoizedCallback(() => {
    return debouncedTitle.trim().length > 0
  }, [debouncedTitle])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid()) return

    dispatch({
      type: 'ADD_TODO',
      payload: {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority,
        subjectId: formData.subjectId || undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        completed: false
      }
    })

    onClose()
  }, [formData, dispatch, onClose, isFormValid])

  const handleChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Nueva Tarea</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X size={20} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isFormValid() && debouncedTitle ? 'border-red-500' : ''}`}
              placeholder="Ej: Estudiar para el examen de matemáticas"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detalles adicionales sobre la tarea..."
              rows={3}
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Materia
            </label>
            <select
              value={formData.subjectId}
              onChange={(e) => handleChange('subjectId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin materia específica</option>
              {state.subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">🟢 Baja</option>
              <option value="medium">🟡 Media</option>
              <option value="high">🔴 Alta</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha límite
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1" disabled={!isFormValid()}>
              Crear Tarea
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
})