# 🔧 Solución: Error RLS Sistema de Amigos

## 🚨 Problema

**Error:**
```
ERROR: new row violates row-level security policy for table "friends"
Code: 42501
```

## 🔍 Causa Raíz

La política RLS de la tabla `friends` solo permitía insertar filas donde `user_id = auth.uid()`:

```sql
CREATE POLICY "Users can create friendships"
  ON friends FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

Cuando intentabas crear la **segunda relación bidireccional**:
```typescript
// Primera inserción: ✅ FUNCIONA
await supabase.from('friends').insert({
  user_id: user.id,      // TÚ eres user_id
  friend_id: friendId,
  status: 'accepted',
});

// Segunda inserción: ❌ FALLA
await supabase.from('friends').insert({
  user_id: friendId,     // TU AMIGO es user_id (no tú)
  friend_id: user.id,
  status: 'accepted',
});
```

La segunda falla porque intentas insertar una fila donde `user_id` NO eres tú.

## ✅ Solución Implementada

### 1. **Política RLS Mejorada**

```sql
-- NUEVA: Permitir insertar si eres user_id O friend_id
CREATE POLICY "Users can create friendships"
  ON friends FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);
```

Ahora puedes crear AMBAS relaciones bidireccionales.

### 2. **Sistema de Códigos de Amigo**

En lugar de usar UUIDs largos, ahora cada usuario tiene un código corto único de 6 caracteres:

**Ventajas:**
- ✅ Fácil de compartir: `ABC123` en lugar de `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- ✅ Fácil de escribir a mano
- ✅ Sin confusión: no usa O, 0, I, 1
- ✅ Único por usuario
- ✅ Generado automáticamente

**Implementación:**
```sql
-- Columna en profiles
ALTER TABLE public.profiles ADD COLUMN friend_code VARCHAR(8) UNIQUE;

-- Función que genera códigos aleatorios
CREATE FUNCTION generate_friend_code() RETURNS VARCHAR(8) AS $$
  -- Usa A-Z y 2-9 (sin O,0,I,1 para evitar confusión)
  -- Genera 6 caracteres aleatorios
$$;

-- Trigger automático al crear usuario
CREATE TRIGGER set_friend_code_trigger
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_friend_code();
```

### 3. **Permisos para Buscar Usuarios**

```sql
-- Permitir que cualquier usuario autenticado busque por friend_code
CREATE POLICY "Users can search by friend code"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);
```

### 4. **Ver Datos de Amigos (Ranking)**

Para calcular el ranking, necesitas ver las métricas de tus amigos:

```sql
-- Permitir ver meals de amigos aceptados
CREATE POLICY "Users can view friends meals"
  ON public.meals FOR SELECT
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM friends 
      WHERE friends.user_id = auth.uid() AND friends.friend_id = meals.user_id
      AND friends.status = 'accepted'
    )
  );
```

Lo mismo para `transport` y `energy_consumption`.

## 📋 Pasos para Aplicar

### Opción 1: Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en https://supabase.com
2. SQL Editor (menú izquierdo)
3. New Query
4. Copia y pega el contenido de `database/FIX_FRIENDS_RLS.sql`
5. Run (ejecutar)

### Opción 2: CLI de Supabase

```bash
# Si tienes Supabase CLI instalado
supabase db reset
# o
psql -h your-db-host -U postgres -d postgres -f database/FIX_FRIENDS_RLS.sql
```

## 🧪 Verificar que Funcionó

Después de ejecutar el script, verifica:

```sql
-- 1. Ver que todos los usuarios tienen friend_code
SELECT id, name, friend_code FROM public.profiles;

-- 2. Ver las nuevas políticas de friends
SELECT policyname, cmd, with_check 
FROM pg_policies 
WHERE tablename = 'friends';

-- 3. Ver las políticas de profiles
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';
```

**Deberías ver:**
- ✅ Todos los usuarios con un `friend_code` de 6 caracteres
- ✅ Política "Users can create friendships" con `WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id)`
- ✅ Política "Users can search by friend code" en profiles

## 🎯 Uso en la App

Tu código actual en `friends.tsx` debería funcionar sin cambios:

```typescript
const handleAddFriend = async () => {
  const code = friendCode.trim().toUpperCase();

  // 1. Buscar por friend_code (ahora funciona)
  const { data: friendProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('friend_code', code)
    .single();

  // 2. Crear ambas relaciones (ahora ambas funcionan)
  await supabase.from('friends').insert({
    user_id: user.id,
    friend_id: friendProfile.id,
    status: 'accepted',
  });

  await supabase.from('friends').insert({
    user_id: friendProfile.id,
    friend_id: user.id,
    status: 'accepted',
  });
};
```

## 📱 Experiencia de Usuario

### Antes (UUID):
```
Tu ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```
❌ Difícil de compartir  
❌ Difícil de copiar  
❌ Propenso a errores  

### Ahora (Código):
```
Tu Código: ABC123
```
✅ Fácil de decir por teléfono  
✅ Fácil de escribir  
✅ Sin confusión (no usa O, 0, I, 1)  

## 🧩 Sobre las Otras Tablas

Las tablas que ves como `audit_log_entries`, `flow_state`, `identities`, etc. son **tablas del sistema de Supabase**:

- **auth.users**: Sistema de autenticación
- **identities**: Proveedores OAuth (Google, Facebook, etc.)
- **sessions**: Sesiones activas
- **refresh_tokens**: Tokens JWT
- **mfa_***: Multi-factor authentication
- **saml_***: Single Sign-On empresarial

**Son normales y necesarias. NO las elimines.**

Tus tablas reales son:
- ✅ `public.profiles`
- ✅ `public.meals`
- ✅ `public.transport`
- ✅ `public.friends`
- ✅ `public.energy_consumption` (si la creaste)
- ✅ `public.achievements` (si la creaste)

## 🚀 Resumen

1. ✅ **Ejecuta** `database/FIX_FRIENDS_RLS.sql` en Supabase
2. ✅ **Verifica** que los códigos se generaron
3. ✅ **Prueba** agregar amigos con los códigos cortos
4. ✅ **Ignora** las tablas del sistema de auth

¡El sistema de amigos ahora debería funcionar perfectamente! 🎉
