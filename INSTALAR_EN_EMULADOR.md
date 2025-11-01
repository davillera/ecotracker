# 📱 INSTALAR APK EN EMULADOR DE ANDROID STUDIO

## 🎯 OBJETIVO

Instalar y probar EcoTracker en el emulador de Android Studio sin usar Expo Orbit.

---

## ✅ PASO 1: Inicia el Emulador de Android Studio

### Opción A: Desde Android Studio

1. Abre **Android Studio**
2. Haz clic en el ícono de **Device Manager** (teléfono con menú)
   - O ve a **Tools → Device Manager**
3. Verás tus dispositivos virtuales (AVD)
4. Haz clic en el botón ▶️ (Play) del emulador que quieras usar
5. Espera a que el emulador se inicie completamente (1-2 minutos)

### Opción B: Desde la línea de comandos

```powershell
# Configurar variables de entorno
$env:ANDROID_HOME = "C:\Users\da-ni\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\platform-tools"

# Ver emuladores disponibles
emulator -list-avds

# Iniciar un emulador específico (reemplaza "Pixel_4_API_30" con el nombre que veas)
emulator -avd Pixel_4_API_30
```

### Si no tienes ningún emulador creado:

1. En Android Studio: **Tools → Device Manager**
2. Haz clic en **Create Device**
3. Selecciona un dispositivo (ej: Pixel 4)
4. Haz clic en **Next**
5. Selecciona una imagen del sistema (ej: Android 13 - API 33)
   - Si no está descargada, haz clic en **Download**
6. Haz clic en **Next** y luego **Finish**
7. Ahora puedes iniciar el emulador

---

## ✅ PASO 2: Verifica que el Emulador esté Conectado

```powershell
# Configurar PATH (por si acaso)
$env:ANDROID_HOME = "C:\Users\da-ni\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"

# Ver dispositivos conectados
adb devices
```

Deberías ver algo como:
```
List of devices attached
emulator-5554   device
```

Si dice `offline` o no aparece:
```powershell
# Reiniciar el servidor ADB
adb kill-server
adb start-server
adb devices
```

---

## ✅ PASO 3: Descarga el APK

### Opción A: Desde el navegador

1. Haz clic aquí: https://expo.dev/artifacts/eas/ugmq26eQNURjeDQeZ9FdFC.apk
2. Guarda el archivo en tu carpeta de Descargas

### Opción B: Con PowerShell

```powershell
# Navega a donde quieras guardar el APK
cd C:\Users\da-ni\Downloads

# Descarga el APK
curl -L -o ecotracker.apk "https://expo.dev/artifacts/eas/ugmq26eQNURjeDQeZ9FdFC.apk"
```

---

## ✅ PASO 4: Instala el APK en el Emulador con ADB

```powershell
# Configurar PATH
$env:ANDROID_HOME = "C:\Users\da-ni\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"

# Navega a donde está el APK
cd C:\Users\da-ni\Downloads

# Instala el APK
adb install ecotracker.apk

# O con el nombre completo del archivo si lo descargaste desde el navegador:
adb install ugmq26eQNURjeDQeZ9FdFC.apk
```

Deberías ver:
```
Performing Streamed Install
Success
```

---

## ✅ PASO 5: Abre la App en el Emulador

### Opción A: Desde el emulador

1. Mira la pantalla del emulador
2. Abre el **App Drawer** (icono de círculo con puntos)
3. Busca el ícono de **EcoTracker**
4. Haz clic para abrir

### Opción B: Con ADB

```powershell
# Abrir la app con ADB
adb shell monkey -p com.davillera.ecotracker 1
```

---

## 🎉 ¡LISTO! Ya puedes usar la app

Ahora puedes:
- ✅ Registrarte con un email
- ✅ Agregar comidas
- ✅ Agregar transporte
- ✅ Ver el dashboard en tiempo real

---

## 🔧 ALTERNATIVA: Arrastra y Suelta el APK

### Método más fácil (si ADB no funciona):

1. **Descarga el APK** desde: https://expo.dev/artifacts/eas/ugmq26eQNURjeDQeZ9FdFC.apk
2. **Inicia el emulador** en Android Studio
3. **Arrastra el archivo APK** directamente a la ventana del emulador
4. El emulador lo instalará automáticamente
5. Busca el ícono de EcoTracker en el emulador

**✨ Esto es lo más simple y funciona siempre!**

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Problema 1: "adb: command not found"

```powershell
# Agregar ADB al PATH permanentemente
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\da-ni\AppData\Local\Android\Sdk", "User")
$oldPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
$newPath = "$oldPath;C:\Users\da-ni\AppData\Local\Android\Sdk\platform-tools;C:\Users\da-ni\AppData\Local\Android\Sdk\emulator"
[System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")

# Cierra y vuelve a abrir PowerShell
```

### Problema 2: El emulador no aparece en "adb devices"

```powershell
# Reiniciar ADB
adb kill-server
adb start-server

# Espera 5 segundos
Start-Sleep -Seconds 5

# Verifica de nuevo
adb devices
```

### Problema 3: "INSTALL_FAILED_UPDATE_INCOMPATIBLE"

```powershell
# Desinstala la versión anterior
adb uninstall com.davillera.ecotracker

# Instala de nuevo
adb install ecotracker.apk
```

### Problema 4: El emulador es muy lento

1. Ve a **Tools → AVD Manager**
2. Haz clic en el lápiz (editar) del emulador
3. Haz clic en **Show Advanced Settings**
4. En **Emulated Performance**:
   - Graphics: **Hardware - GLES 2.0**
   - Boot option: **Quick Boot**
5. En RAM: aumenta a **2048 MB** o más
6. Haz clic en **Finish**

### Problema 5: El emulador no inicia

- Asegúrate de tener **Intel HAXM** o **Hyper-V** habilitado
- En **BIOS**, habilita **Virtualization Technology (VT-x)**
- En Windows: habilita **Hyper-V** en Features de Windows

---

## 💡 TIPS PARA DESARROLLO EN EMULADOR

### 1. Usar Expo con el emulador

```bash
# Inicia el emulador primero
# Luego ejecuta:
npx expo start

# Presiona 'a' para Android
# Expo abrirá automáticamente en el emulador
```

### 2. Recargar la app rápidamente

En el emulador, presiona:
- **R + R** (doble R) → Reload
- **Ctrl + M** (Windows) → Dev Menu

### 3. Ver logs en tiempo real

```powershell
adb logcat | Select-String "ReactNative"
```

### 4. Capturar pantalla

```powershell
adb exec-out screencap -p > screenshot.png
```

### 5. Grabar video

En Android Studio:
- Device Manager → Botón de cámara en el emulador

---

## 🚀 COMANDOS ÚTILES

```powershell
# Ver dispositivos
adb devices

# Instalar APK
adb install app.apk

# Desinstalar app
adb uninstall com.davillera.ecotracker

# Abrir app
adb shell monkey -p com.davillera.ecotracker 1

# Ver logs
adb logcat

# Limpiar logs
adb logcat -c

# Ver datos de la app
adb shell run-as com.davillera.ecotracker ls

# Reiniciar emulador
adb reboot

# Copiar archivo al emulador
adb push archivo.txt /sdcard/

# Copiar archivo del emulador
adb pull /sdcard/archivo.txt .
```

---

## 🎯 RESUMEN RÁPIDO

Para instalar el APK en el emulador en 2 minutos:

```powershell
# 1. Configurar PATH
$env:ANDROID_HOME = "C:\Users\da-ni\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator"

# 2. Iniciar emulador (o usa Android Studio)
emulator -list-avds
emulator -avd Pixel_4_API_30

# 3. Espera a que inicie, luego verifica
adb devices

# 4. Descarga el APK
cd C:\Users\da-ni\Downloads
curl -L -o ecotracker.apk "https://expo.dev/artifacts/eas/ugmq26eQNURjeDQeZ9FdFC.apk"

# 5. Instala
adb install ecotracker.apk

# 6. Abre la app
adb shell monkey -p com.davillera.ecotracker 1
```

---

## ✨ MÉTODO MÁS FÁCIL (Drag & Drop)

1. Inicia el emulador desde Android Studio
2. Descarga el APK: https://expo.dev/artifacts/eas/ugmq26eQNURjeDQeZ9FdFC.apk
3. Arrastra el APK a la ventana del emulador
4. ¡Listo!

**🎉 Este es el método que recomiendo si no quieres usar comandos.**

---

## 📚 DOCUMENTACIÓN ADICIONAL

- **Emulator Android:** https://developer.android.com/studio/run/emulator
- **ADB Commands:** https://developer.android.com/studio/command-line/adb

---

**🚀 ¡Ahora ya puedes probar tu app en el emulador!**
