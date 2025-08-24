import { createClient } from '@supabase/supabase-js'

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

// Crear cliente de Supabase o mock según la configuración
const mockSupabase = {
  auth: {
    signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
    update: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
    delete: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } })
  })
}

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : mockSupabase

// Database tables
export const TABLES = {
  AI_EXPLANATIONS: 'ai_explanations',
  USERS: 'users'
}

// AI Explanations functions
export const aiExplanationsService = {
  // Get cached explanation for a specific text and user
  async getCachedExplanation(userId, textHash) {
    const { data, error } = await supabase
      .from(TABLES.AI_EXPLANATIONS)
      .select('explanation, created_at')
      .eq('user_id', userId)
      .eq('text_hash', textHash)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching cached explanation:', error)
      return null
    }
    
    return data
  },

  // Save new explanation to cache
  async saveExplanation(userId, textHash, originalText, explanation) {
    const { data, error } = await supabase
      .from(TABLES.AI_EXPLANATIONS)
      .insert({
        user_id: userId,
        text_hash: textHash,
        original_text: originalText,
        explanation: explanation,
        created_at: new Date().toISOString()
      })
      .select()
    
    if (error) {
      console.error('Error saving explanation:', error)
      return null
    }
    
    return data[0]
  },

  // Get all explanations for a user
  async getUserExplanations(userId) {
    const { data, error } = await supabase
      .from(TABLES.AI_EXPLANATIONS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user explanations:', error)
      return []
    }
    
    return data || []
  }
}