# Script para abrir Supabase SQL Editor directamente
Write-Host ""
Write-Host "🚀 Abriendo Supabase SQL Editor..." -ForegroundColor Cyan
Write-Host ""

Start-Process "https://supabase.com/dashboard/project/vrusokequxdingvujzvc/sql/new"

Write-Host "✅ Navegador abierto!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 AHORA:" -ForegroundColor Yellow
Write-Host "   1. Se abrió el SQL Editor en tu navegador" -ForegroundColor White
Write-Host "   2. Abre el archivo: database\FIX_FRIENDS_RLS.sql" -ForegroundColor White
Write-Host "   3. Selecciona TODO el contenido (Ctrl+A)" -ForegroundColor White
Write-Host "   4. Copia (Ctrl+C)" -ForegroundColor White
Write-Host "   5. Pega en el SQL Editor (Ctrl+V)" -ForegroundColor White
Write-Host "   6. Click en 'Run' (botón verde)" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Esperando 3 segundos..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "📂 Abriendo el archivo SQL en VS Code..." -ForegroundColor Cyan
Write-Host ""

# Intentar abrir el archivo en VS Code
$sqlFile = Join-Path $PSScriptRoot "..\database\FIX_FRIENDS_RLS.sql"
if (Test-Path $sqlFile) {
    try {
        code $sqlFile
        Write-Host "✅ Archivo abierto en VS Code!" -ForegroundColor Green
        Write-Host "   Ahora solo copia todo (Ctrl+A, Ctrl+C) y pega en Supabase" -ForegroundColor White
    } catch {
        Write-Host "⚠️  No se pudo abrir VS Code automáticamente" -ForegroundColor Yellow
        Write-Host "   Abre manualmente: database\FIX_FRIENDS_RLS.sql" -ForegroundColor White
        notepad $sqlFile
    }
} else {
    Write-Host "❌ No se encontró el archivo SQL" -ForegroundColor Red
    Write-Host "   Búscalo en: database\FIX_FRIENDS_RLS.sql" -ForegroundColor White
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  📖 Si necesitas ayuda, lee: ARREGLAR_AMIGOS_AHORA.md" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
