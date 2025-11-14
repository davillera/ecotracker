# 🌐 Compartir App Públicamente - EcoTracker

## 🎯 3 Opciones para Compartir tu App

---

## ⚡ Opción 1: Expo Go con Túnel (MÁS RÁPIDO - 2 min)

### Ideal para: Desarrollo y pruebas rápidas

**Pasos:**

1. **Instalar ngrok** (si aún no lo tienes):
   ```powershell
   # Con Chocolatey
   choco install ngrok
   
   # O descargar de: https://ngrok.com/download
   ```

2. **Iniciar con túnel:**
   ```powershell
   npx expo start --tunnel
   ```

3. **Compartir:**
   - Aparecerá un QR code
   - Tu amigo descarga **Expo Go** en su teléfono
   - Escanea el QR
   - ¡Ya puede ver la app en tiempo real!

**Ventajas:**
- ✅ No requiere build
- ✅ Cambios en tiempo real (hot reload)
- ✅ Gratis
- ✅ Inmediato (2 minutos)

**Desventajas:**
- ❌ Requiere instalar Expo Go
- ❌ Puede ser lento
- ❌ Solo para desarrollo

---

## 📱 Opción 2: Build APK con EAS (RECOMENDADO - 15 min)

### Ideal para: Pruebas con usuarios reales

**Pasos:**

1. **Instalar EAS CLI:**
   ```powershell
   npm install -g eas-cli
   ```

2. **Login en Expo:**
   ```powershell
   eas login
   ```

3. **Configurar proyecto:**
   ```powershell
   eas build:configure
   ```

4. **Build APK:**
   ```powershell
   eas build -p android --profile preview
   ```

5. **Esperar el build** (10-15 minutos)

6. **Descargar APK:**
   - Te dará un link público
   - Comparte ese link
   - Cualquiera puede instalar el APK

**Ventajas:**
- ✅ APK instalable
- ✅ No requiere Expo Go
- ✅ Link público permanente
- ✅ Funciona como app real

**Desventajas:**
- ❌ Tarda 10-15 minutos por build
- ❌ Necesita cuenta de Expo
- ❌ No actualiza automáticamente

---

## 🌍 Opción 3: Expo Updates (OTA) - MEJOR PARA PRODUCCIÓN

### Ideal para: Actualizaciones sin rebuild

**Pasos:**

1. **Build inicial (una sola vez):**
   ```powershell
   eas build -p android --profile production
   ```

2. **Para actualizar sin rebuild:**
   ```powershell
   eas update --branch production --message "Nuevos cambios"
   ```

3. **Los usuarios reciben la actualización automáticamente**

**Ventajas:**
- ✅ Actualizaciones automáticas (OTA)
- ✅ Sin necesidad de reinstalar
- ✅ Cambios en segundos
- ✅ Profesional

**Desventajas:**
- ❌ Requiere build inicial
- ❌ Configuración más compleja
- ❌ No actualiza código nativo

---

## 🎯 ¿Cuál usar?

### Para AHORA (pruebas rápidas):
```powershell
npx expo start --tunnel
```
📱 Tu amigo instala Expo Go y escanea el QR

### Para COMPARTIR CON VARIOS:
```powershell
eas build -p android --profile preview
```
📦 Compartes el link del APK

### Para PRODUCCIÓN:
```powershell
eas build -p android --profile production
eas update --branch production
```
🚀 App profesional con actualizaciones automáticas

---

## 📋 Comandos Rápidos

### Desarrollo con túnel:
```powershell
npx expo start --tunnel
```

### Build rápido (APK):
```powershell
eas build -p android --profile preview
```

### Actualización OTA:
```powershell
eas update --auto
```

---

## 🔧 Solución de Problemas

### Si ngrok no funciona:
```powershell
# Usar LAN en lugar de túnel
npx expo start --lan
# Asegúrate que ambos estén en la misma red WiFi
```

### Si EAS falla:
```powershell
# Limpiar caché
eas build:clear
# Volver a intentar
eas build -p android --profile preview
```

### Si Expo Go no conecta:
```powershell
# Reiniciar con reset de caché
npx expo start --tunnel --clear
```

---

## 💡 Recomendación

**Para desarrollo y pruebas AHORA:**
```powershell
npx expo start --tunnel
```
Tu amigo descarga Expo Go y escanea el QR.

**Para compartir de forma profesional:**
```powershell
npm install -g eas-cli
eas login
eas build -p android --profile preview
```
Compartir el link del APK que te genera.

---

## 📱 Links Importantes

- **Expo Go:** https://expo.dev/client
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **ngrok:** https://ngrok.com/download

---

**🌍 EcoTracker - Comparte tu app con el mundo** 💚
