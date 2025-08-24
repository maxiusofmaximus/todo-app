import crypto from 'crypto'
import { aiExplanationsService } from '../lib/supabase'

interface AIExplanation {
  explanation: string
  created_at: string
}

interface AIExplanationInsert {
  user_id: string
  text_hash: string
  original_text: string
  explanation: string
  created_at: string
}

// Generate a hash for the text to use as cache key
function generateTextHash(text: string): string {
  return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex')
}

export const aiCacheService = {
  // Check if explanation exists in cache
  async getCachedExplanation(userId: string, text: string): Promise<AIExplanation | null> {
    if (!userId || !text) return null
    
    const textHash = generateTextHash(text)
    return await aiExplanationsService.getCachedExplanation(userId, textHash)
  },

  // Save explanation to cache
  async saveExplanation(userId: string, text: string, explanation: string): Promise<AIExplanationInsert | null> {
    if (!userId || !text || !explanation) return null
    
    const textHash = generateTextHash(text)
    return await aiExplanationsService.saveExplanation(userId, textHash, text, explanation)
  },

  // Get all cached explanations for a user
  async getUserExplanations(userId: string): Promise<AIExplanationInsert[]> {
    if (!userId) return []
    
    return await aiExplanationsService.getUserExplanations(userId)
  }
}