-- Agregar campo de visibilidad a la tabla categories
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;

-- Actualizar todas las categorías existentes para que sean visibles por defecto
UPDATE categories 
SET is_visible = true 
WHERE is_visible IS NULL;

-- Crear índice para mejorar performance en consultas de categorías visibles
CREATE INDEX IF NOT EXISTS idx_categories_visible ON categories(is_visible);
