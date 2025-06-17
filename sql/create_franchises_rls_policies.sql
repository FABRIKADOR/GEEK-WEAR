-- Crear políticas similares para la tabla franchises
-- Primero crear la tabla si no existe
CREATE TABLE IF NOT EXISTS franchises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en franchises
ALTER TABLE franchises ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Permitir lectura pública de franquicias" ON franchises;
DROP POLICY IF EXISTS "Permitir a administradores gestionar franquicias" ON franchises;

-- 1. Política para permitir a todos leer franquicias
CREATE POLICY "Permitir lectura pública de franquicias" 
ON franchises FOR SELECT 
USING (true);

-- 2. Política para permitir a administradores hacer todo
CREATE POLICY "Permitir a administradores gestionar franquicias" 
ON franchises 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Insertar algunas franquicias de ejemplo
INSERT INTO franchises (name, slug, description)
VALUES 
  ('Marvel', 'marvel', 'Superhéroes y villanos del universo Marvel'),
  ('DC Comics', 'dc-comics', 'Personajes del universo DC'),
  ('Star Wars', 'star-wars', 'La guerra de las galaxias'),
  ('Anime', 'anime', 'Series y películas de animación japonesa'),
  ('Dragon Ball', 'dragon-ball', 'La saga de Goku y los guerreros Z'),
  ('Naruto', 'naruto', 'El ninja que sueña con ser Hokage'),
  ('One Piece', 'one-piece', 'Los piratas del sombrero de paja')
ON CONFLICT (slug) DO NOTHING;
