# 🚀 Guía de Despliegue - EcoTracker

## Opciones de Despliegue

EcoTracker puede desplegarse en diferentes plataformas según tus necesidades:

---

## 📱 1. Desarrollo (Expo Go)

**Mejor para**: Testing rápido durante desarrollo

### Pasos
```bash
# Iniciar servidor
npm start

# Opciones:
# - Escanear QR con Expo Go en móvil
# - Presionar 'a' para Android emulator
# - Presionar 'i' para iOS simulator
# - Presionar 'w' para web
```

### Ventajas
- ✅ Sin compilación necesaria
- ✅ Hot reload instantáneo
- ✅ Testing rápido
- ✅ Gratis

### Desventajas
- ❌ Solo para desarrollo
- ❌ Requiere Expo Go instalado
- ❌ Funcionalidad limitada

---

## 🌐 2. Web (Expo Web)

**Mejor para**: Acceso desde navegador

### Desarrollo Local
```bash
npm run web
# Abre http://localhost:8081
```

### Despliegue a Producción

#### Opción A: Netlify (Recomendado)
```bash
# 1. Build de producción
npx expo export:web

# 2. Instalar Netlify CLI
npm install -g netlify-cli

# 3. Deploy
netlify deploy --prod --dir=dist
```

#### Opción B: Vercel
```bash
# 1. Build
npx expo export:web

# 2. Instalar Vercel CLI
npm install -g vercel

# 3. Deploy
vercel --prod
```

#### Opción C: GitHub Pages
```bash
# 1. Build
npx expo export:web

# 2. Agregar homepage en package.json
"homepage": "https://tuusuario.github.io/ecotracker"

# 3. Instalar gh-pages
npm install --save-dev gh-pages

# 4. Agregar scripts
"predeploy": "npx expo export:web",
"deploy": "gh-pages -d dist"

# 5. Deploy
npm run deploy
```

### Ventajas
- ✅ Acceso universal desde navegador
- ✅ No requiere instalación
- ✅ SEO friendly
- ✅ Despliegue rápido

### Desventajas
- ❌ Sin acceso a features nativas
- ❌ Rendimiento menor que app nativa

---

## 🤖 3. Android (APK/AAB)

**Mejor para**: Distribución Android

### Build de Desarrollo (APK)
```bash
# 1. Crear build
eas build --platform android --profile development

# 2. Instalar en dispositivo
adb install app-release.apk
```

### Build de Producción (Google Play)

#### Setup Inicial
```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login en Expo
eas login

# 3. Configurar proyecto
eas build:configure
```

#### Crear Build
```bash
# Build AAB para Google Play
eas build --platform android --profile production
```

#### Configurar eas.json
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle",
        "gradleCommand": ":app:bundleRelease"
      }
    },
    "development": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

#### Subir a Google Play
1. Ir a [Google Play Console](https://play.google.com/console)
2. Crear nueva aplicación
3. Completar información de la tienda
4. Subir AAB generado
5. Completar formularios de contenido
6. Enviar a revisión

### Ventajas
- ✅ App nativa completa
- ✅ Mejor rendimiento
- ✅ Acceso a features nativas
- ✅ Distribución en Play Store

### Desventajas
- ❌ Proceso de build más largo
- ❌ Revisión de Google Play
- ❌ Costo de cuenta desarrollador ($25 único)

---

## 🍎 4. iOS (IPA)

**Mejor para**: Distribución iOS/App Store

### Requisitos
- Mac con Xcode instalado
- Cuenta de Apple Developer ($99/año)
- Certificados y perfiles de provisioning

### Build con EAS
```bash
# Build para iOS
eas build --platform ios --profile production
```

### Configurar app.json para iOS
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.tuempresa.ecotracker",
      "buildNumber": "1.0.0",
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "Esta app necesita acceso a la cámara",
        "NSLocationWhenInUseUsageDescription": "Para calcular distancias"
      }
    }
  }
}
```

### Subir a App Store
1. Ir a [App Store Connect](https://appstoreconnect.apple.com)
2. Crear nueva aplicación
3. Configurar información de la app
4. Subir build con Transporter o EAS Submit
5. Completar metadata
6. Enviar a revisión

```bash
# Submit automático
eas submit --platform ios
```

### Ventajas
- ✅ App nativa para iOS
- ✅ Mejor rendimiento
- ✅ Distribución en App Store

### Desventajas
- ❌ Requiere Mac
- ❌ Costo anual ($99)
- ❌ Proceso de revisión estricto

---

## 📦 5. Distribución Interna (Testing)

### Expo Updates (Over-The-Air)
```bash
# Publicar actualización
eas update --branch production --message "Nueva versión"
```

### TestFlight (iOS)
1. Build con `eas build --platform ios`
2. Upload automático a TestFlight
3. Invitar testers por email
4. Los testers instalan TestFlight y la app

### Google Play Internal Testing (Android)
1. Build con `eas build --platform android`
2. Subir a Play Console > Testing > Internal Testing
3. Crear lista de testers
4. Compartir link de testing

### Firebase App Distribution
```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Crear build
eas build --platform android --profile preview

# 4. Distribuir
firebase appdistribution:distribute \
  app-release.apk \
  --app YOUR_APP_ID \
  --testers "test@ejemplo.com"
```

---

## 🗄️ Base de Datos (Supabase)

### Ya Configurado ✅
La base de datos está lista en Supabase:
- URL: `https://vrusokequxdingvujzvc.supabase.co`
- Tables: profiles, meals, transport
- RLS: Habilitado
- Políticas: Configuradas

### Para Producción
1. **Mantener mismo proyecto** (recomendado)
   - Ya está configurado
   - Gratis hasta 500MB
   - No requiere cambios

2. **O crear proyecto de producción**
   ```bash
   # 1. Crear nuevo proyecto en Supabase
   # 2. Ejecutar database/supabase-schema.sql
   # 3. Actualizar .env con nuevas credenciales
   # 4. Rebuild de la app
   ```

### Backup de Base de Datos
```bash
# En Supabase Dashboard:
# Settings > Database > Backups
# Configurar backups automáticos
```

---

## 🔒 Variables de Entorno

### Para Producción
```env
# .env.production
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-produccion
```

### Configurar en EAS
```bash
# Configurar secrets
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..."
```

---

## 📊 Monitoreo y Analytics

### Expo Application Services
```bash
# Ver builds
eas build:list

# Ver updates
eas update:list

# Ver analytics
eas analytics
```

### Agregar Sentry (Error Tracking)
```bash
npm install @sentry/react-native

# Configurar en app.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'tu-dsn-de-sentry',
});
```

### Agregar Analytics
```bash
npm install @react-native-firebase/analytics

# Configurar Firebase
# Seguir guía en firebase.google.com
```

---

## 🔄 CI/CD (Continuous Integration/Deployment)

### GitHub Actions - Android
```yaml
# .github/workflows/build-android.yml
name: Build Android
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: eas build --platform android --non-interactive
```

### GitHub Actions - iOS
```yaml
# .github/workflows/build-ios.yml
name: Build iOS
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: eas build --platform ios --non-interactive
```

---

## 📝 Checklist Pre-Despliegue

### General
- [ ] Tests manuales completados
- [ ] No hay console.logs innecesarios
- [ ] Variables de entorno configuradas
- [ ] Documentación actualizada
- [ ] README con instrucciones

### App
- [ ] app.json configurado correctamente
- [ ] Versión actualizada
- [ ] Bundle identifier único
- [ ] Iconos y splash screen
- [ ] Permisos necesarios declarados

### Base de Datos
- [ ] Schema ejecutado
- [ ] RLS habilitado
- [ ] Políticas verificadas
- [ ] Backups configurados

### Seguridad
- [ ] .env no en git
- [ ] Secrets configurados en EAS
- [ ] API keys seguras
- [ ] HTTPS en todas las conexiones

---

## 🎯 Estrategia de Despliegue Recomendada

### Fase 1: Testing Interno
```bash
# 1. Build de development
eas build --platform android --profile development

# 2. Distribuir a testers
# Usar Google Play Internal Testing o Firebase
```

### Fase 2: Beta Testing
```bash
# 1. Build de preview
eas build --platform all --profile preview

# 2. Distribuir a beta testers
# TestFlight (iOS) + Play Testing (Android)
```

### Fase 3: Producción
```bash
# 1. Build de producción
eas build --platform all --profile production

# 2. Subir a stores
eas submit --platform all
```

---

## 💰 Costos Estimados

| Servicio | Costo |
|----------|-------|
| Supabase Free | $0/mes |
| Expo EAS Free | $0/mes (builds limitados) |
| Google Play Console | $25 (único) |
| Apple Developer | $99/año |
| Netlify/Vercel Free | $0/mes |
| **Total Mínimo** | **$25-124** |

### Para producción seria:
- Supabase Pro: $25/mes
- EAS Production: $29/mes
- **Total**: ~$54/mes + fees de stores

---

## 📞 Soporte de Despliegue

### Recursos
- [Expo EAS Docs](https://docs.expo.dev/eas/)
- [Supabase Docs](https://supabase.com/docs)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)

### Comandos Útiles
```bash
# Ver estado de builds
eas build:list

# Ver logs de build
eas build:view <build-id>

# Cancelar build
eas build:cancel <build-id>

# Ver credenciales
eas credentials

# Reset credenciales
eas credentials:reset
```

---

**¡Listo para desplegar! 🚀**

Elige la opción que mejor se adapte a tus necesidades y sigue los pasos correspondientes.
