import { useApp } from '@/contexts/AppContext'
import { Todo, Subject, ClassNote } from '@/types'

// Hook que agrupa todas las acciones relacionadas con todos
export function useTodoActions() {
  const { addTodo, updateTodo, deleteTodo } = useApp()
  
  return {
    addTodo,
    updateTodo,
    deleteTodo,
    // Acción compuesta para marcar como completado
    toggleTodoComplete: (id: string, completed: boolean) => {
      updateTodo(id, { completed })
    },
    // Acción compuesta para actualizar prioridad
    updateTodoPriority: (id: string, priority: Todo['priority']) => {
      updateTodo(id, { priority })
    },
    // Acción compuesta para actualizar fecha de vencimiento
    updateTodoDueDate: (id: string, dueDate: string | null) => {
      updateTodo(id, { dueDate })
    }
  }
}

// Hook que agrupa todas las acciones relacionadas con materias
export function useSubjectActions() {
  const { addSubject, updateSubject, deleteSubject, setSelectedSubject } = useApp()
  
  return {
    addSubject,
    updateSubject,
    deleteSubject,
    setSelectedSubject,
    // Acción compuesta para crear materia y seleccionarla
    addAndSelectSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => {
      const newSubject = {
        ...subject,
        id: `subject_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
      addSubject(subject)
      setSelectedSubject(newSubject.id)
      return newSubject.id
    }
  }
}

// Hook que agrupa todas las acciones relacionadas con notas de clase
export function useClassNoteActions() {
  const { addClassNote, updateClassNote, deleteClassNote } = useApp()
  
  return {
    addClassNote,
    updateClassNote,
    deleteClassNote,
    // Acción compuesta para actualizar contenido de nota
    updateNoteContent: (id: string, content: string) => {
      updateClassNote(id, { content })
    },
    // Acción compuesta para actualizar título de nota
    updateNoteTitle: (id: string, title: string) => {
      updateClassNote(id, { title })
    }
  }
}

// Hook que agrupa todas las acciones de la aplicación
export function useAppActions() {
  const todoActions = useTodoActions()
  const subjectActions = useSubjectActions()
  const noteActions = useClassNoteActions()
  
  return {
    todos: todoActions,
    subjects: subjectActions,
    notes: noteActions
  }
}