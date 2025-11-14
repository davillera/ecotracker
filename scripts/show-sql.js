/**
 * Script para mostrar las instrucciones y el SQL necesario
 * Ejecutar con: node scripts/show-sql.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🚀 Configuración del Sistema de Códigos de Amigo\n');
console.log('=' .repeat(70));
console.log('\n⚠️  IMPORTANTE: Debes ejecutar este SQL en Supabase Dashboard\n');

// Leer el archivo SQL
const sqlPath = path.join(__dirname, '..', 'database', 'ADD_FRIEND_CODE.sql');

try {
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  
  console.log('📋 PASOS A SEGUIR:\n');
  console.log('1. Abre tu Supabase Dashboard:');
  console.log('   https://supabase.com/dashboard\n');
  console.log('2. Selecciona tu proyecto\n');
  console.log('3. Ve a "SQL Editor" en el menú lateral\n');
  console.log('4. Crea una nueva query\n');
  console.log('5. Copia y pega el siguiente SQL:\n');
  console.log('=' .repeat(70));
  console.log(sqlContent);
  console.log('=' .repeat(70));
  console.log('\n6. Presiona "Run" o usa Ctrl+Enter\n');
  console.log('7. Verifica que no haya errores\n');
  console.log('8. ¡Listo! Reinicia tu app\n');
  console.log('=' .repeat(70));
  console.log('\n💡 TIP: El SQL también está en: database/ADD_FRIEND_CODE.sql\n');
  
  // Intentar copiar al portapapeles si está disponible
  try {
    const { exec } = require('child_process');
    exec(`echo ${sqlContent} | clip`, (error) => {
      if (!error) {
        console.log('✅ SQL copiado al portapapeles\n');
      }
    });
  } catch (e) {
    // Ignorar si no se puede copiar
  }
  
} catch (error) {
  console.error('❌ Error leyendo el archivo SQL:', error.message);
  console.log('\n📁 Asegúrate de que exista: database/ADD_FRIEND_CODE.sql\n');
}
