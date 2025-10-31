# 🌱 EcoTracker - Funcionalidades Implementadas

## ✅ Product Backlog Completado

### 1. ✅ Registro de Comidas
**Como usuario, quiero registrar mis comidas para ver su impacto en CO2**

**Implementación:**
- Pantalla dedicada en tab "Comidas"
- 5 tipos de comidas con valores de CO₂ por kilogramo:
  - 🌱 Vegano: 0.9 kg CO₂/kg
  - 🥗 Vegetariano: 1.3 kg CO₂/kg
  - 🍗 Pollo: 3.0 kg CO₂/kg
  - 🐟 Pescado: 2.5 kg CO₂/kg
  - 🥩 Carne: 6.5 kg CO₂/kg
- **Input de cantidad en gramos** para cálculo preciso
- Cálculo automático proporcional: `CO₂ = (gramos / 100) × emisión_por_100g`
- Historial de comidas con nombre, tipo, cantidad y emisiones
- Total acumulado del día (CO₂ y gramos totales)
- Interfaz intuitiva con selección visual

**Ejemplo:** 250g de pollo = (250/100) × 0.30 = 0.75 kg CO₂

**Archivo:** `app/(tabs)/meals.tsx`

---

### 2. ✅ Registro de Transporte
**Como usuario, quiero registrar mis viajes (coche, bus, bici) para calcular emisiones**

**Implementación:**
- Pantalla dedicada en tab "Transporte"
- 5 medios de transporte con emisiones por km:
  - 🚗 Coche: 0.192 kg CO₂/km
  - 🚌 Bus: 0.089 kg CO₂/km
  - 🚇 Metro: 0.041 kg CO₂/km
  - 🚴 Bicicleta: 0 kg CO₂/km (¡Zero emisiones!)
  - 🚶 Caminando: 0 kg CO₂/km (¡Zero emisiones!)
- Input de distancia en kilómetros
- Cálculo automático de CO₂ según distancia
- Historial detallado de viajes
- Estadísticas de distancia total y CO₂

**Archivo:** `app/(tabs)/transport.tsx`

---

### 3. ✅ Dashboard Semanal
**Como usuario, quiero ver un dashboard semanal de mi huella de carbono**

**Implementación:**
- Pantalla dedicada en tab "Dashboard"
- Gráfico de barras con emisiones por día de la semana
- Tarjetas con estadísticas clave:
  - Total semanal de CO₂
  - Promedio diario
  - Número de comidas registradas
  - Número de viajes registrados
- Comparación visual con el promedio global
- Mensaje motivacional basado en rendimiento
- Desglose por categorías (Comidas, Transporte, Energía)
- Barras de progreso visuales

**Archivo:** `app/(tabs)/dashboard.tsx`

---

### 4. ✅ Tips Ecológicos
**Como usuario, quiero recibir tips para reducir mi impacto ambiental**

**Implementación:**
- Pantalla dedicada en tab "Tips"
- 8 consejos prácticos clasificados por impacto:
  - 🥗 Alimentación (Alto impacto)
  - 🚴 Transporte sostenible (Alto impacto)
  - 💡 Ahorro energético (Medio impacto)
  - 🛍️ Consumo local (Medio impacto)
  - ♻️ Reciclaje (Medio impacto)
  - 🚰 Ahorro de agua (Bajo impacto)
  - 🌡️ Temperatura (Medio impacto)
  - 🛒 Evitar desperdicio (Alto impacto)
- Cada tip incluye descripción detallada
- Clasificación visual por nivel de impacto
- Banner informativo con datos globales
- Card de acción para compartir

**Archivo:** `app/(tabs)/explore.tsx`

---

### 5. ✅ Sistema de Login
**Como usuario, quiero poder crear una cuenta y hacer login**

**Implementación:**
- Pantalla de login con diseño temático EcoTracker
- Validación de campos (email y contraseña)
- Sistema de autenticación con tokens
- Persistencia segura con `expo-secure-store`
- Estados de carga durante autenticación
- Manejo de errores con alertas
- Protección automática de rutas
- Navegación condicional según estado de autenticación
- Sesión persistente entre reinicios
- Botón de cerrar sesión en todas las pantallas

**Credenciales de prueba:**
- Email: demo@demo.com
- Password: 123456

**Archivos:**
- `app/login.tsx` - Pantalla de login
- `app/_layout.tsx` - Protección de rutas
- `app/src/context/AuthContext.tsx` - Contexto de autenticación
- `app/src/services/authService.ts` - Servicio de autenticación

---

### 6. ⏳ Competencia con Amigos
**Como usuario, quiero competir con amigos para ver quién es más "verde"**

**Estado:** Por implementar

**Propuesta de implementación:**
- Tabla de clasificación (leaderboard)
- Comparación de emisiones semanales
- Sistema de puntos o badges
- Invitación de amigos
- Notificaciones de logros
- Desafíos semanales

---

## 🎨 Diseño y UX

### Paleta de Colores Temática
- **Verde Principal (`#16a34a`):** Representa sostenibilidad, usado en comidas y elementos eco-friendly
- **Azul (`#2563eb`):** Para transporte, transmite movimiento y confianza
- **Naranja (`#f59e0b`):** Para dashboard y energía, cálido y motivador
- **Verde Claro (`#10b981`):** Para tips, fresco y educativo
- **Fondo (`#f8fdf8`):** Verde muy claro, mantiene el tema sin cansar la vista

### Experiencia de Usuario
- ✅ Navegación por tabs intuitiva
- ✅ Iconos representativos en cada sección
- ✅ Feedback visual inmediato en cada acción
- ✅ Alertas amigables y motivacionales
- ✅ Diseño consistente en todas las pantallas
- ✅ Cards con sombras y bordes de color
- ✅ Inputs grandes y fáciles de usar
- ✅ Visualización clara de datos con gráficos

---

## 📊 Datos y Cálculos

### Emisiones de CO₂ - Comidas
Basado en estudios científicos sobre impacto ambiental de alimentos (por kg):
- Carne roja: Mayor impacto (6.5 kg CO₂/kg)
- Pollo: Impacto medio (3.0 kg CO₂/kg)
- Pescado: Impacto medio-bajo (2.5 kg CO₂/kg)
- Vegetariano: Impacto bajo (1.3 kg CO₂/kg)
- Vegano: Menor impacto (0.9 kg CO₂/kg)

**Cálculo:** El sistema calcula proporcionalmente según los gramos ingresados.
- Ejemplo: 300g de carne = (300/1000) × 6.5 = 1.95 kg CO₂

### Emisiones de CO₂ - Transporte
Basado en emisiones promedio por kilómetro:
- Coche particular: 192g CO₂/km
- Autobús: 89g CO₂/km
- Metro: 41g CO₂/km
- Bicicleta: 0g CO₂/km ♻️
- Caminando: 0g CO₂/km ♻️

### Referencias Globales
- Promedio mundial: 4 toneladas CO₂/persona/año
- Meta del Acuerdo de París: Reducir a 2-3 toneladas/persona/año para 2030

---

## 🛠️ Tecnologías Utilizadas

- **React Native** con **Expo**
- **TypeScript** para type safety
- **Expo Router** para navegación
- **Expo Secure Store** para almacenamiento seguro
- **React Hooks** para gestión de estado
- **StyleSheet** para estilos nativos

---

## 📱 Arquitectura

```
Login Screen (no autenticado)
    ↓
  Auth ✓
    ↓
Tab Navigator (autenticado)
├── Inicio
├── Comidas
├── Transporte
├── Dashboard
└── Tips
```

### Protección de Rutas
- Usuario sin token → Redirige a `/login`
- Usuario con token → Acceso a `/(tabs)`
- Verificación automática en cada navegación

---

## 🚀 Próximas Mejoras Sugeridas

### Corto plazo
1. Persistencia de datos local (AsyncStorage)
2. Registro de consumo de energía (tercera categoría)
3. Gráficos interactivos más avanzados
4. Exportar reportes en PDF

### Medio plazo
5. Backend real con base de datos
6. Sistema de registro de usuarios
7. Recuperación de contraseña
8. Perfil de usuario editable
9. Notificaciones push

### Largo plazo
10. Sistema de competencia con amigos
11. Gamificación (badges, logros)
12. Integración con APIs de transporte público
13. Machine learning para sugerencias personalizadas
14. Modo offline completo
15. Internacionalización (múltiples idiomas)

---

## ✨ Características Destacadas

1. **Zero Config para Testing:** Usa credenciales de prueba para acceso inmediato
2. **UX Amigable:** Interfaz clara y fácil de usar
3. **Feedback Constante:** Cada acción tiene una respuesta visual
4. **Datos Realistas:** Basados en estudios científicos
5. **Motivación Positiva:** Mensajes que celebran las buenas acciones
6. **Educación:** Tips con información valiosa
7. **Visualización Clara:** Gráficos y estadísticas fáciles de entender

---

## 🌍 Impacto Social

Esta aplicación contribuye a:
- 📉 **Conciencia ambiental:** Los usuarios ven el impacto real de sus acciones
- 🎯 **Cambio de comportamiento:** Visualizar datos motiva a mejorar hábitos
- 📚 **Educación:** Tips basados en ciencia real
- 🌱 **Sostenibilidad:** Fomenta decisiones más ecológicas
- 👥 **Comunidad:** (Futuro) Conecta personas con objetivos similares

---

**Desarrollado con 💚 para un planeta más verde 🌍**
