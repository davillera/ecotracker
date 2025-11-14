-- =============================================
-- FIX: Sistema de Amigos - Políticas RLS
-- =============================================
-- Este script arregla los problemas de RLS y agrega códigos de amigo

-- 1. Agregar columna friend_code a profiles si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'friend_code'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN friend_code VARCHAR(8) UNIQUE;
  END IF;
END $$;

-- 2. Función para generar código único de 6 caracteres
-- Primero eliminar la función si existe con cualquier tipo de retorno
DROP FUNCTION IF EXISTS generate_friend_code();

-- Crear la función con el tipo correcto
CREATE OR REPLACE FUNCTION generate_friend_code()
RETURNS VARCHAR(8) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Sin O, 0, I, 1 para evitar confusión
  result VARCHAR(8) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 3. Generar códigos para usuarios existentes que no tengan
UPDATE public.profiles
SET friend_code = generate_friend_code()
WHERE friend_code IS NULL;

-- 4. Trigger para generar código automáticamente en nuevos usuarios
CREATE OR REPLACE FUNCTION set_friend_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.friend_code IS NULL THEN
    NEW.friend_code := generate_friend_code();
    
    -- Si por casualidad existe (muy raro), regenerar hasta encontrar uno único
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE friend_code = NEW.friend_code AND id != NEW.id) LOOP
      NEW.friend_code := generate_friend_code();
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_friend_code_trigger ON public.profiles;
CREATE TRIGGER set_friend_code_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_friend_code();

-- 5. Política RLS para que los usuarios puedan buscar por friend_code
-- Permitir que cualquier usuario autenticado pueda buscar perfiles por friend_code
DROP POLICY IF EXISTS "Users can search by friend code" ON public.profiles;
CREATE POLICY "Users can search by friend code"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL); -- Cualquier usuario autenticado puede buscar

-- Mantener las políticas existentes para INSERT y UPDATE
-- Solo asegurarnos de que existen
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 6. ARREGLAR POLÍTICAS RLS DE FRIENDS
-- El problema es que intentamos insertar filas donde friend_id es el usuario actual
-- pero la política solo permite insertar donde user_id sea el usuario actual

-- ELIMINAR todas las políticas antiguas de friends primero
DROP POLICY IF EXISTS "Users can view own friendships" ON friends;
DROP POLICY IF EXISTS "Users can create friendships" ON friends;
DROP POLICY IF EXISTS "Users can update friendships" ON friends;
DROP POLICY IF EXISTS "Users can delete own friendships" ON friends;

-- NUEVAS políticas más permisivas

-- Permitir ver friendships si eres parte de la relación
CREATE POLICY "Users can view own friendships"
  ON friends FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Permitir insertar si eres user_id O friend_id (esto arregla el problema RLS)
CREATE POLICY "Users can create friendships"
  ON friends FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);

-- Permitir actualizar si eres parte de la relación
CREATE POLICY "Users can update friendships"
  ON friends FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Permitir eliminar solo si eres el user_id
CREATE POLICY "Users can delete own friendships"
  ON friends FOR DELETE
  USING (auth.uid() = user_id);



-- 7. Permitir ver datos de amigos (meals y transport) para el ranking
-- Crear políticas para que puedas ver las métricas de tus amigos

-- PRIMERO: Eliminar política restrictiva de meals si existe
DROP POLICY IF EXISTS "Users can view their own meals" ON public.meals;

-- NUEVA política para meals: ver propios O de amigos
DROP POLICY IF EXISTS "Users can view friends meals" ON public.meals;
CREATE POLICY "Users can view friends meals"
  ON public.meals FOR SELECT
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM friends 
      WHERE (friends.user_id = auth.uid() AND friends.friend_id = meals.user_id)
         OR (friends.friend_id = auth.uid() AND friends.user_id = meals.user_id)
      AND friends.status = 'accepted'
    )
  );

-- PRIMERO: Eliminar política restrictiva de transport si existe
DROP POLICY IF EXISTS "Users can view their own transport" ON public.transport;

-- NUEVA política para transport: ver propios O de amigos
DROP POLICY IF EXISTS "Users can view friends transport" ON public.transport;
CREATE POLICY "Users can view friends transport"
  ON public.transport FOR SELECT
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM friends 
      WHERE (friends.user_id = auth.uid() AND friends.friend_id = transport.user_id)
         OR (friends.friend_id = auth.uid() AND friends.user_id = transport.user_id)
      AND friends.status = 'accepted'
    )
  );

-- 8. También para energy_consumption si existe
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'energy_consumption') THEN
    -- Eliminar política restrictiva vieja
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own energy consumption" ON energy_consumption';
    -- Crear nueva política
    EXECUTE 'DROP POLICY IF EXISTS "Users can view friends energy" ON energy_consumption';
    EXECUTE 'CREATE POLICY "Users can view friends energy"
      ON energy_consumption FOR SELECT
      USING (
        auth.uid() = user_id OR 
        EXISTS (
          SELECT 1 FROM friends 
          WHERE (friends.user_id = auth.uid() AND friends.friend_id = energy_consumption.user_id)
             OR (friends.friend_id = auth.uid() AND friends.user_id = energy_consumption.user_id)
          AND friends.status = ''accepted''
        )
      )';
  END IF;
END $$;

-- =============================================
-- VERIFICACIÓN
-- =============================================

-- Ver todos los profiles con sus códigos
SELECT id, name, friend_code, created_at 
FROM public.profiles 
ORDER BY created_at DESC;

-- Ver todas las políticas de friends
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'friends';

-- Ver todas las políticas de profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';
