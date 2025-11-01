# 🚀 ARREGLAR APLICACIÓN - PASOS URGENTES

## ⚠️ PROBLEMA ACTUAL
Las tablas de Supabase NO existen. La aplicación no puede funcionar sin ellas.

## ✅ SOLUCIÓN (5 MINUTOS)

### PASO 1: Crear las tablas en Supabase

1. **Abre tu proyecto de Supabase:**
   ```
   https://vrusokequxdingvujzvc.supabase.co
   ```

2. **Ve al SQL Editor:**
   - En el menú lateral izquierdo, haz clic en "SQL Editor"
   - Haz clic en "+ New query"

3. **Copia y pega el SQL:**
   - Abre el archivo: `database/EJECUTAR_ESTE_SQL.sql`
   - Copia TODO el contenido
   - Pégalo en el editor SQL de Supabase

4. **Ejecuta la query:**
   - Haz clic en "Run" o presiona `Ctrl + Enter` (Windows) o `Cmd + Enter` (Mac)
   - Espera a que termine (debería tomar menos de 5 segundos)

5. **Verifica que se crearon las tablas:**
   - Ve a "Table Editor" en el menú lateral
   - Deberías ver estas 3 tablas:
     - ✅ `profiles`
     - ✅ `meals`
     - ✅ `transport`

### PASO 2: Reinicia la aplicación

```bash
# Detén el servidor si está corriendo (Ctrl + C)

# Limpia la caché
npx expo start -c
```

## 🎉 LISTO!

Ahora la aplicación debería funcionar correctamente:
- ✅ El AuthContext tiene export default
- ✅ Los paquetes están actualizados
- ✅ Las tablas de Supabase están creadas
- ✅ Row Level Security (RLS) está configurado

## 🧪 PROBAR LA APLICACIÓN

1. **Regístrate:**
   - Usa un email válido
   - Contraseña mínimo 6 caracteres
   - Tu perfil se creará automáticamente

2. **Agrega datos:**
   - Ve a la pestaña "Comidas"
   - Agrega una comida
   - Ve a la pestaña "Transporte"
   - Agrega un viaje

3. **Revisa tus estadísticas:**
   - Ve a la pestaña "Inicio"
   - Verás tu huella de carbono

## 🆘 SI AÚN HAY ERRORES

### Error: "Could not find the table"
- Las tablas NO se crearon correctamente
- Repite el PASO 1 de nuevo
- Asegúrate de ejecutar TODO el SQL

### Error: "Invalid API key"
- Verifica el archivo `.env`
- Las credenciales deben estar correctas
- Reinicia expo: `npx expo start -c`

### Error de routing
- Borra la carpeta `.expo`
- Ejecuta: `npx expo start -c`

## 📚 ARCHIVOS IMPORTANTES

- `database/EJECUTAR_ESTE_SQL.sql` - SQL para crear tablas
- `.env` - Credenciales de Supabase
- `app/src/context/AuthContext.tsx` - Contexto de autenticación (ya arreglado)

## 🔧 COMANDOS ÚTILES

```bash
# Ver credenciales configuradas
npm run check-supabase

# Ver instrucciones de base de datos
npm run init-db

# Iniciar con caché limpia
npx expo start -c

# Iniciar para Android
npm run android

# Iniciar para iOS
npm run ios

# Iniciar para Web
npm run web
```

---

**IMPORTANTE:** Ejecuta el SQL en Supabase AHORA. Sin las tablas, la app NO funcionará.
