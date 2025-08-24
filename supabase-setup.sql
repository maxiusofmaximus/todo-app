-- Configuración de tablas para Learning BOT
-- Ejecuta este script en el SQL Editor de Supabase

-- Nota: La configuración JWT se maneja automáticamente por Supabase

-- Crear tabla para explicaciones de IA
CREATE TABLE IF NOT EXISTS ai_explanations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    text_hash VARCHAR(64) NOT NULL,
    original_text TEXT NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_ai_explanations_user_id ON ai_explanations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_explanations_text_hash ON ai_explanations(text_hash);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_explanations_user_text ON ai_explanations(user_id, text_hash);

-- Habilitar Row Level Security
ALTER TABLE ai_explanations ENABLE ROW LEVEL SECURITY;

-- Política de seguridad: los usuarios solo pueden ver sus propias explicaciones
CREATE POLICY "Users can view own explanations" ON ai_explanations
    FOR SELECT USING (auth.uid() = user_id);

-- Política de seguridad: los usuarios solo pueden insertar sus propias explicaciones
CREATE POLICY "Users can insert own explanations" ON ai_explanations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política de seguridad: los usuarios solo pueden actualizar sus propias explicaciones
CREATE POLICY "Users can update own explanations" ON ai_explanations
    FOR UPDATE USING (auth.uid() = user_id);

-- Política de seguridad: los usuarios solo pueden eliminar sus propias explicaciones
CREATE POLICY "Users can delete own explanations" ON ai_explanations
    FOR DELETE USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_ai_explanations_updated_at
    BEFORE UPDATE ON ai_explanations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Crear tabla de perfiles de usuario (opcional, para información adicional)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255),
    full_name VARCHAR(255),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security para perfiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para perfiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger para actualizar perfiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Comentarios para documentación
COMMENT ON TABLE ai_explanations IS 'Almacena las explicaciones de IA generadas para evitar llamadas duplicadas a la API';
COMMENT ON COLUMN ai_explanations.text_hash IS 'Hash SHA256 del texto original para identificación única';
COMMENT ON COLUMN ai_explanations.original_text IS 'Texto original extraído de la imagen o ingresado por el usuario';
COMMENT ON COLUMN ai_explanations.explanation IS 'Explicación generada por la IA de Hugging Face';

COMMENT ON TABLE user_profiles IS 'Perfiles de usuario con información adicional';