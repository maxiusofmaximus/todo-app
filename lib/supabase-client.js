import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
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
    
    // Retornar un cliente mock para evitar errores
    return {
      auth: {
        signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
        signOut: () => Promise.resolve({ error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      }
    }
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}