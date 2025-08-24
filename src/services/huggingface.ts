import { HfInference } from '@huggingface/inference'
import { OCRResult, AIExplanation } from '@/types'
import { aiCacheService } from '../../services/aiCacheService.ts'

// Nota: En producción, esta API key debe estar en variables de entorno
const HF_TOKEN = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN || 'hf_demo_token'

const hf = new HfInference(HF_TOKEN)

export async function extractTextFromImage(imageFile: File): Promise<OCRResult> {
  try {
    // Intentar con diferentes modelos OCR disponibles
    let result
    
    try {
      // Primer intento: TrOCR large para texto impreso
      result = await hf.imageToText({
        data: imageFile,
        model: 'microsoft/trocr-large-printed'
      })
    } catch (error1) {
      console.log('Modelo trocr-large-printed no disponible, intentando alternativa...')
      
      try {
        // Segundo intento: TrOCR base para texto manuscrito
        result = await hf.imageToText({
          data: imageFile,
          model: 'microsoft/trocr-base-handwritten'
        })
      } catch (error2) {
        console.log('Modelo trocr-base-handwritten no disponible, intentando alternativa...')
        
        try {
          // Tercer intento: Modelo genérico de visión
          result = await hf.imageToText({
            data: imageFile,
            model: 'nlpconnect/vit-gpt2-image-captioning'
          })
        } catch (error3) {
          console.log('Todos los modelos OCR fallaron, usando simulación')
          throw new Error('No hay modelos OCR disponibles')
        }
      }
    }

    return {
      text: result.generated_text || '',
      confidence: 0.85 // Valor estimado ya que los modelos no proporcionan confidence
    }
  } catch (error) {
    console.error('Error en OCR:', error)
    // Fallback: usar un servicio de OCR simulado
    return await simulateOCR(imageFile)
  }
}

export async function generateAIExplanation(text: string, subject?: string, userId?: string): Promise<AIExplanation> {
  try {
    // Check cache first if user is provided
    if (userId) {
      const cachedExplanation = await aiCacheService.getCachedExplanation(userId, text)
      if (cachedExplanation) {
        console.log('Using cached explanation for user:', userId)
        return {
          explanation: cachedExplanation.explanation,
          concepts: extractConcepts(text),
          difficulty: determineDifficulty(text)
        }
      }
    }

    const prompt = `Como un profesor experto en ${subject || 'educación'}, explica de manera clara y didáctica el siguiente contenido:

"${text}"

Proporciona:
1. Una explicación detallada
2. Conceptos clave involucrados
3. Nivel de dificultad

Respuesta:`

    const result = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        return_full_text: false
      }
    })

    // Procesar la respuesta para extraer información estructurada
    const explanation = result.generated_text || 'No se pudo generar una explicación.'
    
    // Save to cache if user is provided
    if (userId && explanation !== 'No se pudo generar una explicación.') {
      await aiCacheService.saveExplanation(userId, text, explanation)
      console.log('Explanation saved to cache for user:', userId)
    }
    
    return {
      explanation,
      concepts: extractConcepts(text),
      difficulty: determineDifficulty(text)
    }
  } catch (error) {
    console.error('Error generando explicación IA:', error)
    return {
      explanation: 'No se pudo generar una explicación automática. Por favor, intenta nuevamente más tarde.',
      concepts: extractConcepts(text),
      difficulty: 'intermediate'
    }
  }
}

// Función auxiliar para convertir archivo a base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// Función de OCR simulada como fallback
async function simulateOCR(_imageFile: File): Promise<OCRResult> {
  // Simular procesamiento
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return {
    text: 'Los modelos de OCR no están disponibles actualmente en Hugging Face. Esto puede deberse a:\n\n1. Los modelos están temporalmente fuera de servicio\n2. Se requiere un token de API válido\n3. Los modelos han sido movidos o renombrados\n\nPor favor, intenta nuevamente más tarde o verifica tu configuración de API.',
    confidence: 0.0
  }
}

// Extraer conceptos clave del texto
function extractConcepts(text: string): string[] {
  const mathKeywords = ['ecuación', 'función', 'derivada', 'integral', 'límite', 'matriz', 'vector']
  const physicsKeywords = ['fuerza', 'energía', 'velocidad', 'aceleración', 'masa', 'momento']
  const chemistryKeywords = ['átomo', 'molécula', 'reacción', 'enlace', 'ion', 'pH', 'concentración']
  
  const allKeywords = [...mathKeywords, ...physicsKeywords, ...chemistryKeywords]
  const lowerText = text.toLowerCase()
  
  return allKeywords.filter(keyword => lowerText.includes(keyword))
}

// Determinar dificultad basada en el contenido
function determineDifficulty(text: string): 'beginner' | 'intermediate' | 'advanced' {
  const advancedKeywords = ['derivada', 'integral', 'límite', 'transformada', 'ecuación diferencial']
  const intermediateKeywords = ['función', 'ecuación', 'sistema', 'matriz']
  
  const lowerText = text.toLowerCase()
  
  if (advancedKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'advanced'
  } else if (intermediateKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'intermediate'
  } else {
    return 'beginner'
  }
}