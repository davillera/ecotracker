# 🎯 PASOS PARA ACTIVAR TODAS LAS FUNCIONALIDADES

## ⚡ Solo 2 pasos necesarios

---

## 📝 PASO 1: Ejecutar SQL en Supabase (2 minutos)

### Ir a tu Dashboard de Supabase

1. Abre tu navegador
2. Ve a: https://supabase.com/dashboard
3. Selecciona tu proyecto **ecotracker**

### Ejecutar el SQL

1. En el menú lateral, click en **SQL Editor**
2. Click en **New query**
3. Abre el archivo: `database/new-features-schema.sql`
4. **Copia TODO el contenido** (Ctrl+A, Ctrl+C)
5. **Pega** en el editor de Supabase (Ctrl+V)
6. Click en **RUN** (esquina inferior derecha)
7. Espera a que aparezca: ✅ **Success. No rows returned**

### ¿Qué hace este SQL?

Crea 5 nuevas tablas:
- ✅ `energy_consumption` - Para registros de energía
- ✅ `friends` - Para el sistema de amigos
- ✅ `achievements` - Para badges y logros
- ✅ `push_tokens` - Para notificaciones
- ✅ `profiles` - Para perfiles de usuario

Y configura:
- ✅ Row Level Security (RLS)
- ✅ Índices para optimizar
- ✅ Realtime para actualizaciones automáticas

---

## 🚀 PASO 2: Iniciar la App (30 segundos)

### En tu terminal:

```bash
npm start
```

### Escanea el QR con Expo Go o:

```bash
# Para Android
npm run android

# Para iOS
npm run ios
```

---

## 🎉 ¡LISTO! Ahora puedes usar todo

### Acceso a las Nuevas Funcionalidades:

1. **Login** con tu cuenta
2. Ve a la tab **"Explore"** (segunda tab)
3. Verás 4 botones nuevos:

```
┌─────────────────────────────────┐
│                                 │
│   ⚡ Energy    👥 Friends       │
│                                 │
│   🏆 Badges    ⚙️ Settings      │
│                                 │
└─────────────────────────────────┘
```

---

## 📱 Qué Puedes Hacer Ahora

### ⚡ Energy (Consumo de Energía)
```
- Registrar electricidad (kWh)
- Registrar gas (m³)
- Registrar agua (litros)
- Ver historial completo
- Calcular CO₂ automáticamente
```

### 👥 Friends (Amigos y Competencia)
```
- Agregar amigos por email
- Ver solicitudes pendientes
- Aceptar solicitudes
- Ver leaderboard
- Comparar huella de carbono
```

### 🏆 Badges (Logros y Gamificación)
```
- Ver tu nivel (1-10)
- Ver 10 badges disponibles
- Progreso por categoría
- Badges desbloqueados
```

### ⚙️ Settings (Configuración)
```
- 🌙 Activar Modo Oscuro
- 🌍 Cambiar Idioma (EN/ES)
- 🔔 Habilitar Notificaciones
- 📄 Exportar Reporte PDF
- 🚪 Cerrar Sesión
```

---

## ✅ Checklist de Verificación

Verifica que todo funciona:

### Después del PASO 1 (SQL)
- [ ] En Supabase, ir a **Database** → **Tables**
- [ ] Deberías ver 5 nuevas tablas:
  - [ ] `energy_consumption`
  - [ ] `friends`
  - [ ] `achievements`
  - [ ] `push_tokens`
  - [ ] `profiles`

### Después del PASO 2 (App)
- [ ] La app inicia sin errores
- [ ] Login funciona
- [ ] En "Explore" ves 4 botones nuevos
- [ ] Puedes abrir cada pantalla nueva

### Prueba Rápida (2 minutos)
- [ ] Energy: Registra un consumo
- [ ] Settings: Cambia el idioma
- [ ] Settings: Activa modo oscuro
- [ ] Friends: Intenta agregar un amigo
- [ ] Badges: Ve tu nivel actual

---

## 🐛 ¿Problemas?

### La app no inicia
```bash
# Limpia la caché
npm start -- --clear
```

### No ves los botones en Explore
```bash
# Reinicia completamente
npm start -- --clear
# O cierra y vuelve a abrir Expo Go
```

### Error "Table does not exist"
```
→ Verifica que ejecutaste el SQL en Supabase (PASO 1)
→ Ve a Supabase Dashboard → Database → Tables
→ Deberían aparecer las 5 nuevas tablas
```

### Las notificaciones no funcionan
```
1. Settings → Activar notificaciones
2. Cuando aparezca el popup del sistema, presiona "Permitir"
3. Si no funciona, verifica permisos en configuración del teléfono
```

---

## 🎨 Capturas de lo que Verás

### Pantalla Explore (con botones nuevos)
```
┌──────────────────────────────┐
│  💡 Tips Ecológicos          │
│  Consejos para reducir...    │
├──────────────────────────────┤
│  👤 [Tu perfil]              │
│  user@email.com              │
├──────────────────────────────┤
│  ⚡ Energy  👥 Friends        │
│  🏆 Badges  ⚙️ Settings       │
├──────────────────────────────┤
│  [Tips ecológicos...]        │
└──────────────────────────────┘
```

### Pantalla Energy
```
┌──────────────────────────────┐
│  ⚡ Consumo de Energía        │
├──────────────────────────────┤
│  Electricidad (kWh): [___]   │
│  Gas (m³): [___]             │
│  Agua (L): [___]             │
│  [Guardar]                   │
├──────────────────────────────┤
│  Historial:                  │
│  📅 2025-11-13               │
│     ⚡ 10 kWh | 🔥 5 m³      │
│     💧 100 L | CO₂: 15 kg   │
└──────────────────────────────┘
```

### Pantalla Settings
```
┌──────────────────────────────┐
│  ⚙️ Configuración             │
├──────────────────────────────┤
│  Appearance                  │
│  🌙 Modo Oscuro      [ON]    │
├──────────────────────────────┤
│  Language                    │
│  🌍 Language    [EN] [ES]    │
├──────────────────────────────┤
│  Notifications               │
│  🔔 Daily Reminders  [OFF]   │
├──────────────────────────────┤
│  Reports                     │
│  📄 Exportar Reporte PDF     │
├──────────────────────────────┤
│  Account                     │
│  🚪 Cerrar Sesión            │
└──────────────────────────────┘
```

---

## 💡 Tips para la Primera Vez

### 1. Prueba el Modo Oscuro
```
Settings → Toggle "Modo Oscuro"
→ Toda la app cambia instantáneamente
→ Se guarda tu preferencia
```

### 2. Cambia el Idioma
```
Settings → Presiona EN o ES
→ Toda la app se traduce
→ Se guarda tu preferencia
```

### 3. Registra Energía
```
Energy → Ingresa valores
→ Presiona Guardar
→ Ve el CO₂ calculado automáticamente
```

### 4. Agrega un Amigo
```
Friends → Ingresa email de un amigo
→ Send Request
→ Tu amigo debe aceptar la solicitud
→ Luego verás el leaderboard
```

### 5. Desbloquea tu Primer Badge
```
Registra 7 comidas vegetarianas
→ Ve a Badges
→ Verás "Vegetarian Week" desbloqueado ✅
```

---

## 🎯 Funcionalidades por Prioridad

### Prueba Primero (Fácil)
1. ✅ Modo Oscuro (Settings)
2. ✅ Cambio de Idioma (Settings)
3. ✅ Registrar Energía (Energy)

### Prueba Después (Requiere datos)
4. ✅ Exportar PDF (Settings)
5. ✅ Ver Badges (Badges)

### Prueba con Amigos (Requiere 2+ usuarios)
6. ✅ Sistema de Amigos (Friends)
7. ✅ Leaderboard (Friends)
8. ✅ Notificaciones (Settings)

---

## 📞 Ayuda Adicional

### Documentación Completa
- 📖 `NUEVAS_FUNCIONALIDADES.md` - Guía técnica detallada
- 📋 `RESUMEN_IMPLEMENTACION.md` - Resumen ejecutivo
- ✅ `CHECKLIST_IMPLEMENTACION.md` - Checklist completo

### Archivos Importantes
- 💾 `database/new-features-schema.sql` - SQL para ejecutar
- ⚙️ `app.json` - Configuración de la app
- 📦 `package.json` - Dependencias instaladas

---

## 🎉 ¡Disfruta las Nuevas Funcionalidades!

**7 funcionalidades nuevas:**
1. ⚡ Consumo de Energía
2. 👥 Sistema de Amigos
3. 🏆 Gamificación
4. 🔔 Notificaciones
5. 📄 Reportes PDF
6. 🌙 Modo Oscuro
7. 🌍 Múltiples Idiomas

**Todo implementado y listo para usar** ✨

---

**Última actualización**: 2025-11-13
**Estado**: ✅ 100% Completado
