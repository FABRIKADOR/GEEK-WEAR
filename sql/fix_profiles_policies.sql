-- Primero, eliminar las políticas existentes que están causando el problema
DROP POLICY IF EXISTS "Los perfiles son visibles para todos los usuarios autenticados" ON profiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Los administradores pueden gestionar todos los perfiles" ON profiles;

-- Crear políticas simplificadas que no causen recursión
-- Política para permitir a los usuarios leer cualquier perfil
CREATE POLICY "Los perfiles son visibles para todos los usuarios autenticados" 
ON profiles FOR SELECT 
TO authenticated
USING (true);

-- Política para permitir a los usuarios actualizar su propio perfil
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" 
ON profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- Política para permitir a los usuarios insertar su propio perfil
CREATE POLICY "Los usuarios pueden insertar su propio perfil" 
ON profiles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Política para permitir a los administradores gestionar todos los perfiles
-- Esta es la que causa problemas, la modificamos para usar un enfoque diferente
CREATE POLICY "Los administradores pueden gestionar todos los perfiles" 
ON profiles 
USING (
  -- Usar una lista estática de IDs de administradores o un enfoque diferente
  -- Por ahora, permitimos acceso completo a todos los usuarios autenticados a sus propios perfiles
  auth.uid() = id
);
