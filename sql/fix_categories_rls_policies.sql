-- Primero, verificar si RLS está habilitado en la tabla categories
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'categories';

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Permitir lectura pública de categorías" ON categories;
DROP POLICY IF EXISTS "Permitir a administradores gestionar categorías" ON categories;
DROP POLICY IF EXISTS "Permitir a usuarios autenticados leer categorías" ON categories;

-- 1. Política para permitir a todos leer categorías (para mostrar en la tienda)
CREATE POLICY "Permitir lectura pública de categorías" 
ON categories FOR SELECT 
USING (true);

-- 2. Política para permitir a administradores hacer todo (INSERT, UPDATE, DELETE)
CREATE POLICY "Permitir a administradores gestionar categorías" 
ON categories 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'categories';

-- Verificar tu rol actual
SELECT u.email, p.role, p.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'tu-email@ejemplo.com'; -- Reemplaza con tu email

-- Si no tienes perfil de admin, crear uno (reemplaza el email)
INSERT INTO profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'tu-email@ejemplo.com' -- Reemplaza con tu email
ON CONFLICT (id) DO UPDATE SET role = 'admin';
