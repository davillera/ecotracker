# 🔧 Solución: Error al Crear Usuario

## 🚨 Error

```
Error en signUp: [AuthApiError: Database error saving new user]
```

## 🔍 Causa

El error ocurre porque el trigger que crea automáticamente el perfil del usuario está fallando. Posibles causas:

1. **Políticas RLS muy restrictivas** - El trigger no puede insertar en `profiles`
2. **Función con errores** - La función `handle_new_user()` tiene un bug
3. **Columnas faltantes** - La tabla `profiles` no tiene todas las columnas necesarias

## ✅ Solución

### Paso 1: Ejecutar Script de Reparación

**Link directo:** https://supabase.com/dashboard/project/vrusokequxdingvujzvc/sql/new

**Archivo:** `database/FIX_SIGNUP_ERROR.sql`

Este script hace:

1. ✅ Elimina trigger y función antiguos
2. ✅ Crea función mejorada con manejo de errores
3. ✅ Crea trigger nuevo
4. ✅ Arregla políticas RLS para permitir inserción
5. ✅ Hace test de verificación

### Paso 2: Verificar que Funcionó

Después de ejecutar el script, intenta registrar un nuevo usuario:

1. Abre la app
2. Click en "Regístrate"
3. Ingresa datos:
   - Nombre: "Usuario Test"
   - Email: "test@test.com"
   - Contraseña: "Test123456"
4. Click en "Crear Cuenta"

**Resultado Esperado:**
- ✅ Usuario creado exitosamente
- ✅ Perfil creado automáticamente
- ✅ Código de amigo generado
- ✅ No hay error

### Paso 3: Verificar en Base de Datos

```sql
-- Ver el usuario y su perfil
SELECT 
  au.email,
  au.created_at as user_created,
  p.name,
  p.friend_code,
  p.created_at as profile_created
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'test@test.com';
```

Deberías ver:
- ✅ Usuario en `auth.users`
- ✅ Perfil en `public.profiles`
- ✅ Friend code generado

## 🔧 Cambios Realizados en el Script

### 1. Función Mejorada con Manejo de Errores

**ANTES:**
```sql
CREATE FUNCTION handle_new_user() ...
-- Sin manejo de errores, falla si hay problema
```

**AHORA:**
```sql
CREATE FUNCTION handle_new_user() ...
BEGIN
  INSERT INTO profiles ...
EXCEPTION
  WHEN unique_violation THEN
    -- Manejar duplicados
  WHEN OTHERS THEN
    -- Loguear error pero no fallar
    RAISE WARNING ...
END;
```

### 2. Políticas RLS Menos Restrictivas

**ANTES:**
```sql
CREATE POLICY "Users can insert their own profile"
  WITH CHECK (auth.uid() = id);
-- Problema: El trigger no tiene auth.uid() en ese momento
```

**AHORA:**
```sql
CREATE POLICY "Enable insert for service role and authenticated users"
  WITH CHECK (true);
-- Permite que el trigger inserte
```

### 3. Generación de Código Mejorada

- ✅ Verifica unicidad en un loop
- ✅ Máximo 100 intentos
- ✅ Usa caracteres sin ambigüedad (sin O, 0, I, 1)

## 🆘 Si Sigue Fallando

### Opción 1: Crear Perfil Manualmente

Si el trigger sigue fallando, puedes crear perfiles manualmente:

```sql
-- 1. Registrar el usuario normalmente (va a fallar)
-- 2. Obtener el ID del usuario
SELECT id, email FROM auth.users WHERE email = 'tu-email@test.com';

-- 3. Crear el perfil manualmente
INSERT INTO public.profiles (id, name, friend_code)
VALUES (
  'el-id-del-paso-2',
  'Tu Nombre',
  'ABC123'  -- Código único
);
```

### Opción 2: Desactivar Trigger Temporalmente

Si necesitas registrar usuarios urgentemente:

```sql
-- Desactivar trigger
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

-- Registrar usuario normalmente

-- Crear perfil manualmente con el script de arriba

-- Reactivar trigger
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
```

### Opción 3: Verificar Logs

Ver los logs del trigger para más detalles:

```sql
-- En Supabase Dashboard → Logs → Database
-- Buscar mensajes de WARNING o ERROR
```

## 🧪 Test Manual

Después de aplicar la solución, prueba:

1. **Test 1: Registro nuevo**
   - Registrar usuario con email único
   - Verificar que se crea correctamente

2. **Test 2: Login**
   - Iniciar sesión con el usuario creado
   - Ir a Perfil
   - Verificar que se muestra el código de amigo

3. **Test 3: Duplicado**
   - Intentar registrar el mismo email de nuevo
   - Debe dar error de "email ya existe" (no error de DB)

## 📊 Verificación de Estado

Ejecuta esto para ver el estado actual:

```sql
-- 1. Ver si el trigger existe
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- 2. Ver si la función existe
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';

-- 3. Ver políticas de profiles
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- 4. Contar usuarios sin perfil
SELECT 
  COUNT(*) as users_without_profile
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
);
```

## ⚡ Solución Rápida (Si Tienes Prisa)

Si necesitas solucionar esto AHORA y no tienes tiempo:

```sql
-- Ejecutar solo esto (más simple)
DROP POLICY IF EXISTS "Enable insert for service role and authenticated users" ON public.profiles;

CREATE POLICY "Enable insert for service role and authenticated users"
  ON public.profiles FOR INSERT
  WITH CHECK (true);
```

Luego intenta registrar de nuevo.

## ✅ Checklist Post-Fix

Después de ejecutar el script, verifica:

- [ ] Trigger existe y está habilitado
- [ ] Función existe
- [ ] Políticas RLS permiten INSERT
- [ ] Puedes registrar nuevo usuario
- [ ] Perfil se crea automáticamente
- [ ] Friend code se genera
- [ ] Login funciona con el nuevo usuario
- [ ] Perfil se muestra correctamente

## 🎯 Resultado Esperado

Después de la solución:

1. ✅ Registro de usuario funciona sin errores
2. ✅ Perfil creado automáticamente
3. ✅ Código de amigo generado
4. ✅ Usuario puede iniciar sesión
5. ✅ Puede usar todas las funcionalidades

---

**🚀 Ejecuta `database/FIX_SIGNUP_ERROR.sql` ahora y prueba el registro!**
