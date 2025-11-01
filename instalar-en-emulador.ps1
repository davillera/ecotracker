# Script para instalar APK en emulador de Android Studio

Write-Host "
╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       📱 INSTALAR ECOTRACKER EN EMULADOR                    ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

# Configurar variables de entorno
$env:ANDROID_HOME = "C:\Users\da-ni\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator"

Write-Host "
✅ PASO 1: Verificando configuración..." -ForegroundColor Yellow
Write-Host "   ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor White

Write-Host "
✅ PASO 2: Verificando dispositivos conectados..." -ForegroundColor Yellow
adb devices

Write-Host "
📱 INSTRUCCIONES:" -ForegroundColor Cyan
Write-Host "   1. Inicia el emulador en Android Studio" -ForegroundColor White
Write-Host "   2. Espera a que esté completamente iniciado" -ForegroundColor White
Write-Host "   3. Descarga el APK:" -ForegroundColor White
Write-Host "      https://expo.dev/artifacts/eas/ugmq26eQNURjeDQeZ9FdFC.apk" -ForegroundColor Blue
Write-Host "   4. Ejecuta: adb install ecotracker.apk" -ForegroundColor Cyan
Write-Host "   5. O arrastra el APK al emulador" -ForegroundColor Cyan

Write-Host "
💡 MÉTODO MÁS FÁCIL:" -ForegroundColor Green
Write-Host "   Arrastra y suelta el APK en la ventana del emulador" -ForegroundColor White
Write-Host "   ¡Se instalará automáticamente!" -ForegroundColor White

Write-Host "
════════════════════════════════════════════════════════════════
" -ForegroundColor Cyan
