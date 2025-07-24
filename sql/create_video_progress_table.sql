-- Crear tabla para trackear el progreso de videos por usuario
CREATE TABLE IF NOT EXISTS video_progress (
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

-- Habilitar RLS
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean su propio progreso
CREATE POLICY "Users can view own video progress" ON video_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios puedan insertar su propio progreso
CREATE POLICY "Users can insert own video progress" ON video_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios puedan actualizar su propio progreso
CREATE POLICY "Users can update own video progress" ON video_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_video_progress_user_id ON video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_video_url ON video_progress(video_url);
CREATE INDEX IF NOT EXISTS idx_video_progress_last_watched ON video_progress(last_watched_at DESC);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_video_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_video_progress_updated_at
    BEFORE UPDATE ON video_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_video_progress_updated_at();
