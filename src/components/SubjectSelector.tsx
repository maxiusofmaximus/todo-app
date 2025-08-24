'use client'

import React, { useState, useCallback, memo, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Plus, X } from 'lucide-react'

function SubjectSelectorComponent() {
  const { state, dispatch } = useApp()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSubjectName, setNewSubjectName] = useState('')
  const [newSubjectColor, setNewSubjectColor] = useState('#3B82F6')

  const colors = useMemo(() => [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ], [])

  // Memoizar materias con estadísticas
  const subjectsWithStats = useMemo(() => {
    return state.subjects.map(subject => {
      const subjectTodos = state.todos.filter(todo => todo.subjectId === subject.id)
      const completed = subjectTodos.filter(todo => todo.completed).length
      const total = subjectTodos.length
      return {
        ...subject,
        todoCount: total,
        completedCount: completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      }
    })
  }, [state.subjects, state.todos])

  const handleAddSubject = useCallback(() => {
    if (newSubjectName.trim()) {
      dispatch({
        type: 'ADD_SUBJECT',
        payload: {
          name: newSubjectName.trim(),
          color: newSubjectColor
        }
      })
      setNewSubjectName('')
      setNewSubjectColor('#3B82F6')
      setShowAddForm(false)
    }
  }, [newSubjectName, newSubjectColor, dispatch])

  const handleSelectSubject = useCallback((subjectId: string | null) => {
    dispatch({
      type: 'SET_SELECTED_SUBJECT',
      payload: subjectId
    })
  }, [dispatch])

  const handleToggleAddForm = useCallback(() => {
    setShowAddForm(prev => !prev)
  }, [])

  const handleColorChange = useCallback((color: string) => {
    setNewSubjectColor(color)
  }, [])

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSubjectName(e.target.value)
  }, [])

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 items-center">
          {/* All subjects button */}
          <Button
            variant={state.selectedSubject === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSelectSubject(null)}
            className="flex items-center space-x-2"
          >
            <span>📚</span>
            <span>Todas las materias</span>
            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
              {state.todos.length}
            </span>
          </Button>

          {/* Subject buttons with statistics */}
          {subjectsWithStats.map((subject) => (
            <Button
              key={subject.id}
              variant={state.selectedSubject === subject.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSelectSubject(subject.id)}
              className="flex items-center space-x-2"
              style={{
                backgroundColor: state.selectedSubject === subject.id ? subject.color : undefined,
                borderColor: subject.color
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: subject.color }}
              />
              <span>{subject.name}</span>
              {subject.todoCount > 0 && (
                <span className="ml-2 text-xs px-2 py-1 rounded-full" style={{
                  backgroundColor: state.selectedSubject === subject.id ? 'rgba(255,255,255,0.2)' : subject.color + '20',
                  color: state.selectedSubject === subject.id ? 'white' : subject.color
                }}>
                  {subject.completedCount}/{subject.todoCount}
                </span>
              )}
            </Button>
          ))}

          {/* Add subject button */}
          {!showAddForm ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleAddForm}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
            >
              <Plus size={16} />
              <span>Agregar materia</span>
            </Button>
          ) : (
            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
              <input
                type="text"
                placeholder="Nombre de la materia"
                value={newSubjectName}
                onChange={handleNameChange}
                className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
                autoFocus
              />
              <div className="flex space-x-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      newSubjectColor === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <Button
                size="sm"
                onClick={handleAddSubject}
                disabled={!newSubjectName.trim()}
              >
                ✓
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleToggleAddForm()
                  setNewSubjectName('')
                  setNewSubjectColor('#3B82F6')
                }}
              >
                <X size={16} />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export const SubjectSelector = memo(SubjectSelectorComponent)