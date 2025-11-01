# 📱 Exportar App a Android - EcoTracker

## 🎯 Opción Recomendada: EAS Build

EAS (Expo Application Services) es la forma más fácil y moderna de crear builds de Android.

---

## 🚀 Método 1: Build con EAS (RECOMENDADO)

### Paso 1: Instalar EAS CLI

```bash
npm install -g eas-cli
```

### Paso 2: Login en Expo

```bash
eas login
```

Si no tienes cuenta:
```bash
eas register
```

### Paso 3: Configurar el Proyecto

```bash
eas build:configure
```

Esto creará un archivo `eas.json` automáticamente.

### Paso 4: Crear Build de Desarrollo (APK)

```bash
# Build APK para instalar directamente
eas build --platform android --profile preview
```

**Opciones durante el build:**
- ¿Generar credenciales automáticamente? → **Sí**
- ¿Qué tipo de build? → **APK** (más fácil de instalar)

### Paso 5: Esperar el Build

- El proceso toma 10-15 minutos
- Puedes ver el progreso en: https://expo.dev/accounts/[tu-usuario]/projects/ecotracker/builds
- Recibirás un link de descarga cuando termine

### Paso 6: Descargar e Instalar

1. El build terminará con un link
2. Descarga el APK en tu teléfono o computadora
3. **En el teléfono**:
   - Transfiere el APK si lo descargaste en PC
   - Activa "Instalar apps de fuentes desconocidas"
   - Abre el APK y toca "Instalar"
4. ✅ ¡Listo! Ya tienes la app instalada

---

## 📦 Método 2: Build AAB para Play Store

### Para publicar en Google Play Store:

```bash
# Build AAB (Android App Bundle)
eas build --platform android --profile production
```

### Configurar app.json para producción:

```json
{
  "expo": {
    "name": "EcoTracker",
    "slug": "ecotracker",
    "version": "1.0.0",
    "android": {
      "package": "com.tuusuario.ecotracker",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#16a34a"
      },
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    }
  }
}
```

---

## 🛠️ Método 3: Build Local (Expo prebuild)

### Si prefieres compilar localmente:

```bash
# 1. Prebuild (genera carpeta android/)
npx expo prebuild --platform android

# 2. Build con Gradle
cd android
./gradlew assembleRelease

# 3. El APK estará en:
# android/app/build/outputs/apk/release/app-release.apk
```

**Nota**: Requiere Android Studio y JDK instalados.

---

## ⚙️ Configuración del Proyecto

### Actualizar app.json

```json
{
  "expo": {
    "name": "EcoTracker",
    "slug": "ecotracker",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "ecotracker",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#16a34a"
    },
    "android": {
      "package": "com.ecotracker.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#16a34a"
      },
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    },
    "plugins": [
      "expo-router"
    ]
  }
}
```

### Crear eas.json

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 📋 Perfiles de Build

### Preview (APK para testing)
```bash
eas build --platform android --profile preview
```
- ✅ Genera APK
- ✅ Fácil de instalar
- ✅ Perfecto para demos
- ✅ No requiere Play Store

### Production (AAB para Play Store)
```bash
eas build --platform android --profile production
```
- Genera AAB
- Optimizado y más pequeño
- Requerido para Play Store
- Firmado automáticamente

---

## 🔐 Variables de Entorno en EAS

### Configurar secrets de Supabase:

```bash
# Configurar URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://vrusokequxdingvujzvc.supabase.co"

# Configurar Anon Key
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "tu-anon-key-aqui"
```

### Verificar secrets:
```bash
eas secret:list
```

---

## 📱 Instalar APK en tu Teléfono

### Opción A: Desde el teléfono
1. Abre el link del build en tu teléfono
2. Descarga el APK
3. Abre el APK
4. Permite instalación de fuentes desconocidas
5. Instala

### Opción B: Desde PC con ADB
```bash
# Conectar teléfono con USB Debug activado
adb devices

# Instalar APK
adb install app-release.apk
```

### Opción C: Compartir por WhatsApp/Email
1. Descarga el APK
2. Compártelo por WhatsApp, Email, Drive, etc.
3. Ábrelo en el teléfono destino
4. Instala

---

## 🐛 Troubleshooting

### Error: "Credenciales faltantes"
```bash
# Generar credenciales nuevas
eas credentials
```

### Error: "Build failed"
1. Revisa los logs en expo.dev
2. Verifica que app.json esté correcto
3. Asegúrate que el package name sea único

### Error: "APK no se instala"
1. Activa "Fuentes desconocidas" en Android
2. Verifica que el APK no esté corrupto
3. Intenta desinstalar versión anterior primero

### Build muy lento
- Normal: 10-20 minutos la primera vez
- Builds siguientes son más rápidos (caché)
- Puedes continuar trabajando mientras tanto

---

## ✅ Checklist de Build

- [ ] EAS CLI instalado
- [ ] Logged in a Expo
- [ ] app.json configurado
- [ ] eas.json creado
- [ ] Variables de entorno configuradas
- [ ] Build iniciado
- [ ] Build completado
- [ ] APK descargado
- [ ] APK instalado en teléfono
- [ ] App funcionando correctamente

---

## 📊 Comparación de Métodos

| Método | Dificultad | Tiempo | Resultado |
|--------|-----------|--------|-----------|
| **EAS Build** | ⭐ Fácil | 15 min | APK/AAB |
| **Expo Prebuild** | ⭐⭐ Medio | 30 min | APK |
| **Android Studio** | ⭐⭐⭐ Difícil | 1 hora | APK |

**Recomendación**: Usar EAS Build (Método 1)

---

## 🎯 Comandos Rápidos

```bash
# Setup inicial
npm install -g eas-cli
eas login
eas build:configure

# Build APK (testing)
eas build --platform android --profile preview

# Build AAB (producción)
eas build --platform android --profile production

# Ver builds
eas build:list

# Ver logs
eas build:view [BUILD_ID]
```

---

## 💰 Costos

### EAS Build
- **Free tier**: 30 builds/mes
- **Hobby**: $29/mes - builds ilimitados
- **Producción**: $99/mes - builds prioritarios

### Google Play Store
- **Registro**: $25 (pago único)
- **Publicación**: Gratis después del registro

---

## 🚀 Próximos Pasos

1. ✅ Crear build con EAS
2. ⬜ Probar en varios dispositivos
3. ⬜ Recopilar feedback
4. ⬜ Optimizar y mejorar
5. ⬜ Publicar en Play Store (opcional)

---

## 📞 Recursos

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Expo Application Services](https://expo.dev/eas)
- [Android Build Troubleshooting](https://docs.expo.dev/build-reference/troubleshooting/)

---

## ✨ Resultado Final

Después de seguir esta guía tendrás:

✅ Un APK de tu app EcoTracker  
✅ Instalable en cualquier Android  
✅ Con todas las funcionalidades  
✅ Listo para compartir o testear  
✅ Firmado y seguro  

---

**¡Éxito con tu build de Android! 📱🚀**
