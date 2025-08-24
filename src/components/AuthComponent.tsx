'use client'

import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, PasswordInput } from '@/components/ui'
import { LogIn, LogOut, UserPlus, User, Eye, EyeOff } from 'lucide-react'

export function AuthComponent() {
  const { user, loading, signIn, signUp, signOut } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password)

      if (error) {
        setError(error.message)
      } else if (isSignUp) {
        setError('Revisa tu email para confirmar tu cuenta')
      }
    } catch (_) {
      setError('Error inesperado. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto" variant="secondary">
        <CardContent size="lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto" variant="success">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User size={20} />
            <span>Bienvenido</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
              leftIcon={<LogOut size={16} />}
            >
              Cerrar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto" variant="default">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
          <span>{isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {error && (
            <Card variant="error" size="sm">
              <CardContent size="sm">
                <p className="text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

          <Button 
            type="submit" 
            loading={isSubmitting}
            loadingText={isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...'}
            className="w-full"
            leftIcon={isSignUp ? <UserPlus size={16} /> : <LogIn size={16} />}
          >
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-sm"
            >
              {isSignUp 
                ? '¿Ya tienes cuenta? Inicia sesión' 
                : '¿No tienes cuenta? Créala aquí'
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}