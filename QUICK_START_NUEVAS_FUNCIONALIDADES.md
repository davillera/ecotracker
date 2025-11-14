# 🚀 Guía Rápida - Nuevas Funcionalidades

## ⚡ Inicio Rápido (5 minutos)

### Paso 1: Configurar Base de Datos
```sql
-- Ir a: https://supabase.com/dashboard
-- SQL Editor > Nueva Query
-- Copiar y pegar todo el contenido de: database/new-features-schema.sql
-- Click en RUN
```

### Paso 2: Instalar Dependencias (si no están instaladas)
```bash
npm install
```

### Paso 3: Iniciar la App
```bash
npm start
```

## 🎯 Acceso Rápido a las Nuevas Funcionalidades

Una vez dentro de la app:

1. **Login/Registro** → Usa tu cuenta existente o crea una nueva
2. **Ir a "Explore"** (segunda tab)
3. Verás 4 botones de acceso rápido:
   - ⚡ **Energy** → Registrar consumo energético
   - 👥 **Friends** → Sistema de amigos y competencia
   - 🏆 **Badges** → Ver logros y nivel
   - ⚙️ **Settings** → Configuraciones (tema, idioma, notificaciones, PDF)

## ✨ Características Implementadas

### 1. ⚡ Consumo de Energía
- Registra: electricidad (kWh), gas (m³), agua (litros)
- Calcula automáticamente la huella de carbono
- Historial completo con fechas

### 2. 👥 Sistema de Amigos
- Agrega amigos por email
- Leaderboard con ranking
- Compara tu huella con la de tus amigos

### 3. 🏆 Gamificación
- 10 badges en 5 categorías
- Sistema de niveles (1-10)
- Progreso visual

### 4. 🔔 Notificaciones
- Recordatorios diarios
- Notificaciones de logros
- Configurable desde Settings

### 5. 📄 Reportes PDF
- Exporta tu progreso
- Desglose completo
- Comparte fácilmente

### 6. 🌙 Modo Oscuro
- Toggle en Settings
- Se guarda tu preferencia

### 7. 🌍 Idiomas
- Inglés / Español
- Cambio instantáneo

## 📱 Rutas de Navegación

```
/(tabs)/
  ├── dashboard    → Panel principal
  ├── meals        → Registro de comidas
  ├── transport    → Registro de transporte
  └── explore      → Tips y acceso rápido ⭐

/energy            → Consumo energético
/friends           → Sistema de amigos
/achievements      → Badges y logros
/settings          → Configuraciones
```

## 🎨 Temas

**Modo Claro** (por defecto)
- Colores verdes eco-friendly
- Fácil de leer

**Modo Oscuro**
- Colores adaptados
- Menos fatiga visual

## 🌍 Idiomas

**Inglés (EN)**
- Idioma por defecto si el sistema está en inglés

**Español (ES)**
- Idioma por defecto si el sistema está en español
- +40 traducciones completas

## 🏅 Badges Disponibles

| Badge | Requisito |
|-------|-----------|
| 🥗 Vegetarian Week | 7 comidas vegetarianas |
| 👨‍🍳 Eco Chef | 30 comidas eco |
| 🚴 Bike Enthusiast | 100km en bici |
| 🚇 Public Transport Hero | 50 viajes |
| 💡 Energy Saver | 20% reducción |
| ⚡ Renewable Champion | 30 días |
| 🔥 Week Warrior | 7 días seguidos |
| 🏆 Monthly Master | 30 días seguidos |
| 🦋 Social Butterfly | 10 amigos |
| 👑 Top Performer | #1 en leaderboard |

## 📊 Cálculo de Emisiones

```
Electricidad: 0.5 kg CO₂ por kWh
Gas: 2.0 kg CO₂ por m³
Agua: 0.001 kg CO₂ por litro
```

## 🔧 Solución Rápida de Problemas

### No aparecen las nuevas pantallas
```bash
# Limpiar caché
npm start -- --clear
```

### Error de base de datos
```sql
-- Verifica en Supabase que ejecutaste:
database/new-features-schema.sql
```

### Notificaciones no funcionan
```
1. Settings → Habilitar notificaciones
2. Permitir en el sistema cuando pregunte
```

### El tema no cambia
```bash
# Reinstalar app si es necesario
npm start
```

## 📱 Testing en Emulador/Dispositivo

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Web
```bash
npm run web
```

## 🎓 Para Desarrolladores

### Agregar más badges
```typescript
// Editar: lib/gamification.ts
export const BADGES: Badge[] = [
  {
    id: 'new_badge',
    name: 'Nuevo Badge',
    description: 'Descripción',
    icon: '🎯',
    requirement: 10,
    category: 'meals',
  },
  // ... más badges
];
```

### Agregar más traducciones
```typescript
// Editar: lib/i18n.ts
const translations = {
  en: {
    newKey: 'English text',
  },
  es: {
    newKey: 'Texto en español',
  },
};
```

### Modificar factores de emisión
```typescript
// Editar: lib/energy.ts
const ELECTRICITY_EMISSION_FACTOR = 0.5; // kg CO2 por kWh
const GAS_EMISSION_FACTOR = 2.0; // kg CO2 por m³
const WATER_EMISSION_FACTOR = 0.001; // kg CO2 por litro
```

## 📚 Archivos Clave

```
lib/
├── i18n.ts               → Traducciones
├── theme.ts              → Temas
├── notifications.ts      → Sistema de notificaciones
├── gamification.ts       → Badges y niveles
├── energy.ts             → Gestión de energía
├── friends.ts            → Sistema de amigos
└── pdfReport.ts          → Reportes

app/
├── energy.tsx            → Pantalla energía
├── friends.tsx           → Pantalla amigos
├── achievements.tsx      → Pantalla logros
└── settings.tsx          → Pantalla configuración

database/
└── new-features-schema.sql → SQL para Supabase
```

## ✅ Checklist de Verificación

Verifica que todo funciona:

- [ ] ✅ Base de datos configurada (SQL ejecutado)
- [ ] ✅ App iniciada sin errores
- [ ] ✅ Login exitoso
- [ ] ✅ Botones de acceso rápido visibles en Explore
- [ ] ✅ Energy screen funciona
- [ ] ✅ Friends screen funciona
- [ ] ✅ Achievements screen funciona
- [ ] ✅ Settings screen funciona
- [ ] ✅ Modo oscuro funciona
- [ ] ✅ Cambio de idioma funciona
- [ ] ✅ Notificaciones se pueden habilitar
- [ ] ✅ PDF se puede exportar

## 🎉 ¡Listo!

Todas las funcionalidades están implementadas y funcionando.

**Próximos pasos sugeridos:**
1. Prueba cada funcionalidad
2. Agrega amigos para probar el leaderboard
3. Registra actividades para desbloquear badges
4. Exporta tu primer reporte PDF

## 📞 Soporte

Si encuentras algún problema:
1. Verifica que ejecutaste el SQL en Supabase
2. Revisa que todas las dependencias están instaladas
3. Consulta `NUEVAS_FUNCIONALIDADES.md` para detalles técnicos

---

**Versión**: 1.0.0
**Fecha**: 2025
**Estado**: ✅ Todas las funcionalidades completadas
