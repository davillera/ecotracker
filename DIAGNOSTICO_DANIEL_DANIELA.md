# 🔍 Diagnóstico y Solución: Daniel y Daniela

## ✅ Lo Que Ya Está Bien

Basado en tu CSV de profiles:

```
✅ Todos los usuarios tienen friend_code
✅ Daniela tiene código: J2GTSU
✅ Hay 7 usuarios registrados
```

## ❓ Lo Que Falta Información

**No veo a "Daniel" en la lista de profiles:**

Usuarios en profiles:
- Ricardo (VX82PU)
- Andrea (P5WWZ2)
- **Daniela (J2GTSU)** ✅
- Luis Vega (QVH9C3)
- Juan Pablo (7N8J89)
- Ricardo (KLPLE4)
- Sergio (L2QVLA)

**¿Daniel no existe o tiene otro nombre?**

## 🔧 Cambios Realizados en el Código

### `app/friends.tsx` - Versión Mejorada

Cambié el método de obtener nombres para que sea más robusto:

**ANTES** (dependía de foreign key):
```typescript
.select(`
  id,
  friend_id,
  profiles!friends_friend_id_fkey(name, id)
`)
```

**AHORA** (consulta directa):
```typescript
// 1. Obtener amigos
.select('id, friend_id, status')

// 2. Para cada amigo, obtener su perfil
const { data: friendProfile } = await supabase
  .from('profiles')
  .select('name')
  .eq('id', f.friend_id)
  .single();

// 3. Usar el nombre
const friendName = friendProfile?.name || `Usuario ${f.friend_id.substring(0, 8)}`;
```

## 📊 Pasos de Diagnóstico

### Paso 1: Ejecutar Script de Diagnóstico

Ve a Supabase SQL Editor y ejecuta:
**Archivo:** `database/DIAGNOSTICO_AMIGOS.sql`

Esto te mostrará:
1. Todos los usuarios registrados
2. Todos los perfiles con códigos
3. Búsqueda específica de "Daniel"
4. Todas las relaciones de amistad
5. Amigos de Daniela
6. Quién tiene a Daniela como amiga
7. Políticas RLS
8. Resumen de cantidades

### Paso 2: Exportar Tabla Friends

```sql
SELECT * FROM friends;
```

O exporta la tabla `friends` a CSV y compártela.

## 🎯 Escenarios Posibles

### Escenario A: Daniel no tiene perfil

**Síntoma:** Daniel puede iniciar sesión pero no ve su código.

**Solución:**
```sql
-- Ver si Daniel existe en auth.users
SELECT id, email FROM auth.users WHERE email LIKE '%daniel%';

-- Si existe pero no tiene perfil, crearlo:
INSERT INTO public.profiles (id, name, friend_code)
VALUES (
  'id-de-daniel-aqui',
  'Daniel',
  'ABC123'  -- Cambia esto por un código único
);
```

### Escenario B: La amistad no es bidireccional

**Síntoma:** Daniel ve a Daniela, pero Daniela no ve a Daniel.

**Verificar:**
```sql
-- Ver si existe la relación Daniel → Daniela
SELECT * FROM friends 
WHERE user_id = 'id-de-daniel' 
  AND friend_id = '5b5a1cf7-d99e-43e9-9fd9-e83ac8d36e68';

-- Ver si existe la relación Daniela → Daniel
SELECT * FROM friends 
WHERE user_id = '5b5a1cf7-d99e-43e9-9fd9-e83ac8d36e68' 
  AND friend_id = 'id-de-daniel';
```

**Solución:** Crear ambas relaciones
```sql
-- Relación 1: Daniel → Daniela
INSERT INTO friends (user_id, friend_id, status)
VALUES ('id-de-daniel', '5b5a1cf7-d99e-43e9-9fd9-e83ac8d36e68', 'accepted');

-- Relación 2: Daniela → Daniel
INSERT INTO friends (user_id, friend_id, status)
VALUES ('5b5a1cf7-d99e-43e9-9fd9-e83ac8d36e68', 'id-de-daniel', 'accepted');
```

### Escenario C: Políticas RLS bloqueando

**Verificar:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'friends';
```

**Solución:** Ejecutar script de políticas:
```sql
-- Ya está en database/FIX_FRIENDS_RLS.sql
-- Sección 10: Arreglar políticas RLS de friends
```

## 🚀 Acción Inmediata

### Opción 1: Script Completo (Recomendado)

Ejecuta el script completo que arregla todo:
**Archivo:** `ARREGLAR_AMIGOS_COMPLETO.md` → Sección "Paso 1"

### Opción 2: Diagnóstico Primero

1. Ejecuta: `database/DIAGNOSTICO_AMIGOS.sql`
2. Comparte los resultados
3. Te diré exactamente qué hacer

## 📝 Información que Necesito

Para ayudarte mejor, comparte:

1. **Resultado de:**
   ```sql
   SELECT * FROM friends;
   ```

2. **¿Con qué cuenta está iniciando sesión Daniel?**
   - Email de Daniel
   - ¿Puede iniciar sesión correctamente?
   - ¿Ve la pantalla de Perfil?
   - ¿Ve la pantalla de Amigos?

3. **¿Qué ve exactamente Daniel?**
   - ¿Ve su código en Perfil? (Sí/No)
   - ¿Ve algún amigo en la lista? (Sí/No)
   - ¿Qué mensaje de error aparece? (Si hay)

4. **¿Qué ve exactamente Daniela?**
   - ¿Ve su código J2GTSU? (Sí/No)
   - ¿Ve a Daniel en su lista? (Sí/No)
   - ¿Qué muestra en lugar del nombre? (UUID o qué)

## ✅ Verificación Rápida

Ejecuta esto para verificar todo:

```sql
-- Ver la situación actual
SELECT 
  'Daniela' as usuario,
  p.friend_code as codigo,
  (SELECT COUNT(*) FROM friends WHERE user_id = p.id) as amigos_agregados,
  (SELECT COUNT(*) FROM friends WHERE friend_id = p.id) as aparece_en_listas
FROM profiles p
WHERE p.name = 'Daniela';
```

Debería mostrar:
- codigo: J2GTSU ✅
- amigos_agregados: número de amigos que Daniela agregó
- aparece_en_listas: número de personas que tienen a Daniela

Si ambos números son > 0 y iguales, está bien configurado.

---

**📞 Siguiente Paso:**  
Ejecuta `database/DIAGNOSTICO_AMIGOS.sql` y comparte los resultados.
