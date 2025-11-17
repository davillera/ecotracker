# 🌱 EcoTracker

**Rastrea, entiende y reduce tu huella de carbono diaria**

Una aplicación móvil desarrollada con React Native y Expo que te ayuda a ser más consciente de tu impacto ambiental a través del registro de comidas, transporte y consumo de energía.

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![React Native](https://img.shields.io/badge/React_Native-0.81.5-blue.svg)
![Expo](https://img.shields.io/badge/Expo-54.0-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)

---

## 🚀 Quick Start

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar Supabase (ver SUPABASE_SETUP.md)
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 3. Iniciar la aplicación
npm start
```

📱 Escanea el QR con **Expo Go** o presiona `a` (Android), `i` (iOS), `w` (Web)

> **Nota:** Ahora usa **Supabase** como backend. Consulta [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para configuración completa.

---

## ✨ Funcionalidades

### ✅ Implementadas

| Funcionalidad | Descripción | Estado |
|--------------|-------------|---------|
| 🔐 **Login** | Sistema de autenticación con tokens y persistencia | ✅ |
| 🍽️ **Comidas** | Registro de comidas con cálculo de CO₂ (5 tipos) | ✅ |
| 🚗 **Transporte** | Registro de viajes con cálculo de emisiones (5 medios) | ✅ |
| 📊 **Dashboard** | Gráficos semanales y estadísticas | ✅ |
| 💡 **Tips** | Consejos ecológicos clasificados por impacto | ✅ |

### 🎯 Product Backlog

- [x] Registrar comidas y ver impacto en CO₂
- [x] Registrar viajes (coche, bus, bici) y calcular emisiones
- [x] Ver dashboard semanal de huella de carbono
- [x] Recibir tips para reducir impacto ambiental
- [x] Sistema de login y autenticación
- [ ] Competir con amigos (por implementar)

---

## 📱 Pantallas

### 🔐 Login
- Autenticación segura con tokens
- Persistencia de sesión
- Validación de campos

### 🍽️ Comidas
- **Tipos:** Vegano (0.9 kg/kg), Vegetariano (1.3 kg/kg), Pollo (3.0 kg/kg), Pescado (2.5 kg/kg), Carne (6.5 kg/kg)
- Input de cantidad en gramos
- Cálculo proporcional de emisiones
- Historial con nombre, tipo, cantidad y CO₂
- Total de CO₂ y gramos diarios

### 🚗 Transporte
- **Medios:** Coche (0.192 kg/km), Bus (0.089 kg/km), Metro (0.041 kg/km), Bici (0 kg/km), Caminando (0 kg/km)
- Input de distancia
- Cálculo automático de emisiones

### 📊 Dashboard
- Gráfico semanal de emisiones
- Comparación con promedio global
- Estadísticas resumidas
- Desglose por categorías

### 💡 Tips Ecológicos
- 8 consejos prácticos
- Clasificación por impacto (Alto, Medio, Bajo)
- Información educativa

---

## 🛠️ Tecnologías

### Frontend
- **React Native** 0.81.5
- **Expo** ~54.0.20
- **TypeScript** ~5.9.2
- **Expo Router** ~6.0.13 (navegación)
- **React Navigation** 7.x (tabs)

### Backend
- **Supabase** (Backend as a Service)
  - PostgreSQL Database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions

---

## 📁 Estructura del Proyecto

```
ecotracker/
├── app/
│   ├── (tabs)/                    # Pantallas con tabs (requiere auth)
│   │   ├── index.tsx             # Inicio
│   │   ├── meals.tsx             # 🍽️ Registro de comidas
│   │   ├── transport.tsx         # 🚗 Registro de transporte
│   │   ├── dashboard.tsx         # 📊 Dashboard con gráficos
│   │   ├── explore.tsx           # 💡 Tips ecológicos
│   │   └── _layout.tsx           # Layout de tabs
│   ├── login.tsx                 # 🔐 Pantalla de login
│   └── _layout.tsx               # Layout raíz con protección
├── lib/                           # 📚 Servicios de Supabase
│   ├── supabase.ts               # Cliente y tipos
│   ├── auth.ts                   # Autenticación
│   ├── meals.ts                  # Gestión de comidas
│   ├── transport.ts              # Gestión de transporte
│   └── dashboard.ts              # Estadísticas
├── database/
│   └── supabase-schema.sql       # Schema de base de datos
├── .env.example                  # Variables de entorno (ejemplo)
├── SUPABASE_SETUP.md             # 🔧 Guía de configuración
├── FUNCIONALIDADES.md            # 📚 Documentación completa
├── QUICK_START.md                # 🚀 Guía rápida
└── README.md                     # Este archivo
```

---

## 🎨 Diseño

### Paleta de Colores
- 🟢 **Verde Principal** (#16a34a): Sostenibilidad
- 🔵 **Azul** (#2563eb): Transporte
- 🟠 **Naranja** (#f59e0b): Energía/Dashboard
- 🌿 **Verde Claro** (#10b981): Tips
- 🔴 **Rojo** (#e11d48): Logout/Alertas

---

## 📊 Datos de CO₂

### Comidas (kg CO₂ por kilogramo)
| Tipo | Emisiones | Ejemplo (250g) |
|------|-----------|----------------|
| 🌱 Vegano | 0.9 kg/kg | 0.23 kg CO₂ |
| 🥗 Vegetariano | 1.3 kg/kg | 0.33 kg CO₂ |
| 🍗 Pollo | 3.0 kg/kg | 0.75 kg CO₂ |
| 🐟 Pescado | 2.5 kg/kg | 0.63 kg CO₂ |
| 🥩 Carne | 6.5 kg/kg | 1.63 kg CO₂ |

*Cálculo proporcional según gramos ingresados*

### Transporte (kg CO₂ por km)
| Medio | Emisiones |
|-------|-----------|
| 🚗 Coche | 0.192 kg/km |
| 🚌 Bus | 0.089 kg/km |
| 🚇 Metro | 0.041 kg/km |
| 🚴 Bicicleta | 0 kg/km ♻️ |
| 🚶 Caminando | 0 kg/km ♻️ |

*Datos basados en estudios científicos sobre impacto ambiental*

---

## 🔧 Comandos

```bash
# Desarrollo
npm start              # Iniciar servidor de desarrollo
npm run android        # Ejecutar en Android
npm run ios            # Ejecutar en iOS
npm run web            # Ejecutar en web

# Calidad de código
npm run lint           # Ejecutar linter
npx tsc --noEmit      # Verificar TypeScript

# Limpieza
npx expo start -c     # Limpiar caché
```

---

## 📚 Documentación

### 🚀 Inicio Rápido
- **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** - ⭐ Empieza aquí - Enlaces rápidos
- **[CREDENCIALES_SUPABASE.md](./CREDENCIALES_SUPABASE.md)** - 🔑 Cómo obtener credenciales
- **[CHECKLIST_SUPABASE.md](./CHECKLIST_SUPABASE.md)** - ✅ Checklist paso a paso

### 🔧 Configuración
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Guía completa de configuración
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Guía de migración de código

### 📖 Referencias
- **[lib/README.md](./lib/README.md)** - API de servicios de Supabase
- **[lib/examples.tsx](./lib/examples.tsx)** - Ejemplos de código
- **[FUNCIONALIDADES.md](./FUNCIONALIDADES.md)** - Detalle de funcionalidades

---

## 🌍 Impacto

Esta app ayuda a:
- 📉 Visualizar el impacto real de decisiones diarias
- 🎯 Establecer metas de reducción de huella de carbono
- 📚 Educar sobre sostenibilidad
- 🌱 Fomentar hábitos más ecológicos

**Promedio mundial:** 4 toneladas CO₂/persona/año  
**Meta 2030:** 2-3 toneladas CO₂/persona/año

---

## 🚧 Próximos Pasos

- [x] Backend con Supabase
- [x] Autenticación de usuarios
- [x] Base de datos PostgreSQL con RLS
- [x] Actualizar pantallas para usar Supabase
- [x] CRUD completo de comidas y transporte
- [x] Dashboard con datos reales
- [x] Sistema de competencia con amigos
- [ ] Notificaciones push
- [ ] Registro de consumo de energía
- [ ] Exportar reportes PDF
- [ ] Modo oscuro
- [ ] Internacionalización

---

## 🤝 Contribuir

Este proyecto está en desarrollo activo. Sugerencias y mejoras son bienvenidas.

---

## 📄 Licencia

Proyecto educativo - Universidad

---

## 👨‍💻 Desarrollado con

💚 Pasión por el medio ambiente  
♻️ Código limpio y sostenible  
🌍 Compromiso con el planeta

---

**¡Juntos por un planeta más verde! 🌱**
