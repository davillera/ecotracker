# ✅ Solución Definitiva: Daniel y Daniela

## 🔍 Problema Identificado

Basado en los CSV que exportaste:

### profiles_rows.csv
- ✅ 7 usuarios con códigos
- ✅ Daniela existe (J2GTSU)
- ❌ Daniel NO existe en profiles

### friends_rows.csv
- ❌ Solo 1 relación: `a09b3e53...` → Daniela
- ❌ Falta la relación inversa: Daniela → `a09b3e53...`
- ❌ El usuario `a09b3e53...` no tiene perfil

## 💡 Conclusión

**El usuario `a09b3e53-9509-46c5-84b3-2b56794f73f3` es Daniel, pero:**
1. No tiene perfil creado en la tabla `profiles`
2. La relación de amistad no es bidireccional
3. Por eso Daniela no lo ve en su lista

## ✅ Solución en 2 Pasos

### Paso 1: Ejecutar Script SQL

**Link directo:** https://supabase.com/dashboard/project/vrusokequxdingvujzvc/sql/new

**Archivo:** `database/ARREGLAR_DANIEL_DANIELA.sql`

Este script hace 3 cosas:
1. ✅ Crea el perfil para Daniel con un código único
2. ✅ Crea la relación inversa (Daniela → Daniel)
3. ✅ Verifica que todo funcione

### Paso 2: Reiniciar la App

1. Cierra completamente la app (ambos usuarios)
2. Abre la app con Daniel
3. Ve a Perfil → Verás tu código
4. Ve a Amigos → Verás a Daniela con su nombre
5. Abre la app con Daniela
6. Ve a Amigos → Verás a Daniel con su nombre

## 📋 Contenido del Script

```sql
-- 1. Crear perfil para Daniel
INSERT INTO public.profiles (id, name, friend_code)
VALUES (
  'a09b3e53-9509-46c5-84b3-2b56794f73f3',
  'Daniel',  -- o el nombre que tenga en auth.users
  generate_friend_code()  -- código automático
);

-- 2. Crear relación Daniela → Daniel
INSERT INTO friends (user_id, friend_id, status)
VALUES (
  '5b5a1cf7-d99e-43e9-9fd9-e83ac8d36e68',  -- Daniela
  'a09b3e53-9509-46c5-84b3-2b56794f73f3',  -- Daniel
  'accepted'
);

-- 3. Verificar
-- El script también muestra varias verificaciones
```

## 🎯 Resultado Esperado

Después de ejecutar el script:

### Tabla profiles
```
+--------------------------------------+---------+-------------+
| id                                   | name    | friend_code |
+--------------------------------------+---------+-------------+
| 5b5a1cf7-d99e-43e9-9fd9-e83ac8d36e68 | Daniela | J2GTSU      |
| a09b3e53-9509-46c5-84b3-2b56794f73f3 | Daniel  | ABC123      |
+--------------------------------------+---------+-------------+
```

### Tabla friends
```
+--------------------------------------+--------------------------------------+----------+
| user_id                              | friend_id                            | status   |
+--------------------------------------+--------------------------------------+----------+
| a09b3e53... (Daniel)                 | 5b5a1cf7... (Daniela)                | accepted |
| 5b5a1cf7... (Daniela)                | a09b3e53... (Daniel)                 | accepted |
+--------------------------------------+--------------------------------------+----------+
```

### En la App

**Daniel verá:**
- ✅ Su código en Perfil
- ✅ "Daniela" en su lista de amigos (no UUID)
- ✅ Ranking con nombres

**Daniela verá:**
- ✅ Su código J2GTSU
- ✅ "Daniel" en su lista de amigos (no UUID)
- ✅ Ranking con nombres

## 🔧 Si Necesitas Cambiar el Nombre

Si el nombre "Daniel" no es correcto, antes de ejecutar el script, cámbialo en esta línea:

```sql
INSERT INTO public.profiles (id, name, friend_code)
SELECT 
  'a09b3e53-9509-46c5-84b3-2b56794f73f3',
  'NOMBRE CORRECTO AQUÍ',  -- <-- Cambia esto
  (SELECT generate_friend_code())
```

O después de ejecutar:

```sql
UPDATE public.profiles 
SET name = 'Nombre Correcto' 
WHERE id = 'a09b3e53-9509-46c5-84b3-2b56794f73f3';
```

## 🆘 Troubleshooting

### Error: "duplicate key value violates unique constraint"

Significa que el perfil ya existe. Ejecuta:

```sql
SELECT * FROM public.profiles 
WHERE id = 'a09b3e53-9509-46c5-84b3-2b56794f73f3';
```

Si existe, solo necesitas crear la relación inversa:

```sql
INSERT INTO friends (user_id, friend_id, status)
VALUES (
  '5b5a1cf7-d99e-43e9-9fd9-e83ac8d36e68',
  'a09b3e53-9509-46c5-84b3-2b56794f73f3',
  'accepted'
);
```

### Error: "function generate_friend_code() does not exist"

Primero ejecuta el script completo de `FIX_FRIENDS_RLS.sql` o agrega esto antes:

```sql
CREATE OR REPLACE FUNCTION generate_friend_code()
RETURNS VARCHAR(8) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result VARCHAR(8) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

## 📊 Verificación Manual

Después de ejecutar el script, verifica manualmente:

```sql
-- ¿Daniel tiene perfil?
SELECT * FROM profiles WHERE id = 'a09b3e53-9509-46c5-84b3-2b56794f73f3';

-- ¿Existen ambas relaciones?
SELECT 
  u1.name as usuario,
  u2.name as amigo
FROM friends f
JOIN profiles u1 ON f.user_id = u1.id
JOIN profiles u2 ON f.friend_id = u2.id
WHERE u1.name IN ('Daniel', 'Daniela')
   OR u2.name IN ('Daniel', 'Daniela');
```

Deberías ver:
- Daniel → Daniela
- Daniela → Daniel

## ✨ ¡Listo!

Después de ejecutar el script:
1. ✅ Daniel tendrá su perfil y código
2. ✅ Ambos se verán en sus listas
3. ✅ Se mostrarán nombres reales (no UUIDs)
4. ✅ El ranking funcionará correctamente

🚀 **¡Ejecuta el script ahora y prueba!**
