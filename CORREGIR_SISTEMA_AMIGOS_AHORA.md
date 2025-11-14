# 🚀 ACCIÓN INMEDIATA: Corrección de Sistema de Amigos

## ✅ CAMBIOS EN EL CÓDIGO (Ya Aplicados)

Los siguientes archivos ya han sido corregidos:
- ✅ `app/friends.tsx` - Sistema bidireccional y columnas CO₂ corregidas

## 📋 PASOS A SEGUIR

### 1️⃣ Ejecutar Script SQL en Supabase (IMPORTANTE)

Ve a tu proyecto Supabase → SQL Editor → Nueva Query y ejecuta:

```sql
-- Archivo: database/FIX_FRIENDS_BIDIRECTIONAL.sql
-- Este script corrige las amistades existentes que solo están en una dirección
```

O copia y pega el contenido completo del archivo `FIX_FRIENDS_BIDIRECTIONAL.sql`

### 2️⃣ Reiniciar la App

```bash
# Detener la app si está corriendo (Ctrl+C)
# Luego reiniciar:
npm start
```

## 🐛 PROBLEMAS CORREGIDOS

### ✅ Problema 1: Amistades solo en una dirección
- **Antes**: Usuario A agrega a B, pero B no ve a A en su lista
- **Ahora**: Ambos usuarios se ven mutuamente en sus listas

### ✅ Problema 2: Tabla de posiciones muestra 0.00 kg
- **Antes**: Columna incorrecta (`carbon_footprint` no existe)
- **Ahora**: Usa la columna correcta (`co2`) y muestra valores reales

### ✅ Problema 3: Error "Ya son amigos" cuando no lo son
- **Antes**: Solo verificaba una dirección de la amistad
- **Ahora**: Verifica ambas direcciones correctamente

## 🧪 CÓMO PROBAR

1. **Agregar un amigo**:
   - Usuario A comparte su código con Usuario B
   - Usuario B ingresa el código
   - ✅ Ambos deben aparecer en las listas del otro

2. **Tabla de posiciones**:
   - Verifica que tu huella de CO₂ se muestre correctamente (no 0.00)
   - Debe coincidir con tus datos de comidas y transporte

3. **Eliminar amigo**:
   - Elimina un amigo
   - ✅ Debe desaparecer de ambas listas

## 📊 VERIFICACIÓN EN SUPABASE

Después de ejecutar el script SQL, deberías ver:
- Cada par de amigos aparece 2 veces en la tabla `friends` (una por dirección)
- Si había amistades unidireccionales, se crearon las inversas automáticamente

## 🆘 Si Algo Sale Mal

1. **No puedo agregar amigos**: Ejecuta el script `FIX_FRIENDS_BIDIRECTIONAL.sql`
2. **Sigue mostrando 0.00 kg**: Verifica que tengas registros en `meals` o `transport`
3. **Errores en la app**: Reinicia completamente con `npm start`

---

**Archivos Modificados**:
- `app/friends.tsx`
- `database/FIX_FRIENDS_BIDIRECTIONAL.sql` (nuevo)

**Documentación Completa**: Ver `SOLUCION_AMIGOS_Y_RANKING.md`
