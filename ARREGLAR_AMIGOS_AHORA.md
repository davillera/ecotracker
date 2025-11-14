# 🚀 Guía Rápida: Arreglar Sistema de Amigos

## ⚡ Solución en 3 Pasos

### Paso 1: Entender el Problema

**Tu Error:**
```
ERROR: new row violates row-level security policy for table "friends"
Code: 42501
```

**¿Por qué ocurre?**
- Cuando agregas un amigo, creas 2 filas (relación bidireccional)
- La primera fila funciona: `user_id = TÚ, friend_id = AMIGO` ✅
- La segunda falla: `user_id = AMIGO, friend_id = TÚ` ❌
- La política RLS solo permite crear filas donde `user_id = TÚ`

---

### Paso 2: Ejecutar el Script de Solución

1. **Ve a Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Selecciona tu proyecto EcoTracker

2. **Abre SQL Editor:**
   - Menú izquierdo → SQL Editor
   - New Query

3. **Copia y pega el script:**
   - Abre el archivo: `database/FIX_FRIENDS_RLS.sql`
   - Copia TODO el contenido
   - Pégalo en SQL Editor

4. **Ejecuta el script:**
   - Click en "Run" (botón verde)
   - Espera a que termine (verás "Success")

---

### Paso 3: Probar

1. **Cierra y abre la app completamente**
2. **Ve a Perfil → verás tu código de 6 caracteres** (ej: `ABC123`)
3. **Comparte tu código con un amigo**
4. **Tu amigo te agrega usando tu código**
5. **¡Listo! Deberían verse mutuamente en la lista**

---

## 🎯 ¿Qué Hace el Script?

El script hace 4 cosas importantes:

### 1. Agrega Códigos de Amigo
```sql
-- Cada usuario obtiene un código único de 6 caracteres
ALTER TABLE profiles ADD COLUMN friend_code VARCHAR(8) UNIQUE;
```

**Ventajas:**
- ✅ Fácil de compartir: `ABC123` vs `a1b2c3d4-e5f6-...`
- ✅ Se genera automáticamente
- ✅ Sin caracteres confusos (no usa O, 0, I, 1)

### 2. Arregla las Políticas RLS de Friends
```sql
-- ANTES: Solo permitía user_id = TÚ
CREATE POLICY "Users can create friendships"
  WITH CHECK (auth.uid() = user_id);

-- AHORA: Permite user_id = TÚ O friend_id = TÚ
CREATE POLICY "Users can create friendships"
  WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);
```

Ahora puedes crear AMBAS filas de la relación bidireccional.

### 3. Permite Buscar por Código
```sql
-- Cualquier usuario autenticado puede buscar profiles por friend_code
CREATE POLICY "Users can search by friend code"
  ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);
```

### 4. Permite Ver Datos de Amigos (para Ranking)
```sql
-- Puedes ver meals y transport de tus amigos aceptados
-- Necesario para calcular el ranking
CREATE POLICY "Users can view friends meals" ...
CREATE POLICY "Users can view friends transport" ...
```

---

## ❓ FAQ

### ¿Perderé mis datos?
**No.** El script solo:
- Agrega una columna nueva (`friend_code`)
- Actualiza políticas de seguridad
- NO borra ni modifica datos existentes

### ¿Qué son todas esas otras tablas?
Las tablas como `audit_log_entries`, `identities`, `sessions`, etc. son **del sistema de autenticación de Supabase**. Son normales y necesarias. **NO las toques.**

Tus tablas reales:
- `profiles` - Perfiles de usuario
- `meals` - Comidas registradas
- `transport` - Transportes registrados
- `friends` - Relaciones de amistad

### ¿Por qué bidireccional?
Para que AMBOS usuarios se vean como amigos:
- Usuario A ve a Usuario B en su lista
- Usuario B ve a Usuario A en su lista

Se crean 2 filas:
```
Fila 1: user_id=A, friend_id=B
Fila 2: user_id=B, friend_id=A
```

### ¿Puedo usar UUID en lugar de códigos?
Sí, pero es mucho menos práctico:
- UUID: `a1b2c3d4-e5f6-7890-abcd-ef1234567890` (36 caracteres)
- Código: `ABC123` (6 caracteres)

Si prefieres UUID, modifica `handleAddFriend` en `friends.tsx` para validar UUID en lugar de códigos.

---

## 🔍 Verificar que Funcionó

Después de ejecutar el script, verifica en SQL Editor:

```sql
-- 1. Ver códigos generados
SELECT id, name, friend_code 
FROM public.profiles;

-- 2. Ver políticas de friends
SELECT policyname, cmd, with_check 
FROM pg_policies 
WHERE tablename = 'friends';

-- 3. Ver políticas de profiles
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'profiles';
```

**Deberías ver:**
- ✅ Cada usuario tiene un `friend_code` de 6 caracteres
- ✅ Política "Users can create friendships" incluye `OR auth.uid() = friend_id`
- ✅ Política "Users can search by friend code" existe

---

## 🆘 Si Sigue Sin Funcionar

### Error: "Código Inválido"
**Causa:** El amigo no tiene friend_code generado.
**Solución:** Que el amigo cierre y abra la app, o ejecuta:
```sql
UPDATE public.profiles 
SET friend_code = generate_friend_code() 
WHERE friend_code IS NULL;
```

### Error: "Ya son amigos"
**Causa:** Ya existe la relación.
**Solución:** Normal, no puedes agregar al mismo amigo dos veces.

### Error: "Usuario no encontrado"
**Causa:** El código está mal escrito.
**Solución:** Verifica que el código sea correcto (6 caracteres).

### Error RLS persiste
**Causa:** Las políticas viejas no se eliminaron.
**Solución:** Ejecuta esto primero:
```sql
-- Eliminar TODAS las políticas de friends
DROP POLICY IF EXISTS "Users can view own friendships" ON friends;
DROP POLICY IF EXISTS "Users can create friendships" ON friends;
DROP POLICY IF EXISTS "Users can update friendships" ON friends;
DROP POLICY IF EXISTS "Users can delete own friendships" ON friends;
```
Luego vuelve a ejecutar el script completo.

---

## 📞 Contacto

Si después de seguir esta guía sigues teniendo problemas:

1. Copia el error exacto que recibes
2. Ejecuta esto y copia el resultado:
```sql
SELECT * FROM pg_policies WHERE tablename IN ('friends', 'profiles');
```
3. Comparte ambos para poder ayudarte mejor

---

## ✨ Resultado Final

Después de aplicar la solución:

✅ Sistema de códigos de 6 caracteres  
✅ Agregar amigos funciona  
✅ Relación bidireccional automática  
✅ Ranking actualizado en tiempo real  
✅ Sin errores RLS  

**¡Tu sistema de amigos funcionará perfectamente!** 🎉
