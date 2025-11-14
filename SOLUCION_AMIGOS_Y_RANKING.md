# SOLUCIÓN A PROBLEMAS DEL SISTEMA DE AMIGOS Y TABLA DE POSICIONES

## Problemas Identificados

### 1. Sistema de Amigos Bidireccional Incompleto
- **Síntoma**: Cuando el usuario A agrega al usuario B con su código, B aparece en la lista de A, pero A no aparece en la lista de B
- **Causa**: La verificación solo buscaba amistades donde `user_id = actual AND friend_id = amigo`, pero no verificaba la relación inversa
- **Impacto**: Mensajes de "Ya son amigos" cuando intentas agregar a alguien que te agregó primero

### 2. Tabla de Posiciones Muestra 0.00 kg CO₂
- **Síntoma**: Los usuarios aparecen con 0.00 kg CO₂ en la tabla de posiciones a pesar de tener emisiones registradas
- **Causa**: El código usaba `carbon_footprint` pero las tablas `meals` y `transport` usan la columna `co2`
- **Impacto**: Rankings incorrectos y estadísticas erróneas

## Soluciones Implementadas

### ✅ Correcciones en `app/friends.tsx`

#### 1. Cambio de nombre de columna (líneas 72-84, 134-145)
```typescript
// ANTES:
.select('carbon_footprint')
sum + m.carbon_footprint

// DESPUÉS:
.select('co2')
sum + m.co2
```

#### 2. Verificación bidireccional al agregar amigos (líneas 211-228)
```typescript
// ANTES: Solo verificaba una dirección
const { data: existing } = await supabase
  .from('friends')
  .select('id')
  .eq('user_id', user.id)
  .eq('friend_id', friendId)
  .single();

// DESPUÉS: Verifica ambas direcciones
const { data: existingForward } = await supabase
  .from('friends')
  .select('id')
  .eq('user_id', user.id)
  .eq('friend_id', friendId)
  .maybeSingle();

const { data: existingReverse } = await supabase
  .from('friends')
  .select('id')
  .eq('user_id', friendId)
  .eq('friend_id', user.id)
  .maybeSingle();

if (existingForward || existingReverse) {
  Alert.alert('Error', 'Ya son amigos');
  return;
}
```

#### 3. Carga de amigos desde ambas direcciones (líneas 88-121)
```typescript
// ANTES: Solo buscaba donde yo soy user_id
const { data: friendsData } = await supabase
  .from('friends')
  .select('id, friend_id, status')
  .eq('user_id', user.id)
  .eq('status', 'accepted');

// DESPUÉS: Busca en ambas direcciones
const { data: friendsAsUser } = await supabase
  .from('friends')
  .select('id, friend_id, status')
  .eq('user_id', user.id)
  .eq('status', 'accepted');

const { data: friendsAsFriend } = await supabase
  .from('friends')
  .select('id, user_id, status')
  .eq('friend_id', user.id)
  .eq('status', 'accepted');

// Combinar amistades y extraer IDs únicos
const friendIds = new Set<string>();
const friendshipMap = new Map<string, string>();

friendsAsUser?.forEach((f: any) => {
  friendIds.add(f.friend_id);
  friendshipMap.set(f.friend_id, f.id);
});

friendsAsFriend?.forEach((f: any) => {
  friendIds.add(f.user_id);
  friendshipMap.set(f.user_id, f.id);
});
```

#### 4. Eliminación bidireccional de amigos (líneas 258-281)
```typescript
// ANTES: Solo eliminaba una dirección
const { error } = await supabase
  .from('friends')
  .delete()
  .eq('id', friendshipId);

// DESPUÉS: Elimina ambas direcciones
const { error: error1 } = await supabase
  .from('friends')
  .delete()
  .eq('user_id', user?.id)
  .eq('friend_id', friendId);

const { error: error2 } = await supabase
  .from('friends')
  .delete()
  .eq('user_id', friendId)
  .eq('friend_id', user?.id);
```

### ✅ Script SQL para Corregir Datos Existentes

**Archivo**: `database/FIX_FRIENDS_BIDIRECTIONAL.sql`

Este script:
1. Identifica amistades que solo existen en una dirección
2. Crea automáticamente las relaciones inversas faltantes
3. Verifica que todas las amistades sean bidireccionales
4. Muestra un resumen completo del estado

## Cómo Aplicar las Soluciones

### Paso 1: Aplicar Cambios en el Código (✅ Ya aplicados)
Los cambios en `app/friends.tsx` ya están aplicados y listos.

### Paso 2: Corregir Datos Existentes en Supabase
1. Ve a tu proyecto en Supabase (https://supabase.com/dashboard)
2. Selecciona tu proyecto "EcoTracker"
3. Abre el **SQL Editor** (icono de código en el menú lateral)
4. Crea una nueva query
5. Copia y pega el contenido de `database/FIX_FRIENDS_BIDIRECTIONAL.sql`
6. Haz clic en **Run** o presiona `Ctrl+Enter`
7. Verifica los resultados:
   - Debe mostrar las amistades unidireccionales encontradas
   - Debe crear las relaciones inversas automáticamente
   - Debe mostrar un resumen de verificación

### Paso 3: Reiniciar la App
```bash
# Si la app está corriendo, detenla con Ctrl+C
# Luego reinicia:
npm start
```

### Paso 4: Probar la App
1. **Prueba de agregar amigos**:
   - Usuario A obtiene su código de amigo (ej: ABC123)
   - Usuario B ingresa ese código
   - ✅ Usuario A debe aparecer en la lista de B
   - ✅ Usuario B debe aparecer en la lista de A

2. **Prueba de tabla de posiciones**:
   - Verifica tu huella total (debe coincidir con tus registros)
   - ✅ Debe mostrar kg CO₂ reales (no 0.00)
   - ✅ Ranking debe estar ordenado de menor a mayor

3. **Prueba de eliminar amigo**:
   - Elimina un amigo desde tu lista
   - ✅ Debe desaparecer de tu lista
   - ✅ También debe desaparecer de la lista del otro usuario

## Resultados Esperados

✅ **Sistema de Amigos**:
- Cuando A agrega a B → Ambos aparecen en las listas del otro
- No se pueden crear duplicados
- Al eliminar, se elimina de ambas listas
- Mensajes de error precisos

✅ **Tabla de Posiciones**:
- Muestra correctamente los kg CO₂ de cada usuario
- Ranking ordenado de menor a mayor huella (mejor primero)
- Tu posición destacada en azul
- Datos en tiempo real

## Archivos Modificados

1. `app/friends.tsx` - Corregida lógica bidireccional y nombres de columnas
2. `database/FIX_FRIENDS_BIDIRECTIONAL.sql` - Script para corregir datos existentes

## Notas Técnicas

- El sistema ahora maneja correctamente las relaciones bidireccionales
- Se usa `maybeSingle()` en lugar de `single()` para evitar errores cuando no hay resultados
- Se usa `Set` y `Map` para evitar duplicados al combinar amistades
- La tabla de posiciones ahora consulta la columna correcta (`co2` en lugar de `carbon_footprint`)
