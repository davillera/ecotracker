-- =============================================
-- DIAGNÓSTICO COMPLETO: Sistema de Amigos
-- =============================================

-- 1. VER TODOS LOS USUARIOS REGISTRADOS
SELECT 
  'USUARIOS REGISTRADOS' as seccion,
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. VER TODOS LOS PERFILES
SELECT 
  'PERFILES EXISTENTES' as seccion,
  p.id,
  p.name,
  p.friend_code,
  au.email
FROM public.profiles p
LEFT JOIN auth.users au ON p.id = au.id
ORDER BY p.created_at DESC;

-- 3. BUSCAR A DANIEL
SELECT 
  'BUSCANDO A DANIEL' as seccion,
  p.id,
  p.name,
  p.friend_code,
  au.email
FROM public.profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE LOWER(p.name) LIKE '%daniel%'
   OR LOWER(au.email) LIKE '%daniel%';

-- 4. VER TODAS LAS RELACIONES DE AMISTAD
SELECT 
  'RELACIONES DE AMISTAD' as seccion,
  f.id as friendship_id,
  u1.name as usuario,
  u2.name as amigo,
  f.status,
  f.created_at
FROM friends f
JOIN profiles u1 ON f.user_id = u1.id
JOIN profiles u2 ON f.friend_id = u2.id
ORDER BY f.created_at DESC;

-- 5. VER AMISTADES DE DANIELA
SELECT 
  'AMIGOS DE DANIELA' as seccion,
  u2.name as amigo,
  u2.friend_code as codigo_amigo,
  f.status,
  f.created_at
FROM friends f
JOIN profiles u1 ON f.user_id = u1.id
JOIN profiles u2 ON f.friend_id = u2.id
WHERE u1.name = 'Daniela'
ORDER BY f.created_at DESC;

-- 6. VER QUIÉN TIENE A DANIELA COMO AMIGA
SELECT 
  'QUIÉN TIENE A DANIELA' as seccion,
  u1.name as usuario,
  u1.friend_code as codigo_usuario,
  f.status,
  f.created_at
FROM friends f
JOIN profiles u1 ON f.user_id = u1.id
JOIN profiles u2 ON f.friend_id = u2.id
WHERE u2.name = 'Daniela'
ORDER BY f.created_at DESC;

-- 7. VERIFICAR POLÍTICAS RLS
SELECT 
  'POLÍTICAS RLS' as seccion,
  tablename,
  policyname,
  cmd,
  permissive
FROM pg_policies
WHERE tablename IN ('profiles', 'friends', 'meals', 'transport')
ORDER BY tablename, policyname;

-- 8. CONTAR TODO
SELECT 
  'RESUMEN' as seccion,
  (SELECT COUNT(*) FROM auth.users) as usuarios_auth,
  (SELECT COUNT(*) FROM public.profiles) as perfiles,
  (SELECT COUNT(*) FROM public.profiles WHERE friend_code IS NOT NULL) as perfiles_con_codigo,
  (SELECT COUNT(*) FROM friends) as relaciones_amistad,
  (SELECT COUNT(*) FROM friends WHERE status = 'accepted') as amistades_aceptadas;
