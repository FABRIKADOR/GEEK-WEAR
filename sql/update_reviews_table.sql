-- Eliminar la restricción única que impedía múltiples reseñas por usuario por producto
ALTER TABLE product_reviews DROP CONSTRAINT IF EXISTS product_reviews_product_id_user_id_key;

-- Agregar un índice compuesto para mejorar el rendimiento de consultas
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_user ON product_reviews(product_id, user_id);

-- Agregar un índice para ordenar por fecha
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);
