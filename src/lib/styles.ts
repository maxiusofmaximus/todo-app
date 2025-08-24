// Utilidades para clases CSS comunes y patrones de diseño

// Clases base para componentes comunes
export const baseStyles = {
  // Contenedores
  container: 'min-h-screen p-4',
  card: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
  modal: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50',
  modalContent: 'bg-white rounded-lg max-w-md w-full p-6',
  
  // Botones
  button: {
    base: 'px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  },
  
  // Inputs
  input: {
    base: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
    success: 'border-green-300 focus:ring-green-500 focus:border-green-500'
  },
  
  // Estados de error
  error: {
    container: 'bg-red-50 border border-red-200 rounded-md p-3',
    text: 'text-red-800 text-sm',
    icon: 'text-red-500'
  },
  
  // Estados de éxito
  success: {
    container: 'bg-green-50 border border-green-200 rounded-md p-3',
    text: 'text-green-800 text-sm',
    icon: 'text-green-500'
  },
  
  // Estados de advertencia
  warning: {
    container: 'bg-yellow-50 border border-yellow-200 rounded-md p-3',
    text: 'text-yellow-800 text-sm',
    icon: 'text-yellow-500'
  },
  
  // Estados de información
  info: {
    container: 'bg-blue-50 border border-blue-200 rounded-md p-3',
    text: 'text-blue-800 text-sm',
    icon: 'text-blue-500'
  },
  
  // Loading
  loading: {
    overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
    container: 'bg-white rounded-lg p-6 flex items-center space-x-3',
    spinner: 'animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'
  },
  
  // Badges
  badge: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  }
} as const

// Función para combinar clases CSS
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Función para crear variantes de botones
export function getButtonClasses(variant: keyof typeof baseStyles.button = 'primary', size: 'sm' | 'md' | 'lg' = 'md'): string {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  return cn(
    baseStyles.button.base,
    baseStyles.button[variant],
    sizeClasses[size]
  )
}

// Función para crear variantes de inputs
export function getInputClasses(state: 'default' | 'error' | 'success' = 'default'): string {
  const stateClasses = {
    default: '',
    error: baseStyles.input.error,
    success: baseStyles.input.success
  }
  
  return cn(
    baseStyles.input.base,
    stateClasses[state]
  )
}

// Función para crear variantes de badges
export function getBadgeClasses(variant: keyof typeof baseStyles.badge = 'primary'): string {
  if (variant === 'base') return baseStyles.badge.base
  
  return cn(
    baseStyles.badge.base,
    baseStyles.badge[variant as keyof Omit<typeof baseStyles.badge, 'base'>]
  )
}

// Función para crear clases de estado de mensaje
export function getMessageClasses(type: 'error' | 'success' | 'warning' | 'info'): {
  container: string
  text: string
  icon: string
} {
  return {
    container: baseStyles[type].container,
    text: baseStyles[type].text,
    icon: baseStyles[type].icon
  }
}

// Utilidades para temas
export const themeVariables = {
  light: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8fafc',
    '--bg-tertiary': '#f1f5f9',
    '--text-primary': '#1e293b',
    '--text-secondary': '#64748b',
    '--border-color': '#e2e8f0',
    '--accent': '#3b82f6',
    '--error': '#ef4444',
    '--success': '#10b981',
    '--warning': '#f59e0b'
  },
  dark: {
    '--bg-primary': '#0f172a',
    '--bg-secondary': '#1e293b',
    '--bg-tertiary': '#334155',
    '--text-primary': '#f8fafc',
    '--text-secondary': '#cbd5e1',
    '--border-color': '#475569',
    '--accent': '#60a5fa',
    '--error': '#f87171',
    '--success': '#34d399',
    '--warning': '#fbbf24'
  }
} as const

// Función para aplicar variables de tema
export function applyThemeVariables(theme: keyof typeof themeVariables): void {
  const variables = themeVariables[theme]
  const root = document.documentElement
  
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
}

// Clases responsivas comunes
export const responsive = {
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-1 md:grid-cols-2',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  },
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end'
  },
  spacing: {
    xs: 'space-y-2',
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12'
  }
} as const