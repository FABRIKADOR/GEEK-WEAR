-- Actualizar franquicias para plataformas gaming
UPDATE franchises SET 
  name = 'Steam',
  slug = 'steam',
  description = 'La plataforma de gaming más grande del mundo'
WHERE name = 'Naruto';

UPDATE franchises SET 
  name = 'Epic Games',
  slug = 'epic-games',
  description = 'Plataforma con juegos gratuitos semanales'
WHERE name = 'Dragon Ball';

UPDATE franchises SET 
  name = 'PlayStation',
  slug = 'playstation',
  description = 'Exclusivos y experiencias de consola'
WHERE name = 'One Piece';

-- Insertar nuevas plataformas gaming
INSERT INTO franchises (name, slug, description, created_at, updated_at) VALUES
('Xbox Game Pass', 'xbox-game-pass', 'Suscripción con cientos de juegos incluidos', NOW(), NOW()),
('Nintendo eShop', 'nintendo-eshop', 'Juegos exclusivos de Nintendo', NOW(), NOW()),
('Origin', 'origin', 'Plataforma de EA con juegos AAA', NOW(), NOW()),
('Ubisoft Connect', 'ubisoft-connect', 'Juegos de Ubisoft y contenido exclusivo', NOW(), NOW()),
('Battle.net', 'battle-net', 'Plataforma de Blizzard Entertainment', NOW(), NOW()),
('GOG', 'gog', 'Juegos DRM-free y clásicos', NOW(), NOW()),
('Itch.io', 'itch-io', 'Plataforma indie para desarrolladores independientes', NOW(), NOW());
