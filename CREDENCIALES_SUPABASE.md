# 🔑 Cómo Obtener tus Credenciales de Supabase

## Paso 1: Crear Cuenta (1 min)

1. Ve a **https://supabase.com**
2. Click en **"Start your project"**
3. Regístrate con:
   - GitHub (recomendado)
   - Google
   - Email

## Paso 2: Crear Proyecto (2 min)

1. Click en **"New Project"**
2. Llena los campos:
   ```
   Name: EcoTracker
   Database Password: [genera una segura o usa la sugerida]
   Region: [elige el más cercano a ti]
   Pricing Plan: Free (es suficiente)
   ```
3. Click en **"Create new project"**
4. Espera 1-2 minutos mientras se crea el proyecto

## Paso 3: Obtener Credenciales (30 seg)

### Opción A: Desde el Dashboard (Rápido)

1. En tu proyecto, ve a **Settings** (⚙️ abajo a la izquierda)
2. Click en **"API"**
3. Verás dos secciones importantes:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   
   **API Keys:**
   - `anon` `public` ← **Esta es la que necesitas**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```

### Opción B: Desde la Página Principal

1. En el Dashboard principal del proyecto
2. Busca **"Project API keys"**
3. Copia:
   - **URL** (Project URL)
   - **anon key** (Public/Anon key)

## Paso 4: Configurar .env (1 min)

1. Abre el archivo **`.env`** en la raíz del proyecto
2. Reemplaza los valores:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc...
   ```

3. Guarda el archivo

## Paso 5: Verificar (30 seg)

```bash
# Verificar que está bien configurado
npm run check-supabase
```

Deberías ver:
```
✅ Archivo .env encontrado
✅ EXPO_PUBLIC_SUPABASE_URL configurado
✅ EXPO_PUBLIC_SUPABASE_ANON_KEY configurado
```

## 📸 Referencia Visual

Tu pantalla de API en Supabase se verá así:

```
┌─────────────────────────────────────────────┐
│ Project API                                 │
├─────────────────────────────────────────────┤
│                                             │
│ Project URL                                 │
│ https://abcdefgh.supabase.co    [Copy]     │
│                                             │
│ API Keys                                    │
│                                             │
│ anon public    ← USA ESTA                   │
│ eyJhbGciOiJIU...                [Copy]     │
│                                             │
│ service_role   ← NO USES ESTA EN EL CLIENTE│
│ eyJhbGciOiJIU...                [Copy]     │
│                                             │
└─────────────────────────────────────────────┘
```

## ⚠️ IMPORTANTE

### ✅ SÍ usar:
- **Project URL** → Va en `EXPO_PUBLIC_SUPABASE_URL`
- **anon/public key** → Va en `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### ❌ NO usar:
- **service_role key** → NUNCA en el cliente (solo para backend/scripts)

## 🔄 Después de Configurar

1. **Reinicia Expo:**
   ```bash
   # Detén Expo si está corriendo (Ctrl+C)
   npm start
   ```

2. **Ejecuta el Schema SQL:**
   - Ve a Supabase → **SQL Editor**
   - Copia el contenido de `database/supabase-schema.sql`
   - Pega y click en **"Run"**
   - Verifica que se crearon las tablas en **Table Editor**

3. **Prueba la app:**
   ```bash
   npm start
   # Registra un usuario
   # Crea una comida
   # Verifica en Supabase que se guardó
   ```

## 🆘 Problemas Comunes

### "Invalid API key"
- Verifica que copiaste la **anon/public key** (no la service_role)
- Verifica que no haya espacios extra
- Reinicia Expo después de modificar `.env`

### "Cannot connect to Supabase"
- Verifica que el proyecto esté activo en Supabase
- Verifica que la URL sea correcta
- Chequea tu conexión a internet

### Variables no se cargan
- Las variables DEBEN empezar con `EXPO_PUBLIC_`
- Reinicia Expo SIEMPRE después de cambiar `.env`
- Limpia caché: `npx expo start -c`

## 📚 Siguiente Paso

Una vez configurado el `.env`, continúa con:
- **Ejecutar schema SQL:** Ver `SUPABASE_SETUP.md` sección 3
- **Migrar código:** Ver `MIGRATION_GUIDE.md`

---

**¿Ya tienes tus credenciales? ¡Perfecto! Ahora ejecuta el schema SQL.** 🚀
