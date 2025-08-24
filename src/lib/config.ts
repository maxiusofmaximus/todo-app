// Configuración centralizada de la aplicación

export const APP_CONFIG = {
  name: 'TodoApp',
  version: '1.0.0',
  description: 'Aplicación de gestión de tareas y notas académicas',
  author: 'TodoApp Team',
  repository: 'https://github.com/todoapp/todoapp',
  homepage: 'https://todoapp.com',
  supportEmail: 'support@todoapp.com'
} as const

// Configuración de la API
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
  endpoints: {
    todos: '/todos',
    subjects: '/subjects',
    notes: '/notes',
    auth: '/auth',
    user: '/user',
    export: '/export',
    import: '/import'
  }
} as const

// Configuración de la base de datos
export const DATABASE_CONFIG = {
  name: 'todoapp_db',
  version: 1,
  stores: {
    todos: 'todos',
    subjects: 'subjects',
    notes: 'notes',
    settings: 'settings',
    cache: 'cache'
  }
} as const

// Configuración de autenticación
export const AUTH_CONFIG = {
  tokenKey: 'todoapp_token',
  refreshTokenKey: 'todoapp_refresh_token',
  userKey: 'todoapp_user',
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
  refreshThreshold: 5 * 60 * 1000, // 5 minutos
  providers: {
    google: {
      enabled: true,
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    },
    github: {
      enabled: true,
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
    },
    email: {
      enabled: true,
      requireVerification: true
    }
  }
} as const

// Configuración de tema
export const THEME_CONFIG = {
  default: 'light' as const,
  storageKey: 'todoapp_theme',
  systemPreference: true,
  transitions: {
    duration: '200ms',
    easing: 'ease-in-out'
  },
  colors: {
    light: {
      primary: '#3b82f6',
      secondary: '#64748b',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0'
    },
    dark: {
      primary: '#60a5fa',
      secondary: '#94a3b8',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#22d3ee',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155'
    }
  }
} as const

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  position: 'top-right' as const,
  duration: 5000,
  maxVisible: 5,
  showProgress: true,
  pauseOnHover: true,
  closeOnClick: true,
  types: {
    success: {
      icon: '✓',
      color: '#10b981'
    },
    error: {
      icon: '✕',
      color: '#ef4444'
    },
    warning: {
      icon: '⚠',
      color: '#f59e0b'
    },
    info: {
      icon: 'ℹ',
      color: '#06b6d4'
    }
  }
} as const

// Configuración de almacenamiento
export const STORAGE_CONFIG = {
  prefix: 'todoapp_',
  version: '1.0',
  encryption: {
    enabled: false,
    algorithm: 'AES-GCM',
    keyLength: 256
  },
  compression: {
    enabled: true,
    threshold: 1024 // bytes
  },
  backup: {
    enabled: true,
    interval: 24 * 60 * 60 * 1000, // 24 horas
    maxBackups: 7,
    autoRestore: true
  }
} as const

// Configuración de validación
export const VALIDATION_CONFIG = {
  todo: {
    title: {
      minLength: 1,
      maxLength: 200,
      required: true
    },
    description: {
      maxLength: 1000,
      required: false
    },
    tags: {
      maxCount: 10,
      maxLength: 50
    }
  },
  subject: {
    name: {
      minLength: 1,
      maxLength: 100,
      required: true
    },
    description: {
      maxLength: 500,
      required: false
    },
    color: {
      format: 'hex',
      required: true
    }
  },
  note: {
    title: {
      minLength: 1,
      maxLength: 200,
      required: true
    },
    content: {
      minLength: 1,
      maxLength: 10000,
      required: true
    },
    tags: {
      maxCount: 10,
      maxLength: 50
    }
  }
} as const

// Configuración de búsqueda
export const SEARCH_CONFIG = {
  minQueryLength: 2,
  maxResults: 50,
  debounceDelay: 300,
  highlightMatches: true,
  caseSensitive: false,
  fuzzySearch: {
    enabled: true,
    threshold: 0.6,
    distance: 100
  },
  filters: {
    todos: {
      fields: ['title', 'description', 'tags'],
      weights: {
        title: 3,
        description: 1,
        tags: 2
      }
    },
    subjects: {
      fields: ['name', 'description'],
      weights: {
        name: 3,
        description: 1
      }
    },
    notes: {
      fields: ['title', 'content', 'tags'],
      weights: {
        title: 3,
        content: 1,
        tags: 2
      }
    }
  }
} as const

// Configuración de paginación
export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  maxPageSize: 100,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: true
} as const

// Configuración de exportación/importación
export const EXPORT_CONFIG = {
  formats: {
    json: {
      enabled: true,
      mimeType: 'application/json',
      extension: '.json'
    },
    csv: {
      enabled: true,
      mimeType: 'text/csv',
      extension: '.csv',
      delimiter: ',',
      encoding: 'utf-8'
    },
    pdf: {
      enabled: true,
      mimeType: 'application/pdf',
      extension: '.pdf',
      pageSize: 'A4',
      orientation: 'portrait'
    }
  },
  maxFileSize: 10 * 1024 * 1024, // 10MB
  compression: true
} as const

// Configuración de performance
export const PERFORMANCE_CONFIG = {
  virtualScrolling: {
    enabled: true,
    threshold: 100,
    itemHeight: 60,
    overscan: 5
  },
  lazyLoading: {
    enabled: true,
    threshold: '100px',
    rootMargin: '50px'
  },
  debouncing: {
    search: 300,
    resize: 100,
    scroll: 16
  },
  caching: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutos
    maxSize: 100
  }
} as const

// Configuración de desarrollo
export const DEV_CONFIG = {
  logging: {
    enabled: process.env.NODE_ENV === 'development',
    level: 'debug' as const,
    console: true,
    file: false
  },
  debugging: {
    enabled: process.env.NODE_ENV === 'development',
    showBoundaries: false,
    showRenderTime: false,
    showStateChanges: false
  },
  hotReload: {
    enabled: process.env.NODE_ENV === 'development',
    preserveState: true
  }
} as const

// Configuración de accesibilidad
export const A11Y_CONFIG = {
  announcements: {
    enabled: true,
    polite: true,
    delay: 100
  },
  keyboard: {
    enabled: true,
    trapFocus: true,
    restoreFocus: true
  },
  screenReader: {
    enabled: true,
    verbosity: 'medium' as const
  },
  highContrast: {
    enabled: true,
    autoDetect: true
  },
  reducedMotion: {
    enabled: true,
    autoDetect: true
  }
} as const

// Configuración de seguridad
export const SECURITY_CONFIG = {
  csp: {
    enabled: true,
    reportOnly: false
  },
  sanitization: {
    enabled: true,
    allowedTags: ['b', 'i', 'em', 'strong', 'u', 'br', 'p'],
    allowedAttributes: {}
  },
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 100
  },
  encryption: {
    enabled: false,
    algorithm: 'AES-256-GCM',
    keyDerivation: 'PBKDF2'
  }
} as const

// Configuración de analytics
export const ANALYTICS_CONFIG = {
  enabled: process.env.NODE_ENV === 'production',
  provider: 'google' as const,
  trackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  anonymizeIp: true,
  cookieConsent: true,
  events: {
    pageView: true,
    userInteraction: true,
    errors: true,
    performance: false
  }
} as const

// Configuración de PWA
export const PWA_CONFIG = {
  enabled: true,
  name: APP_CONFIG.name,
  shortName: 'TodoApp',
  description: APP_CONFIG.description,
  themeColor: THEME_CONFIG.colors.light.primary,
  backgroundColor: THEME_CONFIG.colors.light.background,
  display: 'standalone' as const,
  orientation: 'portrait' as const,
  startUrl: '/',
  scope: '/',
  icons: {
    sizes: [72, 96, 128, 144, 152, 192, 384, 512],
    purpose: 'any maskable'
  },
  offline: {
    enabled: true,
    strategy: 'networkFirst' as const,
    cacheName: 'todoapp-cache'
  }
} as const

// Configuración completa de la aplicación
export const CONFIG = {
  app: APP_CONFIG,
  api: API_CONFIG,
  database: DATABASE_CONFIG,
  auth: AUTH_CONFIG,
  theme: THEME_CONFIG,
  notifications: NOTIFICATION_CONFIG,
  storage: STORAGE_CONFIG,
  validation: VALIDATION_CONFIG,
  search: SEARCH_CONFIG,
  pagination: PAGINATION_CONFIG,
  export: EXPORT_CONFIG,
  performance: PERFORMANCE_CONFIG,
  dev: DEV_CONFIG,
  a11y: A11Y_CONFIG,
  security: SECURITY_CONFIG,
  analytics: ANALYTICS_CONFIG,
  pwa: PWA_CONFIG
} as const

// Tipos derivados de la configuración
export type AppConfig = typeof APP_CONFIG
export type ApiConfig = typeof API_CONFIG
export type ThemeConfig = typeof THEME_CONFIG
export type NotificationConfig = typeof NOTIFICATION_CONFIG
export type ValidationConfig = typeof VALIDATION_CONFIG
export type SearchConfig = typeof SEARCH_CONFIG
export type Config = typeof CONFIG

// Función para obtener configuración por entorno
export function getConfig(env: 'development' | 'production' | 'test' = 'development') {
  const baseConfig = CONFIG
  
  switch (env) {
    case 'production':
      return {
        ...baseConfig,
        dev: {
          ...baseConfig.dev,
          logging: { ...baseConfig.dev.logging, enabled: false },
          debugging: { ...baseConfig.dev.debugging, enabled: false }
        },
        analytics: {
          ...baseConfig.analytics,
          enabled: true
        }
      }
    
    case 'test':
      return {
        ...baseConfig,
        api: {
          ...baseConfig.api,
          baseUrl: 'http://localhost:3001/api'
        },
        storage: {
          ...baseConfig.storage,
          prefix: 'test_todoapp_'
        }
      }
    
    default:
      return baseConfig
  }
}

// Función para validar configuración
export function validateConfig(config: Partial<Config>): boolean {
  try {
    // Validaciones básicas
    if (!config.app?.name) {
      console.error('App name is required')
      return false
    }
    
    if (!config.api?.baseUrl) {
      console.error('API base URL is required')
      return false
    }
    
    // Validar URLs
    try {
      new URL(config.api.baseUrl)
    } catch {
      console.error('Invalid API base URL')
      return false
    }
    
    return true
  } catch (error) {
    console.error('Config validation error:', error)
    return false
  }
}

// Exportar configuración por defecto
export default CONFIG