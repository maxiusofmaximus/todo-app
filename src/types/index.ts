// Base types
export type Priority = 'low' | 'medium' | 'high'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type TabType = 'todos' | 'notes'

// Subject related types
export interface Subject {
  id: string
  name: string
  color: string
  createdAt: Date
}

export interface CreateSubjectPayload {
  name: string
  color: string
}

// Todo related types
export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  subjectId?: string
  priority: Priority
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateTodoPayload {
  title: string
  description?: string
  subjectId?: string
  priority: Priority
  dueDate?: Date
}

export interface UpdateTodoPayload {
  title?: string
  description?: string
  completed?: boolean
  subjectId?: string
  priority?: Priority
  dueDate?: Date
}

// ClassNote related types
export interface ClassNote {
  id: string
  title: string
  content: string
  subjectId: string
  imageUrl?: string
  extractedText?: string
  aiExplanation?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateClassNotePayload {
  title: string
  content: string
  subjectId: string
  imageUrl?: string
}

export interface UpdateClassNotePayload {
  title?: string
  content?: string
  subjectId?: string
  imageUrl?: string
  extractedText?: string
  aiExplanation?: string
}

// OCR and AI related types
export interface OCRResult {
  text: string
  confidence: number
}

export interface AIExplanation {
  explanation: string
  concepts: string[]
  difficulty: Difficulty
}

export interface AIExplanationCache {
  user_id: string
  text_hash: string
  original_text: string
  explanation: string
  created_at: string
}

// App State types
export interface AppState {
  subjects: Subject[]
  todos: Todo[]
  classNotes: ClassNote[]
  selectedSubject: string | null
}

// Action types for reducer
export type AppAction =
  | { type: 'ADD_SUBJECT'; payload: CreateSubjectPayload }
  | { type: 'UPDATE_SUBJECT'; payload: { id: string; updates: Partial<Subject> } }
  | { type: 'DELETE_SUBJECT'; payload: string }
  | { type: 'SET_SELECTED_SUBJECT'; payload: string | null }
  | { type: 'ADD_TODO'; payload: CreateTodoPayload }
  | { type: 'UPDATE_TODO'; payload: { id: string; updates: UpdateTodoPayload } }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'ADD_CLASS_NOTE'; payload: CreateClassNotePayload }
  | { type: 'UPDATE_CLASS_NOTE'; payload: { id: string; updates: UpdateClassNotePayload } }
  | { type: 'DELETE_CLASS_NOTE'; payload: string }
  | { type: 'SET_SUBJECTS'; payload: Subject[] }
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'SET_CLASS_NOTES'; payload: ClassNote[] }

// Utility types
export type WithId<T> = T & { id: string }
export type WithTimestamps<T> = T & {
  createdAt: Date
  updatedAt: Date
}
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Error types
export interface AppError {
  message: string
  code?: string
  details?: unknown
}

// Theme types
export type ThemeMode = 'light' | 'dark'

export interface ThemeContextType {
  theme: ThemeMode
  toggleTheme: () => void
}

// Auth types
export interface User {
  id: string
  email: string
  created_at?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
}