-- Script completo para verificar y configurar todo correctamente

-- 1. Verificar estructura de la tabla profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Verificar todos los usuarios y sus roles
SELECT 
  u.email,
  u.created_at as user_created,
  u.email_confirmed_at,
  p.role,
  p.created_at as profile_created
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 3. Verificar políticas de categories
SELECT policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'categories';

-- 4. Verificar políticas de franchises
SELECT policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'franchises';

-- 5. Probar inserción en categories (esto debería funcionar si eres admin)
-- INSERT INTO categories (name, slug, description)
-- VALUES ('Test Category', 'test-category', 'Categoría de prueba')
-- RETURNING *;
