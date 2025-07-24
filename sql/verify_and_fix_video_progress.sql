-- Script para verificar y reparar la tabla video_progress

-- 1. Verificar si la tabla existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'video_progress') THEN
        RAISE NOTICE 'La tabla video_progress NO existe. Creándola...';
        
        -- Crear la tabla
        CREATE TABLE video_progress (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            video_url TEXT NOT NULL,
            video_title TEXT NOT NULL,
            current_time NUMERIC DEFAULT 0,
            duration NUMERIC DEFAULT 0,
            completed BOOLEAN DEFAULT FALSE,
            last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, video_url)
        );
        
        RAISE NOTICE 'Tabla video_progress creada exitosamente.';
    ELSE
        RAISE NOTICE 'La tabla video_progress ya existe.';
    END IF;
END $$;

-- 2. Verificar y habilitar RLS
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'video_progress' 
        AND n.nspname = 'public'
        AND c.relrowsecurity = true
    ) THEN
        RAISE NOTICE 'Habilitando RLS en video_progress...';
        ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;
    ELSE
        RAISE NOTICE 'RLS ya está habilitado en video_progress.';
    END IF;
END $$;

-- 3. Crear políticas si no existen
DO $$
BEGIN
    -- Política de SELECT
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'video_progress' 
        AND policyname = 'Users can view own video progress'
    ) THEN
        CREATE POLICY "Users can view own video progress" ON video_progress
            FOR SELECT USING (auth.uid() = user_id);
        RAISE NOTICE 'Política SELECT creada.';
    END IF;

    -- Política de INSERT
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'video_progress' 
        AND policyname = 'Users can insert own video progress'
    ) THEN
        CREATE POLICY "Users can insert own video progress" ON video_progress
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        RAISE NOTICE 'Política INSERT creada.';
    END IF;

    -- Política de UPDATE
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'video_progress' 
        AND policyname = 'Users can update own video progress'
    ) THEN
        CREATE POLICY "Users can update own video progress" ON video_progress
            FOR UPDATE USING (auth.uid() = user_id);
        RAISE NOTICE 'Política UPDATE creada.';
    END IF;
END $$;

-- 4. Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_video_progress_user_id ON video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_video_url ON video_progress(video_url);
CREATE INDEX IF NOT EXISTS idx_video_progress_last_watched ON video_progress(last_watched_at DESC);

-- 5. Crear función y trigger para updated_at
CREATE OR REPLACE FUNCTION update_video_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eliminar trigger existente si existe y crear uno nuevo
DROP TRIGGER IF EXISTS update_video_progress_updated_at ON video_progress;
CREATE TRIGGER update_video_progress_updated_at
    BEFORE UPDATE ON video_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_video_progress_updated_at();

-- 6. Verificar la estructura final
SELECT 
    'Tabla creada correctamente' as status,
    COUNT(*) as total_columns
FROM information_schema.columns 
WHERE table_name = 'video_progress';

-- 7. Mostrar políticas activas
SELECT 
    'Políticas RLS:' as info,
    policyname,
    cmd as command
FROM pg_policies 
WHERE tablename = 'video_progress';

-- 8. Mostrar índices
SELECT 
    'Índices:' as info,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'video_progress';

RAISE NOTICE 'Verificación y reparación de video_progress completada.';
