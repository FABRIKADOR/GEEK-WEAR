-- Script simplificado que solo maneja las políticas que podemos crear
-- No intenta modificar la tabla storage.objects directamente

-- 1. Eliminar políticas existentes (esto sí podemos hacerlo)
DROP POLICY IF EXISTS "Lectura pública de product-images" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir a product-images" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar en product-images" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar de product-images" ON storage.objects;
DROP POLICY IF EXISTS "Lectura pública de profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir a profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar en profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar de profile-images" ON storage.objects;

-- 2. Crear políticas básicas para product-images
CREATE POLICY "Public read product-images" ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated upload product-images" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated update product-images" ON storage.objects
FOR UPDATE
USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated delete product-images" ON storage.objects
FOR DELETE
USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

-- 3. Crear políticas básicas para profile-images
CREATE POLICY "Public read profile-images" ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated upload profile-images" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated update profile-images" ON storage.objects
FOR UPDATE
USING (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated delete profile-images" ON storage.objects
FOR DELETE
USING (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);
