import { Todo, Subject, ClassNote } from '@/types'

// Tipos para resultados de validación
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

// Utilidades de validación
export class Validator {
  private errors: ValidationError[] = []

  // Validar que un campo no esté vacío
  required(value: any, field: string, message?: string): this {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      this.errors.push({
        field,
        message: message || `${field} es requerido`,
        code: 'REQUIRED'
      })
    }
    return this
  }

  // Validar longitud mínima
  minLength(value: string, min: number, field: string, message?: string): this {
    if (value && value.length < min) {
      this.errors.push({
        field,
        message: message || `${field} debe tener al menos ${min} caracteres`,
        code: 'MIN_LENGTH'
      })
    }
    return this
  }

  // Validar longitud máxima
  maxLength(value: string, max: number, field: string, message?: string): this {
    if (value && value.length > max) {
      this.errors.push({
        field,
        message: message || `${field} no puede tener más de ${max} caracteres`,
        code: 'MAX_LENGTH'
      })
    }
    return this
  }

  // Validar email
  email(value: string, field: string, message?: string): this {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value && !emailRegex.test(value)) {
      this.errors.push({
        field,
        message: message || `${field} debe ser un email válido`,
        code: 'INVALID_EMAIL'
      })
    }
    return this
  }

  // Validar fecha
  date(value: string, field: string, message?: string): this {
    if (value && isNaN(Date.parse(value))) {
      this.errors.push({
        field,
        message: message || `${field} debe ser una fecha válida`,
        code: 'INVALID_DATE'
      })
    }
    return this
  }

  // Validar que una fecha sea futura
  futureDate(value: string, field: string, message?: string): this {
    if (value) {
      const date = new Date(value)
      const now = new Date()
      if (date <= now) {
        this.errors.push({
          field,
          message: message || `${field} debe ser una fecha futura`,
          code: 'PAST_DATE'
        })
      }
    }
    return this
  }

  // Validar color hexadecimal
  hexColor(value: string, field: string, message?: string): this {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (value && !hexRegex.test(value)) {
      this.errors.push({
        field,
        message: message || `${field} debe ser un color hexadecimal válido`,
        code: 'INVALID_COLOR'
      })
    }
    return this
  }

  // Validar que un valor esté en una lista
  oneOf<T>(value: T, options: T[], field: string, message?: string): this {
    if (value && !options.includes(value)) {
      this.errors.push({
        field,
        message: message || `${field} debe ser uno de: ${options.join(', ')}`,
        code: 'INVALID_OPTION'
      })
    }
    return this
  }

  // Obtener resultado de validación
  getResult(): ValidationResult {
    const result = {
      isValid: this.errors.length === 0,
      errors: [...this.errors]
    }
    this.errors = [] // Reset errors
    return result
  }
}

// Validadores específicos para entidades
export function validateTodo(todo: Partial<Todo>): ValidationResult {
  const validator = new Validator()
  
  validator
    .required(todo.title, 'título')
    .minLength(todo.title || '', 1, 'título')
    .maxLength(todo.title || '', 200, 'título')
    .maxLength(todo.description || '', 1000, 'descripción')
    .oneOf(todo.priority, ['low', 'medium', 'high'], 'prioridad')
  
  if (todo.dueDate) {
    validator.date(todo.dueDate, 'fecha de vencimiento')
  }
  
  return validator.getResult()
}

export function validateSubject(subject: Partial<Subject>): ValidationResult {
  const validator = new Validator()
  
  validator
    .required(subject.name, 'nombre')
    .minLength(subject.name || '', 1, 'nombre')
    .maxLength(subject.name || '', 100, 'nombre')
    .required(subject.color, 'color')
    .hexColor(subject.color || '', 'color')
  
  return validator.getResult()
}

export function validateClassNote(note: Partial<ClassNote>): ValidationResult {
  const validator = new Validator()
  
  validator
    .required(note.title, 'título')
    .minLength(note.title || '', 1, 'título')
    .maxLength(note.title || '', 200, 'título')
    .required(note.content, 'contenido')
    .minLength(note.content || '', 1, 'contenido')
  
  return validator.getResult()
}

// Utilidad para formatear errores de validación
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return ''
  if (errors.length === 1) return errors[0].message
  
  return errors.map(error => `• ${error.message}`).join('\n')
}

// Hook personalizado para validación en tiempo real
export function useValidation<T>(validator: (data: Partial<T>) => ValidationResult) {
  const validateField = (data: Partial<T>) => {
    return validator(data)
  }
  
  const getFieldError = (errors: ValidationError[], field: string): string | undefined => {
    const error = errors.find(e => e.field === field)
    return error?.message
  }
  
  return {
    validateField,
    getFieldError,
    formatErrors: formatValidationErrors
  }
}