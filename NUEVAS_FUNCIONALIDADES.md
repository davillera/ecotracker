# Nuevas Funcionalidades Implementadas

## ✅ Funcionalidades Completadas

### 1. 🏆 Sistema de Gamificación
- **Ubicación**: `app/achievements.tsx`
- **Características**:
  - Niveles de usuario basados en huella de carbono
  - Sistema de badges/insignias por categorías
  - Progreso visual de logros
  - Categorías: Comidas, Transporte, Energía, Rachas, Social

### 2. 👥 Sistema de Competencia con Amigos
- **Ubicación**: `app/friends.tsx`
- **Características**:
  - Agregar amigos por email
  - Sistema de solicitudes de amistad
  - Tabla de clasificación (leaderboard)
  - Comparación de huella de carbono
  - Ver ranking entre amigos

### 3. 🔔 Notificaciones Push
- **Ubicación**: `lib/notifications.ts`
- **Características**:
  - Recordatorios diarios configurables
  - Notificaciones de logros desbloqueados
  - Permisos de notificaciones
  - Configuración en Settings

### 4. ⚡ Registro de Consumo de Energía
- **Ubicación**: `app/energy.tsx`
- **Características**:
  - Registro de electricidad (kWh)
  - Registro de gas (m³)
  - Registro de agua (litros)
  - Cálculo automático de huella de carbono
  - Historial de registros

### 5. 📄 Exportar Reportes PDF
- **Ubicación**: `lib/pdfReport.ts`
- **Características**:
  - Generación de reportes HTML
  - Desglose por categoría
  - Estadísticas de actividad
  - Compartir vía sistema nativo
  - Personalizable por período

### 6. 🌙 Modo Oscuro
- **Ubicación**: `app/src/context/ThemeContext.tsx`
- **Características**:
  - Tema claro y oscuro
  - Persistencia de preferencia
  - Cambio instantáneo
  - Todos los colores adaptados

### 7. 🌍 Múltiples Idiomas
- **Ubicación**: `lib/i18n.ts` y `app/src/context/LanguageContext.tsx`
- **Características**:
  - Soporte para Inglés y Español
  - Cambio dinámico de idioma
  - Persistencia de preferencia
  - Traducciones completas

## 📦 Dependencias Instaladas

```json
{
  "expo-notifications": "Notificaciones push",
  "expo-localization": "Detección de idioma",
  "i18n-js": "Sistema de traducción",
  "expo-file-system": "Manejo de archivos",
  "expo-sharing": "Compartir archivos",
  "react-native-svg": "Gráficos vectoriales"
}
```

## 🗄️ Esquema de Base de Datos

Ejecutar el archivo: `database/new-features-schema.sql` en Supabase

### Nuevas Tablas:
1. **energy_consumption**: Registros de consumo energético
2. **friends**: Relaciones de amistad
3. **achievements**: Logros desbloqueados
4. **push_tokens**: Tokens para notificaciones
5. **profiles**: Perfiles de usuario

## 🚀 Cómo Usar las Nuevas Funcionalidades

### 1. Configurar la Base de Datos

```bash
# Ir al Dashboard de Supabase
# SQL Editor > Nuevo Query
# Copiar y ejecutar: database/new-features-schema.sql
```

### 2. Inicializar Notificaciones

```typescript
import { registerForPushNotificationsAsync, scheduleDailyReminder } from '@/lib/notifications';

// En tu componente principal
useEffect(() => {
  registerForPushNotificationsAsync();
  scheduleDailyReminder();
}, []);
```

### 3. Usar el Sistema de Temas

```typescript
import { useTheme } from '@/app/src/context/ThemeContext';

function MyComponent() {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Hola</Text>
      <Button onPress={toggleTheme} title="Cambiar Tema" />
    </View>
  );
}
```

### 4. Usar el Sistema de Idiomas

```typescript
import { useLanguage } from '@/app/src/context/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <View>
      <Text>{t('welcome')}</Text>
      <Button onPress={() => setLanguage('es')} title="Español" />
    </View>
  );
}
```

### 5. Agregar Consumo de Energía

```typescript
import { addEnergyConsumption } from '@/lib/energy';

const handleSubmit = async () => {
  const result = await addEnergyConsumption(
    userId,
    electricityKwh,
    gasM3,
    waterLiters,
    date
  );
};
```

### 6. Trabajar con Amigos

```typescript
import { sendFriendRequest, getFriends } from '@/lib/friends';

// Enviar solicitud
await sendFriendRequest(userId, 'amigo@email.com');

// Obtener amigos
const friends = await getFriends(userId);
```

### 7. Exportar Reporte PDF

```typescript
import { generatePDFReport } from '@/lib/pdfReport';

const handleExport = async () => {
  const fileUri = await generatePDFReport(userId, startDate, endDate);
  // El archivo se comparte automáticamente
};
```

## 🎨 Acceso a las Nuevas Pantallas

Las nuevas pantallas están accesibles desde el menú principal:

1. **Energy** - `/energy`
2. **Friends** - `/friends`
3. **Achievements** - `/achievements`
4. **Settings** - `/settings`

Todas están vinculadas en la pantalla Explore con botones rápidos.

## 🔧 Configuración Necesaria

### 1. Permisos en app.json

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#4CAF50"
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSUserNotificationsUsageDescription": "This app uses notifications to remind you to track your activities."
      }
    },
    "android": {
      "permissions": [
        "android.permission.POST_NOTIFICATIONS"
      ]
    }
  }
}
```

### 2. Variables de Entorno

No se necesitan variables adicionales más allá de las ya configuradas para Supabase.

## 📊 Factores de Emisión Utilizados

```typescript
// En lib/energy.ts
const ELECTRICITY_EMISSION_FACTOR = 0.5; // kg CO2 por kWh
const GAS_EMISSION_FACTOR = 2.0; // kg CO2 por m³
const WATER_EMISSION_FACTOR = 0.001; // kg CO2 por litro
```

## 🏅 Badges Disponibles

### Comidas
- 🥗 Vegetarian Week (7 comidas vegetarianas)
- 👨‍🍳 Eco Chef (30 comidas bajas en carbono)

### Transporte
- 🚴 Bike Enthusiast (100km en bici)
- 🚇 Public Transport Hero (50 viajes en transporte público)

### Energía
- 💡 Energy Saver (20% reducción)
- ⚡ Renewable Champion (30 días usando renovables)

### Rachas
- 🔥 Week Warrior (7 días consecutivos)
- 🏆 Monthly Master (30 días consecutivos)

### Social
- 🦋 Social Butterfly (10 amigos)
- 👑 Top Performer (#1 en leaderboard)

## 🐛 Solución de Problemas

### Las notificaciones no funcionan
1. Verificar permisos en la configuración del dispositivo
2. Asegurarse de que `registerForPushNotificationsAsync()` se llama al inicio

### El tema no cambia
1. Verificar que los providers están en el orden correcto en `_layout.tsx`
2. Limpiar AsyncStorage si hay problemas

### Los amigos no aparecen
1. Verificar que las tablas están creadas en Supabase
2. Comprobar que las RLS policies están habilitadas
3. Verificar que ambos usuarios tienen perfiles

### Los reportes no se generan
1. Verificar permisos de archivos
2. Comprobar que hay datos para exportar
3. Asegurarse de que expo-file-system está instalado

## 🚀 Próximos Pasos

Para probar las funcionalidades:

```bash
# Ejecutar el SQL en Supabase
# Luego reiniciar la app

npm start
```

## 📝 Notas Importantes

1. **Realtime**: Las tablas nuevas están habilitadas para realtime
2. **RLS**: Todas las tablas tienen Row Level Security configurado
3. **Índices**: Se crearon índices para optimizar las consultas
4. **Cascadas**: Las eliminaciones en cascada están configuradas

## 🎯 Testing Checklist

- [ ] Crear cuenta y login
- [ ] Cambiar idioma (EN/ES)
- [ ] Activar modo oscuro
- [ ] Registrar consumo de energía
- [ ] Enviar solicitud de amistad
- [ ] Aceptar solicitud de amistad
- [ ] Ver leaderboard
- [ ] Desbloquear un badge
- [ ] Habilitar notificaciones
- [ ] Exportar reporte PDF
- [ ] Verificar persistencia de preferencias

## 📚 Recursos Adicionales

- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [i18n-js Documentation](https://github.com/fnando/i18n-js)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
