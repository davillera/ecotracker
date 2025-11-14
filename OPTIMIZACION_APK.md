# Optimización del APK - EcoTracker

## Tamaño Original
**83 MB**

## Optimizaciones Aplicadas

### 1. Configuración de ProGuard y Minificación
- ✅ Habilitado ProGuard en builds de release
- ✅ Habilitado shrinking de recursos
- ✅ Habilitado minificación de código
- ✅ Reglas ProGuard optimizadas en `android/app/proguard-rules.pro`
- ✅ Eliminación automática de logs de debug

### 2. Arquitecturas Nativas
**Antes:** `armeabi-v7a, arm64-v8a, x86, x86_64`
**Ahora:** `armeabi-v7a, arm64-v8a` (solo ARM)

**Reducción estimada:** ~40-50% del tamaño por eliminar x86/x86_64

### 3. Soporte de Formatos de Imagen
- ❌ Deshabilitado soporte para GIF
- ❌ Deshabilitado soporte para WebP
- ❌ Deshabilitado soporte para WebP animado

**Reducción estimada:** ~3.5 MB

### 4. Assets Optimizados
- 🗑️ Eliminadas imágenes no utilizadas: react-logo*.png, partial-react-logo.png
- ✅ Habilitado PNG crunching en release builds
- ✅ Habilitado bundle compression

**Reducción estimada:** ~50 KB

### 5. Configuración en app.json
```json
"android": {
  "enableProguardInReleaseBuilds": true,
  "enableShrinkResourcesInReleaseBuilds": true,
  "enableNativeProguardInReleaseBuilds": true,
  "enableBundleCompression": true
}
```

### 6. Configuración en eas.json
```json
"android": {
  "buildType": "apk",
  "enableProguardInReleaseBuilds": true,
  "enableShrinkResourcesInReleaseBuilds": true
}
```

## Reducción Esperada
**~35-45 MB** (reducción del 42-54%)

**Nuevo tamaño estimado:** 38-48 MB

## Cómo Construir el APK Optimizado

### Opción 1: Build con EAS (Recomendado)
```bash
eas build --platform android --profile production
```

### Opción 2: Build Local
```bash
cd android
./gradlew assembleRelease
```

El APK estará en: `android/app/build/outputs/apk/release/app-release.apk`

## Verificar el Tamaño
```powershell
Get-Item "android/app/build/outputs/apk/release/app-release.apk" | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB, 2)}}
```

## Optimizaciones Adicionales (Futuras)

### Si aún necesitas reducir más:

1. **App Bundle en lugar de APK**
   - Cambia en `eas.json`: `"buildType": "app-bundle"`
   - Play Store solo descarga los recursos necesarios por dispositivo
   - Reducción adicional: 20-30%

2. **Analizar dependencias**
   ```bash
   npm install -g source-map-explorer
   npx source-map-explorer android/app/build/outputs/apk/release/app-release.apk
   ```

3. **Comprimir icono principal**
   - El `icon.png` pesa 577 KB
   - Se puede comprimir a ~150-200 KB sin pérdida visible

4. **Deshabilitar New Architecture** (solo si no la usas)
   - En `gradle.properties`: `newArchEnabled=false`
   - Reducción: ~2-3 MB

## Notas Importantes

- ⚠️ Las optimizaciones solo aplican a builds de **release/production**
- ⚠️ Los builds de desarrollo seguirán siendo grandes
- ⚠️ Primera construcción optimizada puede tardar más tiempo
- ✅ No afecta la funcionalidad de la app
- ✅ Mejora el rendimiento en producción

## Validación

Después del build, verifica que la app funcione correctamente:
1. Instala el APK en un dispositivo real
2. Prueba todas las funcionalidades principales
3. Verifica el login/registro
4. Comprueba la navegación entre pantallas
5. Valida la integración con Supabase
