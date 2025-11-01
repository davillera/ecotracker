# 📱 INSTALAR APK SIN EXPO ORBIT

## ⚠️ PROBLEMA

Expo Orbit no funciona porque:
- Build-tools 36.1.0 es incompatible
- ANDROID_HOME no configurado
- Orbit tiene bugs con ciertas configuraciones

## ✅ SOLUCIÓN: Instala el APK MANUALMENTE

---

## 🎯 MÉTODO 1: Descarga e Instala en Android Físico (RECOMENDADO)

### PASO 1: Descarga el APK

**Haz clic aquí:**
https://expo.dev/artifacts/eas/ugmq26eQNURjeDQeZ9FdFC.apk

- El navegador descargará `ugmq26eQNURjeDQeZ9FdFC.apk`
- Guárdalo en tu carpeta de Descargas

### PASO 2: Transfiere a tu Android

**Opción A - Por USB:**
1. Conecta tu Android al PC con cable USB
2. Abre "Este equipo" → Tu teléfono → Almacenamiento interno → Descargas
3. Copia el APK ahí

**Opción B - Por WhatsApp:**
1. Envíate el APK a ti mismo
2. Abre WhatsApp en tu teléfono
3. Descarga el archivo

**Opción C - Por Google Drive:**
1. Sube el APK a Drive desde tu PC
2. Abre Drive en tu teléfono
3. Descarga el APK

**Opción D - Por Email:**
1. Envíate el APK por email
2. Abre el email en tu teléfono
3. Descarga el adjunto

### PASO 3: Instala en tu Android

1. Abre el archivo APK en tu teléfono
2. Android te dirá "Instalar apps de fuentes desconocidas bloqueado"
3. Haz clic en "Configuración"
4. Activa "Permitir desde esta fuente"
5. Vuelve atrás y haz clic en "Instalar"
6. ¡Listo! La app está instalada

### PASO 4: Abre EcoTracker

1. Busca el ícono de EcoTracker en tu teléfono
2. Ábrelo
3. Regístrate o inicia sesión
4. ¡Disfruta!

---

## 🖥️ MÉTODO 2: Instalar con ADB (Para emulador o dispositivo)

Si tienes un emulador de Android corriendo o un dispositivo conectado:

### PASO 1: Descarga el APK

```powershell
# En PowerShell, descarga con curl
curl -L -o ecotracker.apk "https://expo.dev/artifacts/eas/ugmq26eQNURjeDQeZ9FdFC.apk"
```

O descárgalo manualmente desde tu navegador.

### PASO 2: Verifica que el dispositivo esté conectado

```bash
# Asegúrate que ADB esté en el PATH
adb devices
```

Deberías ver algo como:
```
List of devices attached
emulator-5554   device
```

### PASO 3: Instala el APK

```bash
# Instala con ADB
adb install ecotracker.apk

# O si tienes el path completo:
adb install C:\Users\da-ni\Downloads\ugmq26eQNURjeDQeZ9FdFC.apk
```

Si tienes éxito, verás:
```
Performing Streamed Install
Success
```

### PASO 4: Abre la app

```bash
# Abrir la app desde ADB
adb shell monkey -p com.davillera.ecotracker 1
```

---

## 🚀 MÉTODO 3: Usar Expo Go para Desarrollo (Sin APK)

Si solo quieres **desarrollar y probar**, no necesitas el APK:

### PASO 1: Instala Expo Go

- En tu Android, ve a Google Play Store
- Busca "Expo Go"
- Instala

### PASO 2: Inicia el servidor de desarrollo

```bash
npx expo start
```

### PASO 3: Conecta

- Se mostrará un QR en la terminal
- Abre Expo Go en tu teléfono
- Escanea el QR
- ¡La app se cargará automáticamente!

**✨ Ventajas:**
- Hot reload instantáneo
- No necesitas hacer builds
- Desarrollo mucho más rápido
- Perfecto para testing

**⚠️ Limitación:**
- Solo funciona para desarrollo
- No es el APK final standalone

---

## 🔧 MÉTODO 4: Descargar desde el Panel de Expo

### PASO 1: Ve al panel de builds

```
https://expo.dev/accounts/davillera/projects/ecotracker/builds
```

### PASO 2: Encuentra tu build

- Busca el build más reciente (hoy, 1:48 PM)
- Estado: "Finished"
- Plataforma: Android

### PASO 3: Descarga

- Haz clic en el build
- Haz clic en "Download"
- Guarda el APK

### PASO 4: Instala

- Sigue los pasos del MÉTODO 1

---

## ⚡ MÉTODO 5: Usar ADB Wireless (Sin cable)

Si tu Android y PC están en la misma red WiFi:

### PASO 1: Habilita Debugging por WiFi en tu Android

1. Ve a Ajustes → Acerca del teléfono
2. Toca 7 veces en "Número de compilación"
3. Vuelve a Ajustes → Sistema → Opciones de desarrollador
4. Activa "Depuración por USB"
5. Activa "Depuración inalámbrica"
6. Anota la IP y puerto (ej: 192.168.1.100:5555)

### PASO 2: Conecta desde el PC

```bash
# Conéctate por WiFi
adb connect 192.168.1.100:5555

# Verifica la conexión
adb devices
```

### PASO 3: Instala el APK

```bash
adb install ecotracker.apk
```

---

## ❌ NO HAGAS ESTO

### ❌ NO uses Expo Orbit
- Tiene problemas con build-tools 36.1.0
- Requiere configuración compleja
- Es más lento que los métodos directos

### ❌ NO intentes arreglar build-tools ahora
- Lleva tiempo
- No es necesario para instalar el APK
- Mejor usa métodos alternativos

---

## 🎯 RECOMENDACIÓN FINAL

**Para instalar el APK YA:**
→ **MÉTODO 1** (descarga manual + instalar en Android físico)

**Para desarrollo diario:**
→ **MÉTODO 3** (Expo Go)

**Si tienes experiencia con ADB:**
→ **MÉTODO 2** (ADB install)

---

## 📋 CHECKLIST RÁPIDO

Para instalar en 5 minutos:

- [ ] Ve a: https://expo.dev/artifacts/eas/ugmq26eQNURjeDQeZ9FdFC.apk
- [ ] Descarga el APK
- [ ] Transfiere a tu Android (USB/WhatsApp/Drive)
- [ ] Abre el APK en tu teléfono
- [ ] Permite instalación de fuentes desconocidas
- [ ] Instala
- [ ] ¡Abre EcoTracker!

---

## 🆘 SI NADA FUNCIONA

### Opción última: Usa Expo Go

```bash
# En tu PC:
npx expo start

# En tu Android:
# 1. Instala Expo Go desde Play Store
# 2. Escanea el QR que aparece en la terminal
# 3. La app se cargará automáticamente
```

**¡Esto SIEMPRE funciona!** 🎉

---

## 💡 TIPS

1. **Expo Orbit no es necesario** - Es solo un helper, no lo necesitas
2. **El APK ya está construido** - Solo necesitas descargarlo e instalarlo
3. **Para desarrollo usa Expo Go** - Es más rápido y fácil
4. **Los builds son para producción** - Úsalos cuando quieras compartir la app
5. **ADB es tu amigo** - Si sabes usarlo, es la forma más rápida

---

## 🎉 ¡ÉXITO!

Una vez instalado, deberías ver:

- ✅ Ícono de EcoTracker en tu Android
- ✅ Pantalla de login al abrir
- ✅ Puedes registrarte y usar la app
- ✅ Dashboard funcionando con tiempo real

---

**🚀 ¡Ahora solo descarga e instala!**

Link directo: https://expo.dev/artifacts/eas/ugmq26eQNURjeDQeZ9FdFC.apk
