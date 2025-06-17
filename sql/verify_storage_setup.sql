-- Script para verificar que todo esté configurado correctamente

-- Verificar buckets
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets 
WHERE id IN ('product-images', 'profile-images');

-- Verificar políticas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- Verificar que RLS esté habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'storage' 
AND tablename = 'objects';
