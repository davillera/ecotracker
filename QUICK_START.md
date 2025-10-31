# 🚀 Quick Start - EcoTracker

## Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar la aplicación
```bash
npm start
```

### 3. Abrir en tu dispositivo
- Escanea el QR con **Expo Go** (Android/iOS)
- O presiona:
  - `a` para Android
  - `i` para iOS
  - `w` para Web

### 4. Login
```
Email: demo@demo.com
Password: 123456
```

---

## 📱 Navegación de la App

### 🏠 Inicio
- Vista general de la aplicación
- Botón de cerrar sesión

### 🍽️ Comidas
- Registra tus comidas con nombre
- Ingresa la cantidad en gramos
- Selecciona tipo (vegano, vegetariano, pollo, pescado, carne)
- Ve el impacto en CO₂ calculado proporcionalmente

### 🚗 Transporte
- Registra tus viajes
- Selecciona medio (coche, bus, metro, bici, caminando)
- Ingresa distancia en km
- Calcula emisiones automáticamente

### 📊 Dashboard
- Gráfico semanal de emisiones
- Estadísticas resumidas
- Comparación con promedio global
- Desglose por categorías

### 💡 Tips
- Consejos ecológicos
- Clasificados por impacto
- Información educativa

---

## 🎯 Funcionalidades Principales

✅ Sistema de login con persistencia
✅ Registro de comidas con cálculo de CO₂
✅ Registro de transporte con cálculo de emisiones
✅ Dashboard con gráficos y estadísticas
✅ Tips ecológicos educativos
✅ Navegación por tabs intuitiva
✅ Diseño temático verde y sostenible

---

## 🔧 Comandos Útiles

```bash
# Linter
npm run lint

# TypeScript check
npx tsc --noEmit

# Reset del proyecto (cuidado!)
npm run reset-project

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en Web
npm run web
```

---

## 📚 Documentación Completa

- **README.md** - Introducción general
- **FUNCIONALIDADES.md** - Detalles de todas las funcionalidades
- **app/src/README.md** - Documentación técnica

---

## 🐛 Problemas Comunes

### No veo el login
- Asegúrate de que no hay token guardado
- Cierra sesión desde la pantalla de inicio

### Los datos no persisten
- Actualmente los datos son locales en memoria
- Se pierden al recargar la app
- Implementar AsyncStorage para persistencia

### Error de compilación
```bash
# Limpia la caché
npx expo start -c
```

---

## 💡 Tips de Uso

1. **Registra diariamente** tus comidas y viajes
2. **Revisa el dashboard** para ver tu progreso
3. **Lee los tips** para mejorar tus hábitos
4. **Experimenta** con diferentes tipos de transporte
5. **Observa** cómo tus elecciones afectan las emisiones

---

## 🌟 Características Destacadas

- ⚡ **Cálculo instantáneo** de CO₂
- 📊 **Visualización clara** con gráficos
- 🎨 **Diseño intuitivo** y atractivo
- 🔒 **Login seguro** con tokens
- 📱 **Responsive** en todos los dispositivos
- 💚 **Mensaje positivo** y motivacional

---

## 🎓 Para Desarrolladores

### Agregar nueva pantalla
1. Crear archivo en `app/(tabs)/`
2. Exportar componente por defecto
3. Agregar en `app/(tabs)/_layout.tsx`

### Modificar cálculos de CO₂
- Comidas: `app/(tabs)/meals.tsx` → `MEAL_EMISSIONS`
- Transporte: `app/(tabs)/transport.tsx` → `TRANSPORT_EMISSIONS`

### Cambiar colores
Ver paleta completa en `FUNCIONALIDADES.md`

### Integrar backend
Editar `app/src/services/authService.ts`

---

## 📞 Soporte

Si encuentras algún problema:
1. Revisa la documentación
2. Verifica los logs en la consola
3. Limpia la caché: `npx expo start -c`

---

**¡Feliz desarrollo verde! 🌱**
