# 🚀 Guía Rápida de Migración a Supabase

## ✅ Lo que ya está hecho

- [x] Cliente de Supabase configurado (`lib/supabase.ts`)
- [x] Servicios de autenticación (`lib/auth.ts`)
- [x] Servicios de comidas (`lib/meals.ts`)
- [x] Servicios de transporte (`lib/transport.ts`)
- [x] Servicios de dashboard (`lib/dashboard.ts`)
- [x] Schema SQL para Supabase (`database/supabase-schema.sql`)
- [x] Ejemplos de uso (`lib/examples.tsx`)
- [x] Dependencias instaladas

## 📋 Lo que necesitas hacer

### 1. Crear proyecto en Supabase (5 minutos)

1. Ve a https://supabase.com
2. Crea una cuenta (gratis)
3. Crea un nuevo proyecto
4. Copia las credenciales:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon Key**: La clave pública

### 2. Configurar variables de entorno (1 minuto)

```bash
# En la raíz del proyecto
cp .env.example .env
```

Edita `.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 3. Ejecutar schema en Supabase (2 minutos)

1. En Supabase, ve a **SQL Editor**
2. Copia el contenido de `database/supabase-schema.sql`
3. Pégalo y ejecuta
4. Verifica que se crearon las tablas: `profiles`, `meals`, `transport`

### 4. Actualizar pantallas (Variable según tu código)

Reemplaza las llamadas a la API anterior con los servicios de `lib/`:

#### Antes (con backend Express):
```typescript
// Login
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Crear comida
const response = await fetch('http://localhost:3000/api/meals', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(mealData)
});
```

#### Ahora (con Supabase):
```typescript
import { signIn } from '@/lib/auth';
import { createMeal } from '@/lib/meals';

// Login
const { user, error } = await signIn({ email, password });

// Crear comida
const { data, error } = await createMeal(mealData);
```

## 🔄 Mapeo de Funcionalidades

| Funcionalidad Anterior | Nuevo Servicio Supabase |
|------------------------|-------------------------|
| `/api/auth/register` | `signUp()` |
| `/api/auth/login` | `signIn()` |
| `/api/auth/logout` | `signOut()` |
| `/api/auth/verify` | `getCurrentUser()` |
| `POST /api/meals` | `createMeal()` |
| `GET /api/meals` | `getMeals()` |
| `GET /api/meals/today` | `getTodayMeals()` |
| `DELETE /api/meals/:id` | `deleteMeal(id)` |
| `POST /api/transport` | `createTransport()` |
| `GET /api/transport` | `getTransport()` |
| `GET /api/transport/today` | `getTodayTransport()` |
| `DELETE /api/transport/:id` | `deleteTransport(id)` |
| `GET /api/dashboard` | `getDashboardStats()` |
| `GET /api/dashboard/weekly` | `getWeeklyData()` |

## 🎯 Archivos que necesitas modificar

Busca en tu código estos patrones y reemplázalos:

1. **AuthContext** o servicios de autenticación
   - Reemplazar con `lib/auth.ts`

2. **Pantallas de login/registro**
   - Usar `signIn()` y `signUp()` de `lib/auth.ts`

3. **Pantalla de comidas**
   - Usar funciones de `lib/meals.ts`

4. **Pantalla de transporte**
   - Usar funciones de `lib/transport.ts`

5. **Pantalla de dashboard**
   - Usar funciones de `lib/dashboard.ts`

## 💡 Ejemplos Completos

Consulta `lib/examples.tsx` para ver ejemplos completos de:
- Hook de autenticación
- Pantalla de login
- Pantalla de comidas
- Pantalla de dashboard
- Protección de rutas
- Real-time updates (opcional)

## 🧪 Probar la Integración

```bash
# 1. Reiniciar el servidor (importante después de cambiar .env)
npm start

# 2. Probar registro de usuario
# - Abre la app
# - Crea una cuenta
# - Verifica en Supabase > Authentication que se creó el usuario

# 3. Probar creación de datos
# - Crea una comida
# - Verifica en Supabase > Table Editor > meals que se guardó

# 4. Probar dashboard
# - Ve al dashboard
# - Verifica que se muestren las estadísticas
```

## ⚠️ Problemas Comunes

### "Invalid API key"
- Verifica que copiaste bien las credenciales
- Reinicia el servidor de Expo después de cambiar `.env`

### "No rows returned"
- Verifica que ejecutaste el schema SQL
- Verifica que estés autenticado

### "Permission denied"
- Las políticas RLS están activas
- Solo puedes ver/editar tus propios datos

## 🎉 ¡Listo!

Una vez completados estos pasos, tu app estará completamente integrada con Supabase y podrás:
- ✅ Registrar y autenticar usuarios
- ✅ Guardar datos en la nube
- ✅ Acceder desde cualquier dispositivo
- ✅ Datos protegidos con RLS
- ✅ Sin necesidad de servidor propio

## 📚 Documentación Completa

Para más detalles, consulta:
- `SUPABASE_SETUP.md` - Configuración completa
- `lib/examples.tsx` - Ejemplos de código
- [Docs de Supabase](https://supabase.com/docs)

---

**¿Necesitas ayuda?** Revisa los ejemplos en `lib/examples.tsx` o consulta la documentación de Supabase.
