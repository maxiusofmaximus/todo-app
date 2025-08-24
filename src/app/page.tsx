'use client'

import { AppProvider } from '@/contexts/AppContext'
import { TodoApp } from '@/components/TodoApp'

export default function Home() {
  return (
    <AppProvider>
      <TodoApp />
    </AppProvider>
  )
}
