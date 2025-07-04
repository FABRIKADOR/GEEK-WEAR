-- Verificar si la columna storage_path existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'product_images' 
        AND column_name = 'storage_path'
    ) THEN
        -- Añadir la columna storage_path si no existe
        ALTER TABLE product_images ADD COLUMN storage_path TEXT;
    END IF;
END $$;
