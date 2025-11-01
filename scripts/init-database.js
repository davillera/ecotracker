#!/usr/bin/env node

/**
 * Script para inicializar la base de datos de Supabase
 * Este script ejecuta el schema SQL en tu proyecto de Supabase
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function initDatabase() {
  log('\n🚀 Inicializando Base de Datos de Supabase\n', colors.blue);

  // Leer variables de entorno
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    log('❌ Error: No se encontró el archivo .env', colors.red);
    log('📝 Crea el archivo .env con tus credenciales de Supabase', colors.yellow);
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const supabaseUrl = envContent.match(/EXPO_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
  const supabaseKey = envContent.match(/EXPO_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();

  if (!supabaseUrl || !supabaseKey) {
    log('❌ Error: Variables de entorno no configuradas', colors.red);
    log('📝 Configura EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY en .env', colors.yellow);
    process.exit(1);
  }

  log('✅ Credenciales encontradas', colors.green);
  log(`📍 URL: ${supabaseUrl}`, colors.blue);

  // Leer el schema SQL
  const schemaPath = path.join(__dirname, '..', 'database', 'supabase-schema.sql');
  
  if (!fs.existsSync(schemaPath)) {
    log('❌ Error: No se encontró database/supabase-schema.sql', colors.red);
    process.exit(1);
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  
  log('\n📋 INSTRUCCIONES PARA CONFIGURAR LA BASE DE DATOS:\n', colors.magenta);
  log('1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard', colors.yellow);
  log(`2. Abre tu proyecto: ${supabaseUrl}`, colors.yellow);
  log('3. Ve a "SQL Editor" en el menú lateral', colors.yellow);
  log('4. Crea una nueva query', colors.yellow);
  log('5. Copia y pega el siguiente SQL:\n', colors.yellow);
  
  log('─'.repeat(80), colors.blue);
  log(schemaSql, colors.reset);
  log('─'.repeat(80), colors.blue);
  
  log('\n6. Ejecuta la query (botón "Run" o Ctrl/Cmd + Enter)', colors.yellow);
  log('7. Verifica que las tablas se crearon en "Table Editor"\n', colors.yellow);

  log('✅ Deberías ver estas tablas:', colors.green);
  log('   • profiles', colors.blue);
  log('   • meals', colors.blue);
  log('   • transport', colors.blue);
  
  log('\n💡 TIP: También puedes copiar el SQL desde:', colors.magenta);
  log('   database/supabase-schema.sql\n', colors.blue);

  // Guardar el SQL en un archivo temporal para fácil acceso
  const tempSqlPath = path.join(__dirname, '..', 'database', 'EJECUTAR_ESTE_SQL.sql');
  fs.writeFileSync(tempSqlPath, schemaSql);
  log(`✅ SQL guardado en: database/EJECUTAR_ESTE_SQL.sql`, colors.green);
  log('   Puedes abrir este archivo y copiar el contenido\n', colors.blue);
}

initDatabase().catch(err => {
  log(`\n❌ Error: ${err.message}`, colors.red);
  process.exit(1);
});
