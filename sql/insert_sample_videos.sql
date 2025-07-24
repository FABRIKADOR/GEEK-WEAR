-- Insertar datos de ejemplo para testing de videos
-- Nota: Estos son solo para pruebas, reemplaza con tus URLs reales

-- Primero, vamos a verificar si hay usuarios en el sistema
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    -- Intentar obtener un usuario existente
    SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
    
    -- Si hay un usuario, insertar algunos datos de progreso de ejemplo
    IF sample_user_id IS NOT NULL THEN
        -- Video 1: Parcialmente visto
        INSERT INTO video_progress (
            user_id,
            video_url,
            video_title,
            current_time,
            duration,
            completed,
            last_watched_at
        ) VALUES (
            sample_user_id,
            'https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/productos/2025-06-22%2021-07-11.mkv',
            'Detrás de Escenas: Cómo Creamos GeekWear',
            120, -- 2 minutos vistos
            300, -- 5 minutos total
            false,
            NOW() - INTERVAL '1 day'
        ) ON CONFLICT (user_id, video_url) DO NOTHING;

        -- Video 2: Completado
        INSERT INTO video_progress (
            user_id,
            video_url,
            video_title,
            current_time,
            duration,
            completed,
            last_watched_at
        ) VALUES (
            sample_user_id,
            'https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/productos/2025-06-22%2021-10-14.mkv',
            'Showcase de Productos: Lo Mejor de GeekWear 2024',
            180, -- 3 minutos (completado)
            180, -- 3 minutos total
            true,
            NOW() - INTERVAL '2 hours'
        ) ON CONFLICT (user_id, video_url) DO NOTHING;

        RAISE NOTICE 'Datos de ejemplo insertados para el usuario: %', sample_user_id;
    ELSE
        RAISE NOTICE 'No hay usuarios en el sistema. Los datos de ejemplo se insertarán cuando haya usuarios registrados.';
    END IF;
END $$;

-- Función para insertar progreso de ejemplo para cualquier usuario nuevo
CREATE OR REPLACE FUNCTION insert_sample_video_progress_for_user(target_user_id UUID)
RETURNS void AS $$
BEGIN
    -- Video 1: No visto
    INSERT INTO video_progress (
        user_id,
        video_url,
        video_title,
        current_time,
        duration,
        completed,
        last_watched_at
    ) VALUES (
        target_user_id,
        'https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/productos/2025-06-22%2021-07-11.mkv',
        'Detrás de Escenas: Cómo Creamos GeekWear',
        0,
        300,
        false,
        NOW()
    ) ON CONFLICT (user_id, video_url) DO NOTHING;

    -- Video 2: No visto
    INSERT INTO video_progress (
        user_id,
        video_url,
        video_title,
        current_time,
        duration,
        completed,
        last_watched_at
    ) VALUES (
        target_user_id,
        'https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/productos/2025-06-22%2021-10-14.mkv',
        'Showcase de Productos: Lo Mejor de GeekWear 2024',
        0,
        180,
        false,
        NOW()
    ) ON CONFLICT (user_id, video_url) DO NOTHING;

    RAISE NOTICE 'Progreso de videos inicializado para usuario: %', target_user_id;
END;
$$ LANGUAGE plpgsql;

-- Verificar que la tabla se creó correctamente
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'video_progress' 
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'video_progress';
