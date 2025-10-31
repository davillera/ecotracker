# 📚 Servicios de Supabase

Este directorio contiene todos los servicios para interactuar con Supabase.

## 📁 Archivos

### `supabase.ts` - Cliente y Tipos
Cliente de Supabase configurado con AsyncStorage para persistencia de sesión.

```typescript
import { supabase } from '@/lib/supabase';
// Usar directamente para queries custom si es necesario
```

**Tipos exportados:**
- `User` - Usuario
- `Meal` - Comida
- `Transport` - Transporte
- `DashboardStats` - Estadísticas

---

### `auth.ts` - Autenticación

#### `signUp({ email, password, name })`
Registra un nuevo usuario.

```typescript
const { user, session, error } = await signUp({
  email: 'user@example.com',
  password: 'password123',
  name: 'Usuario'
});
```

#### `signIn({ email, password })`
Inicia sesión.

```typescript
const { user, session, error } = await signIn({
  email: 'user@example.com',
  password: 'password123'
});
```

#### `signOut()`
Cierra la sesión.

```typescript
const { error } = await signOut();
```

#### `getCurrentUser()`
Obtiene el usuario actual.

```typescript
const { user, error } = await getCurrentUser();
```

#### `onAuthStateChange(callback)`
Escucha cambios en la autenticación.

```typescript
const subscription = onAuthStateChange((user) => {
  console.log('Usuario cambió:', user);
});

// Limpiar suscripción
subscription.unsubscribe();
```

---

### `meals.ts` - Gestión de Comidas

#### `createMeal(data)`
Crea una nueva comida.

```typescript
const { data, error } = await createMeal({
  name: 'Ensalada',
  type: 'vegetariano',
  grams: 250,
  co2: 0.33
});
```

**Tipos válidos:** `'vegetariano'`, `'vegano'`, `'carne_roja'`, `'carne_blanca'`, `'pescado'`

#### `getMeals()`
Obtiene todas las comidas del usuario.

```typescript
const { data, error } = await getMeals();
// data: Meal[]
```

#### `getTodayMeals()`
Obtiene las comidas de hoy.

```typescript
const { data, error } = await getTodayMeals();
```

#### `deleteMeal(id)`
Elimina una comida.

```typescript
const { error } = await deleteMeal('meal-id');
```

#### `getMealStats()`
Obtiene estadísticas de comidas.

```typescript
const { data, error } = await getMealStats();
// data: { total_co2, count, by_type }
```

---

### `transport.ts` - Gestión de Transporte

#### `createTransport(data)`
Crea un nuevo viaje.

```typescript
const { data, error } = await createTransport({
  type: 'metro',
  distance: 10,
  co2: 0.5
});
```

**Tipos válidos:** `'coche'`, `'moto'`, `'autobus'`, `'metro'`, `'bicicleta'`, `'caminando'`

#### `getTransport()`
Obtiene todos los viajes del usuario.

```typescript
const { data, error } = await getTransport();
// data: Transport[]
```

#### `getTodayTransport()`
Obtiene los viajes de hoy.

```typescript
const { data, error } = await getTodayTransport();
```

#### `deleteTransport(id)`
Elimina un viaje.

```typescript
const { error } = await deleteTransport('transport-id');
```

#### `getTransportStats()`
Obtiene estadísticas de transporte.

```typescript
const { data, error } = await getTransportStats();
// data: { total_co2, total_distance, count, by_type }
```

---

### `dashboard.ts` - Estadísticas

#### `getDashboardStats()`
Obtiene estadísticas generales de hoy.

```typescript
const { data, error } = await getDashboardStats();
// data: { total_co2, meals_co2, transport_co2, meals_count, transport_count }
```

#### `getWeeklyData()`
Obtiene datos de los últimos 7 días.

```typescript
const { data, error } = await getWeeklyData();
// data: Array<{ date, meals_co2, transport_co2, total_co2 }>
```

#### `getCategoryBreakdown()`
Obtiene desglose por categorías de hoy.

```typescript
const { data, error } = await getCategoryBreakdown();
// data: { meals: {...}, transport: {...} }
```

#### `getFullDashboard()`
Obtiene todos los datos del dashboard en una llamada.

```typescript
const { data, error } = await getFullDashboard();
// data: { stats, weekly, breakdown }
```

---

### `examples.tsx` - Ejemplos Completos

Contiene ejemplos completos de uso en componentes React Native:
- Hook de autenticación
- Pantalla de login
- Pantalla de comidas
- Pantalla de dashboard
- Protección de rutas
- Subscripciones en tiempo real

## 🎯 Patrones de Uso

### Manejo de Errores

Todas las funciones retornan `{ data, error }`:

```typescript
const { data, error } = await getMeals();

if (error) {
  console.error('Error:', error);
  Alert.alert('Error', error.message);
  return;
}

// Usar data
setMeals(data);
```

### Hooks Personalizados

```typescript
function useMeals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    const { data, error } = await getMeals();
    if (!error) setMeals(data || []);
    setLoading(false);
  };

  return { meals, loading, reload: loadMeals };
}
```

### Tiempo Real (Opcional)

```typescript
useEffect(() => {
  // Cargar datos iniciales
  loadMeals();

  // Suscribirse a cambios
  const subscription = supabase
    .channel('meals')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'meals' },
      () => loadMeals()
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

## 🔒 Seguridad

- ✅ Todas las queries están protegidas por Row Level Security (RLS)
- ✅ Los usuarios solo pueden ver/editar sus propios datos
- ✅ La autenticación se maneja automáticamente
- ✅ No es necesario pasar tokens manualmente

## 🚀 Mejores Prácticas

1. **Siempre manejar errores**
   ```typescript
   if (error) {
     // Manejar error
   }
   ```

2. **Loading states**
   ```typescript
   const [loading, setLoading] = useState(false);
   setLoading(true);
   await createMeal(data);
   setLoading(false);
   ```

3. **Recargar después de mutaciones**
   ```typescript
   await createMeal(data);
   await getMeals(); // Recargar lista
   ```

4. **Limpiar suscripciones**
   ```typescript
   useEffect(() => {
     const sub = onAuthStateChange(...);
     return () => sub.unsubscribe();
   }, []);
   ```

## 📖 Más Información

- Ver `examples.tsx` para ejemplos completos
- Ver `SUPABASE_SETUP.md` para configuración
- Ver [Docs de Supabase](https://supabase.com/docs)
