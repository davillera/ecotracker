# 📱 BUILD DE APK ANDROID - EcoTracker

## 🚀 Build en Progreso

**Build ID**: d7a4785e-0dbc-438b-9fd7-7823d092a541
**Link**: https://expo.dev/accounts/davillera/projects/ecotracker/builds/d7a4785e-0dbc-438b-9fd7-7823d092a541

### ⏱️ Tiempo Estimado
- **Preview Build**: 5-10 minutos
- **Production Build**: 10-15 minutos

## 📥 Cuando el Build Termine

### Opción 1: Descargar desde el Link
1. Abre el link del build arriba
2. Espera a que el estado sea "Finished"
3. Haz clic en **"Download"**
4. Guarda el archivo `.apk` en tu computadora

### Opción 2: Descargar desde la Terminal
```bash
# Una vez que el build termine, verás un link de descarga
# Copia el link y usa:
curl -L -o ecotracker.apk "URL_DEL_APK"
```

## 📲 Instalar el APK

### En un Dispositivo Físico Android:

#### Método 1: Transferencia USB
1. Conecta tu teléfono Android a la PC con un cable USB
2. Copia el archivo `ecotracker.apk` a tu teléfono
3. En tu teléfono, abre el Explorador de Archivos
4. Busca y toca el archivo APK
5. Autoriza "Instalar desde fuentes desconocidas" si se solicita
6. Sigue las instrucciones para instalar

#### Método 2: ADB (Android Debug Bridge)
```bash
# Asegúrate de tener ADB instalado
adb devices  # Verifica que tu dispositivo esté conectado

# Instala el APK
adb install ecotracker.apk
```

#### Método 3: Compartir por Email/Drive
1. Sube el APK a Google Drive o envíalo por email
2. Abre el archivo en tu teléfono Android
3. Instala desde ahí

### En un Emulador Android:

#### Usando Android Studio:
1. Abre Android Studio
2. Inicia un emulador (AVD Manager → Play)
3. Arrastra el archivo APK al emulador
4. O usa: `adb install ecotracker.apk`

#### Usando el script incluido:
```powershell
# Si tienes el emulador corriendo:
.\instalar-en-emulador.ps1
```

## 🔍 Verificar la Instalación

Una vez instalado, deberías ver:
- ✅ Icono de "EcoTracker" en tu lista de apps
- ✅ Versión 1.0.0
- ✅ Tamaño aproximado: 25-40 MB (dependiendo de optimizaciones)

## 📊 Tipos de Build Disponibles

### Preview (Actual)
```bash
eas build --platform android --profile preview
```
- **Propósito**: Pruebas rápidas
- **Formato**: APK
- **Optimización**: Media
- **Firma**: Automática de desarrollo
- **Ideal para**: Compartir con testers

### Production
```bash
eas build --platform android --profile production
```
- **Propósito**: Versión final para usuarios
- **Formato**: APK o AAB
- **Optimización**: Máxima (ProGuard, minificación)
- **Firma**: Con tu keystore de producción
- **Ideal para**: Google Play Store o distribución pública

### Development
```bash
eas build --platform android --profile development
```
- **Propósito**: Desarrollo con hot reload
- **Formato**: APK con dev client
- **Optimización**: Ninguna
- **Ideal para**: Desarrollo activo

## 🛠️ Comandos Útiles

### Ver Estado del Build
```bash
# Ver todos los builds recientes
eas build:list

# Ver un build específico
eas build:view d7a4785e-0dbc-438b-9fd7-7823d092a541
```

### Cancelar un Build
```bash
eas build:cancel
```

### Configurar Credenciales
```bash
# Ver credenciales actuales
eas credentials

# Configurar nueva keystore
eas credentials --platform android
```

## 📝 Notas Importantes

### ⚠️ Primera Instalación
Si es la primera vez que instalas la app:
1. Android pedirá permisos para "Fuentes desconocidas"
2. Esto es normal para APKs que no vienen de Google Play
3. Autoriza la instalación desde Chrome, Archivos, etc.

### 🔐 Seguridad
- El APK está firmado con tu keystore de desarrollo
- Para producción, usa una keystore específica y guárdala en lugar seguro
- Nunca compartas tu keystore de producción

### 📦 Tamaño del APK
El tamaño del APK de preview puede ser mayor que el de producción porque:
- Production tiene ProGuard habilitado
- Production tiene minificación de recursos
- Production comprime los assets de forma más agresiva

Tamaños esperados:
- **Preview**: ~35-45 MB
- **Production**: ~25-35 MB

## 🐛 Solución de Problemas

### "No se puede instalar la aplicación"
```bash
# Desinstala versión anterior primero
adb uninstall com.davillera.ecotracker

# Luego instala la nueva
adb install ecotracker.apk
```

### "La app se cierra inmediatamente"
- Verifica que tu dispositivo tenga Android 5.0 o superior
- Revisa los logs: `adb logcat | grep -i ecotracker`

### "Build falla"
1. Verifica que no haya errores de TypeScript: `npx tsc --noEmit`
2. Revisa el log completo en el link del build
3. Común: problemas con dependencias nativas

## 🎯 Próximos Pasos

Una vez instalado y probado:
1. ✅ Prueba todas las funcionalidades
2. ✅ Verifica el sistema de amigos
3. ✅ Prueba la tabla de posiciones
4. ✅ Revisa que el registro de comidas/transporte funcione
5. 📝 Si todo está bien, considera hacer un build de producción

### Build de Producción (Cuando estés listo)
```bash
# Para máxima optimización y publicación
eas build --platform android --profile production

# Para Google Play Store (AAB en lugar de APK)
# Modifica eas.json y cambia "buildType": "apk" a "buildType": "aab"
```

## 📚 Recursos

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **Tu Panel de Builds**: https://expo.dev/accounts/davillera/projects/ecotracker/builds
- **Configuración EAS**: https://docs.expo.dev/build-reference/eas-json/
