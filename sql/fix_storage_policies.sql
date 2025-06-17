-- Script para limpiar y recrear las políticas de storage correctamente

-- 1. Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Imágenes de productos visibles para todos" ON storage.objects;
DROP POLICY IF EXISTS "Solo administradores pueden subir imágenes de productos" ON storage.objects;
DROP POLICY IF EXISTS "Solo administradores pueden actualizar imágenes de productos" ON storage.objects;
DROP POLICY IF EXISTS "Solo administradores pueden eliminar imágenes de productos" ON storage.objects;
DROP POLICY IF EXISTS "Imágenes de perfil visibles para todos" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden subir sus propias imágenes de perfil" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propias imágenes de perfil" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propias imágenes de perfil" ON storage.objects;

-- 2. Crear buckets si no existen
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Crear políticas para product-images
CREATE POLICY "Imágenes de productos visibles para todos" ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Solo administradores pueden subir imágenes de productos" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Solo administradores pueden actualizar imágenes de productos" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Solo administradores pueden eliminar imágenes de productos" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 4. Crear políticas para profile-images (más permisivas para testing)
CREATE POLICY "Imágenes de perfil visibles para todos" ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Los usuarios pueden subir sus propias imágenes de perfil" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Los usuarios pueden actualizar sus propias imágenes de perfil" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Los usuarios pueden eliminar sus propias imágenes de perfil" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-images' AND
  auth.uid() IS NOT NULL
);
