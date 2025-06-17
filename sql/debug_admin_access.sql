-- Script para verificar y debuggear el acceso de administrador

-- 1. Verificar si existe la tabla profiles
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'profiles'
);

-- 2. Ver estructura de la tabla profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Ver todos los perfiles existentes
SELECT id, email, role, created_at, updated_at
FROM profiles
ORDER BY created_at DESC;

-- 4. Verificar usuarios en auth.users
SELECT id, email, created_at, email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- 5. Verificar si hay usuarios sin perfil
SELECT u.id, u.email, p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- 6. Crear perfil de admin si no existe (reemplaza 'tu-email@ejemplo.com' con tu email real)
-- INSERT INTO profiles (id, email, role)
-- SELECT id, email, 'admin'
-- FROM auth.users
-- WHERE email = 'tu-email@ejemplo.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';
