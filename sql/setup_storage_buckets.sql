-- Script completo para configurar todos los buckets necesarios

-- 1. Crear bucket para imágenes de productos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Crear bucket para imágenes de perfil
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas para product-images
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

-- 4. Políticas para profile-images
CREATE POLICY "Imágenes de perfil visibles para todos" ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Los usuarios pueden subir sus propias imágenes de perfil" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Los usuarios pueden actualizar sus propias imágenes de perfil" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Los usuarios pueden eliminar sus propias imágenes de perfil" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
