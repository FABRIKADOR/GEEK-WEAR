-- Desactivar temporalmente RLS para la tabla profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes para evitar confusiones
DROP POLICY IF EXISTS "Los perfiles son visibles para todos los usuarios autenticados" ON profiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Los administradores pueden gestionar todos los perfiles" ON profiles;
