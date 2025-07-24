-- Insertar videos de ejemplo en la tabla video_progress para testing
-- Nota: Estos son solo para pruebas, en producción el progreso se crea automáticamente

-- Primero, verificar que la tabla existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'video_progress') THEN
        RAISE EXCEPTION 'La tabla video_progress no existe. Ejecuta create_video_progress_table.sql primero.';
    END IF;
END $$;

-- Insertar algunos registros de ejemplo para testing (opcional)
-- Estos se pueden usar para probar la funcionalidad sin necesidad de usuarios reales

-- Video 1: Detrás de Escenas
INSERT INTO video_progress (
    user_id,
    video_url,
    video_title,
    current_time,
    duration,
    completed,
    last_watched_at,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Usuario de prueba
    'https://your-supabase-url/storage/v1/object/public/product-images/productos/2025-06-22%2021-07-11.mkv',
    'Detrás de Escenas: Cómo Creamos GeekWear',
    120, -- 2 minutos vistos
    300, -- 5 minutos de duración total
    false,
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (user_id, video_url) DO NOTHING;

-- Video 2: Showcase de Productos
INSERT INTO video_progress (
    user_id,
    video_url,
    video_title,
    current_time,
    duration,
    completed,
    last_watched_at,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Usuario de prueba
    'https://your-supabase-url/storage/v1/object/public/product-images/productos/2025-06-22%2021-10-14.mkv',
    'Showcase de Productos: Lo Mejor de GeekWear 2024',
    450, -- 7.5 minutos vistos (completado)
    450, -- 7.5 minutos de duración total
    true,
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (user_id, video_url) DO NOTHING;

-- Verificar que los datos se insertaron correctamente
SELECT 
    video_title,
    current_time,
    duration,
    completed,
    ROUND((current_time::numeric / duration::numeric) * 100, 2) as progress_percentage
FROM video_progress 
WHERE user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY created_at DESC;

-- Mostrar estadísticas de la tabla
SELECT 
    COUNT(*) as total_records,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(CASE WHEN completed = true THEN 1 END) as completed_videos,
    COUNT(CASE WHEN current_time > 0 AND completed = false THEN 1 END) as in_progress_videos
FROM video_progress;
