// Componente Input reutilizable

import React from 'react'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'

// Variantes del componente Input
const inputVariants = cva(
  'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-red-500 focus-visible:ring-red-500 dark:border-red-400 dark:focus-visible:ring-red-400',
        success: 'border-green-500 focus-visible:ring-green-500 dark:border-green-400 dark:focus-visible:ring-green-400',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500 dark:border-yellow-400 dark:focus-visible:ring-yellow-400'
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
  helperText?: string
  label?: string
  required?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    type = 'text',
    leftIcon,
    rightIcon,
    error,
    helperText,
    label,
    required,
    id,
    ...props 
  }, ref) => {
    const inputId = id || React.useId()
    const errorId = `${inputId}-error`
    const helperTextId = `${inputId}-helper`
    
    const hasError = Boolean(error)
    const finalVariant = hasError ? 'error' : variant

    const inputElement = (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ variant: finalVariant, size, className }),
            leftIcon && 'pl-10',
            rightIcon && 'pr-10'
          )}
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={cn(
            error && errorId,
            helperText && helperTextId
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
    )

    if (label) {
      return (
        <div className="space-y-2">
          <label 
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {inputElement}
          {error && (
            <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p id={helperTextId} className="text-sm text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      )
    }

    return (
      <div>
        {inputElement}
        {error && (
          <p id={errorId} className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperTextId} className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// Componente TextArea
export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputVariants> {
  error?: string
  helperText?: string
  label?: string
  required?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ 
    className, 
    variant, 
    size,
    error,
    helperText,
    label,
    required,
    resize = 'vertical',
    id,
    ...props 
  }, ref) => {
    const textareaId = id || React.useId()
    const errorId = `${textareaId}-error`
    const helperTextId = `${textareaId}-helper`
    
    const hasError = Boolean(error)
    const finalVariant = hasError ? 'error' : variant

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    }

    const textareaElement = (
      <textarea
        className={cn(
          inputVariants({ variant: finalVariant, size }),
          resizeClasses[resize],
          'min-h-[80px]',
          className
        )}
        ref={ref}
        id={textareaId}
        aria-invalid={hasError}
        aria-describedby={cn(
          error && errorId,
          helperText && helperTextId
        )}
        {...props}
      />
    )

    if (label) {
      return (
        <div className="space-y-2">
          <label 
            htmlFor={textareaId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {textareaElement}
          {error && (
            <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p id={helperTextId} className="text-sm text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      )
    }

    return (
      <div>
        {textareaElement}
        {error && (
          <p id={errorId} className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperTextId} className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
TextArea.displayName = 'TextArea'

// Componente SearchInput
export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
  onClear?: () => void
  showClearButton?: boolean
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, showClearButton = true, value, ...props }, ref) => {
    const hasValue = Boolean(value)

    const searchIcon = (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    )

    const clearIcon = showClearButton && hasValue && onClear && (
      <button
        type="button"
        onClick={onClear}
        className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label="Limpiar búsqueda"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    )

    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={searchIcon}
        rightIcon={clearIcon}
        value={value}
        {...props}
      />
    )
  }
)
SearchInput.displayName = 'SearchInput'

// Componente PasswordInput
export interface PasswordInputProps extends Omit<InputProps, 'rightIcon' | 'type'> {
  showPasswordToggle?: boolean
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showPasswordToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePassword = () => setShowPassword(!showPassword)

    const toggleIcon = showPasswordToggle && (
      <button
        type="button"
        onClick={togglePassword}
        className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {showPassword ? (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
            />
          </svg>
        ) : (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    )

    return (
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        rightIcon={toggleIcon}
        {...props}
      />
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

// Hook para manejar estado de input
export function useInputState(initialValue = '') {
  const [value, setValue] = React.useState(initialValue)
  const [error, setError] = React.useState<string | undefined>()
  const [touched, setTouched] = React.useState(false)

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value)
    if (error) setError(undefined)
  }, [error])

  const handleBlur = React.useCallback(() => {
    setTouched(true)
  }, [])

  const reset = React.useCallback(() => {
    setValue(initialValue)
    setError(undefined)
    setTouched(false)
  }, [initialValue])

  const validate = React.useCallback((validator: (value: string) => string | undefined) => {
    const validationError = validator(value)
    setError(validationError)
    return !validationError
  }, [value])

  return {
    value,
    error,
    touched,
    setValue,
    setError,
    setTouched,
    handleChange,
    handleBlur,
    reset,
    validate,
    isValid: !error,
    isEmpty: value.trim() === ''
  }
}

// Exportar todos los componentes
export {
  Input,
  TextArea,
  SearchInput,
  PasswordInput,
  inputVariants
}