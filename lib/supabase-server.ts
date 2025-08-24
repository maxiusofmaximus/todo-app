import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SupabaseClient } from '@supabase/supabase-js'

interface MockSupabaseAuth {
  signUp: () => Promise<{ data: null; error: { message: string } }>
  signInWithPassword: () => Promise<{ data: null; error: { message: string } }>
  signOut: () => Promise<{ error: null }>
  onAuthStateChange: () => { data: { subscription: { unsubscribe: () => void } } }
  getUser: () => Promise<{ data: { user: null }; error: null }>
}

interface MockSupabaseQuery {
  select: () => Promise<{ data: any[]; error: null }>
  insert: () => Promise<{ data: null; error: { message: string } }>
  update: () => Promise<{ data: null; error: { message: string } }>
  delete: () => Promise<{ data: null; error: { message: string } }>
}

interface MockSupabaseClient {
  auth: MockSupabaseAuth
  from: (table: string) => MockSupabaseQuery
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verificar si las variables están configuradas correctamente
const isConfigured = supabaseUrl && 
                    supabaseAnonKey && 
                    !supabaseUrl.includes('placeholder') && 
                    !supabaseAnonKey.includes('placeholder') &&
                    supabaseUrl !== 'your_supabase_project_url'

if (!isConfigured) {
  console.warn('⚠️  Supabase no está configurado correctamente. Por favor, configura las variables de entorno en .env')
  console.warn('📖 Consulta SUPABASE_SETUP.md para instrucciones detalladas')
}

// Mock client para cuando Supabase no está configurado
const mockSupabase: MockSupabaseClient = {
  auth: {
    signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null })
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
    update: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
    delete: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } })
  })
}

export const createClient = (): SupabaseClient | MockSupabaseClient => {
  if (!isConfigured) {
    return mockSupabase
  }

  const cookieStore = cookies()

  return createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}