-- Actualizar categorías para gaming
UPDATE categories SET 
  name = 'Juegos AAA',
  slug = 'juegos-aaa'
WHERE name = 'Camisetas';

UPDATE categories SET 
  name = 'Juegos Indie',
  slug = 'juegos-indie'
WHERE name = 'Hoodies';

UPDATE categories SET 
  name = 'Membresías Premium',
  slug = 'membresias-premium'
WHERE name = 'Accesorios';

-- Insertar nuevas categorías gaming
INSERT INTO categories (name, slug, description, created_at, updated_at) VALUES
('DLCs y Expansiones', 'dlcs-expansiones', 'Contenido adicional para tus juegos favoritos', NOW(), NOW()),
('Juegos VR', 'juegos-vr', 'Experiencias de realidad virtual inmersivas', NOW(), NOW()),
('Juegos Retro', 'juegos-retro', 'Clásicos que nunca pasan de moda', NOW(), NOW()),
('Mobile Gaming', 'mobile-gaming', 'Los mejores juegos para dispositivos móviles', NOW(), NOW()),
('PC Gaming', 'pc-gaming', 'Juegos optimizados para PC', NOW(), NOW()),
('Console Gaming', 'console-gaming', 'Juegos para PlayStation, Xbox y Nintendo', NOW(), NOW()),
('Streaming Tools', 'streaming-tools', 'Herramientas para streamers y creadores de contenido', NOW(), NOW());
