-- ==========================================
-- MEJORA: Código de Amigo Simple
-- ==========================================
-- Agregar campo friend_code a la tabla profiles

-- 1. Agregar columna friend_code
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS friend_code TEXT UNIQUE;

-- 2. Crear índice para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_profiles_friend_code 
ON public.profiles(friend_code);

-- 3. Función para generar código único de 6 caracteres
CREATE OR REPLACE FUNCTION generate_friend_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Sin O, 0, I, 1 para evitar confusión
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 4. Función para asignar código único a nuevo usuario
CREATE OR REPLACE FUNCTION assign_friend_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  -- Generar código único
  LOOP
    new_code := generate_friend_code();
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE friend_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  NEW.friend_code := new_code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger para asignar código al crear perfil
DROP TRIGGER IF EXISTS on_profile_friend_code ON public.profiles;
CREATE TRIGGER on_profile_friend_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  WHEN (NEW.friend_code IS NULL)
  EXECUTE FUNCTION assign_friend_code();

-- 6. Asignar códigos a usuarios existentes
UPDATE public.profiles 
SET friend_code = generate_friend_code()
WHERE friend_code IS NULL;

-- 7. Política RLS para permitir búsqueda por friend_code
CREATE POLICY "Users can search by friend code"
  ON public.profiles FOR SELECT
  USING (true); -- Todos pueden buscar perfiles por friend_code

-- 8. Comentario
COMMENT ON COLUMN public.profiles.friend_code IS 'Código único de 6 caracteres para agregar amigos fácilmente';
