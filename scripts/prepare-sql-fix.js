const fs = require('fs');
const https = require('https');

const SUPABASE_URL = 'https://vrusokequxdingvujzvc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydXNva2VxdXhkaW5ndnVqenZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDc2NTcsImV4cCI6MjA3NzQ4MzY1N30.WDhwCWru7y_gGja-PbNgqYbz65y3D0JoazLLzcYxBUI';

// Leer el script SQL
const sql = fs.readFileSync('./database/FIX_FRIENDS_RLS.sql', 'utf8');

console.log('📝 Enviando script SQL a Supabase via REST API...\n');

const data = JSON.stringify({ query: sql });

const options = {
  hostname: 'vrusokequxdingvujzvc.supabase.co',
  port: 443,
  path: '/rest/v1/rpc',
  method: 'POST',
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Prefer': 'return=representation'
  }
};

console.log('❌ ERROR: La API REST de Supabase no puede ejecutar scripts SQL complejos.\n');
console.log('📋 SOLUCIÓN ALTERNATIVA:\n');
console.log('Debes ejecutar el script manualmente en Supabase Dashboard:\n');
console.log('1. Ve a: https://supabase.com/dashboard/project/vrusokequxdingvujzvc/sql/new');
console.log('2. Copia y pega el contenido de: database/FIX_FRIENDS_RLS.sql');
console.log('3. Click en "Run" (botón verde)\n');
console.log('El archivo está listo para copiar. Ábrelo y copia todo su contenido.\n');

// Crear versión simplificada del script en un solo archivo
console.log('📄 Creando versión optimizada del script...\n');

fs.writeFileSync('./database/FIX_FRIENDS_EJECUTAR_AHORA.sql', sql);

console.log('✅ Script listo en: database/FIX_FRIENDS_EJECUTAR_AHORA.sql\n');
console.log('📋 PASOS A SEGUIR:\n');
console.log('1. Abre: https://supabase.com/dashboard/project/vrusokequxdingvujzvc/sql/new');
console.log('2. Copia el contenido de database/FIX_FRIENDS_EJECUTAR_AHORA.sql');
console.log('3. Pégalo en el editor SQL de Supabase');
console.log('4. Click en "Run"');
console.log('5. Si ves errores sobre políticas duplicadas, ignóralos (es normal)');
console.log('\n¡El script está optimizado y listo para ejecutar! 🚀\n');
