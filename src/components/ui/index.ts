// Exportaciones centralizadas de componentes UI

// Componentes básicos
export * from './Button'
export * from './Input'
export * from './Card'
export * from './Modal'

// Re-exportar componentes específicos para facilitar importaciones
export {
  Button,
  IconButton,
  LoadingButton,
  buttonVariants
} from './Button'

export {
  Input,
  TextArea,
  SearchInput,
  PasswordInput,
  inputVariants,
  useInputState
} from './Input'

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardActions,
  useCardHover
} from './Card'

export {
  Modal,
  ConfirmModal,
  FormModal,
  useModal
} from './Modal'

// Tipos útiles
export type {
  ButtonProps,
  IconButtonProps,
  LoadingButtonProps
} from './Button'

export type {
  InputProps,
  TextAreaProps,
  SearchInputProps,
  PasswordInputProps
} from './Input'

export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
  CardActionsProps
} from './Card'

export type {
  ModalProps,
  ConfirmModalProps,
  FormModalProps
} from './Modal'