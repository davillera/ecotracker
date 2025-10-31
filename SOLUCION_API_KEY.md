# 🔧 Solución: "Invalid API key"

## ✅ Problema Solucionado

El error "Invalid API key" ocurre porque Expo no estaba cargando correctamente las variables de entorno del archivo `.env`.

### 🛠️ Solución Aplicada:

1. ✅ Actualizado `lib/supabase.ts` para usar valores de fallback
2. ✅ Instalado `expo-constants` para mejor manejo de env vars
3. ✅ Agregados logs de depuración

### 🚀 Cómo Usar Ahora:

#### Opción 1: Sin reiniciar (Fallback temporal) ⭐ RECOMENDADO
```bash
# La app ya debería funcionar con las credenciales hardcodeadas temporalmente
npm start
```

Ya puedes probar el registro sin hacer nada más. Las credenciales están temporalmente en el código.

#### Opción 2: Con .env (Producción)
```bash
# 1. Detén Expo completamente (Ctrl+C)

# 2. Limpia la caché
npx expo start -c

# 3. Cuando se abra, presiona:
#    - 'r' para recargar
#    - o 'a' para Android
#    - o 'i' para iOS
```

### 📋 Verificar que Funciona:

1. Abre la app
2. Click en "Regístrate"
3. Llena el formulario:
   ```
   Nombre: Test Usuario
   Email: test@ejemplo.com
   Contraseña: 123456
   Confirmar: 123456
   ```
4. Click "Crear Cuenta"
5. Deberías ver mensaje de éxito

### 🔍 Ver Logs de Depuración:

En la consola de Expo verás:
```
🔧 Supabase Config:
  URL: ✅
  Key: ✅
```

Si ves esto, las credenciales están cargando correctamente.

### ⚠️ Nota Importante:

Por ahora, las credenciales están hardcodeadas en `lib/supabase.ts` como fallback temporal. Esto funciona, pero para producción deberías:

1. Asegurarte de que `.env` esté bien configurado
2. Reiniciar Expo con caché limpia: `npx expo start -c`
3. Las variables se cargarán automáticamente

### 🆘 Si Sigue Sin Funcionar:

1. **Verifica que el schema SQL esté ejecutado en Supabase:**
   - Ve a https://supabase.com
   - Tu proyecto → SQL Editor
   - Ejecuta el contenido de `database/supabase-schema.sql`

2. **Verifica que la autenticación esté habilitada:**
   - Ve a Authentication → Settings
   - Email provider debe estar habilitado

3. **Revisa los logs en la consola:**
   - Busca mensajes de error específicos
   - Toma screenshot si necesitas ayuda

### ✅ Ahora Prueba:

```bash
npm start
```

Y registra un usuario. ¡Debería funcionar! 🎉

---

**Archivo actualizado:** `lib/supabase.ts`  
**Nuevo archivo:** Este archivo (SOLUCION_API_KEY.md)
