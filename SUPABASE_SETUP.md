# Configuración de Supabase para Learning BOT

Esta guía te ayudará a configurar Supabase para el sistema de cache de explicaciones de IA y autenticación de usuarios.

## 1. Crear Proyecto en Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Haz clic en "New Project"
3. Selecciona tu organización
4. Ingresa los detalles del proyecto:
   - **Name**: `learning-bot` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura
   - **Region**: Selecciona la región más cercana a tus usuarios
5. Haz clic en "Create new project"

## 2. Obtener Variables de Entorno

1. Una vez creado el proyecto, ve a **Settings** > **API**
2. Copia las siguientes variables:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Key (anon public)**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Actualiza tu archivo `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_publica
```

## 3. Configurar Base de Datos

1. Ve a **SQL Editor** en el dashboard de Supabase
2. Copia y pega el contenido del archivo `supabase-setup.sql`
3. Haz clic en "Run" para ejecutar el script

Este script creará:
- Tabla `ai_explanations` para cache de explicaciones de IA
- Tabla `user_profiles` para información adicional de usuarios
- Políticas de seguridad (Row Level Security)
- Índices para optimizar consultas
- Triggers automáticos

## 4. Configurar Autenticación

1. Ve a **Authentication** > **Settings**
2. En **Site URL**, agrega:
   - Para desarrollo: `http://localhost:3000`
   - Para producción: tu dominio de Vercel

3. En **Auth Providers**, asegúrate de que **Email** esté habilitado

4. (Opcional) Configura proveedores adicionales como Google, GitHub, etc.

## 5. Configurar Políticas de Seguridad

Las políticas ya están incluidas en el script SQL, pero puedes verificarlas en:
**Authentication** > **Policies**

Las políticas configuradas aseguran que:
- Los usuarios solo pueden ver sus propias explicaciones
- Los usuarios solo pueden crear/editar/eliminar sus propios datos
- Se mantiene la privacidad entre usuarios

## 6. Verificar Configuración

1. Ejecuta tu aplicación: `npm run dev`
2. Intenta registrar un nuevo usuario
3. Sube una imagen y verifica que se genere una explicación
4. Recarga la página y verifica que la explicación se cargue desde cache

## 7. Monitoreo y Logs

Puedes monitorear el uso de tu base de datos en:
- **Database** > **Tables**: Ver datos almacenados
- **Logs** > **Database**: Ver consultas ejecutadas
- **Settings** > **Usage**: Ver estadísticas de uso

## Estructura de Datos

### Tabla `ai_explanations`
```sql
id              UUID (Primary Key)
user_id         UUID (Foreign Key a auth.users)
text_hash       VARCHAR(64) (Hash SHA256 del texto)
original_text   TEXT (Texto original)
explanation     TEXT (Explicación de IA)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabla `user_profiles`
```sql
id              UUID (Primary Key, Foreign Key a auth.users)
email           VARCHAR(255)
full_name       VARCHAR(255)
avatar_url      VARCHAR(255)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## Beneficios del Cache

1. **Ahorro de Créditos**: Evita llamadas duplicadas a Hugging Face API
2. **Velocidad**: Las explicaciones cached se cargan instantáneamente
3. **Experiencia de Usuario**: Respuestas más rápidas y consistentes
4. **Escalabilidad**: Reduce la carga en APIs externas

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Verifica que las variables estén correctamente configuradas en `.env`
- Reinicia el servidor de desarrollo después de cambiar variables

### Error de autenticación
- Verifica que la Site URL esté configurada correctamente
- Asegúrate de que las políticas RLS estén habilitadas

### Explicaciones no se guardan en cache
- Verifica que el usuario esté autenticado
- Revisa los logs de Supabase para errores de inserción
- Confirma que las políticas de seguridad permitan la inserción

## Próximos Pasos

1. Configurar backup automático de la base de datos
2. Implementar analytics de uso de explicaciones
3. Agregar funcionalidad de favoritos/bookmarks
4. Implementar compartir explicaciones entre usuarios (opcional)