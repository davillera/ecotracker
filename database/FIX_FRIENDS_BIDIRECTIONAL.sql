-- =============================================
-- FIX: Corrección del sistema de amigos
-- =============================================
-- Problema 1: Amistades solo en una dirección
-- Problema 2: Duplicados o inconsistencias
-- =============================================

-- 1. Ver el estado actual de las amistades
SELECT 
  '=== ESTADO ACTUAL DE AMISTADES ===' as info,
  COUNT(*) as total_friendships,
  COUNT(DISTINCT user_id) as users_with_friends
FROM friends;

-- 2. Encontrar amistades que solo existen en una dirección
SELECT 
  '=== AMISTADES UNIDIRECCIONALES ===' as info,
  f1.user_id,
  f1.friend_id,
  f1.status,
  CASE 
    WHEN f2.id IS NULL THEN 'Falta relación inversa'
    ELSE 'Bidireccional correcta'
  END as estado
FROM friends f1
LEFT JOIN friends f2 
  ON f1.user_id = f2.friend_id 
  AND f1.friend_id = f2.user_id
WHERE f2.id IS NULL;

-- 3. Crear las relaciones inversas faltantes
INSERT INTO friends (user_id, friend_id, status, created_at, updated_at)
SELECT 
  f1.friend_id as user_id,
  f1.user_id as friend_id,
  f1.status,
  f1.created_at,
  NOW() as updated_at
FROM friends f1
LEFT JOIN friends f2 
  ON f1.user_id = f2.friend_id 
  AND f1.friend_id = f2.user_id
WHERE f2.id IS NULL
  AND f1.status = 'accepted'
ON CONFLICT (user_id, friend_id) DO NOTHING;

-- 4. Verificar que ahora todas las amistades sean bidireccionales
SELECT 
  '=== VERIFICACIÓN POST-CORRECCIÓN ===' as info,
  COUNT(*) as total_friendships,
  COUNT(*) FILTER (WHERE status = 'accepted') as accepted_friendships
FROM friends;

-- 5. Mostrar todas las amistades con sus nombres
SELECT 
  '=== AMISTADES ACTUALES ===' as info,
  p1.name as usuario,
  p2.name as amigo,
  f.status,
  f.created_at
FROM friends f
JOIN profiles p1 ON f.user_id = p1.id
JOIN profiles p2 ON f.friend_id = p2.id
ORDER BY p1.name, p2.name;

-- 6. Verificar que cada amistad tenga su inversa
SELECT 
  '=== RESUMEN DE CORRECCIÓN ===' as info,
  (SELECT COUNT(*) FROM friends) as total_relaciones,
  (SELECT COUNT(*) FROM (
    SELECT DISTINCT LEAST(user_id, friend_id), GREATEST(user_id, friend_id)
    FROM friends 
    WHERE status = 'accepted'
  ) as unique_pairs) as parejas_unicas,
  (SELECT COUNT(*) FROM friends) / 2.0 as parejas_esperadas;
