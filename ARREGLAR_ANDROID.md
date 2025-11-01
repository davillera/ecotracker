# 🔧 SOLUCIÓN: Error al Instalar APK en Emulador

## ⚠️ PROBLEMA

```
Something went wrong while installing the app.
C:/Users/da-ni/AppData/Local/Android/Sdk/build-tools/36.1.0/aapt.exe dump badging ...
exited with non-zero code: 1
```

**Causas:**
1. Build-tools 36.1.0 puede ser inestable
2. ANDROID_HOME no está configurado en las variables del sistema
3. Problema al descargar el APK desde Expo

---

## ✅ SOLUCIÓN RÁPIDA (Opción 1 - Recomendada)

### No uses el emulador, instala directo en tu Android físico

1. **Descarga el APK del build:**
   - Ve a: https://expo.dev/accounts/davillera/projects/ecotracker/builds
   - Encuentra tu build más reciente
   - Haz clic en "Download" (si ya terminó)
   - Guarda el APK

2. **Transfiere a tu teléfono:**
   - Conecta tu Android por USB
   - Copia el APK a tu teléfono
   - O envíalo por WhatsApp/Email/Drive

3. **Instala:**
   - Abre el APK en tu teléfono
   - Permite "Instalar de fuentes desconocidas"
   - Instala normalmente

**✨ Ventaja:** No depende de configuración de Android Studio, funciona siempre.

---

## 🔧 SOLUCIÓN TÉCNICA (Opción 2 - Para desarrolladores)

### Si quieres usar el emulador, sigue estos pasos:

### PASO 1: Configurar Variables de Entorno

**En Windows (Permanente):**

1. Presiona `Windows + R`
2. Escribe `sysdm.cpl` y Enter
3. Pestaña "Opciones Avanzadas"
4. Botón "Variables de entorno"
5. En "Variables del sistema", haz clic en "Nueva"
6. Nombre: `ANDROID_HOME`
7. Valor: `C:\Users\da-ni\AppData\Local\Android\Sdk`
8. Haz clic en OK

**O en PowerShell (Temporal):**

```powershell
$env:ANDROID_HOME = "C:\Users\da-ni\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator"
```

### PASO 2: Instalar Build Tools Estable

**Opción A - Desde Android Studio (Recomendado):**

1. Abre Android Studio
2. Ve a **File → Settings** (o **Android Studio → Preferences** en Mac)
3. Busca **Appearance & Behavior → System Settings → Android SDK**
4. Pestaña **SDK Tools**
5. Marca:
   - ✅ Android SDK Build-Tools 33.0.2
   - ✅ Android SDK Command-line Tools (latest)
6. Haz clic en **Apply** y **OK**

**Opción B - Manualmente:**

Descarga desde: https://developer.android.com/studio#command-line-tools-only

1. Descarga "Command line tools only"
2. Extrae en `C:\Users\da-ni\AppData\Local\Android\Sdk\cmdline-tools\latest`
3. Ejecuta:

```cmd
C:\Users\da-ni\AppData\Local\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat "build-tools;33.0.2"
```

### PASO 3: Verificar Instalación

```powershell
# Verificar ANDROID_HOME
echo $env:ANDROID_HOME

# Verificar build-tools
Test-Path "C:\Users\da-ni\AppData\Local\Android\Sdk\build-tools\33.0.2\aapt.exe"

# Probar aapt
& "C:\Users\da-ni\AppData\Local\Android\Sdk\build-tools\33.0.2\aapt.exe" version
```

Deberías ver algo como:
```
Android Asset Packaging Tool, v0.2-...
```

### PASO 4: Configurar Expo para usar la versión correcta

Crea o edita `android/gradle.properties`:

```properties
android.buildToolsVersion=33.0.2
```

### PASO 5: Limpiar y Rebuild

```bash
# Limpiar caché
npx expo start -c

# Regenerar archivos nativos
npx expo prebuild --clean

# Correr en Android
npx expo run:android
```

---

## 🚀 SOLUCIÓN ALTERNATIVA (Opción 3 - Más rápida)

### Usar Expo Go en vez del emulador

1. **En tu Android físico:**
   - Descarga "Expo Go" desde Google Play Store
   - Abre Expo Go

2. **En tu PC:**
   ```bash
   npx expo start
   ```

3. **Conecta:**
   - Escanea el QR que aparece en la terminal
   - O usa el mismo WiFi y abre la URL

**✨ Ventaja:** No necesitas instalar el APK, desarrollo más rápido, hot reload.

**⚠️ Limitación:** No funciona para apps con código nativo custom (pero EcoTracker sí funciona).

---

## 📱 SOLUCIÓN PREFERIDA PARA TU CASO

Basándome en tu error, te recomiendo:

### MÉTODO 1: Espera a que termine el build y descarga el APK

```bash
# Ver estado del build
eas build:list

# Cuando termine, descárgalo desde:
# https://expo.dev/accounts/davillera/projects/ecotracker/builds
```

Luego instala directo en tu Android físico (no emulador).

### MÉTODO 2: Usa Expo Go para desarrollo

```bash
npx expo start
```

Escanea el QR con Expo Go en tu teléfono.

---

## 🔍 DIAGNÓSTICO: ¿Por qué falló?

### Error analizado:

```
C:/Users/da-ni/AppData/Local/Android/Sdk/build-tools/36.1.0/aapt.exe
```

**Problemas identificados:**

1. **Build-tools 36.1.0 es muy reciente** y puede tener bugs
   - Solución: Usar 33.0.2 (estable y probado)

2. **ANDROID_HOME no configurado**
   - Solución: Configurar variable de entorno

3. **Expo Orbit intenta descargar el APK**
   - La URL: `https://expo.dev/artifacts/eas/...`
   - Puede fallar por firewall/antivirus
   - Solución: Descargar manualmente

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de intentar de nuevo:

- [ ] ANDROID_HOME está configurado
- [ ] Build-tools 33.0.2 está instalado
- [ ] Puedes ejecutar `aapt.exe version` sin error
- [ ] El emulador está corriendo
- [ ] Has limpiado la caché: `npx expo start -c`

---

## 🎯 RECOMENDACIÓN FINAL

**Para AHORA (testing rápido):**
1. Espera a que termine el build en EAS
2. Descarga el APK
3. Instálalo en tu Android físico
4. ✅ Funciona sin configurar nada

**Para DESPUÉS (desarrollo):**
1. Usa Expo Go para desarrollo diario
2. Solo haz builds cuando quieras probar la versión final
3. Configura Android Studio si necesitas el emulador

---

## 📞 SI NADA FUNCIONA

**Plan B - Descarga el APK ya construido:**

```bash
# Ver tus builds
eas build:list

# O ve directo a:
https://expo.dev/accounts/davillera/projects/ecotracker/builds
```

Descarga el APK más reciente y instala en tu Android físico.

**¡Esto SIEMPRE funciona!** 🎉

---

## 💡 TIPS ADICIONALES

### Para desarrollo futuro:

1. **Usa Expo Go** para desarrollo día a día
2. **Haz builds preview** solo para testear features nativas
3. **Usa el emulador** solo si tienes Android Studio bien configurado
4. **El APK directo** es la forma más confiable de testear

### Comandos útiles:

```bash
# Desarrollo con Expo Go
npx expo start

# Build APK cuando necesites
eas build --platform android --profile preview

# Ver builds anteriores
eas build:list

# Limpiar todo si hay problemas
npx expo start -c
rm -rf android
npx expo prebuild
```

---

**🎯 SIGUIENTE PASO:** Ve a https://expo.dev/accounts/davillera/projects/ecotracker/builds y descarga el APK cuando termine.
