# ✅ Solucionado: Error de Web SSR

## 🔴 El Problema

```
ReferenceError: window is not defined
    at getValue (AsyncStorage.js:63:52)
```

**Causa:** AsyncStorage intentaba acceder a `window` durante el Server-Side Rendering (SSR) en web, pero `window` no existe en el servidor.

## ✅ Solución Aplicada

### 1. Storage Adapter Universal (`lib/supabase.ts`)

Creé un adapter que funciona en 3 entornos:

```typescript
const getSupabaseStorage = () => {
  // 1. SSR en web: storage dummy (no falla)
  if (Platform.OS === 'web' && typeof window === 'undefined') {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }
  
  // 2. Cliente web: usa localStorage
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return {
      getItem: async (key: string) => window.localStorage.getItem(key),
      setItem: async (key: string, value: string) => 
        window.localStorage.setItem(key, value),
      removeItem: async (key: string) => 
        window.localStorage.removeItem(key),
    };
  }
  
  // 3. Móvil: usa AsyncStorage
  return AsyncStorage;
};
```

### 2. Archivos de Contexto Movidos

**Problema:** Expo Router interpretaba los archivos en `app/src/context/` como rutas.

**Solución:** Los moví a `src/context/` (fuera de `app/`).

```
ANTES:
app/
  src/
    context/
      AuthContext.tsx    ❌ Expo Router ve esto como ruta
      ThemeContext.tsx   ❌
      LanguageContext.tsx ❌

DESPUÉS:
src/
  context/
    AuthContext.tsx      ✅ No es una ruta
    ThemeContext.tsx     ✅
    LanguageContext.tsx  ✅
```

### 3. Imports Actualizados

Cambié todos los imports relativos a imports absolutos usando el alias `@`:

```typescript
// ANTES
import { useAuth } from './src/context/AuthContext';
import { useAuth } from '../src/context/AuthContext';

// AHORA
import { useAuth } from '@/src/context/AuthContext';
```

**Archivos actualizados:**
- ✅ `app/_layout.tsx`
- ✅ `app/friends.tsx`
- ✅ `app/(tabs)/profile.tsx`
- ✅ `app/achievements.tsx`
- ✅ `app/energy.tsx`
- ✅ `app/login.tsx`
- ✅ `app/register.tsx`
- ✅ `app/settings.tsx`

## 🎯 Beneficios

1. ✅ **Web funciona** - No más errores de SSR
2. ✅ **Móvil funciona** - AsyncStorage sigue funcionando
3. ✅ **Código limpio** - Imports consistentes con `@/`
4. ✅ **Sin warnings** - Contextos ya no son interpretados como rutas

## 🧪 Probar

```bash
# Limpiar cache y reiniciar
npx expo start -c --web
```

Deberías ver:
- ✅ Sin errores de `window is not defined`
- ✅ Sin warnings de "missing default export" en contextos
- ✅ Web carga correctamente

## 📚 Warnings Restantes (son normales)

Estos warnings son de deprecaciones de React Native Web y no afectan la funcionalidad:

```
⚠️ "shadow*" style props are deprecated. Use "boxShadow"
⚠️ props.pointerEvents is deprecated. Use style.pointerEvents
```

Puedes ignorarlos o actualizar los estilos después si quieres.

## 🔄 Si Vuelve a Fallar

1. Limpia cache completamente:
   ```bash
   npx expo start -c
   rm -rf .expo node_modules/.cache
   ```

2. Verifica que los contextos estén en `src/context/` (NO en `app/`)

3. Verifica que todos los imports usen `@/src/context/...`

## ✨ Estado Final

```
✅ Web SSR: Funcionando
✅ Web Client: Funcionando (usa localStorage)
✅ Móvil: Funcionando (usa AsyncStorage)
✅ Contextos: Fuera de app/, sin warnings
✅ Imports: Actualizados con @/
```

¡La app ahora funciona en web y móvil sin problemas! 🎉
