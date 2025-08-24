import React from 'react'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'

// Variantes del componente Card
const cardVariants = cva(
  'rounded-lg border transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        secondary: 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700',
        outline: 'border-2 border-dashed border-gray-300 dark:border-gray-600 bg-transparent',
        ghost: 'border-transparent bg-transparent',
        success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8'
      },
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl'
      },
      hover: {
        none: '',
        lift: 'hover:shadow-lg hover:-translate-y-1',
        glow: 'hover:shadow-lg hover:shadow-blue-500/25',
        scale: 'hover:scale-105'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shadow: 'sm',
      hover: 'none'
    }
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, shadow, hover, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'div'
    
    if (asChild) {
      return <React.Fragment {...props} />
    }

    return (
      <Comp
        className={cn(cardVariants({ variant, size, shadow, hover, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

// Componente CardHeader
const cardHeaderVariants = cva(
  'flex flex-col space-y-1.5',
  {
    variants: {
      size: {
        sm: 'p-3 pb-2',
        md: 'p-4 pb-3',
        lg: 'p-6 pb-4',
        xl: 'p-8 pb-6'
      },
      border: {
        none: '',
        bottom: 'border-b border-gray-200 dark:border-gray-700'
      }
    },
    defaultVariants: {
      size: 'md',
      border: 'none'
    }
  }
)

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, size, border, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardHeaderVariants({ size, border, className }))}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

// Componente CardTitle
const cardTitleVariants = cva(
  'font-semibold leading-none tracking-tight',
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl'
      }
    },
    defaultVariants: {
      size: 'lg'
    }
  }
)

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof cardTitleVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size, as: Comp = 'h3', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(
        cardTitleVariants({ size, className }),
        'text-gray-900 dark:text-gray-100'
      )}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

// Componente CardDescription
const cardDescriptionVariants = cva(
  'text-gray-600 dark:text-gray-400',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
      }
    },
    defaultVariants: {
      size: 'sm'
    }
  }
)

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof cardDescriptionVariants> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, size, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(cardDescriptionVariants({ size, className }))}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

// Componente CardContent
const cardContentVariants = cva(
  '',
  {
    variants: {
      size: {
        sm: 'p-3 pt-0',
        md: 'p-4 pt-0',
        lg: 'p-6 pt-0',
        xl: 'p-8 pt-0'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
)

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardContentVariants({ size, className }))}
      {...props}
    />
  )
)
CardContent.displayName = 'CardContent'

// Componente CardFooter
const cardFooterVariants = cva(
  'flex items-center',
  {
    variants: {
      size: {
        sm: 'p-3 pt-0',
        md: 'p-4 pt-0',
        lg: 'p-6 pt-0',
        xl: 'p-8 pt-0'
      },
      border: {
        none: '',
        top: 'border-t border-gray-200 dark:border-gray-700 pt-4'
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around'
      }
    },
    defaultVariants: {
      size: 'md',
      border: 'none',
      justify: 'start'
    }
  }
)

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, size, border, justify, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFooterVariants({ size, border, justify, className }))}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

// Componente CardActions (para botones)
export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right'
  spacing?: 'sm' | 'md' | 'lg'
}

const CardActions = React.forwardRef<HTMLDivElement, CardActionsProps>(
  ({ className, align = 'right', spacing = 'md', children, ...props }, ref) => {
    const alignClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end'
    }

    const spacingClasses = {
      sm: 'space-x-2',
      md: 'space-x-3',
      lg: 'space-x-4'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          alignClasses[align],
          spacingClasses[spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardActions.displayName = 'CardActions'

// Hook para manejar estado de hover de la card
export function useCardHover() {
  const [isHovered, setIsHovered] = React.useState(false)

  const handleMouseEnter = React.useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = React.useCallback(() => setIsHovered(false), [])

  return {
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
    hoverProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    }
  }
}

// Exportar todos los componentes
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardActions
}