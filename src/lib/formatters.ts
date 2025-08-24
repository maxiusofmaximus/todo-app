// Utilidades para formateo y manipulación de datos

import { PRIORITY_LABELS, PRIORITY_COLORS } from './constants'
import { Priority, Todo, Subject, ClassNote } from '@/types'

// Formateo de fechas
export const dateFormatters = {
  // Formato corto: "15/03/2024"
  short: (date: Date | string): string => {
    const d = new Date(date)
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  },

  // Formato largo: "15 de marzo de 2024"
  long: (date: Date | string): string => {
    const d = new Date(date)
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  },

  // Formato con hora: "15/03/2024 14:30"
  withTime: (date: Date | string): string => {
    const d = new Date(date)
    return d.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  // Formato relativo: "hace 2 horas", "en 3 días"
  relative: (date: Date | string): string => {
    const d = new Date(date)
    const now = new Date()
    const diffMs = d.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.ceil(diffMs / (1000 * 60))

    if (Math.abs(diffDays) >= 1) {
      if (diffDays > 0) {
        return diffDays === 1 ? 'mañana' : `en ${diffDays} días`
      } else {
        return diffDays === -1 ? 'ayer' : `hace ${Math.abs(diffDays)} días`
      }
    }

    if (Math.abs(diffHours) >= 1) {
      if (diffHours > 0) {
        return diffHours === 1 ? 'en 1 hora' : `en ${diffHours} horas`
      } else {
        return diffHours === -1 ? 'hace 1 hora' : `hace ${Math.abs(diffHours)} horas`
      }
    }

    if (Math.abs(diffMinutes) >= 1) {
      if (diffMinutes > 0) {
        return diffMinutes === 1 ? 'en 1 minuto' : `en ${diffMinutes} minutos`
      } else {
        return diffMinutes === -1 ? 'hace 1 minuto' : `hace ${Math.abs(diffMinutes)} minutos`
      }
    }

    return 'ahora'
  },

  // Formato para input datetime-local
  forInput: (date: Date | string): string => {
    const d = new Date(date)
    return d.toISOString().slice(0, 16)
  },

  // Verificar si una fecha es hoy
  isToday: (date: Date | string): boolean => {
    const d = new Date(date)
    const today = new Date()
    return d.toDateString() === today.toDateString()
  },

  // Verificar si una fecha es mañana
  isTomorrow: (date: Date | string): boolean => {
    const d = new Date(date)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return d.toDateString() === tomorrow.toDateString()
  },

  // Verificar si una fecha está vencida
  isOverdue: (date: Date | string): boolean => {
    const d = new Date(date)
    const now = new Date()
    return d < now
  }
}

// Formateo de texto
export const textFormatters = {
  // Truncar texto
  truncate: (text: string, maxLength: number, suffix = '...'): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - suffix.length) + suffix
  },

  // Capitalizar primera letra
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  },

  // Capitalizar cada palabra
  titleCase: (text: string): string => {
    return text.split(' ').map(word => textFormatters.capitalize(word)).join(' ')
  },

  // Convertir a slug (URL-friendly)
  slug: (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .trim()
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Remover guiones múltiples
  },

  // Extraer iniciales
  initials: (text: string, maxLength = 2): string => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, maxLength)
      .join('')
  },

  // Resaltar texto en búsqueda
  highlight: (text: string, query: string): string => {
    if (!query.trim()) return text
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }
}

// Formateo de números
export const numberFormatters = {
  // Formatear como porcentaje
  percentage: (value: number, decimals = 0): string => {
    return `${value.toFixed(decimals)}%`
  },

  // Formatear tamaño de archivo
  fileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  },

  // Formatear duración en minutos
  duration: (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours}h`
    }
    return `${hours}h ${remainingMinutes}min`
  }
}

// Formateo específico para entidades de la app
export const entityFormatters = {
  // Formatear prioridad
  priority: (priority: Priority): { label: string; color: string } => {
    return {
      label: PRIORITY_LABELS[priority],
      color: PRIORITY_COLORS[priority]
    }
  },

  // Formatear estado de tarea
  todoStatus: (todo: Todo): { label: string; color: string } => {
    if (todo.completed) {
      return { label: 'Completada', color: '#10b981' }
    }
    if (todo.dueDate && dateFormatters.isOverdue(todo.dueDate)) {
      return { label: 'Vencida', color: '#ef4444' }
    }
    if (todo.dueDate && dateFormatters.isToday(todo.dueDate)) {
      return { label: 'Vence hoy', color: '#f59e0b' }
    }
    return { label: 'Pendiente', color: '#6b7280' }
  },

  // Formatear resumen de materia
  subjectSummary: (subject: Subject, todos: Todo[], notes: ClassNote[]): string => {
    const todoCount = todos.length
    const completedTodos = todos.filter(t => t.completed).length
    const noteCount = notes.length
    
    const parts = []
    if (todoCount > 0) {
      parts.push(`${completedTodos}/${todoCount} tareas`)
    }
    if (noteCount > 0) {
      parts.push(`${noteCount} notas`)
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'Sin contenido'
  },

  // Formatear título de nota con preview
  notePreview: (note: ClassNote, maxLength = 100): string => {
    const content = note.content.replace(/\n/g, ' ').trim()
    return textFormatters.truncate(content, maxLength)
  }
}

// Utilidades de validación de formato
export const formatValidators = {
  // Validar email
  email: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  },

  // Validar URL
  url: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  // Validar color hexadecimal
  hexColor: (color: string): boolean => {
    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    return regex.test(color)
  },

  // Validar fecha
  date: (date: string): boolean => {
    return !isNaN(Date.parse(date))
  }
}

// Utilidades de conversión
export const converters = {
  // Convertir string a boolean
  stringToBoolean: (value: string): boolean => {
    return value.toLowerCase() === 'true'
  },

  // Convertir array a string separado por comas
  arrayToString: (array: string[], separator = ', '): string => {
    return array.join(separator)
  },

  // Convertir string separado por comas a array
  stringToArray: (value: string, separator = ','): string[] => {
    return value.split(separator).map(item => item.trim()).filter(Boolean)
  },

  // Convertir objeto a query string
  objectToQueryString: (obj: Record<string, any>): string => {
    const params = new URLSearchParams()
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, String(value))
      }
    })
    return params.toString()
  },

  // Convertir query string a objeto
  queryStringToObject: (queryString: string): Record<string, string> => {
    const params = new URLSearchParams(queryString)
    const obj: Record<string, string> = {}
    params.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  }
}