-- Crear tabla de franquicias si no existe
CREATE TABLE IF NOT EXISTS franchises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_franchises_slug ON franchises(slug);
CREATE INDEX IF NOT EXISTS idx_franchises_active ON franchises(is_active);
CREATE INDEX IF NOT EXISTS idx_franchises_name ON franchises(name);

-- Insertar algunas franquicias de ejemplo
INSERT INTO franchises (name, slug, description) VALUES
('Marvel', 'marvel', 'Universo cinematográfico de Marvel con superhéroes icónicos'),
('DC Comics', 'dc-comics', 'Universo de DC con Batman, Superman y más'),
('Star Wars', 'star-wars', 'La saga galáctica más famosa del cine'),
('Dragon Ball', 'dragon-ball', 'El anime de acción más popular del mundo'),
('Naruto', 'naruto', 'El ninja más famoso del anime'),
('One Piece', 'one-piece', 'La aventura pirata más épica del manga')
ON CONFLICT (slug) DO NOTHING;
