# 🚀 USAR EXPO GO - Probar la App AHORA

## 🎯 ¿Por qué Expo Go?

El APK que construimos NO incluía las credenciales de Supabase, por eso crasheaba.

**Expo Go SI funciona** porque usa las variables del archivo `.env` directamente desde tu PC.

---

## ✅ PASO 1: Instala Expo Go en el Emulador

### Opción A: Descarga el APK de Expo Go

1. Descarga Expo Go APK:
   https://expo.dev/go

2. Arrastra el APK al emulador (igual que hiciste con EcoTracker)

### Opción B: Usa Google Play (si el emulador tiene Play Store)

1. Abre **Play Store** en el emulador
2. Busca "**Expo Go**"
3. Instala

---

## ✅ PASO 2: Inicia el Servidor de Desarrollo

```bash
# En tu PC, en la carpeta del proyecto
npx expo start
```

Verás algo como:
```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands
```

---

## ✅ PASO 3: Conecta el Emulador

### Opción A: Presiona 'a' (Automático - MÁS FÁCIL)

1. En la terminal donde corre `npx expo start`
2. Presiona la tecla **`a`**
3. Expo abrirá automáticamente la app en el emulador
4. ¡Listo! 🎉

### Opción B: Escanea el QR (Manual)

1. Abre **Expo Go** en el emulador
2. Escanea el QR que aparece en la terminal
3. La app se cargará

---

## 🎉 RESULTADO

La app se abrirá y funcionará PERFECTAMENTE porque:
- ✅ Usa las credenciales del archivo `.env`
- ✅ Se conecta a Supabase correctamente
- ✅ Hot reload activado (cambios instantáneos)
- ✅ No necesitas hacer builds

---

## 💡 VENTAJAS DE EXPO GO

1. **Desarrollo rápido:**
   - Haces un cambio → Guardas → Se actualiza automáticamente
   - No necesitas hacer builds cada vez

2. **Debugging fácil:**
   - Presiona **`j`** para abrir el debugger
   - Presiona **`r`** para recargar
   - Presiona **`m`** para abrir el menú de desarrollo

3. **Funciona siempre:**
   - No depende de configuraciones complejas
   - Usa tus variables de entorno locales

4. **Gratis y rápido:**
   - No usa minutos de build de EAS
   - Instantáneo

---

## 🔧 COMANDOS ÚTILES

```bash
# Iniciar servidor
npx expo start

# Limpiar caché y reiniciar
npx expo start -c

# Abrir en Android automáticamente
npx expo start
# Luego presiona: a

# Abrir en web
npx expo start
# Luego presiona: w

# Abrir debugger
npx expo start
# Luego presiona: j
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Problema 1: "Unable to connect to Metro"

```bash
# Reinicia el servidor con caché limpia
npx expo start -c
```

### Problema 2: No detecta el emulador cuando presiono 'a'

```bash
# Verifica que ADB detecte el emulador
adb devices

# Debería mostrar algo como:
# emulator-5554   device
```

Si no aparece:
```bash
# Reinicia ADB
adb kill-server
adb start-server
adb devices
```

### Problema 3: Error de red / No puede conectar

- Asegúrate que el emulador y tu PC estén en la misma red
- Reinicia el servidor: `Ctrl+C` y luego `npx expo start`

### Problema 4: Pantalla blanca o error de JavaScript

```bash
# Limpia caché y reinstala dependencias
rm -rf node_modules
npm install
npx expo start -c
```

---

## 🎯 COMPARACIÓN: Expo Go vs APK

| Aspecto | Expo Go | APK Build |
|---------|---------|-----------|
| **Setup** | 2 minutos | 15 minutos + configuración |
| **Hot Reload** | ✅ Sí | ❌ No |
| **Debugging** | ✅ Fácil | ⚠️ Complejo |
| **Variables .env** | ✅ Automático | ⚠️ Necesita configuración |
| **Tiempo de prueba** | ⚡ Instantáneo | ⏱️ 5-15 min por build |
| **Uso** | Desarrollo | Producción |

---

## 🚀 WORKFLOW RECOMENDADO

### Para Desarrollo (día a día):
```bash
# Usa Expo Go
npx expo start
# Presiona 'a'
# Desarrolla con hot reload
```

### Para Testing Final:
```bash
# Haz un build
eas build --platform android --profile preview

# Instala el APK en el emulador
# Prueba como usuario final
```

### Para Producción:
```bash
# Build de producción
eas build --platform android --profile production

# Publica en Play Store
eas submit --platform android
```

---

## ✨ RESUMEN RÁPIDO

Para probar tu app AHORA MISMO:

```bash
# 1. Asegúrate que el emulador esté corriendo
adb devices

# 2. Inicia Expo
npx expo start

# 3. Presiona 'a' para abrir en Android

# 4. ¡Listo! La app se abrirá y funcionará
```

**✅ Esto funciona AHORA, sin esperar builds.**

---

## 🎉 BONUS: Hot Reload

Con Expo Go, cuando modificas el código:

1. Guardas el archivo (Ctrl + S)
2. Expo detecta el cambio automáticamente
3. La app se recarga en 1-2 segundos
4. ¡No necesitas hacer nada más!

Ejemplo:
```javascript
// Cambia esto en app/(tabs)/index.tsx:
<Text style={styles.title}>¡Bienvenido a EcoTracker!</Text>

// Por esto:
<Text style={styles.title}>¡Mi App Funciona! 🎉</Text>

// Guarda (Ctrl + S)
// En 2 segundos verás el cambio en el emulador
```

---

**🚀 ¡Usa Expo Go y empieza a probar tu app YA!**

No esperes el build, Expo Go funciona perfectamente para desarrollo.
