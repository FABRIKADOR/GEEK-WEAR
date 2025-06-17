-- Políticas para el bucket product-images
-- 1. Política para permitir a todos leer (SELECT) del bucket
CREATE POLICY "Permitir lectura pública de imágenes de productos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- 2. Política para permitir a usuarios autenticados insertar en el bucket
CREATE POLICY "Permitir a usuarios autenticados subir imágenes de productos" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- 3. Política para permitir a usuarios autenticados actualizar sus propios objetos
CREATE POLICY "Permitir a usuarios autenticados actualizar sus propias imágenes" 
ON storage.objects FOR UPDATE 
TO authenticated
USING (bucket_id = 'product-images' AND owner = auth.uid());

-- 4. Política para permitir a usuarios autenticados eliminar sus propios objetos
CREATE POLICY "Permitir a usuarios autenticados eliminar sus propias imágenes" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'product-images' AND owner = auth.uid());

-- 5. Política para permitir a administradores gestionar todos los objetos
CREATE POLICY "Permitir a administradores gestionar todas las imágenes" 
ON storage.objects 
TO authenticated
USING (
  bucket_id = 'product-images' AND 
  auth.uid() IN (SELECT id FROM auth.users WHERE email = 'tu_email_admin@ejemplo.com')
)
WITH CHECK (
  bucket_id = 'product-images' AND 
  auth.uid() IN (SELECT id FROM auth.users WHERE email = 'tu_email_admin@ejemplo.com')
);

-- 6. Política para permitir a usuarios autenticados listar buckets
CREATE POLICY "Permitir a usuarios autenticados listar buckets" 
ON storage.buckets FOR SELECT 
TO authenticated
USING (true);
