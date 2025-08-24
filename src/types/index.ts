export interface Subject {
  id: string
  name: string
  color: string
  createdAt: Date
}

export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  subjectId?: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ClassNote {
  id: string
  title: string
  content: string
  subjectId: string
  imageUrl?: string
  extractedText?: string
  aiExplanation?: string
  createdAt: Date
  updatedAt: Date
}

export interface OCRResult {
  text: string
  confidence: number
}

export interface AIExplanation {
  explanation: string
  concepts: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}