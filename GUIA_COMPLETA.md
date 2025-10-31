# 📱 Guía Completa - EcoTracker App

## 🎯 Resumen de la Aplicación

**EcoTracker** es una aplicación móvil desarrollada con React Native y Expo que permite a los usuarios:
- 🌱 Registrar sus comidas diarias
- 🚗 Rastrear sus viajes y medios de transporte
- 📊 Ver su huella de carbono en tiempo real
- 💡 Recibir tips ecológicos personalizados

## 🏗️ Arquitectura

### Stack Tecnológico
- **Frontend**: React Native + Expo
- **Backend**: Supabase (PostgreSQL + Auth)
- **Lenguaje**: TypeScript
- **Navegación**: Expo Router
- **Estado**: React Context API
- **Almacenamiento**: AsyncStorage

### Estructura del Proyecto
```
ecotracker/
├── app/                      # Pantallas de la aplicación
│   ├── (tabs)/              # Pantallas con navegación por tabs
│   │   ├── index.tsx        # Home
│   │   ├── meals.tsx        # Registro de comidas
│   │   ├── transport.tsx    # Registro de transporte
│   │   ├── dashboard.tsx    # Estadísticas
│   │   └── explore.tsx      # Tips ecológicos
│   ├── src/
│   │   └── context/
│   │       └── AuthContext.tsx  # Contexto de autenticación
│   ├── login.tsx            # Pantalla de login
│   ├── register.tsx         # Pantalla de registro
│   └── _layout.tsx          # Layout principal
├── lib/                      # Lógica de negocio
│   ├── supabase.ts          # Cliente de Supabase
│   ├── auth.ts              # Funciones de autenticación
│   ├── meals.ts             # CRUD de comidas
│   ├── transport.ts         # CRUD de transporte
│   └── dashboard.ts         # Estadísticas
├── database/
│   └── supabase-schema.sql  # Schema de la base de datos
├── .env                      # Variables de entorno
└── package.json
```

## 🔐 Autenticación

### Flujo de Autenticación
1. Usuario abre la app
2. Si no está autenticado → redirige a `/login`
3. Usuario puede registrarse o iniciar sesión
4. Supabase genera un JWT token
5. Token se guarda en AsyncStorage
6. Usuario accede a la app → redirige a `/(tabs)`

### AuthContext
Proporciona:
- `user`: Usuario actual
- `loading`: Estado de carga
- `signIn(email, password)`: Iniciar sesión
- `signUp(email, password, name)`: Registrarse
- `signOut()`: Cerrar sesión

## 📊 Base de Datos

### Tablas

#### profiles
- Extiende `auth.users` con información adicional
- Campos: `id`, `name`, `created_at`, `updated_at`

#### meals
- Registro de comidas del usuario
- Campos: `id`, `user_id`, `name`, `type`, `grams`, `co2`, `created_at`
- Tipos: vegano, vegetariano, carne_roja, carne_blanca, pescado

#### transport
- Registro de viajes del usuario
- Campos: `id`, `user_id`, `type`, `distance`, `co2`, `created_at`
- Tipos: coche, moto, autobus, metro, bicicleta, caminando

### Row Level Security (RLS)
Todas las tablas tienen RLS habilitado:
- Los usuarios solo pueden ver/editar sus propios datos
- Se valida automáticamente con `auth.uid()`

## 🍽️ Módulo de Comidas

### Factores de Emisión (kg CO₂ por kg de comida)
- Vegano: 0.9 kg
- Vegetariano: 1.3 kg
- Pollo/Pavo: 3.0 kg
- Pescado: 2.5 kg
- Carne Roja: 6.5 kg

### Funcionalidades
- ✅ Registrar comida con nombre, tipo y cantidad
- ✅ Calcular CO₂ automáticamente
- ✅ Ver historial del día
- ✅ Eliminar registros (mantener presionado)
- ✅ Ver total de CO₂ del día

## 🚗 Módulo de Transporte

### Factores de Emisión (kg CO₂ por km)
- Coche: 0.192 kg
- Moto: 0.103 kg
- Autobús: 0.089 kg
- Metro: 0.041 kg
- Bicicleta: 0 kg
- Caminando: 0 kg

### Funcionalidades
- ✅ Registrar viaje con tipo y distancia
- ✅ Calcular CO₂ automáticamente
- ✅ Ver historial del día
- ✅ Eliminar registros (mantener presionado)
- ✅ Ver total de CO₂ y km del día

## 📈 Dashboard

### Estadísticas Mostradas
1. **Resumen de Hoy**
   - Total CO₂ hoy
   - Promedio semanal
   - Número de comidas registradas
   - Número de viajes registrados

2. **Gráfico Semanal**
   - Emisiones de los últimos 7 días
   - Separado por comidas y transporte

3. **Comparación Global**
   - Tu huella vs promedio mundial (12.5 kg/día)
   - Porcentaje de diferencia

4. **Desglose por Categoría**
   - Comidas: Total y porcentaje
   - Transporte: Total y porcentaje

## 💡 Tips Ecológicos

La pantalla **Explore** muestra:
- 8 consejos prácticos para reducir huella de carbono
- Cada tip tiene: icono, título, descripción e impacto
- Perfil del usuario
- Información sobre promedios globales

## 🔄 Flujo de Datos

### Registrar Comida
```
Usuario ingresa datos → Calcula CO₂ → createMeal() → Supabase INSERT
→ loadMeals() → Actualiza UI
```

### Registrar Transporte
```
Usuario ingresa datos → Calcula CO₂ → createTransport() → Supabase INSERT
→ loadTrips() → Actualiza UI
```

### Ver Dashboard
```
Carga pantalla → getDashboardStats() → Supabase SELECT → Procesa datos
→ Renderiza gráficos y estadísticas
```

## 🚀 Instalación y Configuración

### 1. Clonar e Instalar
```bash
cd ecotracker
npm install
```

### 2. Configurar Supabase
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Copiar URL y Anon Key
3. Actualizar `.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Ejecutar Schema SQL
1. Ir a SQL Editor en Supabase
2. Copiar contenido de `database/supabase-schema.sql`
3. Ejecutar

### 4. Iniciar App
```bash
npm start
```

## 📱 Uso de la Aplicación

### Primer Uso
1. Abre la app
2. Toca "Regístrate"
3. Ingresa nombre, email y contraseña
4. Inicia sesión

### Registrar Comida
1. Ve a pestaña "Comidas"
2. Ingresa nombre (ej: "Ensalada")
3. Ingresa gramos (ej: 250)
4. Selecciona tipo
5. Toca "Registrar Comida"

### Registrar Viaje
1. Ve a pestaña "Transporte"
2. Selecciona tipo de transporte
3. Ingresa distancia en km
4. Toca "Registrar Viaje"

### Ver Estadísticas
1. Ve a pestaña "Dashboard"
2. Ve tu impacto del día
3. Compara con promedio global
4. Revisa gráfico semanal

## 🎨 Diseño y UX

### Paleta de Colores
- Verde primario: `#16a34a` (acciones ecológicas)
- Azul secundario: `#2563eb` (transporte)
- Naranja dashboard: `#f59e0b` (estadísticas)
- Rojo alertas: `#ef4444` (advertencias)

### Componentes Principales
- Cards con sombras sutiles
- Botones con feedback táctil
- Gráficos de barras simples
- Iconos emoji para mejor UX

## 🔧 Mantenimiento

### Actualizar Factores de Emisión
Edita los archivos:
- `app/(tabs)/meals.tsx` → `MEAL_EMISSIONS`
- `app/(tabs)/transport.tsx` → `TRANSPORT_EMISSIONS`

### Agregar Nuevos Tips
Edita:
- `app/(tabs)/explore.tsx` → array `tips`

### Modificar Schema
1. Edita `database/supabase-schema.sql`
2. Ejecuta en SQL Editor de Supabase
3. Actualiza tipos en `lib/supabase.ts`

## 📊 Métricas y Analytics

### Datos Rastreados
- Emisiones diarias por usuario
- Tipo de comidas más registradas
- Medio de transporte más usado
- Tendencia semanal de emisiones

### Queries Útiles (Supabase SQL Editor)
```sql
-- Total de usuarios
SELECT COUNT(*) FROM profiles;

-- Promedio de emisiones por usuario
SELECT AVG(total_co2) FROM daily_stats;

-- Top 10 usuarios más ecológicos
SELECT user_id, SUM(co2) as total
FROM (
  SELECT user_id, co2 FROM meals
  UNION ALL
  SELECT user_id, co2 FROM transport
) combined
GROUP BY user_id
ORDER BY total ASC
LIMIT 10;
```

## 🐛 Solución de Problemas

### La app no carga
- Verifica que `.env` tenga las credenciales correctas
- Reinicia con: `npx expo start -c`

### Los datos no se guardan
- Verifica que RLS esté configurado correctamente
- Revisa la consola de Expo para errores
- Verifica que el usuario esté autenticado

### Error de autenticación
- Limpia AsyncStorage
- Cierra sesión y vuelve a iniciar
- Verifica la conexión a internet

## 🚀 Próximas Mejoras

### Funcionalidades Sugeridas
- [ ] Modo offline con sincronización
- [ ] Exportar datos a CSV
- [ ] Comparar con amigos
- [ ] Sistema de logros y badges
- [ ] Notificaciones push
- [ ] Tema oscuro
- [ ] Gráficos más avanzados (Chart.js)
- [ ] Integración con APIs de clima
- [ ] Calculadora de compensación de carbono

## 📚 Recursos Adicionales

- [Documentación de Expo](https://docs.expo.dev)
- [Documentación de Supabase](https://supabase.com/docs)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contribuir

Para contribuir al proyecto:
1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

¡Gracias por usar EcoTracker! 🌱 Juntos hacemos la diferencia. 🌍
