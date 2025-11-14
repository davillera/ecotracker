-- =============================================
-- QUERIES DE VERIFICACIÓN PARA DEBUG
-- Sistema de Amigos y Tabla de Posiciones
-- =============================================

-- ====================================
-- 1. VERIFICAR MIS DATOS PERSONALES
-- ====================================

-- Ver mi perfil y código de amigo
SELECT 
  id,
  name,
  friend_code,
  created_at
FROM profiles
WHERE id = auth.uid();

-- Ver mi huella de carbono total
SELECT 
  'Comidas' as tipo,
  COUNT(*) as registros,
  SUM(co2) as total_co2_kg
FROM meals
WHERE user_id = auth.uid()
UNION ALL
SELECT 
  'Transporte' as tipo,
  COUNT(*) as registros,
  SUM(co2) as total_co2_kg
FROM transport
WHERE user_id = auth.uid()
UNION ALL
SELECT 
  'TOTAL' as tipo,
  (SELECT COUNT(*) FROM meals WHERE user_id = auth.uid()) + 
  (SELECT COUNT(*) FROM transport WHERE user_id = auth.uid()) as registros,
  (SELECT COALESCE(SUM(co2), 0) FROM meals WHERE user_id = auth.uid()) + 
  (SELECT COALESCE(SUM(co2), 0) FROM transport WHERE user_id = auth.uid()) as total_co2_kg;

-- ====================================
-- 2. VERIFICAR MIS AMISTADES
-- ====================================

-- Ver todas mis amistades (donde yo soy user_id)
SELECT 
  'Yo → Amigo' as direccion,
  f.id as friendship_id,
  f.status,
  p.name as nombre_amigo,
  p.friend_code as codigo_amigo,
  f.created_at
FROM friends f
JOIN profiles p ON f.friend_id = p.id
WHERE f.user_id = auth.uid();

-- Ver todas mis amistades (donde yo soy friend_id)
SELECT 
  'Amigo → Yo' as direccion,
  f.id as friendship_id,
  f.status,
  p.name as nombre_amigo,
  p.friend_code as codigo_amigo,
  f.created_at
FROM friends f
JOIN profiles p ON f.user_id = p.id
WHERE f.friend_id = auth.uid();

-- ====================================
-- 3. DETECTAR PROBLEMAS
-- ====================================

-- Detectar amistades unidireccionales (PROBLEMA)
SELECT 
  'PROBLEMA: Amistad unidireccional' as alerta,
  p1.name as usuario,
  p2.name as amigo,
  'Falta: ' || p2.name || ' → ' || p1.name as falta_relacion
FROM friends f1
JOIN profiles p1 ON f1.user_id = p1.id
JOIN profiles p2 ON f1.friend_id = p2.id
LEFT JOIN friends f2 
  ON f1.user_id = f2.friend_id 
  AND f1.friend_id = f2.user_id
WHERE f2.id IS NULL
  AND f1.status = 'accepted';

-- ====================================
-- 4. TABLA DE POSICIONES COMPLETA
-- ====================================

-- Ranking de todos los usuarios con amistades
WITH user_footprints AS (
  SELECT 
    user_id,
    COALESCE(SUM(co2), 0) as total_co2
  FROM (
    SELECT user_id, co2 FROM meals
    UNION ALL
    SELECT user_id, co2 FROM transport
  ) combined
  GROUP BY user_id
),
all_users AS (
  -- Usuarios con los que tengo amistad
  SELECT DISTINCT
    CASE 
      WHEN f.user_id = auth.uid() THEN f.friend_id
      WHEN f.friend_id = auth.uid() THEN f.user_id
    END as user_id
  FROM friends f
  WHERE (f.user_id = auth.uid() OR f.friend_id = auth.uid())
    AND f.status = 'accepted'
  UNION
  -- Yo mismo
  SELECT auth.uid() as user_id
)
SELECT 
  ROW_NUMBER() OVER (ORDER BY COALESCE(uf.total_co2, 0) ASC) as posicion,
  p.name as nombre,
  p.friend_code as codigo,
  COALESCE(uf.total_co2, 0) as co2_total_kg,
  (SELECT COUNT(*) FROM meals WHERE user_id = p.id) as registros_comidas,
  (SELECT COUNT(*) FROM transport WHERE user_id = p.id) as registros_transporte,
  CASE WHEN p.id = auth.uid() THEN '← TÚ' ELSE '' END as es_tu_usuario
FROM all_users au
JOIN profiles p ON au.user_id = p.id
LEFT JOIN user_footprints uf ON p.id = uf.user_id
ORDER BY co2_total_kg ASC;

-- ====================================
-- 5. VERIFICAR INTEGRIDAD DE DATOS
-- ====================================

-- Contar relaciones de amistad
SELECT 
  'Total de amistades registradas' as metrica,
  COUNT(*) as valor
FROM friends
WHERE status = 'accepted'
UNION ALL
SELECT 
  'Parejas únicas de amigos',
  COUNT(DISTINCT CONCAT(
    LEAST(user_id::text, friend_id::text),
    '-',
    GREATEST(user_id::text, friend_id::text)
  ))
FROM friends
WHERE status = 'accepted';

-- ====================================
-- 6. BUSCAR UN AMIGO POR CÓDIGO
-- ====================================

-- Reemplaza 'ABC123' con el código que quieres buscar
SELECT 
  p.name as nombre,
  p.friend_code as codigo,
  p.id as user_id,
  COALESCE(
    (SELECT SUM(co2) FROM meals WHERE user_id = p.id),
    0
  ) + COALESCE(
    (SELECT SUM(co2) FROM transport WHERE user_id = p.id),
    0
  ) as co2_total_kg
FROM profiles p
WHERE p.friend_code = 'ABC123'; -- Cambia esto por el código real

-- ====================================
-- 7. VER TODAS LAS COLUMNAS DISPONIBLES
-- ====================================

-- Ver estructura de la tabla meals
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'meals' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Ver estructura de la tabla transport
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'transport' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Ver estructura de la tabla friends
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'friends' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Ver estructura de la tabla profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;
