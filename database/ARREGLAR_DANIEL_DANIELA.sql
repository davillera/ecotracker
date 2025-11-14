-- =============================================
-- SOLUCIÓN: Arreglar Daniel y Daniela
-- =============================================

-- PASO 1: Crear perfil para el usuario sin perfil (Daniel)
-- Este es el usuario a09b3e53-9509-46c5-84b3-2b56794f73f3

-- Primero verificar si existe en auth.users
SELECT 
  'Usuario sin perfil' as titulo,
  id,
  email,
  raw_user_meta_data->>'name' as nombre_metadata
FROM auth.users
WHERE id = 'a09b3e53-9509-46c5-84b3-2b56794f73f3';

-- Crear perfil para este usuario (Daniel)
INSERT INTO public.profiles (id, name, friend_code)
SELECT 
  'a09b3e53-9509-46c5-84b3-2b56794f73f3',
  COALESCE(
    (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = 'a09b3e53-9509-46c5-84b3-2b56794f73f3'),
    (SELECT split_part(email, '@', 1) FROM auth.users WHERE id = 'a09b3e53-9509-46c5-84b3-2b56794f73f3'),
    'Daniel'
  ),
  (SELECT generate_friend_code())
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE id = 'a09b3e53-9509-46c5-84b3-2b56794f73f3'
);

-- PASO 2: Crear relación inversa (Daniela → Daniel)
INSERT INTO friends (user_id, friend_id, status)
SELECT 
  '5b5a1cf7-d99e-43e9-9fd9-e83ac8d36e68', -- Daniela
  'a09b3e53-9509-46c5-84b3-2b56794f73f3', -- Daniel
  'accepted'
WHERE NOT EXISTS (
  SELECT 1 FROM friends 
  WHERE user_id = '5b5a1cf7-d99e-43e9-9fd9-e83ac8d36e68'
    AND friend_id = 'a09b3e53-9509-46c5-84b3-2b56794f73f3'
);

-- PASO 3: Verificar que todo está correcto
SELECT 
  'VERIFICACIÓN FINAL' as titulo,
  '---' as separador;

-- Ver el perfil creado
SELECT 
  'Perfil de Daniel' as titulo,
  p.id,
  p.name,
  p.friend_code,
  au.email
FROM public.profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE p.id = 'a09b3e53-9509-46c5-84b3-2b56794f73f3';

-- Ver ambas relaciones de amistad
SELECT 
  'Relaciones Daniel ↔ Daniela' as titulo,
  u1.name as usuario,
  u2.name as amigo,
  f.status,
  f.created_at
FROM friends f
JOIN profiles u1 ON f.user_id = u1.id
JOIN profiles u2 ON f.friend_id = u2.id
WHERE (f.user_id = 'a09b3e53-9509-46c5-84b3-2b56794f73f3' 
   OR f.friend_id = 'a09b3e53-9509-46c5-84b3-2b56794f73f3')
ORDER BY f.created_at;

-- Verificar la vista desde Daniela
SELECT 
  'Amigos de Daniela (debería ver a Daniel)' as titulo,
  u2.name as amigo,
  u2.friend_code as codigo,
  f.status
FROM friends f
JOIN profiles u1 ON f.user_id = u1.id
JOIN profiles u2 ON f.friend_id = u2.id
WHERE u1.id = '5b5a1cf7-d99e-43e9-9fd9-e83ac8d36e68'
ORDER BY u2.name;

-- Verificar la vista desde Daniel
SELECT 
  'Amigos de Daniel (debería ver a Daniela)' as titulo,
  u2.name as amigo,
  u2.friend_code as codigo,
  f.status
FROM friends f
JOIN profiles u1 ON f.user_id = u1.id
JOIN profiles u2 ON f.friend_id = u2.id
WHERE u1.id = 'a09b3e53-9509-46c5-84b3-2b56794f73f3'
ORDER BY u2.name;

-- Resumen final
SELECT 
  'RESUMEN' as titulo,
  (SELECT COUNT(*) FROM public.profiles) as total_perfiles,
  (SELECT COUNT(*) FROM friends) as total_relaciones,
  (SELECT COUNT(*) FROM friends WHERE user_id = 'a09b3e53-9509-46c5-84b3-2b56794f73f3' OR friend_id = 'a09b3e53-9509-46c5-84b3-2b56794f73f3') as relaciones_daniel;
