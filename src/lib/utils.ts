// Utilidades generales para la aplicación

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Todo, Subject, ClassNote, Priority } from '@/types'

// Función para combinar clases de Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mantener compatibilidad con función existente
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

// Mantener compatibilidad con función existente
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Generadores de ID únicos
export const idGenerators = {
  // Generar ID simple basado en timestamp y random
  simple: (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },

  // Generar UUID v4 simplificado
  uuid: (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  },

  // Generar ID corto para URLs
  short: (): string => {
    return Math.random().toString(36).substr(2, 8)
  },

  // Generar ID basado en prefijo
  withPrefix: (prefix: string): string => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
  }
}

// Utilidades de tiempo
export const timeUtils = {
  // Obtener timestamp actual
  now: (): number => Date.now(),

  // Crear fecha desde string
  parseDate: (dateString: string): Date => new Date(dateString),

  // Verificar si una fecha es válida
  isValidDate: (date: any): boolean => {
    return date instanceof Date && !isNaN(date.getTime())
  },

  // Agregar días a una fecha
  addDays: (date: Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  },

  // Agregar horas a una fecha
  addHours: (date: Date, hours: number): Date => {
    const result = new Date(date)
    result.setHours(result.getHours() + hours)
    return result
  },

  // Obtener inicio del día
  startOfDay: (date: Date): Date => {
    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
  },

  // Obtener fin del día
  endOfDay: (date: Date): Date => {
    const result = new Date(date)
    result.setHours(23, 59, 59, 999)
    return result
  },

  // Calcular diferencia en días
  daysDifference: (date1: Date, date2: Date): number => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  },

  // Verificar si dos fechas son el mismo día
  isSameDay: (date1: Date, date2: Date): boolean => {
    return timeUtils.startOfDay(date1).getTime() === timeUtils.startOfDay(date2).getTime()
  }
}

// Utilidades de arrays
export const arrayUtils = {
  // Remover elemento por ID
  removeById: <T extends { id: string }>(array: T[], id: string): T[] => {
    return array.filter(item => item.id !== id)
  },

  // Actualizar elemento por ID
  updateById: <T extends { id: string }>(array: T[], id: string, updates: Partial<T>): T[] => {
    return array.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  },

  // Encontrar elemento por ID
  findById: <T extends { id: string }>(array: T[], id: string): T | undefined => {
    return array.find(item => item.id === id)
  },

  // Mover elemento en array
  moveItem: <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
    const result = [...array]
    const [removed] = result.splice(fromIndex, 1)
    result.splice(toIndex, 0, removed)
    return result
  },

  // Agrupar array por función
  groupBy: <T, K extends string | number | symbol>(
    array: T[], 
    keyFn: (item: T) => K
  ): Record<K, T[]> => {
    return array.reduce((groups, item) => {
      const key = keyFn(item)
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
      return groups
    }, {} as Record<K, T[]>)
  },

  // Ordenar array por múltiples criterios
  sortBy: <T>(array: T[], ...sortFns: Array<(item: T) => any>): T[] => {
    return [...array].sort((a, b) => {
      for (const sortFn of sortFns) {
        const aVal = sortFn(a)
        const bVal = sortFn(b)
        if (aVal < bVal) return -1
        if (aVal > bVal) return 1
      }
      return 0
    })
  },

  // Obtener elementos únicos
  unique: <T>(array: T[], keyFn?: (item: T) => any): T[] => {
    if (!keyFn) {
      return [...new Set(array)]
    }
    const seen = new Set()
    return array.filter(item => {
      const key = keyFn(item)
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  },

  // Dividir array en chunks
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }
}

// Utilidades de objetos
export const objectUtils = {
  // Verificar si objeto está vacío
  isEmpty: (obj: object): boolean => {
    return Object.keys(obj).length === 0
  },

  // Seleccionar propiedades específicas
  pick: <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key]
      }
    })
    return result
  },

  // Omitir propiedades específicas
  omit: <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj }
    keys.forEach(key => {
      delete result[key]
    })
    return result
  },

  // Clonar objeto profundamente
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as any
    if (obj instanceof Array) return obj.map(item => objectUtils.deepClone(item)) as any
    if (typeof obj === 'object') {
      const cloned = {} as any
      Object.keys(obj).forEach(key => {
        cloned[key] = objectUtils.deepClone((obj as any)[key])
      })
      return cloned
    }
    return obj
  },

  // Comparar objetos profundamente
  deepEqual: (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true
    if (obj1 == null || obj2 == null) return false
    if (typeof obj1 !== typeof obj2) return false
    
    if (typeof obj1 === 'object') {
      const keys1 = Object.keys(obj1)
      const keys2 = Object.keys(obj2)
      
      if (keys1.length !== keys2.length) return false
      
      for (const key of keys1) {
        if (!keys2.includes(key)) return false
        if (!objectUtils.deepEqual(obj1[key], obj2[key])) return false
      }
      
      return true
    }
    
    return false
  }
}

// Utilidades de strings
export const stringUtils = {
  // Verificar si string está vacío o solo espacios
  isEmpty: (str: string): boolean => {
    return !str || str.trim().length === 0
  },

  // Limpiar espacios extra
  cleanSpaces: (str: string): string => {
    return str.replace(/\s+/g, ' ').trim()
  },

  // Generar string aleatorio
  random: (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  // Escapar HTML
  escapeHtml: (str: string): string => {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  },

  // Buscar coincidencias (case insensitive)
  fuzzyMatch: (str: string, query: string): boolean => {
    return str.toLowerCase().includes(query.toLowerCase())
  }
}

// Utilidades específicas para entidades de la app
export const entityUtils = {
  // Crear nueva tarea
  createTodo: (data: Partial<Todo>): Todo => {
    return {
      id: idGenerators.withPrefix('todo'),
      title: data.title || '',
      description: data.description || '',
      completed: false,
      priority: data.priority || 'medium',
      subjectId: data.subjectId || '',
      createdAt: timeUtils.now(),
      updatedAt: timeUtils.now(),
      dueDate: data.dueDate,
      tags: data.tags || []
    }
  },

  // Crear nueva materia
  createSubject: (data: Partial<Subject>): Subject => {
    return {
      id: idGenerators.withPrefix('subject'),
      name: data.name || '',
      color: data.color || '#3b82f6',
      description: data.description || '',
      createdAt: timeUtils.now(),
      updatedAt: timeUtils.now()
    }
  },

  // Crear nueva nota
  createClassNote: (data: Partial<ClassNote>): ClassNote => {
    return {
      id: idGenerators.withPrefix('note'),
      title: data.title || '',
      content: data.content || '',
      subjectId: data.subjectId || '',
      createdAt: timeUtils.now(),
      updatedAt: timeUtils.now(),
      tags: data.tags || []
    }
  },

  // Obtener color de prioridad
  getPriorityColor: (priority: Priority): string => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444'
    }
    return colors[priority]
  },

  // Verificar si tarea está vencida
  isTodoOverdue: (todo: Todo): boolean => {
    if (!todo.dueDate || todo.completed) return false
    return new Date(todo.dueDate) < new Date()
  },

  // Obtener estadísticas de tareas
  getTodoStats: (todos: Todo[]) => {
    const total = todos.length
    const completed = todos.filter(t => t.completed).length
    const pending = total - completed
    const overdue = todos.filter(t => entityUtils.isTodoOverdue(t)).length
    
    return {
      total,
      completed,
      pending,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }
}

// Utilidades de performance
export const performanceUtils = {
  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  // Throttle function
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  // Medir tiempo de ejecución
  measureTime: async <T>(fn: () => Promise<T> | T): Promise<{ result: T; time: number }> => {
    const start = performance.now()
    const result = await fn()
    const time = performance.now() - start
    return { result, time }
  }
}

// Utilidades de validación
export const validationUtils = {
  // Validar email
  isValidEmail: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  },

  // Validar URL
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  // Validar que string no esté vacío
  isNotEmpty: (str: string): boolean => {
    return !stringUtils.isEmpty(str)
  },

  // Validar longitud mínima
  hasMinLength: (str: string, min: number): boolean => {
    return str.length >= min
  },

  // Validar longitud máxima
  hasMaxLength: (str: string, max: number): boolean => {
    return str.length <= max
  },

  // Validar que sea número
  isNumber: (value: any): boolean => {
    return typeof value === 'number' && !isNaN(value)
  },

  // Validar que sea entero positivo
  isPositiveInteger: (value: any): boolean => {
    return validationUtils.isNumber(value) && value > 0 && Number.isInteger(value)
  }
}

// Utilidades de desarrollo
export const devUtils = {
  // Log con timestamp
  log: (...args: any[]): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${new Date().toISOString()}]`, ...args)
    }
  },

  // Warn con timestamp
  warn: (...args: any[]): void => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[${new Date().toISOString()}]`, ...args)
    }
  },

  // Error con timestamp
  error: (...args: any[]): void => {
    console.error(`[${new Date().toISOString()}]`, ...args)
  },

  // Medir performance de componente
  measureRender: (componentName: string) => {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now()
      return () => {
        const end = performance.now()
        console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`)
      }
    }
    return () => {}
  }
}