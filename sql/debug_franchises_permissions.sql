-- Script para depurar permisos y problemas de RLS en franchises

-- 1. Verificar si la tabla franchises existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'franchises'
);

-- 2. Verificar estructura de la tabla franchises
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'franchises'
ORDER BY ordinal_position;

-- 3. Verificar si RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'franchises';

-- 4. Verificar políticas existentes
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'franchises';

-- 5. Verificar tu usuario y rol
SELECT 
  auth.uid() as current_user_id,
  (SELECT email FROM auth.users WHERE id = auth.uid()) as email;

-- 6. Verificar si tienes perfil de admin
SELECT p.id, p.email, p.role
FROM profiles p
WHERE p.id = auth.uid();

-- 7. Verificar todos los perfiles admin
SELECT u.email, p.role
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';

-- 8. Verificar si hay franquicias existentes
SELECT COUNT(*) FROM franchises;
