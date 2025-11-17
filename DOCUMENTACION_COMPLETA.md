# 📘 Documentación Completa - EcoTracker

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura de Directorios](#estructura-de-directorios)
5. [Base de Datos](#base-de-datos)
6. [Funcionalidades](#funcionalidades)
7. [Servicios y APIs](#servicios-y-apis)
8. [Componentes](#componentes)
9. [Navegación](#navegación)
10. [Autenticación](#autenticación)
11. [Instalación y Configuración](#instalación-y-configuración)
12. [Guía de Uso](#guía-de-uso)
13. [Cálculos de CO₂](#cálculos-de-co2)
14. [Seguridad](#seguridad)
15. [Características Avanzadas](#características-avanzadas)

---

## 📖 Descripción General

**EcoTracker** es una aplicación móvil multiplataforma desarrollada con React Native y Expo que permite a los usuarios rastrear, entender y reducir su huella de carbono diaria mediante el registro de:

- 🍽️ **Comidas**: Diferentes tipos de alimentos y su impacto ambiental
- 🚗 **Transporte**: Medios de transporte utilizados y distancias recorridas
- ⚡ **Energía**: Consumo eléctrico del hogar
- 👥 **Competencia Social**: Sistema de amigos y rankings
- 🏆 **Gamificación**: Logros y sistema de puntos

### Objetivos del Proyecto

- Crear conciencia sobre el impacto ambiental de las decisiones diarias
- Proporcionar datos precisos basados en estudios científicos
- Motivar hábitos más sostenibles mediante gamificación
- Facilitar la competencia amistosa entre usuarios

---

## 🏗️ Arquitectura del Proyecto

### Patrón de Arquitectura

El proyecto sigue una arquitectura **Cliente-Servidor** con las siguientes capas:

```
┌─────────────────────────────────────┐
│      React Native Frontend          │
│  (Expo Router + React Navigation)   │
├─────────────────────────────────────┤
│      Servicios (lib/)               │
│  - Auth, Meals, Transport, etc.     │
├─────────────────────────────────────┤
│      Supabase Client                │
│  (@supabase/supabase-js)            │
├─────────────────────────────────────┤
│      Supabase Backend               │
│  - PostgreSQL + Auth + Storage      │
└─────────────────────────────────────┘
```

### Principios de Diseño

- **Separación de Responsabilidades**: Servicios separados para cada dominio
- **Gestión de Estado**: Context API de React para estado global
- **Seguridad First**: Row Level Security (RLS) en todas las tablas
- **Real-time**: Suscripciones a cambios en tiempo real
- **Offline Support**: AsyncStorage para persistencia local

---

## 🛠️ Tecnologías Utilizadas

### Frontend

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| React Native | 0.81.5 | Framework móvil multiplataforma |
| Expo | ~54.0.20 | Plataforma de desarrollo |
| TypeScript | ~5.9.2 | Tipado estático |
| Expo Router | ~6.0.13 | Navegación basada en archivos |
| React Navigation | 7.x | Navegación con tabs |

### Backend

| Tecnología | Propósito |
|-----------|-----------|
| Supabase | Backend as a Service (BaaS) |
| PostgreSQL | Base de datos relacional |
| Supabase Auth | Autenticación y gestión de usuarios |
| Row Level Security | Seguridad a nivel de filas |

### Librerías Adicionales

```json
{
  "@react-native-async-storage/async-storage": "Almacenamiento local",
  "@react-native-community/datetimepicker": "Selector de fecha/hora",
  "expo-secure-store": "Almacenamiento seguro de tokens",
  "expo-notifications": "Notificaciones push",
  "react-native-svg": "Gráficos vectoriales",
  "axios": "Cliente HTTP",
  "i18n-js": "Internacionalización"
}
```

---

## 📁 Estructura de Directorios

```
ecotracker/
│
├── app/                          # Pantallas de la aplicación (Expo Router)
│   ├── (tabs)/                  # Pantallas con navegación por tabs
│   │   ├── index.tsx           # 🏠 Inicio/Dashboard
│   │   ├── meals.tsx           # 🍽️ Registro de comidas
│   │   ├── transport.tsx       # 🚗 Registro de transporte
│   │   ├── dashboard.tsx       # 📊 Estadísticas y gráficos
│   │   ├── explore.tsx         # 💡 Tips ecológicos
│   │   ├── profile.tsx         # 👤 Perfil de usuario
│   │   └── _layout.tsx         # Layout de tabs
│   │
│   ├── login.tsx               # 🔐 Pantalla de inicio de sesión
│   ├── register.tsx            # 📝 Pantalla de registro
│   ├── friends.tsx             # 👥 Gestión de amigos
│   ├── achievements.tsx        # 🏆 Logros y badges
│   ├── energy.tsx              # ⚡ Registro de energía
│   ├── settings.tsx            # ⚙️ Configuración
│   └── _layout.tsx             # Layout raíz con protección de rutas
│
├── lib/                         # 📚 Servicios y lógica de negocio
│   ├── supabase.ts             # Cliente de Supabase
│   ├── auth.ts                 # Autenticación
│   ├── meals.ts                # Gestión de comidas
│   ├── transport.ts            # Gestión de transporte
│   ├── energy.ts               # Gestión de energía
│   ├── dashboard.ts            # Estadísticas y métricas
│   ├── friends.ts              # Sistema de amigos
│   ├── gamification.ts         # Sistema de logros
│   ├── notifications.ts        # Notificaciones
│   ├── pdfReport.ts            # Generación de reportes
│   ├── theme.ts                # Tema y colores
│   ├── i18n.ts                 # Internacionalización
│   ├── examples.tsx            # Ejemplos de uso
│   └── README.md               # Documentación de servicios
│
├── components/                  # 🧩 Componentes reutilizables
│   ├── ui/                     # Componentes de UI
│   ├── themed-text.tsx         # Texto con tema
│   ├── themed-view.tsx         # Vista con tema
│   ├── external-link.tsx       # Enlaces externos
│   └── haptic-tab.tsx          # Tab con feedback háptico
│
├── src/                         # Código fuente adicional
│   └── context/                # Contextos de React
│
├── database/                    # 🗄️ Scripts de base de datos
│   ├── supabase-schema.sql     # Schema principal
│   ├── new-features-schema.sql # Nuevas funcionalidades
│   └── *.sql                   # Scripts de mantenimiento
│
├── assets/                      # 🎨 Recursos estáticos
│   └── images/                 # Imágenes e iconos
│
├── constants/                   # ⚙️ Constantes globales
│
├── hooks/                       # 🪝 Custom hooks
│
├── .env.example                # Ejemplo de variables de entorno
├── app.json                    # Configuración de Expo
├── package.json                # Dependencias del proyecto
├── tsconfig.json               # Configuración de TypeScript
└── README.md                   # Documentación principal
```

---

## 🗄️ Base de Datos

### Schema de PostgreSQL

#### Tabla: `profiles`

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  friend_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Propósito**: Extender información de usuarios de Supabase Auth.

#### Tabla: `meals`

```sql
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vegetariano', 'vegano', 'carne_roja', 'carne_blanca', 'pescado')),
  grams DECIMAL(10, 2) NOT NULL CHECK (grams > 0),
  co2 DECIMAL(10, 2) NOT NULL CHECK (co2 >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Índices**:
- `idx_meals_user_id` en `user_id`
- `idx_meals_created_at` en `created_at DESC`
- `idx_meals_user_date` en `(user_id, created_at DESC)`

#### Tabla: `transport`

```sql
CREATE TABLE public.transport (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('coche', 'moto', 'autobus', 'metro', 'bicicleta', 'caminando')),
  distance DECIMAL(10, 2) NOT NULL CHECK (distance > 0),
  co2 DECIMAL(10, 2) NOT NULL CHECK (co2 >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla: `energy`

```sql
CREATE TABLE public.energy (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  kwh DECIMAL(10, 2) NOT NULL CHECK (kwh > 0),
  co2 DECIMAL(10, 2) NOT NULL CHECK (co2 >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla: `friendships`

```sql
CREATE TABLE public.friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);
```

#### Tabla: `achievements`

```sql
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con políticas que permiten:

- **SELECT**: Solo ver propios registros
- **INSERT**: Solo crear registros propios
- **UPDATE**: Solo actualizar registros propios
- **DELETE**: Solo eliminar registros propios

Ejemplo de política:

```sql
CREATE POLICY "Users can view their own meals" 
  ON public.meals FOR SELECT 
  USING (auth.uid() = user_id);
```

---

## ⚙️ Funcionalidades

### 1. 🔐 Autenticación

**Archivo**: `lib/auth.ts`

#### Registro de Usuario

```typescript
async function signUp({ email, password, name }: SignUpData)
```

- Crea cuenta en Supabase Auth
- Genera código de amigo único
- Crea perfil en tabla `profiles`

#### Inicio de Sesión

```typescript
async function signIn({ email, password }: SignInData)
```

- Valida credenciales
- Retorna sesión y tokens JWT
- Almacena sesión en AsyncStorage

#### Gestión de Sesión

```typescript
async function getSession()
async function signOut()
```

### 2. 🍽️ Comidas

**Archivo**: `lib/meals.ts`

#### Crear Comida

```typescript
async function createMeal({
  name: string,
  type: MealType,
  grams: number
})
```

**Tipos de comida**:
- `vegano`: 0.9 kg CO₂/kg
- `vegetariano`: 1.3 kg CO₂/kg
- `carne_blanca`: 3.0 kg CO₂/kg
- `pescado`: 2.5 kg CO₂/kg
- `carne_roja`: 6.5 kg CO₂/kg

**Cálculo de CO₂**:
```
CO₂ = (gramos / 1000) × factor_emisión
```

#### Obtener Comidas

```typescript
async function getTodayMeals()
async function getMealsByDateRange(startDate: Date, endDate: Date)
```

#### Eliminar Comida

```typescript
async function deleteMeal(id: string)
```

### 3. 🚗 Transporte

**Archivo**: `lib/transport.ts`

#### Crear Viaje

```typescript
async function createTransport({
  type: TransportType,
  distance: number
})
```

**Tipos de transporte**:
- `coche`: 0.192 kg CO₂/km
- `moto`: 0.150 kg CO₂/km
- `autobus`: 0.089 kg CO₂/km
- `metro`: 0.041 kg CO₂/km
- `bicicleta`: 0 kg CO₂/km
- `caminando`: 0 kg CO₂/km

**Cálculo de CO₂**:
```
CO₂ = distancia × factor_emisión
```

### 4. ⚡ Energía

**Archivo**: `lib/energy.ts`

#### Registrar Consumo

```typescript
async function createEnergy({
  kwh: number
})
```

**Factor de emisión**: 0.5 kg CO₂/kWh (promedio)

### 5. 📊 Dashboard

**Archivo**: `lib/dashboard.ts`

#### Estadísticas Semanales

```typescript
async function getWeeklyStats()
```

Retorna:
- Total CO₂ por día
- Desglose por categoría (comidas, transporte, energía)
- Comparación con semana anterior
- Promedio diario

#### Resumen Mensual

```typescript
async function getMonthlyStats()
```

### 6. 👥 Sistema de Amigos

**Archivo**: `lib/friends.ts`

#### Agregar Amigo

```typescript
async function addFriend(friendCode: string)
```

#### Listar Amigos

```typescript
async function getFriends()
```

#### Ranking de Amigos

```typescript
async function getFriendsRanking()
```

Ordena amigos por:
1. Menor huella de carbono semanal
2. Mayor reducción respecto a semana anterior

### 7. 🏆 Gamificación

**Archivo**: `lib/gamification.ts`

#### Logros Disponibles

| ID | Nombre | Descripción | Condición |
|----|--------|-------------|-----------|
| `first_meal` | Primera Comida | Registra tu primera comida | 1 comida |
| `green_week` | Semana Verde | < 50 kg CO₂ en una semana | CO₂ < 50 kg |
| `eco_warrior` | Guerrero Eco | 30 días consecutivos | 30 días |
| `plant_based` | Dieta Vegetal | 10 comidas veganas/vegetarianas | 10 comidas |

#### Verificar Logros

```typescript
async function checkAchievements()
```

Se ejecuta automáticamente después de cada acción.

### 8. 🔔 Notificaciones

**Archivo**: `lib/notifications.ts`

#### Tipos de Notificación

- **Recordatorios**: Registrar datos diarios
- **Logros**: Nuevo logro desbloqueado
- **Social**: Amigo superó tu récord
- **Tips**: Consejo ecológico del día

#### Programar Notificación

```typescript
async function scheduleNotification({
  title: string,
  body: string,
  trigger: Date
})
```

### 9. 📄 Reportes PDF

**Archivo**: `lib/pdfReport.ts`

#### Generar Reporte

```typescript
async function generatePDFReport(month: number, year: number)
```

Incluye:
- Resumen mensual de emisiones
- Gráficos de tendencias
- Comparación con metas
- Recomendaciones personalizadas

---

## 🧩 Componentes

### Componentes de UI

#### `ThemedText`
Texto que se adapta al tema (claro/oscuro).

#### `ThemedView`
Contenedor que se adapta al tema.

#### `HapticTab`
Tab con feedback háptico al presionar.

---

## 🗺️ Navegación

### Estructura de Rutas

```
app/
  ├── _layout.tsx              # Protección de rutas
  ├── login.tsx                # Ruta pública
  ├── register.tsx             # Ruta pública
  └── (tabs)/                  # Rutas protegidas
      ├── index.tsx            # /
      ├── meals.tsx            # /meals
      ├── transport.tsx        # /transport
      ├── dashboard.tsx        # /dashboard
      ├── explore.tsx          # /explore
      └── profile.tsx          # /profile
```

### Protección de Rutas

El `_layout.tsx` raíz verifica la sesión:

```typescript
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session && pathname !== '/login' && pathname !== '/register') {
      router.replace('/login');
    }
  });
}, []);
```

---

## 🔐 Autenticación

### Flujo de Autenticación

1. Usuario ingresa credenciales
2. `signIn()` valida con Supabase
3. Supabase retorna JWT token
4. Token se almacena en AsyncStorage
5. Token se incluye en todas las peticiones
6. RLS verifica permisos en cada query

### Almacenamiento de Tokens

```typescript
// Configuración de Supabase
const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
  }
});
```

---

## 📦 Instalación y Configuración

### 1. Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta en Supabase
- Expo CLI

### 2. Clonar Repositorio

```bash
git clone <repository-url>
cd ecotracker
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar Supabase

#### a) Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Anota la URL y la API Key

#### b) Ejecutar Schema

```bash
# Copiar contenido de database/supabase-schema.sql
# Ejecutar en SQL Editor de Supabase
```

#### c) Configurar Variables de Entorno

```bash
cp .env.example .env
```

Editar `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 5. Iniciar Aplicación

```bash
npm start
```

Escanear QR con Expo Go o presionar:
- `a` para Android
- `i` para iOS
- `w` para Web

---

## 📖 Guía de Uso

### Para Usuarios

#### 1. Registro

1. Abrir app → **Registrarse**
2. Ingresar email, contraseña y nombre
3. Confirmar email (si está habilitado)

#### 2. Registrar Comida

1. Tab **Comidas**
2. Ingresar nombre (ej: "Ensalada")
3. Seleccionar tipo (ej: "Vegano")
4. Ingresar gramos (ej: "250")
5. Presionar **Agregar**

#### 3. Registrar Transporte

1. Tab **Transporte**
2. Seleccionar medio (ej: "Bicicleta")
3. Ingresar distancia (ej: "5.5 km")
4. Presionar **Registrar**

#### 4. Ver Estadísticas

1. Tab **Dashboard**
2. Ver gráfico semanal
3. Comparar con promedio
4. Ver desglose por categoría

#### 5. Agregar Amigos

1. Tab **Perfil** → **Amigos**
2. Compartir tu código de amigo
3. O ingresar código de amigo
4. Ver ranking en tiempo real

---

## 🧮 Cálculos de CO₂

### Metodología

Los factores de emisión están basados en:

- **Comidas**: Estudios de ciclo de vida (LCA)
- **Transporte**: EPA y DEFRA
- **Energía**: Factor de emisión nacional

### Fórmulas

#### Comidas

```
CO₂ (kg) = (gramos / 1000) × factor_tipo
```

Ejemplo:
```
250g de carne roja:
CO₂ = (250 / 1000) × 6.5 = 1.625 kg CO₂
```

#### Transporte

```
CO₂ (kg) = distancia (km) × factor_medio
```

Ejemplo:
```
10 km en coche:
CO₂ = 10 × 0.192 = 1.92 kg CO₂
```

#### Energía

```
CO₂ (kg) = kWh × 0.5
```

### Factores de Emisión

| Categoría | Item | Factor | Unidad |
|-----------|------|--------|--------|
| Comidas | Vegano | 0.9 | kg CO₂/kg |
| Comidas | Vegetariano | 1.3 | kg CO₂/kg |
| Comidas | Pollo | 3.0 | kg CO₂/kg |
| Comidas | Pescado | 2.5 | kg CO₂/kg |
| Comidas | Carne Roja | 6.5 | kg CO₂/kg |
| Transporte | Coche | 0.192 | kg CO₂/km |
| Transporte | Moto | 0.150 | kg CO₂/km |
| Transporte | Bus | 0.089 | kg CO₂/km |
| Transporte | Metro | 0.041 | kg CO₂/km |
| Transporte | Bici | 0 | kg CO₂/km |
| Energía | Eléctrica | 0.5 | kg CO₂/kWh |

---

## 🔒 Seguridad

### Row Level Security (RLS)

Cada tabla tiene políticas que garantizan:

```sql
-- Solo ver propios datos
USING (auth.uid() = user_id)

-- Solo modificar propios datos
WITH CHECK (auth.uid() = user_id)
```

### Validación de Datos

#### Backend (PostgreSQL)

```sql
CHECK (grams > 0)
CHECK (co2 >= 0)
CHECK (type IN ('vegano', 'vegetariano', ...))
```

#### Frontend (TypeScript)

```typescript
if (isNaN(gramsNum) || gramsNum <= 0) {
  Alert.alert('Error', 'Cantidad inválida');
  return;
}
```

### Protección de Rutas

```typescript
// _layout.tsx
if (!session && pathname !== '/login') {
  router.replace('/login');
}
```

### Almacenamiento Seguro

- Tokens en **AsyncStorage** (móvil) o **localStorage** (web)
- Variables sensibles en `.env` (no versionadas)
- API Keys en modo servidor (Supabase)

---

## 🚀 Características Avanzadas

### Real-time Subscriptions

```typescript
supabase
  .channel('meals-realtime')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'meals',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('Change:', payload);
    loadMeals();
  })
  .subscribe();
```

### Internacionalización (i18n)

```typescript
import { I18n } from 'i18n-js';

const i18n = new I18n({
  en: { welcome: 'Welcome' },
  es: { welcome: 'Bienvenido' }
});

i18n.locale = 'es';
```

### Tema Dinámico

```typescript
const theme = useColorScheme();
const colors = theme === 'dark' ? darkColors : lightColors;
```

### Notificaciones Push

```typescript
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Recordatorio",
    body: "¡Registra tus comidas de hoy!"
  },
  trigger: { hour: 20, minute: 0, repeats: true }
});
```

---

## 📊 Métricas y Objetivos

### Promedio Mundial

- **Global**: 4,000 kg CO₂/persona/año
- **Meta 2030**: 2,000-3,000 kg CO₂/persona/año
- **Promedio diario**: ~11 kg CO₂/día

### Metas en la App

- **Verde**: < 7 kg CO₂/día
- **Amarillo**: 7-15 kg CO₂/día
- **Rojo**: > 15 kg CO₂/día

---

## 🐛 Troubleshooting

### Error: "Invalid API Key"

**Solución**: Verificar `.env` y reiniciar servidor

```bash
npx expo start -c
```

### Error: "RLS Policy Violation"

**Solución**: Verificar que las políticas RLS estén creadas

```sql
SELECT * FROM pg_policies WHERE tablename = 'meals';
```

### Error: "Session Expired"

**Solución**: Cerrar sesión y volver a iniciar

```typescript
await signOut();
```

---

## 🔄 Actualizaciones Futuras

### Roadmap

- [ ] Modo oscuro completo
- [ ] Exportar datos a CSV
- [ ] Integración con API de clima
- [ ] Calculadora de compensación de carbono
- [ ] Widget para home screen
- [ ] Soporte para Apple Watch
- [ ] Integración con Google Fit
- [ ] Modo offline completo
- [ ] Versión web responsive
- [ ] Multi-idioma (inglés, español, francés)

---

## 📞 Soporte

Para preguntas o problemas:

1. Revisar esta documentación
2. Consultar `lib/README.md` para ejemplos de código
3. Ver `lib/examples.tsx` para casos de uso

---

## 📝 Licencia

Proyecto educativo - Universidad

---

## 👨‍💻 Créditos

Desarrollado con:
- 💚 Pasión por el medio ambiente
- ♻️ Código limpio y sostenible
- 🌍 Compromiso con el planeta

---

**¡Juntos por un planeta más verde! 🌱**

*Última actualización: 2025*
