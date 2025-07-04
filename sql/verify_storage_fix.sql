-- Script para verificar que las políticas de storage están funcionando correctamente

-- Verificar buckets existentes
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id IN ('product-images', 'profile-images');

-- Verificar políticas activas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

-- Verificar que RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Contar objetos en cada bucket
SELECT 
  bucket_id,
  COUNT(*) as total_files,
  pg_size_pretty(SUM(metadata->>'size')::bigint) as total_size
FROM storage.objects 
WHERE bucket_id IN ('product-images', 'profile-images')
GROUP BY bucket_id;
