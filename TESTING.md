# 🧪 Guía de Pruebas - EcoTracker

## ✅ Checklist de Funcionalidades

### 1. Autenticación

#### Registro de Usuario
- [ ] Abrir la app
- [ ] Tocar "Regístrate"
- [ ] Ingresar nombre: "Usuario Test"
- [ ] Ingresar email: "test@ejemplo.com"
- [ ] Ingresar contraseña: "test123456"
- [ ] Confirmar contraseña: "test123456"
- [ ] Tocar "Crear Cuenta"
- [ ] ✅ Debe mostrar mensaje de éxito
- [ ] ✅ Debe redirigir a login

#### Inicio de Sesión
- [ ] En pantalla de login
- [ ] Ingresar email: "test@ejemplo.com"
- [ ] Ingresar contraseña: "test123456"
- [ ] Tocar "Iniciar sesión"
- [ ] ✅ Debe cargar y redirigir a home
- [ ] ✅ Debe mostrar el nombre del usuario

#### Validaciones
- [ ] Intentar login con email vacío → Debe mostrar error
- [ ] Intentar login con contraseña vacía → Debe mostrar error
- [ ] Intentar login con credenciales incorrectas → Debe mostrar error
- [ ] Intentar registro con contraseñas que no coinciden → Debe mostrar error
- [ ] Intentar registro con contraseña < 6 caracteres → Debe mostrar error

### 2. Registro de Comidas

#### Crear Comida
- [ ] Ir a pestaña "Comidas"
- [ ] Ingresar nombre: "Ensalada mixta"
- [ ] Ingresar gramos: "250"
- [ ] Seleccionar tipo: "Vegetariano"
- [ ] Tocar "Registrar Comida"
- [ ] ✅ Debe mostrar alerta con CO₂ calculado (0.33 kg)
- [ ] ✅ Debe aparecer en el historial
- [ ] ✅ Debe actualizar el total de CO₂

#### Probar Diferentes Tipos
- [ ] Registrar comida vegana (100g) → Debe calcular 0.09 kg CO₂
- [ ] Registrar carne roja (200g) → Debe calcular 1.30 kg CO₂
- [ ] Registrar pollo (150g) → Debe calcular 0.45 kg CO₂
- [ ] Registrar pescado (180g) → Debe calcular 0.45 kg CO₂

#### Eliminar Comida
- [ ] Mantener presionado un registro de comida
- [ ] Confirmar eliminación
- [ ] ✅ Debe desaparecer del historial
- [ ] ✅ Debe actualizar el total de CO₂

#### Validaciones
- [ ] Intentar registrar sin nombre → Debe mostrar error
- [ ] Intentar registrar sin gramos → Debe mostrar error
- [ ] Intentar registrar con gramos = 0 → Debe mostrar error
- [ ] Intentar registrar con gramos negativos → Debe mostrar error

### 3. Registro de Transporte

#### Crear Viaje
- [ ] Ir a pestaña "Transporte"
- [ ] Seleccionar tipo: "Coche"
- [ ] Ingresar distancia: "10"
- [ ] Tocar "Registrar Viaje"
- [ ] ✅ Debe mostrar alerta con CO₂ calculado (1.92 kg)
- [ ] ✅ Debe aparecer en el historial
- [ ] ✅ Debe actualizar el total de CO₂ y km

#### Probar Diferentes Tipos
- [ ] Registrar coche (5 km) → Debe calcular 0.96 kg CO₂
- [ ] Registrar autobús (8 km) → Debe calcular 0.71 kg CO₂
- [ ] Registrar metro (12 km) → Debe calcular 0.49 kg CO₂
- [ ] Registrar bicicleta (3 km) → Debe calcular 0 kg CO₂
- [ ] Registrar caminando (1 km) → Debe calcular 0 kg CO₂

#### Eliminar Viaje
- [ ] Mantener presionado un registro de viaje
- [ ] Confirmar eliminación
- [ ] ✅ Debe desaparecer del historial
- [ ] ✅ Debe actualizar el total de CO₂ y km

#### Validaciones
- [ ] Intentar registrar sin distancia → Debe mostrar error
- [ ] Intentar registrar con distancia = 0 → Debe mostrar error
- [ ] Intentar registrar con distancia negativa → Debe mostrar error

### 4. Dashboard

#### Visualización de Datos
- [ ] Ir a pestaña "Dashboard"
- [ ] ✅ Debe mostrar "Total Hoy" con suma correcta
- [ ] ✅ Debe mostrar número de comidas registradas
- [ ] ✅ Debe mostrar número de viajes registrados
- [ ] ✅ Debe mostrar promedio semanal
- [ ] ✅ Debe mostrar gráfico de últimos 7 días
- [ ] ✅ Debe mostrar comparación con promedio global (12.5 kg)
- [ ] ✅ Debe mostrar desglose por categorías

#### Refrescar Datos
- [ ] Tocar botón de refresh (↻)
- [ ] ✅ Debe mostrar indicador de carga
- [ ] ✅ Debe actualizar todas las estadísticas

#### Validaciones del Gráfico
- [ ] Si no hay datos → Debe mostrar "No hay datos suficientes aún"
- [ ] Si hay datos → Debe mostrar barras proporcionales
- [ ] Las etiquetas de días deben ser correctas

### 5. Tips Ecológicos (Explore)

#### Visualización
- [ ] Ir a pestaña "Explore"
- [ ] ✅ Debe mostrar perfil del usuario
- [ ] ✅ Debe mostrar banner informativo
- [ ] ✅ Debe mostrar 8 tips ecológicos
- [ ] ✅ Cada tip debe tener: icono, título, descripción, impacto

#### Cerrar Sesión
- [ ] Tocar botón "Salir"
- [ ] Confirmar en diálogo
- [ ] ✅ Debe cerrar sesión
- [ ] ✅ Debe redirigir a login
- [ ] ✅ Los datos del usuario deben desaparecer

### 6. Persistencia de Datos

#### Verificar Guardado
- [ ] Registrar 3 comidas diferentes
- [ ] Registrar 3 viajes diferentes
- [ ] Cerrar la app completamente
- [ ] Abrir la app nuevamente
- [ ] ✅ El usuario debe seguir autenticado
- [ ] ✅ Los datos deben seguir visibles en historial
- [ ] ✅ El dashboard debe mostrar las estadísticas correctas

#### Verificar en Supabase
- [ ] Ir a Supabase Dashboard
- [ ] Abrir Table Editor
- [ ] Ver tabla `meals`
- [ ] ✅ Debe haber registros de las comidas
- [ ] Ver tabla `transport`
- [ ] ✅ Debe haber registros de los viajes
- [ ] Ver tabla `profiles`
- [ ] ✅ Debe existir el perfil del usuario

### 7. Sincronización Multi-dispositivo

#### Probar en Otro Dispositivo (Opcional)
- [ ] Iniciar sesión con las mismas credenciales en otro dispositivo
- [ ] ✅ Debe mostrar los mismos datos
- [ ] Registrar una comida en dispositivo 1
- [ ] Refrescar en dispositivo 2
- [ ] ✅ Debe aparecer la nueva comida

### 8. Casos Extremos

#### Datos Grandes
- [ ] Registrar comida con 10000 gramos
- [ ] ✅ Debe calcular correctamente el CO₂ (muy alto)
- [ ] Registrar viaje de 500 km
- [ ] ✅ Debe calcular correctamente el CO₂

#### Datos Pequeños
- [ ] Registrar comida con 1 gramo
- [ ] ✅ Debe calcular correctamente el CO₂ (muy bajo)
- [ ] Registrar viaje de 0.1 km
- [ ] ✅ Debe calcular correctamente el CO₂

#### Datos Decimales
- [ ] Registrar comida con 250.5 gramos
- [ ] ✅ Debe aceptar decimales
- [ ] Registrar viaje de 5.5 km
- [ ] ✅ Debe aceptar decimales

### 9. Interfaz de Usuario

#### Responsive
- [ ] Probar en diferentes tamaños de pantalla
- [ ] ✅ Los componentes deben verse bien
- [ ] ✅ Los textos deben ser legibles
- [ ] ✅ Los botones deben ser accesibles

#### Estados de Carga
- [ ] Al registrar comida → Debe mostrar spinner en botón
- [ ] Al registrar viaje → Debe mostrar spinner en botón
- [ ] Al cargar dashboard → Debe mostrar "Cargando datos..."
- [ ] Al refrescar listas → Debe mostrar indicador

#### Feedback Visual
- [ ] Al tocar un botón → Debe cambiar de color
- [ ] Al seleccionar tipo de comida → Debe resaltarse
- [ ] Al seleccionar tipo de transporte → Debe resaltarse
- [ ] Al completar acción → Debe mostrar alerta

### 10. Rendimiento

#### Velocidad
- [ ] Cargar pantalla de comidas → Debe ser < 1 segundo
- [ ] Cargar pantalla de transporte → Debe ser < 1 segundo
- [ ] Cargar dashboard → Debe ser < 2 segundos
- [ ] Registrar comida → Debe ser < 1 segundo
- [ ] Registrar viaje → Debe ser < 1 segundo

#### Memoria
- [ ] Navegar entre todas las pantallas varias veces
- [ ] ✅ La app no debe ralentizarse
- [ ] ✅ No debe haber memory leaks

## 🐛 Bugs Conocidos

Ninguno reportado actualmente. Si encuentras alguno:
1. Verifica que tu configuración sea correcta
2. Revisa la consola de Expo para errores
3. Asegúrate de tener la última versión
4. Contacta al equipo de desarrollo

## 📊 Resultados de Pruebas

| Categoría | Total Tests | Pasados | Fallidos |
|-----------|-------------|---------|----------|
| Autenticación | 10 | - | - |
| Comidas | 12 | - | - |
| Transporte | 12 | - | - |
| Dashboard | 8 | - | - |
| Explore | 5 | - | - |
| Persistencia | 6 | - | - |
| UI/UX | 10 | - | - |
| **TOTAL** | **63** | **-** | **-** |

## 📝 Notas de Testing

### Setup Inicial
1. Crear usuario de prueba
2. Tener datos de ejemplo en Supabase
3. Conexión a internet estable
4. Expo Go instalado (móvil) o navegador (web)

### Datos de Prueba Sugeridos

#### Usuario de Prueba
```
Email: test@ecotracker.com
Password: Test123456
Name: Usuario Test
```

#### Comidas de Prueba
- Ensalada (250g, vegetariano)
- Hamburguesa (300g, carne roja)
- Pollo a la plancha (200g, carne blanca)
- Sushi (180g, pescado)
- Bowl vegano (300g, vegano)

#### Viajes de Prueba
- Casa → Trabajo en coche (10 km)
- Trabajo → Supermercado en autobús (5 km)
- Paseo en bicicleta (8 km)
- Caminata por el parque (2 km)
- Viaje en metro (15 km)

## 🔄 Regression Testing

Después de cada actualización, ejecutar:
1. ✅ Tests de autenticación
2. ✅ Tests de CRUD básico
3. ✅ Tests de cálculo de CO₂
4. ✅ Tests de visualización

## 📈 Métricas de Calidad

- **Cobertura de código**: Pendiente
- **Tests automatizados**: Pendiente
- **Tests manuales**: Completar checklist arriba
- **Performance**: < 2s carga de pantallas

---

**Última actualización**: 2024
**Versión de la app**: 1.0.0
**Testeado en**: iOS, Android, Web
