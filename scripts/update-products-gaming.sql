-- Actualizar productos existentes para gaming
UPDATE products SET 
  name = 'Cyberpunk 2077 - Edición Completa',
  description = 'Experimenta Night City como nunca antes. Incluye todas las expansiones y contenido adicional.',
  price = 899.00,
  compare_at_price = 1299.00
WHERE name LIKE '%Camiseta%' 
LIMIT 1;

UPDATE products SET 
  name = 'The Witcher 3: Wild Hunt - Game of the Year Edition',
  description = 'La aventura RPG definitiva con más de 150 horas de contenido épico.',
  price = 599.00,
  compare_at_price = 899.00
WHERE name LIKE '%Hoodie%' 
LIMIT 1;

UPDATE products SET 
  name = 'Xbox Game Pass Ultimate - 3 Meses',
  description = 'Acceso ilimitado a más de 100 juegos de alta calidad en consola, PC y nube.',
  price = 449.00,
  compare_at_price = NULL
WHERE name LIKE '%Accesorio%' 
LIMIT 1;

-- Insertar nuevos productos gaming
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, franchise_id, featured, created_at, updated_at) VALUES
('Elden Ring - Deluxe Edition', 'elden-ring-deluxe', 'El juego de acción RPG más esperado del año. Explora un mundo abierto lleno de misterios.', 1199.00, 1499.00, 1, 1, true, NOW(), NOW()),
('PlayStation Plus Premium - 12 Meses', 'ps-plus-premium-12m', 'Membresía premium con catálogo de juegos, multijugador online y beneficios exclusivos.', 1899.00, NULL, 3, 3, true, NOW(), NOW()),
('Hades - Supergiant Games', 'hades-supergiant', 'Roguelike de acción aclamado por la crítica. Escapa del inframundo en esta aventura épica.', 399.00, 599.00, 2, 1, false, NOW(), NOW()),
('Forza Horizon 5 - Premium Edition', 'forza-horizon-5-premium', 'La experiencia de carreras definitiva en México. Incluye Car Pass y expansiones.', 1099.00, 1399.00, 1, 4, true, NOW(), NOW()),
('Nintendo Switch Online + Expansion Pack', 'nintendo-online-expansion', 'Acceso a juegos clásicos de N64, Sega Genesis y multijugador online.', 699.00, NULL, 3, 5, false, NOW(), NOW());
