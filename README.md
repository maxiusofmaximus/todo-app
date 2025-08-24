# 📚 Lista de Tareas Académicas

Una aplicación web moderna para gestionar tareas académicas por materias, con funcionalidades avanzadas de OCR (Reconocimiento Óptico de Caracteres) e Inteligencia Artificial para convertir imágenes de notas en texto y generar explicaciones automáticas.

## ✨ Características Principales

### 🎯 Gestión de Tareas
- **Organización por Materias**: Crea y gestiona materias con colores personalizados
- **Prioridades**: Asigna niveles de prioridad (Alta, Media, Baja) a tus tareas
- **Fechas de Vencimiento**: Programa tus tareas con fechas límite
- **Estados**: Marca tareas como completadas o pendientes
- **Filtrado Inteligente**: Visualiza tareas por materia específica

### 📝 Notas de Clase con IA
- **OCR Avanzado**: Convierte imágenes de tus notas manuscritas o impresas en texto
- **Explicaciones con IA**: Genera explicaciones automáticas de conceptos y ecuaciones
- **Procesamiento de Imágenes**: Sube fotos de pizarrones, libros o cuadernos
- **Organización por Materia**: Asocia notas específicas a cada materia

### 🎨 Interfaz Moderna
- **Diseño Responsivo**: Funciona perfectamente en desktop, tablet y móvil
- **Tema Moderno**: Interfaz limpia y profesional con Tailwind CSS
- **Navegación Intuitiva**: Tabs para alternar entre tareas y notas
- **Estadísticas en Tiempo Real**: Panel lateral con métricas de progreso

## 🚀 Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Framework de CSS utilitario
- **Lucide React** - Iconos modernos y consistentes

### Backend & APIs
- **Hugging Face API** - Modelos de IA para OCR y explicaciones
  - `microsoft/trocr-base-printed` - OCR para texto impreso
  - `microsoft/DialoGPT-medium` - Generación de explicaciones

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Git** - Control de versiones

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/maxiusofmaximus/todo-app.git
   cd todo-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Edita `.env.local` y agrega tu token de Hugging Face:
   ```env
   NEXT_PUBLIC_HUGGINGFACE_API_KEY=tu_token_aqui
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   Visita [http://localhost:3000](http://localhost:3000)

## 🔧 Configuración de Hugging Face

1. Crea una cuenta en [Hugging Face](https://huggingface.co/)
2. Ve a tu perfil → Settings → Access Tokens
3. Crea un nuevo token con permisos de lectura
4. Agrega el token a tu archivo `.env.local`

## 📱 Uso de la Aplicación

### Gestión de Materias
1. Haz clic en "Agregar Materia" en el selector superior
2. Ingresa el nombre y selecciona un color
3. La materia aparecerá en el selector para filtrar tareas

### Crear Tareas
1. Selecciona una materia (opcional)
2. Haz clic en "Nueva Tarea"
3. Completa el formulario con título, descripción, prioridad y fecha
4. La tarea aparecerá en la lista correspondiente

### Subir Notas con OCR
1. Ve a la pestaña "Notas de Clase"
2. Selecciona una materia
3. Haz clic en "Nueva Nota"
4. Sube una imagen de tus notas
5. La aplicación extraerá el texto y generará explicaciones automáticamente

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI reutilizables
│   │   ├── Button.tsx    # Componente de botón
│   │   └── Card.tsx      # Componente de tarjeta
│   ├── AddTodoForm.tsx   # Formulario para agregar tareas
│   ├── ClassNotesSection.tsx # Sección de notas con OCR
│   ├── SubjectSelector.tsx   # Selector de materias
│   ├── TodoApp.tsx       # Componente principal
│   └── TodoList.tsx      # Lista de tareas
├── contexts/             # Contextos de React
│   └── AppContext.tsx    # Estado global de la aplicación
├── lib/                  # Utilidades
│   └── utils.ts          # Funciones auxiliares
├── services/             # Servicios externos
│   └── huggingface.ts    # Integración con Hugging Face
└── types/                # Definiciones de TypeScript
    └── index.ts          # Interfaces y tipos
```

## 🔄 Estado de la Aplicación

La aplicación utiliza React Context para manejar el estado global:

- **Tareas**: Lista de todas las tareas con sus propiedades
- **Materias**: Materias disponibles con colores personalizados
- **Notas**: Notas de clase con texto extraído y explicaciones IA
- **Selección**: Materia actualmente seleccionada para filtrado

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. El despliegue se realizará automáticamente

### Otros Proveedores
- **Netlify**: Compatible con builds estáticos
- **Railway**: Para despliegues con backend
- **Heroku**: Usando buildpacks de Node.js

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa los [Issues existentes](https://github.com/maxiusofmaximus/todo-app/issues)
2. Crea un nuevo Issue si no encuentras solución
3. Proporciona detalles sobre tu entorno y el problema

## 🔮 Roadmap

- [ ] Autenticación de usuarios
- [ ] Sincronización en la nube
- [ ] Notificaciones push
- [ ] Exportación de datos
- [ ] Modo offline
- [ ] Integración con calendarios
- [ ] Análisis de productividad
- [ ] Soporte para más idiomas

## 👨‍💻 Autor

**maxiusofmaximus**
- GitHub: [@maxiusofmaximus](https://github.com/maxiusofmaximus)

---

⭐ ¡No olvides dar una estrella al proyecto si te resulta útil!
