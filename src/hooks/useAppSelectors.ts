import { useApp } from '@/contexts/AppContext'
import { useMemo } from 'react'
import { Todo, ClassNote } from '@/types'
import { useCacheWithTTL } from './usePerformance'

export const useAppSelectors = () => {
  const { 
    state, 
    selectedSubjectTodos, 
    selectedSubjectNotes, 
    selectedSubjectName,
    appStats 
  } = useApp()

  // Cache local para selectores específicos
  const selectorCache = useCacheWithTTL<any>('app-selectors-hook', 1 * 60 * 1000) // 1 minuto

  // Estadísticas de tareas del subject seleccionado
  const todoStats = useMemo(() => {
    const cacheKey = `todo-stats-${selectedSubjectTodos.length}-${selectedSubjectTodos.filter(t => t.completed).length}`
    const cached = selectorCache.get(cacheKey)
    if (cached) return cached

    const total = selectedSubjectTodos.length
    const completed = selectedSubjectTodos.filter(todo => todo.completed).length
    const pending = total - completed
    const overdue = selectedSubjectTodos.filter(todo => {
      if (!todo.dueDate || todo.completed) return false
      return new Date(todo.dueDate) < new Date()
    }).length

    const result = {
      total,
      completed,
      pending,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }

    selectorCache.set(cacheKey, result)
    return result
  }, [selectedSubjectTodos, selectorCache])

  // Tareas por prioridad
  const todosByPriority = useMemo(() => {
    const cacheKey = `todos-priority-${selectedSubjectTodos.length}`
    const cached = selectorCache.get(cacheKey)
    if (cached) return cached

    const high = selectedSubjectTodos.filter(todo => todo.priority === 'high')
    const medium = selectedSubjectTodos.filter(todo => todo.priority === 'medium')
    const low = selectedSubjectTodos.filter(todo => todo.priority === 'low')

    const result = { high, medium, low }
    selectorCache.set(cacheKey, result)
    return result
  }, [selectedSubjectTodos, selectorCache])

  // Próximas tareas (próximos 7 días)
  const upcomingTodos = useMemo(() => {
    const cacheKey = `upcoming-todos-${selectedSubjectTodos.length}-${new Date().toDateString()}`
    const cached = selectorCache.get(cacheKey)
    if (cached) return cached

    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const result = selectedSubjectTodos.filter(todo => {
      if (!todo.dueDate || todo.completed) return false
      const dueDate = new Date(todo.dueDate)
      return dueDate >= now && dueDate <= nextWeek
    }).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())

    selectorCache.set(cacheKey, result)
    return result
  }, [selectedSubjectTodos, selectorCache])

  // Estadísticas de notas
  const notesStats = useMemo(() => {
    const cacheKey = `notes-stats-${selectedSubjectNotes.length}`
    const cached = selectorCache.get(cacheKey)
    if (cached) return cached

    const total = selectedSubjectNotes.length
    const withAI = selectedSubjectNotes.filter(note => note.aiExplanation).length
    const withText = selectedSubjectNotes.filter(note => note.extractedText).length

    const result = {
      total,
      withAI,
      withText,
      aiUsageRate: total > 0 ? Math.round((withAI / total) * 100) : 0
    }

    selectorCache.set(cacheKey, result)
    return result
  }, [selectedSubjectNotes, selectorCache])

  return {
    // Estado base
    state,
    selectedSubjectTodos,
    selectedSubjectNotes,
    selectedSubjectName,
    
    // Estadísticas globales (desde AppContext)
    appStats,
    
    // Estadísticas específicas del subject seleccionado
    todoStats,
    notesStats,
    
    // Agrupaciones
    todosByPriority,
    upcomingTodos
  }
}