// Constantes de la aplicación para evitar valores mágicos

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'Todo App',
  version: '1.0.0',
  description: 'Aplicación de gestión de tareas y notas de clase'
} as const

// Límites y validaciones
export const LIMITS = {
  TODO: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 1000
  },
  SUBJECT: {
    NAME_MIN_LENGTH: 1,
    NAME_MAX_LENGTH: 100
  },
  CLASS_NOTE: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 200,
    CONTENT_MIN_LENGTH: 1,
    CONTENT_MAX_LENGTH: 10000
  },
  FILE: {
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024
  }
} as const

// Duraciones y timeouts
export const TIMEOUTS = {
  ERROR_AUTO_DISMISS: 5000, // 5 segundos
  DEBOUNCE_SEARCH: 300, // 300ms
  TOAST_DURATION: 3000, // 3 segundos
  API_TIMEOUT: 30000, // 30 segundos
  RETRY_DELAY: 1000 // 1 segundo
} as const

// Claves de localStorage
export const STORAGE_KEYS = {
  THEME: 'theme',
  USER_PREFERENCES: 'userPreferences',
  DRAFT_TODO: 'draftTodo',
  DRAFT_NOTE: 'draftNote',
  SELECTED_SUBJECT: 'selectedSubject',
  APP_STATE: 'appState'
} as const

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SETTINGS: '/settings'
} as const

// Prioridades de tareas
export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const

export const PRIORITY_LABELS = {
  [PRIORITIES.LOW]: 'Baja',
  [PRIORITIES.MEDIUM]: 'Media',
  [PRIORITIES.HIGH]: 'Alta'
} as const

export const PRIORITY_COLORS = {
  [PRIORITIES.LOW]: '#10b981', // green
  [PRIORITIES.MEDIUM]: '#f59e0b', // yellow
  [PRIORITIES.HIGH]: '#ef4444' // red
} as const

// Estados de tareas
export const TODO_STATES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

// Tipos de errores
export const ERROR_TYPES = {
  VALIDATION: 'validation',
  NETWORK: 'network',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  GENERIC: 'generic'
} as const

// Severidades de errores
export const ERROR_SEVERITIES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
} as const

// Códigos de error HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_EMAIL: 'Ingresa un email válido',
  INVALID_PASSWORD: 'La contraseña debe tener al menos 8 caracteres',
  PASSWORDS_DONT_MATCH: 'Las contraseñas no coinciden',
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
  NOT_FOUND: 'El recurso solicitado no fue encontrado',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  GENERIC_ERROR: 'Ha ocurrido un error inesperado',
  VALIDATION_ERROR: 'Por favor corrige los errores en el formulario'
} as const

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  TODO_CREATED: 'Tarea creada exitosamente',
  TODO_UPDATED: 'Tarea actualizada exitosamente',
  TODO_DELETED: 'Tarea eliminada exitosamente',
  TODO_COMPLETED: 'Tarea marcada como completada',
  SUBJECT_CREATED: 'Materia creada exitosamente',
  SUBJECT_UPDATED: 'Materia actualizada exitosamente',
  SUBJECT_DELETED: 'Materia eliminada exitosamente',
  NOTE_CREATED: 'Nota creada exitosamente',
  NOTE_UPDATED: 'Nota actualizada exitosamente',
  NOTE_DELETED: 'Nota eliminada exitosamente',
  SETTINGS_SAVED: 'Configuración guardada exitosamente',
  PROFILE_UPDATED: 'Perfil actualizado exitosamente'
} as const

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5
} as const

// Configuración de búsqueda
export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  MAX_RESULTS: 50,
  DEBOUNCE_DELAY: TIMEOUTS.DEBOUNCE_SEARCH
} as const

// Configuración de archivos
export const FILE_CONFIG = {
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain', 'application/msword'],
  MAX_FILE_SIZE: LIMITS.FILE.MAX_SIZE_BYTES
} as const

// Configuración de tema
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light',
  AVAILABLE_THEMES: ['light', 'dark'] as const,
  STORAGE_KEY: STORAGE_KEYS.THEME
} as const

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  POSITION: 'top-right',
  AUTO_CLOSE: true,
  CLOSE_DELAY: TIMEOUTS.TOAST_DURATION,
  MAX_NOTIFICATIONS: 5
} as const

// Breakpoints responsivos
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080
} as const

// Animaciones
export const ANIMATIONS = {
  DURATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms'
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out'
  }
} as const

// Colores predefinidos para materias
export const SUBJECT_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#F97316', // orange
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#EC4899', // pink
  '#6B7280'  // gray
] as const

// Configuración de AI/OCR
export const AI_CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT: TIMEOUTS.API_TIMEOUT,
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 horas
  MAX_TEXT_LENGTH: 5000
} as const