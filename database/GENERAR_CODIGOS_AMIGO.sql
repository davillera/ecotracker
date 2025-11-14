-- =============================================
-- GENERAR FRIEND_CODE PARA USUARIOS SIN CÓDIGO
-- =============================================

-- Asegurarse de que la columna existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'friend_code'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN friend_code VARCHAR(8) UNIQUE;
  END IF;
END $$;

-- Verificar si la función existe, si no, crearla
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'generate_friend_code') THEN
    EXECUTE '
      CREATE FUNCTION generate_friend_code()
      RETURNS VARCHAR(8) AS $func$
      DECLARE
        chars TEXT := ''ABCDEFGHJKLMNPQRSTUVWXYZ23456789'';
        result VARCHAR(8) := '''';
        i INTEGER;
      BEGIN
        FOR i IN 1..6 LOOP
          result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        END LOOP;
        RETURN result;
      END;
      $func$ LANGUAGE plpgsql;
    ';
  END IF;
END $$;

-- Generar códigos para todos los usuarios que no tienen
UPDATE public.profiles
SET friend_code = generate_friend_code()
WHERE friend_code IS NULL;

-- Verificar resultados
SELECT id, name, friend_code, created_at 
FROM public.profiles 
ORDER BY created_at DESC;

-- Mostrar cuántos usuarios tienen código ahora
SELECT 
  COUNT(*) as total_usuarios,
  COUNT(friend_code) as con_codigo,
  COUNT(*) - COUNT(friend_code) as sin_codigo
FROM public.profiles;
