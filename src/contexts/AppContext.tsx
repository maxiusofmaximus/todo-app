'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Todo, Subject, ClassNote } from '@/types'
import { generateId } from '@/lib/utils'

interface AppState {
  todos: Todo[]
  subjects: Subject[]
  classNotes: ClassNote[]
  selectedSubject: string | null
}

type AppAction =
  | { type: 'ADD_TODO'; payload: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_TODO'; payload: { id: string; updates: Partial<Todo> } }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'ADD_SUBJECT'; payload: Omit<Subject, 'id' | 'createdAt'> }
  | { type: 'UPDATE_SUBJECT'; payload: { id: string; updates: Partial<Subject> } }
  | { type: 'DELETE_SUBJECT'; payload: string }
  | { type: 'ADD_CLASS_NOTE'; payload: Omit<ClassNote, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_CLASS_NOTE'; payload: { id: string; updates: Partial<ClassNote> } }
  | { type: 'DELETE_CLASS_NOTE'; payload: string }
  | { type: 'SET_SELECTED_SUBJECT'; payload: string | null }

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

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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