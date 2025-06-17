-- Crear tabla de reseñas de productos si no existe
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (product_id, user_id)
);

-- Crear tabla de lista de deseos si no existe
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON wishlist_items(product_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en product_reviews
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_product_reviews_updated_at'
  ) THEN
    CREATE TRIGGER update_product_reviews_updated_at
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;

-- Políticas RLS para product_reviews
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver todas las reseñas aprobadas
DROP POLICY IF EXISTS "Users can view approved reviews" ON product_reviews;
CREATE POLICY "Users can view approved reviews" ON product_reviews
  FOR SELECT USING (is_approved = true);

-- Política para que los usuarios puedan ver sus propias reseñas (aprobadas o no)
DROP POLICY IF EXISTS "Users can view their own reviews" ON product_reviews;
CREATE POLICY "Users can view their own reviews" ON product_reviews
  FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios puedan crear sus propias reseñas
DROP POLICY IF EXISTS "Users can create their own reviews" ON product_reviews;
CREATE POLICY "Users can create their own reviews" ON product_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios puedan actualizar sus propias reseñas
DROP POLICY IF EXISTS "Users can update their own reviews" ON product_reviews;
CREATE POLICY "Users can update their own reviews" ON product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para que los usuarios puedan eliminar sus propias reseñas
DROP POLICY IF EXISTS "Users can delete their own reviews" ON product_reviews;
CREATE POLICY "Users can delete their own reviews" ON product_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para wishlist_items
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver sus propios items de wishlist
DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlist_items;
CREATE POLICY "Users can view their own wishlist" ON wishlist_items
  FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios puedan crear sus propios items de wishlist
DROP POLICY IF EXISTS "Users can create their own wishlist items" ON wishlist_items;
CREATE POLICY "Users can create their own wishlist items" ON wishlist_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios puedan eliminar sus propios items de wishlist
DROP POLICY IF EXISTS "Users can delete their own wishlist items" ON wishlist_items;
CREATE POLICY "Users can delete their own wishlist items" ON wishlist_items
  FOR DELETE USING (auth.uid() = user_id);
