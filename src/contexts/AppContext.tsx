'use client'

import React, { createContext, useContext, useReducer, ReactNode, useMemo, useCallback } from 'react'
import { AppState, AppAction, Subject, Todo, ClassNote } from '@/types'
import { generateId } from '@/lib/utils'
import { useCacheWithTTL } from '@/hooks/usePerformance'

const initialState: AppState = {
  todos: [],
  subjects: [
    {
      id: 'math',
      name: 'Matemáticas',
      color: '#3B82F6',
      createdAt: new Date()
    },
    {
      id: 'physics',
      name: 'Física',
      color: '#10B981',
      createdAt: new Date()
    },
    {
      id: 'chemistry',
      name: 'Química',
      color: '#F59E0B',
      createdAt: new Date()
    }
  ],
  classNotes: [],
  selectedSubject: null
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            ...action.payload,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.updates, updatedAt: new Date() }
            : todo
        )
      }
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      }
    case 'ADD_SUBJECT':
      return {
        ...state,
        subjects: [
          ...state.subjects,
          {
            ...action.payload,
            id: generateId(),
            createdAt: new Date()
          }
        ]
      }
    case 'UPDATE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.map(subject =>
          subject.id === action.payload.id
            ? { ...subject, ...action.payload.updates }
            : subject
        )
      }
    case 'DELETE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.filter(subject => subject.id !== action.payload),
        todos: state.todos.filter(todo => todo.subjectId !== action.payload),
        classNotes: state.classNotes.filter(note => note.subjectId !== action.payload)
      }
    case 'ADD_CLASS_NOTE':
      return {
        ...state,
        classNotes: [
          ...state.classNotes,
          {
            ...action.payload,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
    case 'UPDATE_CLASS_NOTE':
      return {
        ...state,
        classNotes: state.classNotes.map(note =>
          note.id === action.payload.id
            ? { ...note, ...action.payload.updates, updatedAt: new Date() }
            : note
        )
      }
    case 'DELETE_CLASS_NOTE':
      return {
        ...state,
        classNotes: state.classNotes.filter(note => note.id !== action.payload)
      }
    case 'SET_SELECTED_SUBJECT':
      return {
        ...state,
        selectedSubject: action.payload
      }
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  // Selectores memoizados
  selectedSubjectTodos: Todo[]
  selectedSubjectNotes: ClassNote[]
  selectedSubjectName: string
  // Acciones optimizadas
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => void
  updateSubject: (id: string, updates: Partial<Subject>) => void
  deleteSubject: (id: string) => void
  addClassNote: (note: Omit<ClassNote, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateClassNote: (id: string, updates: Partial<ClassNote>) => void
  deleteClassNote: (id: string) => void
  setSelectedSubject: (subjectId: string | null) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Cache para selectores costosos
  const selectorCache = useCacheWithTTL<any>('app-selectors', 2 * 60 * 1000) // 2 minutos

  // Selectores memoizados con cache
  const selectedSubjectTodos = useMemo(() => {
    const cacheKey = `todos-${state.selectedSubject}-${state.todos.length}`
    const cached = selectorCache.get(cacheKey)
    if (cached) return cached

    const result = state.selectedSubject
      ? state.todos.filter(todo => todo.subjectId === state.selectedSubject)
      : state.todos
    
    selectorCache.set(cacheKey, result)
    return result
  }, [state.todos, state.selectedSubject, selectorCache])

  const selectedSubjectNotes = useMemo(() => {
    const cacheKey = `notes-${state.selectedSubject}-${state.classNotes.length}`
    const cached = selectorCache.get(cacheKey)
    if (cached) return cached

    const result = state.selectedSubject
      ? state.classNotes.filter(note => note.subjectId === state.selectedSubject)
      : state.classNotes
    
    selectorCache.set(cacheKey, result)
    return result
  }, [state.classNotes, state.selectedSubject, selectorCache])

  const selectedSubjectName = useMemo(() => {
    const cacheKey = `subject-name-${state.selectedSubject}`
    const cached = selectorCache.get(cacheKey)
    if (cached) return cached

    const result = state.selectedSubject
      ? state.subjects.find(s => s.id === state.selectedSubject)?.name || 'Materia desconocida'
      : 'Todas las materias'
    
    selectorCache.set(cacheKey, result)
    return result
  }, [state.subjects, state.selectedSubject, selectorCache])

  // Estadísticas memoizadas
  const appStats = useMemo(() => {
    const cacheKey = `stats-${state.todos.length}-${state.classNotes.length}-${state.subjects.length}`
    const cached = selectorCache.get(cacheKey)
    if (cached) return cached

    const totalTodos = state.todos.length
    const completedTodos = state.todos.filter(t => t.completed).length
    const pendingTodos = totalTodos - completedTodos
    const overdueTodos = state.todos.filter(t => {
      if (!t.dueDate || t.completed) return false
      return new Date(t.dueDate) < new Date()
    }).length

    const result = {
      totalTodos,
      completedTodos,
      pendingTodos,
      overdueTodos,
      totalNotes: state.classNotes.length,
      totalSubjects: state.subjects.length,
      completionRate: totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0
    }

    selectorCache.set(cacheKey, result)
    return result
  }, [state.todos, state.classNotes, state.subjects, selectorCache])

  // Acciones optimizadas con useCallback
  const addTodo = useCallback((todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_TODO', payload: todo })
  }, [dispatch])

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    dispatch({ type: 'UPDATE_TODO', payload: { id, updates } })
  }, [dispatch])

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: id })
  }, [dispatch])

  const addSubject = useCallback((subject: Omit<Subject, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_SUBJECT', payload: subject })
  }, [dispatch])

  const updateSubject = useCallback((id: string, updates: Partial<Subject>) => {
    dispatch({ type: 'UPDATE_SUBJECT', payload: { id, updates } })
  }, [dispatch])

  const deleteSubject = useCallback((id: string) => {
    dispatch({ type: 'DELETE_SUBJECT', payload: id })
  }, [dispatch])

  const addClassNote = useCallback((note: Omit<ClassNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_CLASS_NOTE', payload: note })
  }, [dispatch])

  const updateClassNote = useCallback((id: string, updates: Partial<ClassNote>) => {
    dispatch({ type: 'UPDATE_CLASS_NOTE', payload: { id, updates } })
  }, [dispatch])

  const deleteClassNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CLASS_NOTE', payload: id })
  }, [dispatch])

  const setSelectedSubject = useCallback((subjectId: string | null) => {
    dispatch({ type: 'SET_SELECTED_SUBJECT', payload: subjectId })
  }, [dispatch])

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    selectedSubjectTodos,
    selectedSubjectNotes,
    selectedSubjectName,
    appStats,
    addTodo,
    updateTodo,
    deleteTodo,
    addSubject,
    updateSubject,
    deleteSubject,
    addClassNote,
    updateClassNote,
    deleteClassNote,
    setSelectedSubject
  }), [
    state,
    dispatch,
    selectedSubjectTodos,
    selectedSubjectNotes,
    selectedSubjectName,
    appStats,
    addTodo,
    updateTodo,
    deleteTodo,
    addSubject,
    updateSubject,
    deleteSubject,
    addClassNote,
    updateClassNote,
    deleteClassNote,
    setSelectedSubject
  ])

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}