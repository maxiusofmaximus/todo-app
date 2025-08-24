// Utilidades para manejo de localStorage y persistencia de datos

import { STORAGE_KEYS } from './constants'
import { Todo, Subject, ClassNote, ThemeMode } from '@/types'

// Tipos para el storage
export interface StorageData {
  todos: Todo[]
  subjects: Subject[]
  classNotes: ClassNote[]
  selectedSubjectId: string | null
  theme: ThemeMode
  preferences: UserPreferences
}

export interface UserPreferences {
  language: string
  dateFormat: 'short' | 'long' | 'relative'
  defaultPriority: 'low' | 'medium' | 'high'
  autoSave: boolean
  notifications: boolean
  compactView: boolean
  showCompletedTodos: boolean
  todoSortBy: 'dueDate' | 'priority' | 'createdAt' | 'title'
  todoSortOrder: 'asc' | 'desc'
}

// Configuración por defecto
const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'es',
  dateFormat: 'short',
  defaultPriority: 'medium',
  autoSave: true,
  notifications: true,
  compactView: false,
  showCompletedTodos: true,
  todoSortBy: 'dueDate',
  todoSortOrder: 'asc'
}

// Clase para manejo seguro del localStorage
class SafeStorage {
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  get<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) {
      console.warn('localStorage no está disponible')
      return defaultValue
    }

    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue
      return JSON.parse(item)
    } catch (error) {
      console.error(`Error al leer ${key} del localStorage:`, error)
      return defaultValue
    }
  }

  set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage no está disponible')
      return false
    }

    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage:`, error)
      return false
    }
  }

  remove(key: string): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage no está disponible')
      return false
    }

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error al eliminar ${key} del localStorage:`, error)
      return false
    }
  }

  clear(): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage no está disponible')
      return false
    }

    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error al limpiar localStorage:', error)
      return false
    }
  }

  // Obtener el tamaño usado del localStorage
  getUsedSpace(): number {
    if (!this.isAvailable()) return 0

    let total = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return total
  }

  // Verificar si hay espacio disponible
  hasSpace(dataSize: number): boolean {
    const maxSize = 5 * 1024 * 1024 // 5MB aproximado
    return this.getUsedSpace() + dataSize < maxSize
  }
}

// Instancia singleton del storage
export const storage = new SafeStorage()

// Funciones específicas para cada tipo de dato
export const todoStorage = {
  get: (): Todo[] => storage.get(STORAGE_KEYS.TODOS, []),
  set: (todos: Todo[]): boolean => storage.set(STORAGE_KEYS.TODOS, todos),
  add: (todo: Todo): boolean => {
    const todos = todoStorage.get()
    todos.push(todo)
    return todoStorage.set(todos)
  },
  update: (id: string, updates: Partial<Todo>): boolean => {
    const todos = todoStorage.get()
    const index = todos.findIndex(t => t.id === id)
    if (index === -1) return false
    todos[index] = { ...todos[index], ...updates }
    return todoStorage.set(todos)
  },
  remove: (id: string): boolean => {
    const todos = todoStorage.get()
    const filtered = todos.filter(t => t.id !== id)
    return todoStorage.set(filtered)
  },
  clear: (): boolean => storage.remove(STORAGE_KEYS.TODOS)
}

export const subjectStorage = {
  get: (): Subject[] => storage.get(STORAGE_KEYS.SUBJECTS, []),
  set: (subjects: Subject[]): boolean => storage.set(STORAGE_KEYS.SUBJECTS, subjects),
  add: (subject: Subject): boolean => {
    const subjects = subjectStorage.get()
    subjects.push(subject)
    return subjectStorage.set(subjects)
  },
  update: (id: string, updates: Partial<Subject>): boolean => {
    const subjects = subjectStorage.get()
    const index = subjects.findIndex(s => s.id === id)
    if (index === -1) return false
    subjects[index] = { ...subjects[index], ...updates }
    return subjectStorage.set(subjects)
  },
  remove: (id: string): boolean => {
    const subjects = subjectStorage.get()
    const filtered = subjects.filter(s => s.id !== id)
    return subjectStorage.set(filtered)
  },
  clear: (): boolean => storage.remove(STORAGE_KEYS.SUBJECTS)
}

export const classNoteStorage = {
  get: (): ClassNote[] => storage.get(STORAGE_KEYS.CLASS_NOTES, []),
  set: (notes: ClassNote[]): boolean => storage.set(STORAGE_KEYS.CLASS_NOTES, notes),
  add: (note: ClassNote): boolean => {
    const notes = classNoteStorage.get()
    notes.push(note)
    return classNoteStorage.set(notes)
  },
  update: (id: string, updates: Partial<ClassNote>): boolean => {
    const notes = classNoteStorage.get()
    const index = notes.findIndex(n => n.id === id)
    if (index === -1) return false
    notes[index] = { ...notes[index], ...updates }
    return classNoteStorage.set(notes)
  },
  remove: (id: string): boolean => {
    const notes = classNoteStorage.get()
    const filtered = notes.filter(n => n.id !== id)
    return classNoteStorage.set(filtered)
  },
  clear: (): boolean => storage.remove(STORAGE_KEYS.CLASS_NOTES)
}

export const themeStorage = {
  get: (): ThemeMode => storage.get(STORAGE_KEYS.THEME, 'light'),
  set: (theme: ThemeMode): boolean => storage.set(STORAGE_KEYS.THEME, theme)
}

export const selectedSubjectStorage = {
  get: (): string | null => storage.get(STORAGE_KEYS.SELECTED_SUBJECT, null),
  set: (subjectId: string | null): boolean => storage.set(STORAGE_KEYS.SELECTED_SUBJECT, subjectId)
}

export const preferencesStorage = {
  get: (): UserPreferences => storage.get(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES),
  set: (preferences: UserPreferences): boolean => storage.set(STORAGE_KEYS.PREFERENCES, preferences),
  update: (updates: Partial<UserPreferences>): boolean => {
    const current = preferencesStorage.get()
    const updated = { ...current, ...updates }
    return preferencesStorage.set(updated)
  },
  reset: (): boolean => preferencesStorage.set(DEFAULT_PREFERENCES)
}

// Funciones de utilidad para backup y restore
export const backupRestore = {
  // Crear backup completo
  createBackup: (): StorageData => {
    return {
      todos: todoStorage.get(),
      subjects: subjectStorage.get(),
      classNotes: classNoteStorage.get(),
      selectedSubjectId: selectedSubjectStorage.get(),
      theme: themeStorage.get(),
      preferences: preferencesStorage.get()
    }
  },

  // Restaurar desde backup
  restoreFromBackup: (data: StorageData): boolean => {
    try {
      const success = [
        todoStorage.set(data.todos || []),
        subjectStorage.set(data.subjects || []),
        classNoteStorage.set(data.classNotes || []),
        selectedSubjectStorage.set(data.selectedSubjectId || null),
        themeStorage.set(data.theme || 'light'),
        preferencesStorage.set(data.preferences || DEFAULT_PREFERENCES)
      ]
      
      return success.every(Boolean)
    } catch (error) {
      console.error('Error al restaurar backup:', error)
      return false
    }
  },

  // Exportar datos como JSON
  exportToJSON: (): string => {
    const data = backupRestore.createBackup()
    return JSON.stringify(data, null, 2)
  },

  // Importar datos desde JSON
  importFromJSON: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString) as StorageData
      return backupRestore.restoreFromBackup(data)
    } catch (error) {
      console.error('Error al importar JSON:', error)
      return false
    }
  },

  // Limpiar todos los datos
  clearAll: (): boolean => {
    const success = [
      todoStorage.clear(),
      subjectStorage.clear(),
      classNoteStorage.clear(),
      storage.remove(STORAGE_KEYS.SELECTED_SUBJECT),
      storage.remove(STORAGE_KEYS.THEME),
      preferencesStorage.reset()
    ]
    
    return success.every(Boolean)
  }
}

// Hook para auto-guardado
export const useAutoSave = () => {
  const preferences = preferencesStorage.get()
  
  const autoSave = (key: string, data: any) => {
    if (preferences.autoSave) {
      storage.set(key, data)
    }
  }
  
  return { autoSave, isEnabled: preferences.autoSave }
}

// Utilidades de migración para versiones futuras
export const migration = {
  // Versión actual del esquema de datos
  CURRENT_VERSION: '1.0.0',
  
  // Obtener versión guardada
  getStoredVersion: (): string => {
    return storage.get('app_version', '1.0.0')
  },
  
  // Guardar versión actual
  setCurrentVersion: (): boolean => {
    return storage.set('app_version', migration.CURRENT_VERSION)
  },
  
  // Verificar si necesita migración
  needsMigration: (): boolean => {
    const storedVersion = migration.getStoredVersion()
    return storedVersion !== migration.CURRENT_VERSION
  },
  
  // Ejecutar migración (placeholder para futuras versiones)
  migrate: (): boolean => {
    const storedVersion = migration.getStoredVersion()
    
    // Aquí se agregarían las migraciones específicas según la versión
    console.log(`Migrando desde versión ${storedVersion} a ${migration.CURRENT_VERSION}`)
    
    return migration.setCurrentVersion()
  }
}