-- Crear la tabla de relación muchos a muchos entre productos y franquicias
CREATE TABLE IF NOT EXISTS product_franchises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  franchise_id UUID NOT NULL REFERENCES franchises(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Índice único para evitar duplicados
  UNIQUE(product_id, franchise_id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_product_franchises_product_id ON product_franchises(product_id);
CREATE INDEX IF NOT EXISTS idx_product_franchises_franchise_id ON product_franchises(franchise_id);

-- Habilitar RLS
ALTER TABLE product_franchises ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para product_franchises
CREATE POLICY "Todos pueden ver relaciones producto-franquicia"
  ON product_franchises FOR SELECT
  USING (true);

CREATE POLICY "Solo admins pueden crear relaciones producto-franquicia"
  ON product_franchises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden actualizar relaciones producto-franquicia"
  ON product_franchises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden eliminar relaciones producto-franquicia"
  ON product_franchises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
