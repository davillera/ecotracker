# 🚀 Integración con Supabase - EcoTracker

## 📋 Resumen

EcoTracker ahora está integrado con Supabase, proporcionando:
- ✅ Autenticación de usuarios
- ✅ Base de datos PostgreSQL
- ✅ Row Level Security (RLS)
- ✅ API en tiempo real
- ✅ Backend serverless

## 🔧 Configuración

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Copia las credenciales:
   - **Project URL**: `https://tu-proyecto.supabase.co`
   - **Anon Key**: La clave pública (anon/public)

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` y agrega tus credenciales:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 3. Ejecutar el Schema de Base de Datos

1. Ve al **SQL Editor** en tu proyecto de Supabase
2. Copia el contenido de `database/supabase-schema.sql`
3. Pégalo en el editor y ejecuta
4. Verifica que se crearon las tablas: `profiles`, `meals`, `transport`

### 4. Instalar Dependencias

Las dependencias ya están instaladas. Si necesitas reinstalarlas:

```bash
npm install
```

Dependencias agregadas:
- `@supabase/supabase-js` - Cliente de Supabase
- `react-native-url-polyfill` - Polyfill para URLs en React Native

## 📁 Estructura del Proyecto

```
ecotracker/
├── lib/                      # 📚 Servicios de Supabase
│   ├── supabase.ts          # Cliente y tipos de Supabase
│   ├── auth.ts              # Servicios de autenticación
│   ├── meals.ts             # Servicios de comidas
│   ├── transport.ts         # Servicios de transporte
│   └── dashboard.ts         # Servicios de dashboard
├── database/
│   └── supabase-schema.sql  # Schema de base de datos
├── .env.example             # Variables de entorno (ejemplo)
└── .env                     # Variables de entorno (crear)
```

## 🔐 Servicios Disponibles

### Autenticación (`lib/auth.ts`)

```typescript
import { signUp, signIn, signOut, getCurrentUser } from '@/lib/auth';

// Registrar usuario
const { user, session, error } = await signUp({
  email: 'user@example.com',
  password: 'password123',
  name: 'Usuario'
});

// Iniciar sesión
const { user, session, error } = await signIn({
  email: 'user@example.com',
  password: 'password123'
});

// Cerrar sesión
await signOut();

// Obtener usuario actual
const { user, error } = await getCurrentUser();
```

### Comidas (`lib/meals.ts`)

```typescript
import { createMeal, getMeals, getTodayMeals, deleteMeal } from '@/lib/meals';

// Crear comida
const { data, error } = await createMeal({
  name: 'Ensalada',
  type: 'vegetariano',
  grams: 250,
  co2: 0.33
});

// Obtener comidas
const { data, error } = await getMeals();

// Obtener comidas de hoy
const { data, error } = await getTodayMeals();

// Eliminar comida
const { error } = await deleteMeal('meal-id');
```

### Transporte (`lib/transport.ts`)

```typescript
import { createTransport, getTransport, getTodayTransport } from '@/lib/transport';

// Crear viaje
const { data, error } = await createTransport({
  type: 'metro',
  distance: 10,
  co2: 0.5
});

// Obtener viajes
const { data, error } = await getTransport();

// Obtener viajes de hoy
const { data, error } = await getTodayTransport();
```

### Dashboard (`lib/dashboard.ts`)

```typescript
import { getDashboardStats, getWeeklyData, getFullDashboard } from '@/lib/dashboard';

// Obtener estadísticas
const { data, error } = await getDashboardStats();

// Obtener datos semanales
const { data, error } = await getWeeklyData();

// Obtener datos completos
const { data, error } = await getFullDashboard();
```

## 🎯 Ejemplo de Uso en Componentes

### Hook de Autenticación

```typescript
import { useState, useEffect } from 'react';
import { onAuthStateChange } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const subscription = onAuthStateChange(setUser);
    return () => subscription.unsubscribe();
  }, []);

  return { user };
}
```

### Componente de Login

```typescript
import { useState } from 'react';
import { signIn } from '@/lib/auth';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { user, error } = await signIn({ email, password });
    if (error) {
      alert(error.message);
    } else {
      // Navegar a pantalla principal
    }
  };

  return (
    // Tu UI aquí
  );
}
```

## 🔒 Row Level Security (RLS)

El schema incluye políticas de seguridad que garantizan:

- ✅ Los usuarios solo pueden ver sus propios datos
- ✅ Los usuarios solo pueden modificar sus propios datos
- ✅ Los datos están protegidos a nivel de base de datos
- ✅ No se requiere lógica de seguridad adicional en el cliente

## 📊 Base de Datos

### Tablas

#### `profiles`
- `id` - UUID (referencia a auth.users)
- `name` - TEXT
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

#### `meals`
- `id` - UUID (auto-generado)
- `user_id` - UUID (referencia a auth.users)
- `name` - TEXT
- `type` - TEXT (vegetariano, vegano, carne_roja, carne_blanca, pescado)
- `grams` - DECIMAL
- `co2` - DECIMAL
- `created_at` - TIMESTAMP

#### `transport`
- `id` - UUID (auto-generado)
- `user_id` - UUID (referencia a auth.users)
- `type` - TEXT (coche, moto, autobus, metro, bicicleta, caminando)
- `distance` - DECIMAL
- `co2` - DECIMAL
- `created_at` - TIMESTAMP

### Vistas

- `daily_stats` - Estadísticas diarias por usuario
- `weekly_stats` - Estadísticas semanales por usuario

## 🧪 Probar la Integración

1. **Crear usuario**: Usa la función `signUp`
2. **Verificar email**: Supabase enviará un email de confirmación (si lo configuraste)
3. **Iniciar sesión**: Usa la función `signIn`
4. **Crear datos**: Usa `createMeal` o `createTransport`
5. **Ver datos**: Usa `getMeals` o `getTransport`

## 🚀 Migrar desde Backend Anterior

Si tenías el backend con Express/PostgreSQL:

1. ✅ **Ya no necesitas** el servidor Express
2. ✅ **Ya no necesitas** el directorio `backend/`
3. ✅ **Supabase reemplaza** toda la funcionalidad del backend
4. ✅ Las funciones de `lib/` son equivalentes a los endpoints REST anteriores

### Equivalencias

| Backend Anterior | Supabase |
|-----------------|----------|
| `POST /api/auth/register` | `signUp()` |
| `POST /api/auth/login` | `signIn()` |
| `GET /api/meals` | `getMeals()` |
| `POST /api/meals` | `createMeal()` |
| `GET /api/transport` | `getTransport()` |
| `POST /api/transport` | `createTransport()` |
| `GET /api/dashboard` | `getDashboardStats()` |

## 🔄 Próximos Pasos

1. ✅ Configurar proyecto en Supabase
2. ✅ Crear archivo `.env` con credenciales
3. ✅ Ejecutar schema en Supabase
4. 📱 Actualizar pantallas para usar los servicios de `lib/`
5. 🧪 Probar autenticación y flujos de datos
6. 🎨 Mejorar UI/UX según necesidades

## 📝 Notas Importantes

- **Seguridad**: Las claves en `.env` deben comenzar con `EXPO_PUBLIC_` para ser accesibles en el cliente
- **No compartir**: Nunca subas el archivo `.env` a Git (ya está en `.gitignore`)
- **Anon Key**: La clave anon/public es segura para usar en el cliente (está protegida por RLS)
- **Service Key**: NUNCA uses la service_role key en el cliente

## 🆘 Solución de Problemas

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctas
- Asegúrate de reiniciar el servidor de Expo después de cambiar `.env`

### Error: "No rows returned"
- Verifica que el RLS esté configurado correctamente
- Asegúrate de estar autenticado antes de hacer consultas

### Error: "Connection refused"
- Verifica que la URL de Supabase sea correcta
- Verifica que tengas conexión a internet

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase con React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-react-native)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**¡Backend completamente integrado con Supabase!** 🎉
