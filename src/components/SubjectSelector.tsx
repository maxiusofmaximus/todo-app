'use client'

import React, { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Plus, X } from 'lucide-react'

export function SubjectSelector() {
  const { state, dispatch } = useApp()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSubjectName, setNewSubjectName] = useState('')
  const [newSubjectColor, setNewSubjectColor] = useState('#3B82F6')

  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ]

  const handleAddSubject = () => {
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
  }

  const handleSelectSubject = (subjectId: string | null) => {
    dispatch({
      type: 'SET_SELECTED_SUBJECT',
      payload: subjectId
    })
  }

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
          </Button>

          {/* Subject buttons */}
          {state.subjects.map((subject) => (
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
            </Button>
          ))}

          {/* Add subject button */}
          {!showAddForm ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddForm(true)}
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
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
                autoFocus
              />
              <div className="flex space-x-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewSubjectColor(color)}
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
                  setShowAddForm(false)
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