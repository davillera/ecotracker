-- =============================================
-- FIX: Error al crear usuario
-- "Database error saving new user"
-- =============================================

-- El problema es que el trigger de crear perfil automáticamente
-- está fallando. Vamos a arreglarlo.

-- 1. ELIMINAR trigger y función antiguos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. VERIFICAR que la tabla profiles tiene las columnas correctas
-- Ver estructura de la tabla
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. ASEGURAR que RLS está habilitado pero permite operaciones del trigger
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas antiguas que puedan estar bloqueando
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for service role and authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;

-- Crear política para permitir que el trigger inserte (el trigger se ejecuta con privilegios del sistema)
-- Esta política es permisiva y permite todas las inserciones
CREATE POLICY "Enable insert for all authenticated"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para SELECT (cualquier autenticado puede ver perfiles - necesario para sistema de amigos)
CREATE POLICY "Enable read for all authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Política para UPDATE (solo tu propio perfil)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. CREAR función mejorada para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER -- Esto permite que se ejecute con privilegios elevados
SET search_path = public
AS $$
DECLARE
  v_friend_code VARCHAR(8);
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  i INTEGER;
  attempts INTEGER := 0;
  is_unique BOOLEAN := FALSE;
BEGIN
  -- Generar código único de amigo
  WHILE NOT is_unique AND attempts < 100 LOOP
    v_friend_code := '';
    FOR i IN 1..6 LOOP
      v_friend_code := v_friend_code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    
    -- Verificar si es único
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE friend_code = v_friend_code) THEN
      is_unique := TRUE;
    END IF;
    
    attempts := attempts + 1;
  END LOOP;

  -- Insertar perfil con manejo de errores
  BEGIN
    INSERT INTO public.profiles (id, name, friend_code, created_at, updated_at)
    VALUES (
      NEW.id,
      COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1),
        'Usuario'
      ),
      v_friend_code,
      NOW(),
      NOW()
    );
    
    RAISE LOG 'Profile created successfully for user %', NEW.id;
    
  EXCEPTION
    WHEN unique_violation THEN
      -- Si ya existe el perfil, actualizar el código si no tiene
      UPDATE public.profiles
      SET 
        friend_code = COALESCE(friend_code, v_friend_code),
        updated_at = NOW()
      WHERE id = NEW.id AND friend_code IS NULL;
      
      RAISE LOG 'Profile already exists for user %, updated friend_code', NEW.id;
      
    WHEN OTHERS THEN
      -- Log del error y propagar la excepción para que Supabase lo reporte
      RAISE WARNING 'Error creating profile for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
      RAISE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. CREAR trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. VERIFICAR políticas RLS de profiles
SELECT 
  '=== POLICIES ===' as info,
  policyname,
  cmd,
  permissive,
  roles::text
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles';

-- 7. VERIFICACIÓN FINAL
SELECT 
  '=== TRIGGER STATUS ===' as info,
  tgname as trigger_name,
  CASE tgenabled
    WHEN 'O' THEN 'enabled'
    WHEN 'D' THEN 'disabled'
    WHEN 'R' THEN 'replica'
    WHEN 'A' THEN 'always'
    ELSE 'unknown'
  END as status
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- 8. Mostrar resumen
SELECT 
  '=== SETUP SUMMARY ===' as info,
  (SELECT COUNT(*) FROM pg_trigger WHERE tgname = 'on_auth_user_created') as trigger_exists,
  (SELECT COUNT(*) FROM pg_proc WHERE proname = 'handle_new_user') as function_exists,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles') as policies_count;

-- 9. IMPORTANTE: Verificar que la columna friend_code existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'friend_code'
  ) THEN
    -- Agregar columna friend_code si no existe
    ALTER TABLE public.profiles 
    ADD COLUMN friend_code VARCHAR(8) UNIQUE;
    
    RAISE NOTICE 'Column friend_code added to profiles table';
  ELSE
    RAISE NOTICE 'Column friend_code already exists';
  END IF;
END $$;
