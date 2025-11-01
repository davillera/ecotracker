# 📦 CÓMO HACER BUILD DE LA APP

## 🎯 Opciones de Build

Tienes 3 tipos de build disponibles:

### 1. **Preview** (Recomendado para pruebas)
- Genera un APK que puedes instalar directamente
- No necesita Google Play Store
- Rápido y fácil de compartir
- **Comando:**
  ```bash
  eas build --platform android --profile preview
  ```

### 2. **Production** (Para publicar)
- Genera un APK optimizado para producción
- Listo para subir a Google Play Store
- **Comando:**
  ```bash
  eas build --platform android --profile production
  ```

### 3. **Development** (Para debugging)
- Build de desarrollo con herramientas de debug
- **Comando:**
  ```bash
  eas build --platform android --profile development
  ```

---

## 🚀 GUÍA PASO A PASO - BUILD PREVIEW

### PASO 1: Verifica que estés logueado

```bash
eas whoami
```

Deberías ver tu username: `davillera`

### PASO 2: Construye el APK

```bash
eas build --platform android --profile preview
```

El proceso tomará **5-15 minutos**.

### PASO 3: Espera a que termine

Verás algo como:
```
✔ Build started, it may take a few minutes to complete.
✔ Build finished
✔ APK: https://expo.dev/artifacts/...
```

### PASO 4: Descarga el APK

Opciones para descargar:

**A) Desde el link directo:**
- EAS te dará un link como: `https://expo.dev/artifacts/eas/...`
- Cópialo y pégalo en tu navegador
- Descarga el APK

**B) Desde el panel de EAS:**
- Ve a: https://expo.dev/accounts/davillera/projects/ecotracker/builds
- Encuentra tu build más reciente
- Haz clic en "Download"

**C) Con el CLI:**
```bash
eas build:list
```

### PASO 5: Instala el APK en tu dispositivo

**Opción A - Android (Physical Device):**
1. Descarga el APK en tu PC
2. Envíalo a tu teléfono (por cable, email, o Drive)
3. En el teléfono, abre el APK
4. Permite instalación de fuentes desconocidas
5. Instala

**Opción B - Emulador:**
1. Abre el emulador
2. Arrastra el APK al emulador
3. Se instalará automáticamente

---

## 🔧 OPCIONES AVANZADAS

### Build Local (Sin EAS Cloud)

Si quieres hacer el build localmente (más rápido pero requiere setup):

```bash
eas build --platform android --profile preview --local
```

**Requisitos:**
- Android Studio instalado
- Android SDK configurado
- Java JDK

### Ver todos tus builds

```bash
eas build:list
```

### Cancelar un build

```bash
eas build:cancel
```

---

## 📊 INFORMACIÓN DEL BUILD

### Versión actual:
- **Version:** 1.0.0 (definida en `app.json`)
- **Package:** com.davillera.ecotracker
- **Bundle Identifier:** com.davillera.ecotracker

### Perfiles disponibles (eas.json):

1. **preview**
   - APK directo
   - Para testing interno
   - Distribución: internal

2. **production**
   - APK optimizado
   - Auto-incrementa versión
   - Listo para Play Store

3. **development**
   - Build de debug
   - Con Expo Dev Client

---

## ⚠️ PROBLEMAS COMUNES

### Error: "Not logged in"
```bash
eas login
```

### Error: "Project not configured"
```bash
eas build:configure
```

### Error: "Build failed"
1. Revisa los logs en expo.dev
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate que el código compila localmente: `npm run android`

### APK muy grande
- Normal para apps de React Native
- El APK será ~30-50 MB
- En producción, usa AAB (Android App Bundle) en vez de APK

---

## 🎉 BUILD EXITOSO

Una vez que tengas el APK:

1. **Pruébalo:**
   - Instala en varios dispositivos
   - Prueba todas las funcionalidades
   - Verifica que Supabase funcione

2. **Compártelo:**
   - Envía el link del APK a tus testers
   - O distribuye el archivo APK directamente

3. **Publica (Opcional):**
   - Para Google Play Store, usa:
     ```bash
     eas build --platform android --profile production
     eas submit --platform android
     ```

---

## 📚 RECURSOS

- **Panel de builds:** https://expo.dev/accounts/davillera/projects/ecotracker/builds
- **Documentación EAS:** https://docs.expo.dev/build/introduction/
- **Expo Status:** https://status.expo.dev/

---

## 🔐 NOTAS DE SEGURIDAD

### Variables de entorno

EAS NO incluye automáticamente tu archivo `.env` en el build.

**Para builds con variables de entorno:**

1. Crea un archivo `eas.json` con:
   ```json
   {
     "build": {
       "preview": {
         "env": {
           "EXPO_PUBLIC_SUPABASE_URL": "tu-url-aqui",
           "EXPO_PUBLIC_SUPABASE_ANON_KEY": "tu-key-aqui"
         }
       }
     }
   }
   ```

2. **O usa EAS Secrets:**
   ```bash
   eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
   eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..."
   ```

**⚠️ IMPORTANTE:** 
- Las variables `EXPO_PUBLIC_*` quedan embebidas en el APK
- Son visibles para cualquiera que descompile el APK
- **NUNCA** incluyas la Service Role Key
- Usa solo la Anon Key (está protegida por RLS)

---

## ✅ CHECKLIST PRE-BUILD

Antes de hacer el build, verifica:

- [ ] Todas las funcionalidades funcionan en desarrollo
- [ ] El `.env` tiene las credenciales correctas de Supabase
- [ ] Las tablas están creadas en Supabase
- [ ] RLS está habilitado
- [ ] La app se ve bien en diferentes tamaños de pantalla
- [ ] No hay errores en la consola
- [ ] El ícono y splash screen están configurados

---

¡Listo para hacer el build! 🚀
