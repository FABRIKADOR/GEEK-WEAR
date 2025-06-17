-- Crear bucket para imágenes de perfil si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir a los usuarios autenticados leer cualquier imagen de perfil
CREATE POLICY "Imágenes de perfil visibles para todos" ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-images');

-- Política para permitir a los usuarios subir sus propias imágenes de perfil
CREATE POLICY "Los usuarios pueden subir sus propias imágenes de perfil" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para permitir a los usuarios actualizar sus propias imágenes de perfil
CREATE POLICY "Los usuarios pueden actualizar sus propias imágenes de perfil" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para permitir a los usuarios eliminar sus propias imágenes de perfil
CREATE POLICY "Los usuarios pueden eliminar sus propias imágenes de perfil" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
