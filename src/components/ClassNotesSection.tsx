'use client'

import React, { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { extractTextFromImage, generateAIExplanation } from '@/services/huggingface'
import { formatDate } from '@/lib/utils'
import { Upload, Image as ImageIcon, Brain, Trash2, Plus, FileText, Loader, X } from 'lucide-react'
import { Subject } from '@/types'
import Image from 'next/image'

export function ClassNotesSection() {
  const { state, dispatch } = useApp()
  const { user } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')

  const filteredNotes = state.selectedSubject
    ? state.classNotes.filter(note => note.subjectId === state.selectedSubject)
    : state.classNotes

  const selectedSubject = state.selectedSubject
    ? state.subjects.find(s => s.id === state.selectedSubject)
    : null

  const handleImageUpload = async (file: File, title: string, subjectId: string) => {
    if (!subjectId) {
      alert('Por favor selecciona una materia antes de subir una imagen.')
      return
    }

    setIsProcessing(true)
    setProcessingStep('Procesando imagen...')

    try {
      // Crear URL temporal para la imagen
      const imageUrl = URL.createObjectURL(file)

      // Extraer texto de la imagen
      setProcessingStep('Extrayendo texto de la imagen...')
      const ocrResult = await extractTextFromImage(file)

      // Generar explicación con IA
      setProcessingStep('Generando explicación con IA...')
      const subject = state.subjects.find(s => s.id === subjectId)
      const aiExplanation = await generateAIExplanation(ocrResult.text, subject?.name, user?.id)

      // Crear la nota
      dispatch({
        type: 'ADD_CLASS_NOTE',
        payload: {
          title,
          content: `Imagen procesada automáticamente\n\nTexto extraído: ${ocrResult.text}`,
          subjectId,
          imageUrl,
          extractedText: ocrResult.text,
          aiExplanation: aiExplanation.explanation
        }
      })

      setShowAddForm(false)
    } catch (error) {
      console.error('Error procesando imagen:', error)
      
      // Mostrar mensaje específico según el tipo de error
      let errorMessage = 'Error al procesar la imagen.'
      
      if (error instanceof Error) {
        if (error.message.includes('No Inference Provider available')) {
          errorMessage = 'Los modelos de OCR no están disponibles actualmente. Esto puede deberse a:\n\n• Los modelos están temporalmente fuera de servicio\n• Se requiere configurar un token de API válido\n• Problemas de conectividad\n\nPor favor, verifica tu configuración en el archivo .env.local y intenta nuevamente.'
        } else if (error.message.includes('No hay modelos OCR disponibles')) {
          errorMessage = 'Ningún modelo de OCR está disponible en este momento. La aplicación usará texto simulado como respaldo.'
        }
      }
      
      alert(errorMessage)
    } finally {
      setIsProcessing(false)
      setProcessingStep('')
    }
  }

  const handleDeleteNote = (noteId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      dispatch({
        type: 'DELETE_CLASS_NOTE',
        payload: noteId
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="text-blue-500" size={24} />
              <span>
                Notas de Clase
                {selectedSubject && ` - ${selectedSubject.name}`}
              </span>
            </CardTitle>
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2"
              disabled={!state.selectedSubject}
            >
              <Plus size={16} />
              <span>Nueva Nota</span>
            </Button>
          </div>
          {!state.selectedSubject && (
            <p className="text-sm text-orange-600">
              💡 Selecciona una materia para crear notas específicas
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Processing Status */}
      {isProcessing && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Loader className="animate-spin text-blue-500" size={20} />
              <span className="text-blue-700">{processingStep}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay notas de clase
            </h3>
            <p className="text-gray-500 mb-4">
              {state.selectedSubject
                ? 'Sube una imagen de tus notas para convertirla en texto y obtener explicaciones con IA.'
                : 'Selecciona una materia y sube una imagen de tus notas.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => {
            const subject = state.subjects.find(s => s.id === note.subjectId)
            
            return (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject?.color }}
                      />
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(new Date(note.createdAt))}
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Image */}
                  {note.imageUrl && (
                    <div className="mb-4">
                      <Image
                        src={note.imageUrl}
                        alt="Nota de clase"
                        width={800}
                        height={600}
                        className="max-w-full h-auto rounded-lg border"
                      />
                    </div>
                  )}

                  {/* Extracted Text */}
                  {note.extractedText && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                        <ImageIcon size={16} />
                        <span>Texto Extraído</span>
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {note.extractedText}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* AI Explanation */}
                  {note.aiExplanation && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                        <Brain size={16} className="text-purple-500" />
                        <span>Explicación con IA</span>
                      </h4>
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {note.aiExplanation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contenido</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add Note Form */}
      {showAddForm && (
        <AddNoteForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleImageUpload}
          selectedSubjectId={state.selectedSubject}
          subjects={state.subjects}
        />
      )}
    </div>
  )
}

// Componente para el formulario de agregar nota
interface AddNoteFormProps {
  onClose: () => void
  onSubmit: (file: File, title: string, subjectId: string) => void
  selectedSubjectId: string | null
  subjects: Subject[]
}

function AddNoteForm({ onClose, onSubmit, selectedSubjectId, subjects }: AddNoteFormProps) {
  const [title, setTitle] = useState('')
  const [subjectId, setSubjectId] = useState(selectedSubjectId || '')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file && title.trim() && subjectId) {
      onSubmit(file, title.trim(), subjectId)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile)
    } else {
      alert('Por favor selecciona un archivo de imagen válido.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Nueva Nota de Clase</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Ecuaciones cuadráticas"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Materia *
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona una materia</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                  required
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600">
                    {file ? file.name : 'Haz clic para subir una imagen'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF hasta 10MB
                  </p>
                </label>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1" disabled={!file || !title.trim() || !subjectId}>
                Procesar Imagen
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}