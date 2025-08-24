import crypto from 'crypto'
import { aiExplanationsService } from '../lib/supabase'

// Generate a hash for the text to use as cache key
function generateTextHash(text) {
  return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex')
}

export const aiCacheService = {
  // Check if explanation exists in cache
  async getCachedExplanation(userId, text) {
    if (!userId || !text) return null
    
    const textHash = generateTextHash(text)
    return await aiExplanationsService.getCachedExplanation(userId, textHash)
  },

  // Save explanation to cache
  async saveExplanation(userId, text, explanation) {
    if (!userId || !text || !explanation) return null
    
    const textHash = generateTextHash(text)
    return await aiExplanationsService.saveExplanation(userId, textHash, text, explanation)
  },

  // Get all cached explanations for a user
  async getUserExplanations(userId) {
    if (!userId) return []
    
    return await aiExplanationsService.getUserExplanations(userId)
  }
}