-- Agregar columnas faltantes a la tabla profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);

-- Actualizar perfiles existentes que no tienen full_name
UPDATE profiles 
SET full_name = CASE 
  WHEN email = 'test@mail.com' THEN 'Usuario Test'
  WHEN email = 'rober@mail.com' THEN 'Roberto'
  WHEN email = 'soyjuan@mail.com' THEN 'Juan'
  WHEN email = 'hola@mail.com' THEN 'Holiwis'
  ELSE COALESCE(username, 'Usuario')
END
WHERE full_name IS NULL;

-- Función para auto-crear perfil cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función cuando se crea un usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
