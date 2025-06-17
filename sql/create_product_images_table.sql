-- Crear tabla de imágenes de productos si no existe
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON product_images(is_primary);

-- Crear políticas RLS para imágenes de productos
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Política para permitir a todos ver las imágenes
CREATE POLICY "Las imágenes de productos son visibles para todos" 
ON product_images FOR SELECT 
USING (true);

-- Política para permitir a los administradores gestionar las imágenes
CREATE POLICY "Los administradores pueden gestionar las imágenes de productos" 
ON product_images FOR ALL 
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);
