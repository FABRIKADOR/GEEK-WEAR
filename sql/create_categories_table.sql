-- Crear tabla de categorías si no existe
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas por slug
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Insertar algunas categorías de ejemplo
INSERT INTO categories (name, slug, description)
VALUES 
  ('Playeras', 'playeras', 'Playeras de diferentes franquicias y diseños'),
  ('Sudaderas', 'sudaderas', 'Sudaderas con capucha y sin capucha'),
  ('Accesorios', 'accesorios', 'Accesorios como llaveros, pines y más'),
  ('Coleccionables', 'coleccionables', 'Figuras y artículos de colección')
ON CONFLICT (slug) DO NOTHING;

-- Crear tabla de franquicias si no existe
CREATE TABLE IF NOT EXISTS franchises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas por slug
CREATE INDEX IF NOT EXISTS idx_franchises_slug ON franchises(slug);

-- Insertar algunas franquicias de ejemplo
INSERT INTO franchises (name, slug, description)
VALUES 
  ('Marvel', 'marvel', 'Superhéroes y villanos del universo Marvel'),
  ('DC Comics', 'dc-comics', 'Personajes del universo DC'),
  ('Star Wars', 'star-wars', 'La guerra de las galaxias'),
  ('Anime', 'anime', 'Series y películas de animación japonesa')
ON CONFLICT (slug) DO NOTHING;

-- Añadir relación entre productos y categorías
ALTER TABLE products
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Añadir relación entre productos y franquicias
ALTER TABLE products
ADD COLUMN IF NOT EXISTS franchise_id UUID REFERENCES franchises(id) ON DELETE SET NULL;
