-- Script para solucionar el acceso a los buckets de storage

-- 1. Primero, eliminar todas las políticas existentes que pueden estar causando problemas
DROP POLICY IF EXISTS "Imágenes de productos visibles para todos" ON storage.objects;
DROP POLICY IF EXISTS "Solo administradores pueden subir imágenes de productos" ON storage.objects;
DROP POLICY IF EXISTS "Solo administradores pueden actualizar imágenes de productos" ON storage.objects;
DROP POLICY IF EXISTS "Solo administradores pueden eliminar imágenes de productos" ON storage.objects;
DROP POLICY IF EXISTS "Imágenes de perfil visibles para todos" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden subir sus propias imágenes de perfil" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propias imágenes de perfil" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propias imágenes de perfil" ON storage.objects;
DROP POLICY IF EXISTS "Permitir a administradores gestionar todas las imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Permitir lectura pública de imágenes de productos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir a usuarios autenticados subir imágenes de productos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir a usuarios autenticados actualizar sus propias imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Permitir a usuarios autenticados eliminar sus propias imágenes" ON storage.objects;

-- 2. Verificar que los buckets existen y son públicos
UPDATE storage.buckets SET public = true WHERE id = 'product-images';
UPDATE storage.buckets SET public = true WHERE id = 'profile-images';

-- 3. Crear políticas más permisivas para product-images
CREATE POLICY "Lectura pública de product-images" ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Usuarios autenticados pueden subir a product-images" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Usuarios autenticados pueden actualizar en product-images" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'product-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Usuarios autenticados pueden eliminar de product-images" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images' AND
  auth.uid() IS NOT NULL
);

-- 4. Crear políticas más permisivas para profile-images
CREATE POLICY "Lectura pública de profile-images" ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Usuarios autenticados pueden subir a profile-images" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Usuarios autenticados pueden actualizar en profile-images" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Usuarios autenticados pueden eliminar de profile-images" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-images' AND
  auth.uid() IS NOT NULL
);

-- 5. Verificar que RLS está habilitado
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
